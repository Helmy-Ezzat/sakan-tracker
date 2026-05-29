/** Arabic UI copy — single source for user-facing strings. */

export const ar = {
  appName: "مصاريف السكن",
  appDescription: "تتبع مصاريف السكن المشتركة والتسويات بسهولة.",

  nav: {
    main: "التنقل الرئيسي",
    dashboard: "الرئيسية",
    archive: "الأرشيف",
  },

  auth: {
    signInTitle: "الدخول إلى الجلسة",
    signInSubtitle: "الاسم ورقم الجوال فقط — بدون كلمة مرور.",
    nameLabel: "اسمك",
    namePlaceholder: "أحمد",
    phoneLabel: "رقم الجوال",
    phonePlaceholder: "05xxxxxxxx",
    continue: "متابعة",
    signingIn: "جاري الدخول…",
    errors: {
      nameRequired: "يرجى إدخال اسمك.",
      phoneInvalid: "يرجى إدخال رقم جوال صحيح.",
      signInFailed: "تعذّر تسجيل الدخول. حاول مرة أخرى.",
    },
  },

  dashboard: {
    currentCycle: "الجمعية الحالية",
    totalSpent: "إجمالي المصروف",
    perPerson: "لكل شخص",
    addExpense: "إضافة مصروف",
    closeAddExpense: "إغلاق إضافة مصروف",
    addExpenseTitle: "إضافة مصروف",
    addExpenseSubtitle: "سجّل ما تم صرفه في هذه الدورة.",
    amount: "المبلغ",
    amountPlaceholder: "0.00",
    description: "الوصف",
    descriptionPlaceholder: "رز ولحمة",
    saveExpense: "حفظ المصروف",
    saving: "جاري الحفظ…",
    cancel: "إلغاء",
    recentExpenses: "آخر المصروفات",
    noExpenses: "لا توجد مصروفات بعد. اضغط + لإضافة أول مصروف.",
    settlement: "التسوية",
    noMembers: "لا يوجد أعضاء بعد. تظهر التسوية عند انضمام الأشخاص.",
    settled: "مُسوّى",
    owed: "يُستحق له",
    owes: "عليه",
    totalPaid: "إجمالي الدفع",
    netBalance: "الصافي",
    unknownUser: "غير معروف",
    deleteExpense: "حذف المصروف",
    deleteConfirmTitle: "حذف المصروف؟",
    deleteConfirmBody:
      "سيتم حذف هذا المصروف نهائيًا من الدورة الحالية. لا يمكن التراجع عن هذا الإجراء.",
    deleteConfirmAction: "حذف",
    settleCycle: "تسوية وبدء جمعية جديدة",
    settleConfirmTitle: "تسوية الدورة؟",
    settleConfirmBody:
      "سيتم أرشفة جميع مصروفات الدورة الحالية وبدء جمعية جديدة. تأكد أن الجميع موافق.",
    settleConfirmAction: "تسوية وبدء جديدة",
    expenseAddedToast: (name: string, amount: string, description: string) =>
      `أضاف ${name} ${amount} لـ «${description}»`,
    errors: {
      saveFailed: "تعذّر حفظ المصروف.",
      signInAgain: "يرجى تسجيل الدخول مرة أخرى.",
      amountInvalid: "أدخل مبلغًا صحيحًا أكبر من صفر.",
      descriptionRequired: "يرجى إدخال وصف.",
      saveExpenseFailed: "تعذّر حفظ المصروف.",
      noActiveSession: "لا توجد جلسة نشطة.",
      deleteFailed: "تعذّر حذف المصروف.",
      deleteForbidden: "لا يمكنك حذف مصروف شخص آخر.",
      deleteNotFound: "المصروف غير موجود.",
      adminRequired: "هذا الإجراء متاح للمسؤول فقط.",
      settleFailed: "تعذّر إتمام التسوية.",
    },
  },

  archive: {
    title: "الأرشيف",
    subtitle: "دورات التسوية السابقة — محفوظة ولا تُحذف.",
    empty: "لا توجد دورات مؤرشفة بعد. عند التسوية ستظهر هنا.",
    archivedCycle: "دورة مؤرشفة",
    readOnly: "للقراءة فقط",
    people: "أشخاص",
    backToArchive: "العودة إلى الأرشيف",
    archivedSession: "جلسة مؤرشفة",
    detailPlaceholder: "سيتم تحميل المصروفات والتسوية النهائية من قاعدة البيانات.",
  },

  errors: {
    dbNotSetup:
      "قاعدة البيانات غير مهيأة. في Supabase → محرر SQL، نفّذ supabase/migrations/001_initial_schema.sql ثم 002_realtime_anon_read.sql.",
    tableMissing:
      "جدول مطلوب غير موجود. نفّذ ملفات supabase/migrations/ من محرر SQL في Supabase.",
  },
} as const;

/** Arabic pluralization for session member count. */
export function formatMemberCount(count: number): string {
  if (count === 0) return "لا أحد في هذه الجلسة";
  if (count === 1) return "شخص واحد في هذه الجلسة";
  if (count === 2) return "شخصان في هذه الجلسة";
  if (count >= 3 && count <= 10) return `${count} أشخاص في هذه الجلسة`;
  return `${count} شخصًا في هذه الجلسة`;
}

/** Archive list member suffix, e.g. "3 أشخاص · للقراءة فقط" */
export function formatArchiveMemberLine(count: number): string {
  const people =
    count === 1 ? "شخص واحد" : count === 2 ? "شخصان" : `${count} أشخاص`;
  return `${people} · ${ar.archive.readOnly}`;
}
