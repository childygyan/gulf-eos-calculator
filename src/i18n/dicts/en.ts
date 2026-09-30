/**
 * dicts/en.ts — the English dictionary.
 *
 * Must satisfy `Dict` (typeof ar) exactly: same keys, same nesting.
 * Natural English — not a word-by-word translation of the Arabic copy.
 */
import type { Dict } from '../dict.js';

export const en: Dict = {
  meta: {
    siteName: 'Mustahaqqat',
    homeTitle: 'Mustahaqqat | Gulf End-of-Service Benefits Guide',
    homeDescription:
      'Mustahaqqat — your English guide to understanding end-of-service benefits across the Gulf: Saudi Arabia, the UAE, Kuwait, Qatar, Bahrain, and Oman. General information for awareness.',
  },
  nav: {
    home: 'Home',
    countries: 'Countries',
    faq: 'FAQ',
    about: 'About',
  },
  switcher: {
    label: 'Language',
    current: 'English',
    other: 'العربية',
  },
  hero: {
    badge: 'Gulf end-of-service benefits guide',
    title: 'Know what you are owed when employment ends',
    subtitle:
      'Clear, plain-language explainers on the basics of end-of-service benefits across the six GCC countries — no legal jargon.',
    ctaPrimary: 'Calculate your benefits',
    ctaSecondary: 'Explore countries',
    note: 'The detailed calculator is on its way — coming soon.',
  },
  countries: {
    title: 'Covered Gulf countries',
    subtitle: 'We cover the labour systems of all six GCC member states.',
    items: [
      { name: 'Saudi Arabia', code: 'SA' },
      { name: 'United Arab Emirates', code: 'AE' },
      { name: 'Kuwait', code: 'KW' },
      { name: 'Qatar', code: 'QA' },
      { name: 'Bahrain', code: 'BH' },
      { name: 'Oman', code: 'OM' },
    ],
  },
  features: {
    title: 'Why Mustahaqqat?',
    subtitle: 'Built to be your first reference for end-of-service benefits.',
    items: [
      {
        title: 'Plain-language explainers',
        desc: 'End-of-service concepts explained clearly, without dense legal terminology.',
      },
      {
        title: 'Gulf-wide coverage',
        desc: 'Dedicated content for each of the six Gulf states, reflecting how their systems differ.',
      },
      {
        title: 'Completely free',
        desc: 'All guides and content are free — no subscriptions, no accounts, now or later.',
      },
    ],
  },
  cta: {
    title: 'Start understanding your rights today',
    desc: 'Browse the country guides to learn the basics of end-of-service benefits in the country where you work.',
    button: 'Browse countries',
  },
  footer: {
    tagline: 'Your guide to Gulf end-of-service benefits.',
    columns: 'Links',
    rights: '© {year} Mustahaqqat. All rights reserved.',
    disclaimer:
      'Notice: content is general information for awareness purposes only, not legal advice. Always check the official texts of labour laws.',
  },
};
