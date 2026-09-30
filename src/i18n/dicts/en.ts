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
    menu: 'Menu',
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
    guideLink: 'Guide',
    calcLink: 'Calculator',
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
    guidesTitle: 'Country guides',
    contentTitle: 'Site content',
    compareHubLink: 'Gulf countries comparison',
    compareSaAeLink: 'Saudi vs UAE: comparison',
    lawyersLink: 'Talk to a lawyer',
    correctionsLink: 'Report a correction',
    contactLink: 'Contact us',
    legalTitle: 'Legal',
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Use',
    disclaimerLink: 'Disclaimer',
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
    jsRequired: 'This calculator is interactive and needs JavaScript enabled in your browser to work.',
    noJsMailtoLead: 'JavaScript is disabled in your browser — you can email us directly at:',
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
  guides: {
    pageTitle: 'End-of-Service Benefits Guide: {country} | Mustahaqqat',
    pageDescription:
      'A plain-English guide to end-of-service rules in {country}: who qualifies, how the award is calculated, resignation vs termination, caps — with a worked example and official sources.',
    heading: 'End-of-Service Benefits Guide: {country}',
    intro:
      'This guide explains the key end-of-service rules in {country} in plain language, based on {law}. Every figure comes from the official texts listed under Sources below, and the worked example is computed by our own calculator.',
    scopeNote:
      'Scope: private-sector employees covered by the labour law. Excludes domestic workers, free-zone employees under separate regimes, and workers covered by national pension/social-insurance systems.',
    secEligibility: 'Who qualifies?',
    eligibilityTermination: 'On termination or contract expiry: {min}.',
    eligibilityResignation: 'On resignation: {min}.',
    secCalculation: 'How is the award calculated?',
    calcIntro:
      'The award is based on the "{basis}", with fractions of a year pro-rated to actual service. The formula:',
    exampleTitle: 'Worked example',
    exampleIntro: 'An employee on a monthly wage of {wage} {currency} with {years} years of service (termination case):',
    exampleLine: '{yearsWord} × {rate} of the wage = {amount} {currency}',
    exampleTotal: 'Total: {amount} {currency}',
    exampleResignation: 'Had this been a resignation, the total would be: {amount} {currency}.',
    secResignation: 'Resignation vs termination',
    noReduction: 'The law does not distinguish between resignation and termination when calculating the award — the result is the same either way.',
    reductionIntro: 'The law applies reduced rates to resignation depending on length of service:',
    secCap: 'Cap on the award',
    secNoticeLeave: 'Notice period and annual leave',
    noticeLine: 'Notice ({scope}): employee {employee} days / employer {employer} days.',
    leaveLine: 'Annual leave: {days} days — {eligibility}',
    secTransition: 'Transitional periods',
    transitionAmbiguityNote:
      'Honesty note: press coverage of the ministerial clarification disagrees on the split date (the law’s effective date vs the contract-conclusion date); we use the effective date here and flag the disagreement.',
    secMistakes: 'Common mistakes',
    secAssumptions: 'Notes on the figures',
    secSources: 'Official sources',
    sourcesIntro: 'Every figure in this guide comes from the following official sources:',
    secFaq: 'Frequently asked questions',
    secRelated: 'Related links',
    relatedCalc: 'Calculate your award',
    relatedCalcDesc: 'Try the interactive calculator for {country}, with every step explained.',
    relatedTools: 'Supporting calculators',
    relatedGuides: 'Other country guides',
    relatedCompare: 'Compare countries',
    faqAllowanceQ: 'Do allowances count towards the award in {country}?',
    faqAllowanceA:
      'Wages in {country} are assessed on the "{basis}" basis. See "How is the award calculated?" above for details.',
    faqResignQ: 'Is the award lower if I resign?',
    faqResignAYes: 'Yes — the law applies reduced resignation rates depending on length of service: {bands}',
    faqResignANo: 'No — the law does not distinguish between resignation and termination when calculating the award.',
    faqPayoutQ: 'When and how is the award paid?',
    faqFractionsQ: 'Are fractions of a year counted?',
    faqFractionsA: 'Yes — fractions of a year are pro-rated to the actual period of service.',
    notes: {
      SA: 'Watch the exceptions: the full award is due on force majeure, and for a female worker ending her contract after marriage or childbirth — check the official text for details.',
      AE: 'The old labour law and its resignation reductions were repealed; current law applies no reduction to resignation.',
      KW: 'The reduced resignation rates apply to indefinite-term contracts.',
      QA: 'Three weeks is the statutory minimum; your contract may grant more — always check your contract.',
      BH: 'Identify the right payer by your start date: the employer for earlier service, the Social Insurance Organisation for later service.',
      OM: 'This formula covers workers not under the Social Protection Law; those covered fall under its own system.',
    },
    mistakes: {
      SA: [
        'Assuming an early resignation earns a partial award — nothing is due before the statutory minimum service is completed.',
        'Calculating on basic salary only and ignoring the regular allowances included in the last wage.',
        'Assuming a statutory cap exists on the award.',
      ],
      AE: [
        'Assuming resignation reduces the award — current law applies no reduction at all.',
        'Including allowances in the base — the law uses basic salary only.',
        'Ignoring the cap on long service periods.',
      ],
      KW: [
        'Expecting an award on resignation after short service — nothing is due before the minimum is completed.',
        'Forgetting the statutory cap on the award.',
        'Confusing the last wage with an average wage — the law uses the last wage paid.',
      ],
      QA: [
        'Expecting the rate to rise with longer service — the law has no escalating tiers.',
        'Assuming resignation reduces the award — there is no statutory reduction.',
        'Confusing the statutory minimum with the potentially higher contractual amount.',
      ],
      BH: [
        'The common claim that resignation halves the award — the law contains no such reduction.',
        'Claiming from the wrong payer — identify the payer from your service start date.',
        'Including allowances other than the social allowance in the base.',
      ],
      OM: [
        'Applying the new-law formula to service before its effective date.',
        'Assuming workers under the Social Protection Law use the same formula.',
        'Including allowances in the base — the law uses the last basic wage.',
      ],
    },
  },
  faqPage: {
    pageTitle: 'End-of-Service FAQ — Gulf States | Mustahaqqat',
    pageDescription:
      'Plain-English answers to the most common questions about end-of-service benefits in Saudi Arabia, the UAE, Kuwait, Qatar, Bahrain, and Oman.',
    heading: 'Frequently Asked Questions',
    intro:
      'The questions we hear most about end-of-service benefits across the Gulf, answered in plain language from the official labour-law texts.',
    generalTitle: 'General questions',
    countryTitle: 'Questions by country',
    items: [
      {
        q: 'What is the end-of-service award?',
        a: 'A sum of money due to the employee when the employment relationship ends, set by each country’s labour law under a statutory formula based on wages and length of service.',
      },
      {
        q: 'Are the rules the same across the Gulf?',
        a: 'No — they differ by country: the wage base, the accrual rates, how resignation is treated, and whether a cap exists. See the "Gulf countries comparison" page for a side-by-side view.',
      },
      {
        q: 'Are fractions of a year counted?',
        a: 'Yes — all six states apply pro-rating: part of a year counts in proportion to the actual period served.',
      },
      {
        q: 'Is the calculator result a final, binding amount?',
        a: 'No — results are estimates for awareness only. The actual amount depends on your contract and circumstances; the final reference is the official labour-law text or a legal professional.',
      },
      {
        q: 'I resigned after a year and a half in Saudi Arabia — do I get anything?',
        a: 'No — the minimum for resignation in Saudi Arabia is {saMin} of service, so nothing is due before that is completed.',
      },
      {
        q: 'Will my award be lower if I resign from my job in the UAE?',
        a: 'No — current UAE labour law applies no reduction to resignation; the award is identical whether you or the employer end the contract.',
      },
      {
        q: 'Is there a cap on end-of-service benefits in Kuwait?',
        a: 'Yes — the statutory cap in Kuwait is {kwCap} months of wages.',
      },
      {
        q: 'Does my award in Qatar grow the longer I work?',
        a: 'The rate is flat — the minimum is three weeks per year for the whole service period; Qatari law has no escalating tiers.',
      },
      {
        q: 'I recently started work in Bahrain — where do I claim my award from?',
        a: 'For service from {bhDate}, the award is claimed from the Social Insurance Organisation; earlier service is paid directly by the employer.',
      },
      {
        q: 'I worked in Oman before the new labour law took effect — how is my award calculated?',
        a: 'Your service is split: before {omDate} it uses the old formula, after that one full month per year — the two parts are combined on your last basic wage.',
      },
    ],
  },
  compare: {
    hubTitle: 'Gulf End-of-Service Comparison | Mustahaqqat',
    hubDescription:
      'Compare end-of-service systems in Saudi Arabia, the UAE, Kuwait, Qatar, Bahrain, and Oman: formula, wage base, resignation treatment, and caps.',
    hubHeading: 'Comparing End-of-Service Benefits Across the Gulf',
    hubIntro:
      'A side-by-side table built directly from the official texts of the six labour laws — every figure comes from the same data model that powers our calculators.',
    colCountry: 'Country',
    colFormula: 'Award formula (on termination)',
    colBasis: 'Wage base',
    colResignation: 'On resignation',
    colCap: 'Cap',
    colMin: 'Minimum service',
    resignFull: 'Full award — no statutory reduction',
    resignReduced: 'Reduced by length of service',
    noCap: 'No statutory cap',
    capValue: '{n} months of wages',
    minNone: 'None',
    minValue: '{n}',
    notesTitle: 'Notes on the table',
    hubNotes: [
      'The formulas above are for termination or contract expiry; see the resignation column for the differences.',
      'The "wage base" is the wage the formula is built on under each law — see the country guides for details.',
      'All six states pro-rate fractions of a year to actual service.',
    ],
    saAeTitle: 'End-of-Service Compared: Saudi Arabia vs the UAE | Mustahaqqat',
    saAeDescription:
      'A detailed comparison of end-of-service systems in Saudi Arabia and the UAE: formula, wage base, resignation, cap, and payment deadline.',
    saAeHeading: 'Saudi Arabia or the UAE? Comparing End-of-Service Benefits',
    saAeIntro:
      'The two biggest Gulf systems for expatriate employment — but the details that matter differ. This comparison uses the official texts only.',
    secFormula: 'The formula',
    secBasis: 'Wage base',
    secResignation: 'Resignation',
    secCap: 'Cap',
    secPayout: 'Payment deadline',
    secNoticeLeave: 'Notice and annual leave',
    secVerdict: 'The bottom line',
    verdict:
      'There is no universally "better" country — Saudi Arabia pays higher rates to those who complete ten years and resign, while the UAE is simpler (no resignation reduction at all) but has a clear cap. Run your own case in the calculator for the country where you work; individual differences outweigh any generalisation.',
    viewGuides: 'Guides for both countries',
    viewHub: 'Compare all six Gulf states',
    viewCalculators: 'Calculators for both countries',
  },
  lawyers: {
    pageTitle: 'Talk to a lawyer | Mustahaqqat',
    pageDescription:
      'Send an inquiry about a Gulf employment case — we route it to the lawyer partner program being set up. Replies are not guaranteed.',
    heading: 'Need a lawyer? Send an inquiry',
    intro:
      'If you have a dispute about end-of-service benefits or any term of your employment in one of the six Gulf states, fill in the form below and we will route your request to the lawyer partner program we are setting up.',
    honestNote:
      'This form only sends an email inquiry — the lawyer partner program is still being set up, and we cannot guarantee anyone will reply. We list no lawyer names or firms, and we will not invent any.',
    countryLabel: 'Country where you work',
    caseTypeLabel: 'Case type',
    nameLabel: 'Name',
    contactLabel: 'Email or phone number',
    contactHint: 'Either one is enough — we will use it to reply if possible.',
    descriptionLabel: 'Briefly describe your case',
    descriptionHint: 'A sentence or two is enough: what happened, when, and what you are claiming.',
    selectPlaceholder: 'Select…',
    submitLabel: 'Review request',
    caseTypes: {
      resignation: 'Resignation dispute',
      termination: 'Termination / EOS underpayment',
      'notice-leave': 'Notice-period / leave dispute',
      other: 'Other',
    },
    errors: {
      required: 'This field is required.',
      invalidCountry: 'Choose a country from the list.',
      invalidCaseType: 'Choose a case type from the list.',
      nameTooShort: 'Write your full name or a name we can call you.',
      contactRequired: 'Enter your email or phone number.',
      contactInvalid: 'That email or phone number does not look right.',
      descriptionTooShort: 'Describe your case in at least a sentence or two.',
    },
    successTitle: 'Your request is ready to send',
    successIntro:
      'Review your summary below. To send it, open your email with the button — or copy the summary and send it yourself to the inquiry address.',
    routeLine: 'Routing: {country} — {caseType}',
    summaryTitle: 'Your request summary',
    mailtoLabel: 'Open email to send',
    copyLabel: 'Copy summary',
    copiedLabel: 'Copied ✓',
    manualCopyHint: 'Automatic copy failed — please select the summary above and copy it manually.',
    backLabel: 'Edit request',
    emailSubject: 'Legal inquiry: {country} — {caseType}',
    summaryLabels: {
      country: 'Country',
      caseType: 'Case type',
      name: 'Name',
      contact: 'Contact',
      description: 'Case description',
      route: 'Routing',
    },
  },
  corrections: {
    pageTitle: 'Report a correction | Mustahaqqat',
    pageDescription:
      'Found a wrong legal figure or a missing rule on the site? Tell us — every correction is reviewed against official sources.',
    heading: 'Report a wrong figure or a missing rule',
    intro:
      'Accuracy is the foundation of this site. If you spot a wrong legal figure on any page, or notice an important rule we missed, tell us here.',
    honestNote:
      'We review every correction against the official texts of labour laws before adopting it — that can take some time, and we cannot promise an immediate fix.',
    pageUrlLabel: 'Page URL concerned',
    pageUrlHint: 'Paste the full link, or write the page path (e.g. /en/guides/saudi-arabia/).',
    whatsWrongLabel: 'What is wrong?',
    whatsWrongHint:
      'Describe the error in a sentence or two: what is currently written, and why it is wrong?',
    correctFigureLabel: 'The correct figure or the missing rule',
    sourceLinkLabel: 'Official source link',
    sourceLinkHint:
      'A full link to the official text (labour law, government portal…) — without it we cannot adopt the correction.',
    submitLabel: 'Review correction',
    errors: {
      required: 'This field is required.',
      invalidUrl: 'Enter a valid link or a page path starting with /.',
      tooShort: 'Please write a slightly fuller explanation.',
      invalidSource: 'Enter the full link to the official source (starting with http).',
    },
    successTitle: 'Your correction is ready to send',
    successIntro: 'Review your summary below, then send it by email or copy it.',
    summaryTitle: 'Correction summary',
    mailtoLabel: 'Open email to send',
    copyLabel: 'Copy summary',
    copiedLabel: 'Copied ✓',
    manualCopyHint: 'Automatic copy failed — please select the summary above and copy it manually.',
    backLabel: 'Edit correction',
    emailSubject: 'Suggested correction: {page}',
    summaryLabels: {
      pageUrl: 'Page',
      whatsWrong: 'What is wrong',
      correctFigure: 'Suggested correction',
      sourceLink: 'Source',
    },
  },
  contact: {
    pageTitle: 'Contact us | Mustahaqqat',
    pageDescription: 'Reach the Mustahaqqat team with general questions about the site and its content.',
    heading: 'Contact us',
    intro:
      'For general questions about the site and its content — not for individual legal advice (use the lawyer form for that).',
    emailLabel: 'Email',
    placeholderNote: 'A temporary address — it will be replaced with the real contact address soon.',
    noPhoneNote: 'We have no phone number or office address — email only.',
    correctionsCta: 'Spotted a wrong legal figure?',
    correctionsLink: 'Use the correction form',
    lawyersCta: 'Have a legal case?',
    lawyersLink: 'Fill in the lawyer inquiry form',
  },
  privacy: {
    pageTitle: 'Privacy Policy | Mustahaqqat',
    pageDescription:
      'How Mustahaqqat handles your data: no accounts, contact forms work through your own email app, and we use Google Analytics to understand aggregate usage.',
    heading: 'Privacy Policy',
    intro:
      'This policy describes how Mustahaqqat handles information when you use the site.',
    updated: 'Last updated: 30 September 2026.',
    sections: [
      {
        h: 'A static site with no accounts',
        p: 'Mustahaqqat is a static informational site — we never ask you to create an account, and we collect no names, phone numbers, or other identifying data to use the calculators and guides.',
      },
      {
        h: 'Contact forms',
        p: 'The "Talk to a lawyer" and "Report a correction" forms send nothing to any server — they compose an email in your own mail app, and you press send. If you email us, we see only your address and message content, used solely to reply to you.',
      },
      {
        h: 'Cookies and analytics',
        p: 'We use Google Analytics to understand how visitors use the site in aggregate — such as the most visited pages, traffic sources, and device types — and Google may use cookies for this purpose. We set no first-party cookies ourselves. The site\u2019s ad slots are empty until an ad account is activated; if ads are enabled in future (e.g. Google AdSense), the ad provider may use cookies to serve relevant ads.',
      },
      {
        h: 'Hosting and security',
        p: 'The site is hosted on Cloudflare Pages, which may process technical data (such as IP addresses) for security and performance purposes only.',
      },
      {
        h: 'Data sharing',
        p: 'We do not sell your data or share it with third parties for marketing purposes.',
      },
      {
        h: 'External links',
        p: 'The site links to official sources (labour-law texts and similar) — we are not responsible for the privacy policies of those sites.',
      },
      {
        h: 'Your rights',
        p: 'If you emailed us and later want your message deleted, send your request to the same contact address and we will delete it.',
      },
      {
        h: 'Updates to this policy',
        p: 'We may update this page when our practices change; continued use of the site counts as acceptance of the current version.',
      },
    ],
  },
  terms: {
    pageTitle: 'Terms of Use | Mustahaqqat',
    pageDescription:
      'Terms of use for Mustahaqqat: content is informational and estimated for awareness purposes, not legal or financial advice.',
    heading: 'Terms of Use',
    intro: 'By using Mustahaqqat you agree to these terms.',
    updated: 'Last updated: 30 September 2026.',
    sections: [
      {
        h: 'Nature of the content',
        p: 'The site is an informational guide offering calculators and simplified guides about end-of-service benefits in the six Gulf states: Saudi Arabia, the UAE, Kuwait, Qatar, Bahrain, and Oman.',
      },
      {
        h: 'Not professional advice',
        p: 'Everything on the site — including calculator results — is general information for awareness purposes only, not legal, financial, or tax advice, and creates no professional relationship between you and us.',
      },
      {
        h: 'Accuracy of information',
        p: 'We make reasonable efforts to be accurate based on official labour-law texts, but laws change and practical application varies. Your actual entitlement depends on your contract and circumstances — always verify against the official text or consult a specialist.',
      },
      {
        h: 'Acceptable use',
        p: 'You may not abuse the site, attempt to harm it, or scrape it automatically in ways that degrade its performance or break the law.',
      },
      {
        h: 'Intellectual property',
        p: 'The site\u2019s content is original — you may share it and link to it with attribution, without claiming ownership or presenting it misleadingly.',
      },
      {
        h: 'Limitation of liability',
        p: 'You use the site at your own risk; we are not liable for any loss resulting from reliance on the content without independent verification.',
      },
      {
        h: 'Changes to the terms',
        p: 'We may amend these terms when needed; continued use of the site after any change means you accept the updated version.',
      },
    ],
  },
  disclaimerPage: {
    pageTitle: 'Disclaimer | Mustahaqqat',
    pageDescription:
      'Mustahaqqat disclaimer: calculator results are estimates, not legal advice — always verify against official texts.',
    heading: 'Disclaimer',
    intro: 'Please read this notice before relying on any content on the site.',
    updated: 'Last updated: 30 September 2026.',
    sections: [
      {
        h: 'Estimated results',
        p: 'All calculator results are estimates for awareness purposes only, based on our reading of statutory texts — the actual amount may differ depending on your employment contract, your employer\u2019s regulations, and your personal circumstances.',
      },
      {
        h: 'Not legal advice',
        p: 'No content on the site — calculators, guides, or answers — is legal advice, and none of it replaces consulting a licensed lawyer in your country.',
      },
      {
        h: 'The lawyer contact form',
        p: 'The form only composes an email on your device; submitting it creates no lawyer–client relationship between you and us or between you and any lawyer.',
      },
      {
        h: 'The final reference',
        p: 'In any dispute, the authoritative reference is the official text of your country\u2019s labour law and its competent judicial bodies.',
      },
      {
        h: 'No guarantees',
        p: 'We make reasonable efforts to keep the content accurate and the site available, but we do not guarantee it is error-free or uninterrupted.',
      },
    ],
  },
};
