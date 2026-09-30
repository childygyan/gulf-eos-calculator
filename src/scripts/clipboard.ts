/**
 * scripts/clipboard.ts — honest clipboard copy helper (Phase 6).
 *
 * Uses the async Clipboard API only. Returns true on success, false when the
 * browser denies or lacks clipboard access — the caller must then show its
 * manual-copy fallback instead of claiming the copy worked. There is
 * deliberately no fallback to the deprecated legacy copy command.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Select the text content of an element so the user can copy it manually
 * (Ctrl/Cmd+C). Used when copyText() reports failure.
 */
export function selectForManualCopy(el: HTMLElement | null): void {
  const sel = window.getSelection();
  if (!el || !sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}
