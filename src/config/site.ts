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
  /**
   * GA4 measurement ID (e.g. `G-XXXXXXXXXX`). When set, the gtag.js
   * snippet is injected into every page head via `headTags()`.
   */
  ga4MeasurementId: string;
  /**
   * Search-console verification tokens. When set, the corresponding
   * `<meta>` tags are injected into every page head via `headTags()`.
   */
  googleSiteVerification: string;
  bingSiteVerification: string;
}

export const SITE: SiteConfig = {
  siteUrl: 'https://endofservicegulf.org',
  contactEmail: 'intake@endofservicegulf.org',
  adsenseClientId: '',
  ga4MeasurementId: 'G-GS7FF1XVSD',
  googleSiteVerification: 'yrTNvTgdFCC2E8eKOWM3zgZRa34y5c3w4R_vLf3QNcA',
  bingSiteVerification: '2A730A2FAF8DA672C0BDBCC548BEB4FA',
};
