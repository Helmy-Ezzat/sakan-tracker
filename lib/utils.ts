import type { Expense, SettlementLine, User } from "@/types/database";

/** Format amount with Arabic numerals + "ريال" (no ر.س. abbreviation). */
export function formatCurrency(amount: number, locale = "ar-SA"): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ريال`;
}

/**
 * Settlement: average share = total / member count.
 * balance = paid - share (positive => is owed, negative => owes).
 */
export function calculateSettlement(
  expenses: Expense[],
  members: User[],
): SettlementLine[] {
  if (members.length === 0) return [];

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const share = total / members.length;

  const paidByUser = new Map<string, number>();
  for (const expense of expenses) {
    const current = paidByUser.get(expense.user_id) ?? 0;
    paidByUser.set(expense.user_id, current + Number(expense.amount));
  }

  return members.map((member) => {
    const paid = paidByUser.get(member.id) ?? 0;
    const balance = paid - share;
    return {
      userId: member.id,
      userName: member.name,
      paid,
      share,
      balance,
    };
  });
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
