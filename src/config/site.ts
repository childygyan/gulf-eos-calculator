/**
 * config/site.ts — the single site-wide configuration (Phase 5).
 *
 * Production domain is live (endofservicegulf.org, 2026-09-30). The contact
 * inbox and AdSense ID are still placeholders Firoz must fill — see
 * docs/PHASE5-REPORT.md for the exact list.
 *
 * Phases 1–4 kept `SITE_URL` in lib/seo.ts; it now re-exports
 * `SITE.siteUrl` so there is exactly one place to change.
 */
export interface SiteConfig {
  /**
   * Production domain (live 2026-09-30). Canonicals, hreflang, sitemap,
   * and OG URLs all follow this value automatically.
   */
  siteUrl: string;
  /**
   * Placeholder intake inbox. Used by the lawyer lead-intake form, the
   * correction form, and the contact page (mailto: links only — there is
   * no backend on this static site). Firoz must supply the real address.
   */
  contactEmail: string;
  /**
   * AdSense publisher ID (e.g. `ca-pub-xxxxxxxxxxxxxxxx`). EMPTY by
   * default: ad slots render nothing (zero height, no layout shift) until
   * Firoz supplies a real publisher ID.
   */
  adsenseClientId: string;
}

export const SITE: SiteConfig = {
  siteUrl: 'https://endofservicegulf.org',
  contactEmail: 'intake@endofservicegulf.org',
  adsenseClientId: '',
};
