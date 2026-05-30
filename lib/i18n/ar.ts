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
    enabling: "جاري التفعيل...",
    enabled: "اشتغلت تمام! جرّب من موبايل تاني كدة",
    denied: "إذن الإشعارات مقفول على الموبايل.",
    deniedHintChrome:
      "Chrome: ⋮ → الإعدادات → إعدادات الموقع → الإشعارات → اسمح للموقع ده.",
    deniedHintSafari:
      "آيفون: الإعدادات → الإشعارات → اختار «ميز السكن» من الشاشة الرئيسية (مش Safari العادي) → اسمح بالإشعارات.",
    deniedHintIosInstall:
      "لو لسه مش ظاهر: احذف اختصار التطبيق من الشاشة الرئيسية، افتح الموقع من Safari، Add to Home Screen، وفعّل الإشعارات تاني.",
    needsSubscriptionTitle: "إكمال تفعيل الإشعارات",
    needsSubscriptionBody:
      "الإذن متاح، بس لسه محتاجين نربط الموبايل بالسيرفر. دوس الزرار تحت.",
    completeSetupAction: "إكمال التفعيل",
    pushNotConfigured: "مفاتيح الـ VAPID مش مظبوطة على السيرفر.",
    pushSaveFailed: "مش عارفين نحفظ الاشتراك، جرب تاني.",
    pushUnsupported: "موبايلك أو متصفحك مش بيدعم إشعارات الخلفية.",
  },

  nav: {
    main: "القائمة الرئيسية",
    dashboard: "الرئيسية",
    expenses: "المشتريات",
    settlement: "التصفية",
    archive: "الأرشيف",
    settings: "الإعدادات",
  },

  auth: {
    signInTitle: "دخول ميز السكن",
    nameLabel: "اسمك إيه؟",
    namePlaceholder: "مثلاً: أحمد",
    phoneLabel: "رقم الموبايل",
    phonePlaceholder: "05xxxxxxxx",
    roomCodeLabel: "كود الميز المشترك",
    roomCodePlaceholder: "مثلاً: سكن-الروضه",
    continue: "ادخل الميز",
    signingIn: "جاري تسجيل الدخول...",
    errors: {
      nameRequired: "اكتب اسمك الأول يا غالي.",
      phoneInvalid: "اكتب رقم موبايل صح عشان الميز يظبط.",
      roomCodeRequired: "اكتب كود الميز عشان نعرف هتدخل فين.",
      signInFailed: "حصل مشكلة ومادخلتش، جرب تاني.",
    },
  },

  dashboard: {
    currentCycle: "الميز الشغال حاليا",
    totalSpent: "كل اللي اتصرف",
    perPerson: "كل واحد عليه",
    addExpense: "سجّل مصروف جديد",
    closeAddExpense: "إلغاء",
    addExpenseTitle: "صرفت كام؟",
    addExpenseSubtitle: "اكتب اللي دفعته دلوقتي عشان يتزود في الميز.",
    amount: "المبلغ بالريال",
    amountPlaceholder: "0.00",
    description: "اشتريت إيه؟ (الوصف)",
    descriptionPlaceholder: "مثلاً: غداء رز ولحمة، شحن غاز..",
    saveExpense: "سجّل في الميز",
    saving: "جاري الحفظ...",
    cancel: "إلغاء",
    recentExpenses: "آخر حاجات اتصرفت",
    noExpenses: "محدش صرف حاجة لسه في الميز ده. دوس (+) وسجل أول مصروف.",
    settlement: "صفحة التصفية (مين ليه ومين عليه)",
    noMembers: "مفيش شباب مسجلين لسه. أول ما حد يدخل هتبان الحسبة هنا.",
    settled: "خالص",
    settlementStatus: "المستحقات",
    owedAmount: (amount: string) => `ليه ${amount}`,
    owesAmount: (amount: string) => `عليه ${amount}`,
    totalPaid: "دفع",
    unknownUser: "شخص مجهول",
    editExpense: "تعديل",
    deleteExpense: "حذف",
    deleteConfirmTitle: "تأكيد الحذف",
    deleteConfirmBody:
      "المصروف هيتحذف نهائياً ومش هتقدر ترجعه تاني.",
    deleteConfirmAction: "احذف",
    editExpenseTitle: "عدّل المصروف",
    editExpenseSubtitle: "غيّر المبلغ أو الوصف بتاع المصروف.",
    updateExpense: "حفظ التعديل",
    updating: "جاري التحديث...",
    settleCycle: "قفل الميز الشغال وابدأ واحد جديد",
    settleConfirmTitle: "عايز تقفل الميز وتصفيه؟",
    settleConfirmBody:
      "بمجرد ما تصفي الميز الحالي هينتقل للأرشيف وهيتم فتح ميز جديد.",
    settleConfirmAction: "صفّي الميز ",
    expenseAddedToast: (name: string, amount: string, description: string) =>
      `${name} صرف ${amount} (${description})`,
    expenseUpdatedToast: "تم تحديث المصروف بنجاح",
    expenseDeletedToast: "تم حذف المصروف",
    settlementCompletedToast: "تم قفل الميز وبدء ميز جديد بنجاح",
    errors: {
      saveFailed: "معرفناش نحفظ اللي صرفته.",
      signInAgain: "اطلع وادخل تاني عشان السيستم يقراك.",
      amountInvalid: "اكتب مبلغ حقيقي أكبر من الصفر يا هندسة.",
      descriptionRequired: "اكتب اشتريت إيه عشان الباقي يفهم.",
      saveExpenseFailed: "حصل غلطة أثناء الحفظ.",
      updateExpenseFailed: "حصل غلطة أثناء التحديث.",
      noActiveSession: "مفيش ميز شغال حالياً.",
      deleteFailed: "المسح فشل.",
      deleteForbidden: "عيب.. متقدرش تمسح حاجة سجلها زميلك بنفسه!",
      deleteNotFound: "المصروف ده ملوش أثر في قاعدة البيانات.",
      updateForbidden: "عيب.. متقدرش تعدل حاجة سجلها زميلك بنفسه!",
      updateNotFound: "المصروف ده ملوش أثر في قاعدة البيانات.",
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

  settings: {
    title: "الإعدادات",
    subtitle: "إدارة حسابك وبيانات الميز",
    accountSection: "معلومات الحساب",
    yourName: "اسمك",
    yourPhone: "رقم موبايلك",
    yourRole: "دورك",
    roleAdmin: "مسؤول الميز",
    roleUser: "عضو",
    roomSection: "معلومات الميز",
    roomCode: "كود الميز",
    appearanceSection: "المظهر",
    theme: "الثيم",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "تلقائي (حسب النظام)",
    logout: "تسجيل خروج",
    logoutConfirmTitle: "تسجيل الخروج",
    logoutConfirmBody: "متأكد عايز تسجل خروج؟ هتحتاج تدخل تاني بالاسم ورقم الموبايل.",
    logoutConfirmAction: "تسجيل خروج",
    loggingOut: "جاري تسجيل الخروج...",
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