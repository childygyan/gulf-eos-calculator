// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://endofservicegulf.org',
  integrations: [
    tailwind(),
    sitemap({
      // Arabic default locale lives at the root; English mirrors under /en/.
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar', en: 'en' },
      },
      // The 404 page must never appear in the sitemap.
      filter: (page) => !page.endsWith('/404') && !page.endsWith('/404/'),
    }),
  ],
});
