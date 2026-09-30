#!/usr/bin/env python3
"""Deploy this repo's dist/ to Cloudflare Pages (project: gulf-eos-calculator).

Why this exists instead of ~/workspace/skills/cloudflare/bin/cf-wrangler:
that wrapper forces cwd=~/workspace/height-calculator, and wrangler picks
up functions//_redirects/_headers from its cwd — which once 301'd this
whole project to height-calculator.net (see AGENTS.md). This script runs
wrangler with cwd=this repo's root.

Auth: stored Cloudflare credential via surrogate (never touches disk).
Requires CLOUDFLARE_ACCOUNT_ID because the token cannot list accounts.
"""
from __future__ import annotations

import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACCOUNT_ID = "1abe704f3449834965689b3b47db3926"
PROJECT = "gulf-eos-calculator"

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import dynamic_credential_entry  # noqa: E402


def main() -> int:
    entry = dynamic_credential_entry("custom.cloudflare", "access_token")
    surrogate = str(entry["surrogate"]).strip()
    if not surrogate.startswith("hsurr:"):
        print("error: did not get a surrogate credential", file=sys.stderr)
        return 1
    env = dict(os.environ)
    env["CLOUDFLARE_API_TOKEN"] = surrogate
    env["CLOUDFLARE_ACCOUNT_ID"] = ACCOUNT_ID
    proc = subprocess.run(
        ["npx", "-y", "wrangler@4", "pages", "deploy",
         os.path.join(REPO, "dist"),
         f"--project-name={PROJECT}", "--branch=main"],
        cwd=REPO,
        env=env,
    )
    return proc.returncode


if __name__ == "__main__":
    sys.exit(main())
