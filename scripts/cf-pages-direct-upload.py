#!/usr/bin/env python3
"""Direct-upload deploy to Cloudflare Pages via the REST API (no wrangler).

Usage: cf-pages-direct-upload.py <project> <abs-dist-dir> [--branch=main]
"""
from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import sys
import urllib.request

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import dynamic_credential_entry  # noqa: E402

ACCOUNT_ID = "1abe704f3449834965689b3b47db3926"
API = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}"


def api(method, path, body=None, token=None, raw_body=None, content_type=None):
    data = raw_body if raw_body is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(API + path, data=data, method=method)
    req.add_header("Authorization", "Bearer " + token)
    req.add_header("Content-Type", content_type or "application/json")
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.load(resp)


def main(argv):
    if len(argv) < 2:
        print("usage: cf-pages-direct-upload.py <project> <abs-dist-dir> [--branch=main]", file=sys.stderr)
        return 2
    project, dist = argv[0], argv[1]
    branch = "main"
    for a in argv[2:]:
        if a.startswith("--branch="):
            branch = a.split("=", 1)[1]
    if not os.path.isabs(dist) or not os.path.isdir(dist):
        print("error: dist dir must be an absolute existing dir", file=sys.stderr)
        return 2

    entry = dynamic_credential_entry("custom.cloudflare", "access_token")
    token = str(entry["surrogate"]).strip()

    # 1. Build manifest: path -> sha256 hex
    manifest, hash_to_path = {}, {}
    for root, _dirs, files in os.walk(dist):
        for f in files:
            full = os.path.join(root, f)
            rel = "/" + os.path.relpath(full, dist).replace(os.sep, "/")
            h = hashlib.sha256()
            with open(full, "rb") as fh:
                for chunk in iter(lambda: fh.read(1 << 20), b""):
                    h.update(chunk)
            digest = h.hexdigest()
            manifest[rel] = digest
            hash_to_path[digest] = full
    print(f"manifest: {len(manifest)} files")

    # 2. Create deployment
    res = api("POST", f"/pages/projects/{project}/deployments",
              {"manifest": manifest, "branch": branch}, token)
    if not res.get("success"):
        print("create deployment failed:", json.dumps(res.get("errors"))[:500], file=sys.stderr)
        return 1
    result = res["result"]
    dep_id = result["id"]
    jwt = result.get("jwt")
    missing = result.get("missing", [])
    print(f"deployment {dep_id} created; {len(missing)} assets to upload")

    # 3. Upload missing assets (multipart, keyed by hash)
    for i in range(0, len(missing), 50):
        batch = missing[i:i + 50]
        boundary = "----cfdu" + os.urandom(8).hex()
        parts = []
        for h in batch:
            path = hash_to_path[h]
            ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
            with open(path, "rb") as fh:
                content = fh.read()
            parts.append(
                f"--{boundary}\r\n".encode()
                + f'Content-Disposition: form-data; name="{h}"; filename="{h}"\r\n'.encode()
                + f"Content-Type: {ctype}\r\n\r\n".encode()
                + content + b"\r\n"
            )
        body = b"".join(parts) + f"--{boundary}--\r\n".encode()
        up = api("POST", "/pages/assets/upload", token=jwt, raw_body=body,
                 content_type=f"multipart/form-data; boundary={boundary}")
        if not up.get("success"):
            print("asset upload failed:", json.dumps(up.get("errors"))[:500], file=sys.stderr)
            return 1
        print(f"  uploaded batch {i // 50 + 1} ({len(batch)} files)")

    # 4. Poll deployment status
    import time
    for _ in range(30):
        st = api("GET", f"/pages/projects/{project}/deployments/{dep_id}", token=token)
        stage = st["result"].get("latest_stage", {}).get("name")
        status = st["result"].get("latest_stage", {}).get("status")
        if status in ("success", "failure"):
            print(f"deployment {status} (stage: {stage})")
            url = st["result"].get("url")
            if url:
                print("url:", url)
            return 0 if status == "success" else 1
        time.sleep(5)
    print("timed out waiting for deployment", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
