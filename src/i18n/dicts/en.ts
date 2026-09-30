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
    calculators: 'Calculators',
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
    note: 'Interactive calculators for all six states — try them free.',
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
  common: {
    calculate: 'Calculate',
    reset: 'Reset',
    resultTitle: 'Result',
    disclaimerTitle: 'Disclaimer',
    disclaimer:
      'Results are estimates for awareness purposes only — not legal, financial, or tax advice. Your actual outcome may differ based on your contract and circumstances. Always verify against the official legal texts or consult a professional.',
    backToCalculators: 'Back to calculators',
    estimateBadge: 'Estimated result',
    countryLabel: 'Country',
  },
  calculators: {
    pageTitle: 'Calculators | Mustahaqqat',
    pageDescription:
      'Free interactive calculators: end-of-service benefits across the six Gulf states, plus net salary, VAT, leave balance, and notice period calculators.',
    heading: 'Calculators',
    subtitle:
      'Interactive tools that run right in your browser and show every step of the calculation — no accounts, no subscriptions.',
    eosTitle: 'End-of-Service Calculator',
    eosDesc: 'Pick the country where you work to calculate your award under its labour law.',
    eosCardDesc: 'Calculate your award in {country} under its labour law, with every step explained.',
    toolsTitle: 'Supporting calculators',
    toolsDesc: 'Extra tools for salary, tax, leave, and notice periods.',
    cardCta: 'Open calculator',
    toolNames: {
      salaryNet: 'Net Salary Calculator',
      vat: 'VAT Calculator',
      leave: 'Leave Balance Calculator',
      notice: 'Notice Period Calculator',
    },
    toolDescs: {
      salaryNet: 'Work out your monthly net salary in any Gulf state, and see your EOS wage basis.',
      vat: 'Calculate VAT in Saudi Arabia, Bahrain, the UAE, and Oman — inclusive or exclusive.',
      leave: 'See your statutory annual entitlement and your remaining leave balance.',
      notice: 'Find your last working day based on the statutory notice period.',
    },
  },
  eos: {
    pageTitle: 'End-of-Service Calculator — {country} | Mustahaqqat',
    pageDescription:
      'Calculate your end-of-service award in {country} under the labour law: enter your monthly wage and length of service for an instant result with a full step-by-step breakdown.',
    heading: 'End-of-Service Calculator — {country}',
    intro:
      'This calculator follows the labour-law texts of {country}. Enter your details below for an instant result with every calculation step shown.',
    wageBasisTitle: 'Which wage is the award based on?',
    scenarioLabel: 'Reason for end of service',
    componentsTitle: 'Monthly wage ({currency})',
    componentsHint:
      'Enter your monthly amounts in the local currency. Only the included components form the calculation basis.',
    excludedNote: 'Not counted in the calculation basis: {items}.',
    yearsLabel: 'Full years of service',
    monthsLabel: 'Additional months',
    serviceHint: 'Example: 5 years and 3 months.',
    startDateLabel: 'Employment start date',
    endDateLabel: 'End-of-service date',
    dateHintOm:
      'We need your start date to split your service between the old law (before 31 July 2023) and the new law.',
    dateHintBh:
      'We need your start date to show which part the employer pays and which part you claim from social insurance (from 1 March 2024).',
    resultTitle: 'Your estimated result',
    totalLabel: 'Total end-of-service award',
    breakdownTitle: 'How did we reach this figure?',
    tierLine: '{band}: {years} × {rate} of monthly wage = {amount}',
    bandFirst: 'First {n} years',
    bandAfter: 'Beyond {n} years',
    bandAll: 'Whole period',
    portionPre: '(before {date})',
    portionPost: '(from {date})',
    rateHalf: 'half a month',
    rateFull: 'one full month',
    rateDays: '{n} days',
    rateWeeks: '{n} weeks',
    rateMonths: '{n} of a month',
    fullAwardLine: 'Full statutory award',
    resignationLine: 'Resignation reduction ({pct} of the full award)',
    noReductionLine: 'No statutory reduction for resignation',
    capLine: 'Statutory cap ({n} months of wages)',
    splitTitleOm: 'Splitting service between the two laws',
    splitPreOm: 'Before 31 July 2023 (old law)',
    splitPostOm: 'From 31 July 2023 (new law)',
    splitTitleBh: 'Who pays the award?',
    splitPreBh: 'Service before 1 March 2024 — paid directly by the employer',
    splitPostBh: 'Service from 1 March 2024 — claimed from the Social Insurance Organisation',
    assumptionsTitle: 'Important notes on this calculation',
    ineligibleTitle: 'No award for this length of service',
    ineligibleBody:
      'Under the law, you need at least {min} of service to qualify for an award in this case.',
    sourcesTitle: 'Official sources',
    sourcesHint: 'Every figure in this calculator comes from these official texts:',
    faqTitle: 'Frequently asked questions',
    basisShort: {
      basic: 'basic wage only, excluding allowances',
      'basic-plus-social-allowance': 'basic wage plus the social allowance',
      'total-wage': 'the last wage — basic plus regular allowances',
    },
    faqAllowanceQ: 'Do allowances count toward the end-of-service award in {country}?',
    faqAllowanceA:
      'It depends on the law: in {country} the wage basis is "{basis}". See "{wageBasisTitle}" above for details.',
    faqResignQ: 'Is the award lower if I resign?',
    faqResignAYes:
      'Yes. In {country} the law applies reduced rates to resignation depending on length of service — choose "Resignation" in the calculator and the statutory rates are applied automatically and shown in the breakdown.',
    faqResignANo:
      'No. The labour law in {country} does not distinguish between resignation and termination when calculating the award — the result is the same either way.',
    faqPayoutQ: 'When and how is the award paid?',
    assumptions: {
      qatarWeeksDivisor:
        'We treat "three weeks" as 21/30 of the monthly wage; the law does not specify the conversion.',
      kuwaitDailyDivisor:
        'Days are converted to months by dividing by 26 working days, per published practice.',
      omanOldDivisor: 'We treat 15 days as half a month (15/30) in the old-law formula.',
      saudiWageReading:
        'We follow the administrative reading of the "last wage": basic plus regular allowances (the statute itself does not itemise it).',
      omNoStartDate:
        'Because you did not enter a start date, the whole period was calculated under the new law. Enter the date for an exact split.',
      bhNoStartDate:
        'Because you did not enter a start date, we could not attribute the payer. Enter the date to see the employer and social-insurance portions.',
    },
    validation: {
      wage: 'Please enter a valid monthly wage (a positive number).',
      years: 'Please enter valid years of service (0 or more).',
      months: 'Please enter months between 0 and 11.',
      date: 'Please enter a valid date.',
      dateOrder: 'The end-of-service date must not be before the start date.',
    },
  },
  tools: {
    salaryNet: {
      pageTitle: 'Net Salary Calculator — Gulf | Mustahaqqat',
      pageDescription:
        'Calculate your monthly net salary in any Gulf state: enter your salary components and deductions from your payslip for an instant gross and net figure.',
      heading: 'Net Salary Calculator',
      intro:
        'Pick your country and enter your monthly salary components and deductions from your payslip. We also show the amount your end-of-service award would be based on in your country.',
      earningsTitle: 'Monthly salary components',
      deductionsTitle: 'Monthly deductions',
      deductionsHint:
        'Enter the actual deduction amounts from your payslip (social insurance, advances, etc.). We do not assume any deduction rates.',
      addDeduction: 'Add deduction',
      deductionName: 'Deduction name',
      deductionPlaceholder: 'e.g. social insurance contribution',
      removeDeduction: 'Remove',
      gross: 'Gross salary',
      totalDeductions: 'Total deductions',
      net: 'Net salary',
      eosBasis: 'End-of-service wage basis',
      eosBasisHint: 'Components included in the award basis under the labour law of {country}.',
      assumptionNote:
        'Honesty note: deduction rates differ between employers, so we assume none — every deduction here is entered by you.',
      validation: {
        amount: 'Please enter valid amounts (positive numbers).',
      },
    },
    vat: {
      pageTitle: 'VAT Calculator — Gulf | Mustahaqqat',
      pageDescription:
        'Calculate VAT in Saudi Arabia (15%), Bahrain (10%), the UAE and Oman (5%): enter an amount inclusive or exclusive of VAT.',
      heading: 'VAT Calculator',
      intro:
        'Pick the country, enter the amount, and say whether it includes VAT — the breakdown appears instantly.',
      amountLabel: 'Amount',
      modeLabel: 'Amount type',
      exclusive: 'Excluding VAT (VAT is added)',
      inclusive: 'Including VAT (VAT is extracted)',
      net: 'Amount before VAT',
      vatAmount: 'VAT amount',
      gross: 'Amount after VAT',
      notImplemented: 'VAT is not implemented in {country} yet.',
      rateNote: 'Rate applied in {country}: {rate}% (authority: {authority}).',
      validation: {
        amount: 'Please enter a valid amount (a positive number).',
      },
    },
    leave: {
      pageTitle: 'Leave Balance Calculator — Gulf | Mustahaqqat',
      pageDescription:
        'Calculate your annual leave balance in the Gulf states: the statutory yearly entitlement for your length of service, accrued, used, and remaining.',
      heading: 'Leave Balance Calculator',
      intro:
        'Pick your country and length of service to see your statutory yearly entitlement, then enter your accrued and used leave to find what remains.',
      serviceYearsLabel: 'Years of service',
      entitlement: 'Your statutory yearly entitlement',
      daysUnit: '{n} days',
      accruedLabel: 'Accrued leave (days)',
      accruedHint: 'Pre-filled for you (yearly entitlement × years of service) — adjust to match reality.',
      usedLabel: 'Used leave (days)',
      balance: 'Remaining balance',
      overused: 'You have exceeded your balance',
      overusedBy: 'You exceeded your balance by {n} — check with your employer to settle the difference.',
      note: 'Carry-over policies differ between employers; this calculator uses the statutory entitlement only.',
      validation: {
        numbers: 'Please enter valid numbers (positive).',
      },
    },
    notice: {
      pageTitle: 'Notice Period Calculator — Gulf | Mustahaqqat',
      pageDescription:
        'Find your last working day in the Gulf states: pick the country, contract type, who gives notice, and the notice date.',
      heading: 'Notice Period Calculator',
      intro:
        'Pick your country and contract type, say who gives notice and when — we calculate your last working day.',
      ruleLabel: 'Contract / pay type',
      partyLabel: 'Notice given by',
      partyEmployee: 'Employee',
      partyEmployer: 'Employer',
      startLabel: 'Notice date',
      daysLabel: 'Notice period (days)',
      daysHint: 'Pre-filled with the statutory minimum — adjust to match your contract (a longer period may be agreed).',
      lastDay: 'Last working day',
      resultLine: 'If notice is given on {start} for {days}, the last working day is {end}.',
      daysUnit: '{n} days',
      note: 'Your contract may set a longer notice period than the statutory minimum — the contract is the final reference.',
      validation: {
        date: 'Please enter a valid date.',
        days: 'Please enter a valid notice period (a positive number of days).',
      },
    },
  },
};
