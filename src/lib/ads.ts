/**
 * lib/ads.ts — AdSense slot rendering (Phase 5).
 *
 * Honesty contract: `SITE.adsenseClientId` is EMPTY until Firoz supplies a
 * real publisher ID. While it is empty, every ad slot renders the empty
 * string — literally nothing: no markup, no reserved height, no layout
 * shift, no third-party requests. The placeholders only become live ads
 * after Firoz configures a real AdSense account (see docs/PHASE5-REPORT.md).
 */
import { SITE } from '../config/site.js';

export type AdPosition = 'header' | 'in-article' | 'footer';

/**
 * HTML for one ad slot, or the empty string when no publisher ID is
 * configured. `slot` is the AdSense ad-unit slot id (also a placeholder
 * until real ad units exist).
 */
export function adSlotHtml(position: AdPosition, slot: string = '0000000000'): string {
  const clientId = SITE.adsenseClientId.trim();
  if (!clientId) return '';
  const safeSlot = slot.replace(/[^0-9]/g, '') || '0000000000';
  return (
    `<ins class="adsbygoogle" style="display:block" ` +
    `data-ad-client="${clientId}" data-ad-slot="${safeSlot}" ` +
    `data-ad-format="auto" data-full-width-responsive="true" ` +
    `data-ad-position="${position}"></ins>`
  );
}

/** Whether any ad slot on the site will render live ad markup. */
export function adsConfigured(): boolean {
  return SITE.adsenseClientId.trim().length > 0;
}
