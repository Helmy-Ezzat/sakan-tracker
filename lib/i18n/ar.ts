/** Arabic (Egyptian Colloquial) UI copy — single source for user-facing strings. */
export const ar = {
  appName: "ميز السكن",
  appDescription: "احسب مصاريف ميز السكن.",

  notifications: {
    now: "الآن",
    enableTitle: "شغّل إشعارات الموبايل",
    enableBody:
      "عشان تلمح أي حاجة بتتدفع في الميز أول بأول، حتى لو الموبايل مقفول أو فاتح الواتساب.",
    installHint:
      "لو معاك آيفون: ضيف التطبيق للشاشة الرئيسية الأول (Add to Home Screen) وبعدين شغل الإشعارات.",
    enableAction: "تفعيل الإشعارات",
    enabling: "بنشغلها أهو…",
    enabled: "اشتغلت تمام! جرّب من موبايل تاني كدة",
    denied: "أنت رفضت الإذن. شغلها يدوياً من إعدادات المتصفح.",
    pushNotConfigured: "مفاتيح الـ VAPID مش مظبوطة على السيرفر.",
    pushSaveFailed: "مش عارفين نحفظ الاشتراك، جرب تاني.",
    pushUnsupported: "موبايلك أو متصفحك مش بيدعم إشعارات الخلفية.",
  },

  nav: {
    main: "القائمة الرئيسية",
    dashboard: "الرئيسية",
    archive: "المِياز القديمة",
  },

  auth: {
    signInTitle: "دخول ميز السكن",
    signInSubtitle: "اكتب اسمك ورقم موبايلك بس — من غير باسوورد وجع دماغ.",
    nameLabel: "اسمك إيه؟",
    namePlaceholder: "مثلاً: أحمد",
    phoneLabel: "رقم الموبايل",
    phonePlaceholder: "05xxxxxxxx",
    continue: "ادخل الميز",
    signingIn: "بندخلك الميز أهو…",
    errors: {
      nameRequired: "اكتب اسمك الأول يا غالي.",
      phoneInvalid: "اكتب رقم موبايل صح عشان الميز يظبط.",
      signInFailed: "حصل مشكلة ومادخلتش، جرب تاني.",
    },
  },

  dashboard: {
    currentCycle: "الميز الشغال حاليا",
    totalSpent: "كل اللي اتصرف",
    perPerson: "نصيب النفر",
    addExpense: "سجّل مصروف جديد",
    closeAddExpense: "إلغاء",
    addExpenseTitle: "صرفت كام؟",
    addExpenseSubtitle: "اكتب اللي دفعته دلوقتي عشان يتزود في الميز.",
    amount: "المبلغ بالريال",
    amountPlaceholder: "0.00",
    description: "اشتريت إيه؟ (الوصف)",
    descriptionPlaceholder: "مثلاً: غداء رز ولحمة، شحن غاز..",
    saveExpense: "سجّل في الميز",
    saving: "بنحفظ أهو…",
    cancel: "إلغاء",
    recentExpenses: "آخر حاجات اتصرفت",
    noExpenses: "محدش صرف حاجة لسه في الميز ده. دوس (+) وسجل أول مصروف.",
    settlement: "صفحة التصفية (مين ليه ومين عليه)",
    noMembers: "مفيش شباب مسجلين لسه. أول ما حد يدخل هتبان الحسبة هنا.",
    settled: "خالصان 👍",
    owed: "ليه فلوس 🟢",
    owes: "عليه فلوس 🔴",
    totalPaid: "دفع كام كله",
    netBalance: "الصافي",
    unknownUser: "شخص مجهول",
    deleteExpense: "امسح المصروف ده",
    deleteConfirmTitle: "عايز تمسح المصروف ده؟",
    deleteConfirmBody:
      "المصروف ده هيتمسح تماماً من الميز الشغال ومفيش تراجع. متأكد؟",
    deleteConfirmAction: "إمسح المصروف",
    settleCycle: "قفل الميز الشغال وابدأ واحد جديد",
    settleConfirmTitle: "عايز تقفل الميز وتصفيه؟",
    settleConfirmBody:
      "كده هتقفل الميز الحالي وتتنقل للأرشيف، ونبدأ ميز جديد على نضافة. اتأكد إن الشباب كلها موافقة وخالصة.",
    settleConfirmAction: "صفّي الميز وابدأ على نضافة",
    expenseAddedToast: (name: string, amount: string, description: string) =>
      `${name} صرف ${amount} ريال (${description})`,
    errors: {
      saveFailed: "معرفناش نحفظ اللي صرفته.",
      signInAgain: "اطلع وادخل تاني عشان السيستم يقراك.",
      amountInvalid: "اكتب مبلغ حقيقي أكبر من الصفر يا هندسة.",
      descriptionRequired: "اكتب اشتريت إيه عشان الباقي يفهم.",
      saveExpenseFailed: "حصل غلطة أثناء الحفظ.",
      noActiveSession: "مفيش ميز شغال حالياً.",
      deleteFailed: "المسح فشل.",
      deleteForbidden: "عيب.. متقدرش تمسح حاجة سجلها زميلك بنفسه!",
      deleteNotFound: "المصروف ده ملوش أثر في قاعدة البيانات.",
      adminRequired: "الميزة دي مقفولة للمسؤول عن الميز بس.",
      settleFailed: "التصفية باظت، راجع الداتا تاني.",
    },
  },

  archive: {
    title: "المِياز المقفولة",
    subtitle: "دي المِياز القديمة اللي اتصفت وخلاص.. محفوظة هنا للرجوع ليها.",
    empty: "لسه مفيش أي ميز اتقفل واتصفى لغاية دلوقتي.",
    archivedCycle: "ميز مقفول",
    readOnly: "للقراءة فقط (متقفل)",
    people: "شباب",
    backToArchive: "ارجع للمِياز القديمة",
    archivedSession: "ميز قديم مقفول",
    detailPlaceholder: "جاري سحب مصاريف الميز والتصفية النهائية من الأرشيف...",
  },

  errors: {
    dbNotSetup:
      "السباكة بتاعة قاعدة البيانات مش راكبة. شغل ملفات الـ migrations في الـ SQL Editor بتاع Supabase الأول.",
    tableMissing:
      "فيه جدول ناقص في قاعدة البيانات، راجع مهندس السيستم عشان يشغل الـ migrations.",
  },
} as const;

/** Arabic pluralization for session member count (Egyptian Style). */
export function formatMemberCount(count: number): string {
  if (count === 0) return "محدش مسجل في الميز ده";
  if (count === 1) return "نفر واحد في الميز";
  if (count === 2) return "نفرين في الميز";
  if (count >= 3 && count <= 10) return `${count} شباب في الميز`;
  return `${count} شاب في الميز`;
}

/** Archive list member suffix, e.g. "3 شباب · مقفولة" */
export function formatArchiveMemberLine(count: number): string {
  const people =
    count === 1 ? "نفر واحد" : count === 2 ? "نفرين" : `${count} شباب`;
  return `${people} · ${ar.archive.readOnly}`;
}