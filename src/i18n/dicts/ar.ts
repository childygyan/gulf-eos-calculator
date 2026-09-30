/**
 * dicts/ar.ts — the Arabic (default) dictionary.
 *
 * This file is the TYPE SOURCE OF TRUTH (`Dict = typeof ar` in dict.ts):
 * every other locale dictionary must match its key shape exactly, so a
 * missing or extra key fails compilation — and the dict-completeness test.
 *
 * Phase 1 carries nav/homepage/footer copy only. No legal figures anywhere.
 */
export const ar = {
  meta: {
    siteName: 'مستحقات',
    homeTitle: 'مستحقات | دليل مستحقات نهاية الخدمة في دول الخليج',
    homeDescription:
      'مستحقات — دليلك بالعربية لفهم مستحقات نهاية الخدمة في دول الخليج: السعودية، الإمارات، الكويت، قطر، البحرين، وعُمان. معلومات عامة للتوعية.',
  },
  nav: {
    home: 'الرئيسية',
    countries: 'الدول',
    faq: 'الأسئلة الشائعة',
    about: 'من نحن',
  },
  switcher: {
    label: 'اللغة',
    current: 'العربية',
    other: 'English',
  },
  hero: {
    badge: 'دليل مستحقات نهاية الخدمة في الخليج',
    title: 'اعرف مستحقاتك عند نهاية الخدمة',
    subtitle:
      'محتوى عربي واضح يشرح لك أساسيات مستحقات نهاية الخدمة في دول مجلس التعاون الخليجي الست، بلغة مبسطة وبدون تعقيد.',
    ctaPrimary: 'احسب مستحقاتك',
    ctaSecondary: 'استكشف الدول',
    note: 'الحاسبة التفصيلية قيد الإعداد — ستتوفر قريبًا.',
  },
  countries: {
    title: 'دول الخليج المشمولة',
    subtitle: 'نغطي أنظمة العمل في دول مجلس التعاون الخليجي الست.',
    items: [
      { name: 'السعودية', code: 'SA' },
      { name: 'الإمارات العربية المتحدة', code: 'AE' },
      { name: 'الكويت', code: 'KW' },
      { name: 'قطر', code: 'QA' },
      { name: 'البحرين', code: 'BH' },
      { name: 'عُمان', code: 'OM' },
    ],
  },
  features: {
    title: 'لماذا مستحقات؟',
    subtitle: 'صممنا الموقع ليكون مرجعك الأول باللغة العربية.',
    items: [
      {
        title: 'شرح مبسط',
        desc: 'نشرح مفاهيم نهاية الخدمة بلغة عربية واضحة، بعيدًا عن المصطلحات القانونية المعقدة.',
      },
      {
        title: 'تغطية خليجية',
        desc: 'محتوى مخصص لكل دولة من دول الخليج الست، مع مراعاة اختلاف الأنظمة بينها.',
      },
      {
        title: 'مجاني بالكامل',
        desc: 'جميع الأدلة والمحتوى مجانية، وستبقى كذلك — بلا اشتراكات وبلا حسابات.',
      },
    ],
  },
  cta: {
    title: 'ابدأ بفهم حقوقك اليوم',
    desc: 'تصفح أدلة الدول لتتعرف على أساسيات مستحقات نهاية الخدمة في الدولة التي تعمل بها.',
    button: 'تصفح الدول',
  },
  footer: {
    tagline: 'دليلك العربي لمستحقات نهاية الخدمة في دول الخليج.',
    columns: 'روابط',
    rights: '© {year} مستحقات. جميع الحقوق محفوظة.',
    disclaimer:
      'تنبيه: المحتوى معلومات عامة لأغراض التوعية فقط، وليس استشارة قانونية. تحقق دائمًا من النصوص الرسمية لقوانين العمل.',
  },
};
