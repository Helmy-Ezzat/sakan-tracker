import { Card } from "@/components/ui/Card";
import { getRoomCodeFromCookies } from "@/lib/auth/cookies";
import { getArchivedSessionData } from "@/lib/data/session";
import { ar } from "@/lib/i18n/ar";
import { calculateSettlement, cn, formatCurrency } from "@/lib/utils";
import type { SettlementLine } from "@/types/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

interface ArchiveDetailPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ArchiveDetailPage({
  params,
}: ArchiveDetailPageProps) {
  const { sessionId } = await params;
  const roomCode = await getRoomCodeFromCookies();

  if (!roomCode) {
    redirect(ROUTES.login);
  }

  const { session, expenses, members } = await getArchivedSessionData(
    sessionId,
    roomCode,
  );

  const settlement = calculateSettlement(expenses, members);
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0,
  );
  const perPerson = members.length > 0 ? totalExpenses / members.length : 0;

  const startDate = new Date(session.created_at).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const endDate = session.ended_at
    ? new Date(session.ended_at).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      <Link
        href={ROUTES.archive}
        className="inline-flex text-sm text-primary touch-manipulation"
      >
        ← {ar.archive.backToArchive}
      </Link>

      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{ar.archive.archivedSession}</h1>
          <span className="rounded-full bg-muted/30 px-3 py-1 text-xs font-medium text-muted">
            {ar.archive.readOnly}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted" dir="rtl">
          {startDate} — {endDate}
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">{ar.dashboard.totalSpent}</p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">{ar.dashboard.perPerson}</p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {formatCurrency(perPerson)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">
          {ar.dashboard.settlement}
        </h2>
        {settlement.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">{ar.dashboard.noMembers}</p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {settlement.map((line) => (
              <li key={line.userId}>
                <Card className="space-y-3">
                  <p className="font-semibold">{line.userName}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted">
                        {ar.dashboard.totalPaid}
                      </p>
                      <p className="mt-0.5 font-medium tabular-nums">
                        {formatCurrency(line.paid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">
                        {ar.dashboard.settlementStatus}
                      </p>
                      <SettlementStatus balance={line.balance} />
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">
          {ar.dashboard.recentExpenses}
        </h2>
        {expenses.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">{ar.dashboard.noExpenses}</p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => {
              const member = members.find((m) => m.id === expense.user_id);
              const userName = member?.name ?? ar.dashboard.unknownUser;
              return (
                <li key={expense.id}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{expense.description}</p>
                        <p className="mt-0.5 text-xs text-muted">{userName}</p>
                      </div>
                      <p className="shrink-0 font-bold tabular-nums">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function SettlementStatus({ balance }: { balance: number }) {
  const threshold = 0.01;

  if (Math.abs(balance) < threshold) {
    return (
      <p className="mt-0.5 text-sm font-medium text-success">
        {ar.dashboard.settled}
      </p>
    );
  }

  const amount = formatCurrency(Math.abs(balance));
  const isOwed = balance > 0;

  return (
    <p
      className={cn(
        "mt-0.5 text-sm font-semibold leading-snug",
        isOwed ? "text-success" : "text-danger",
      )}
    >
      {isOwed
        ? ar.dashboard.owedAmount(amount)
        : ar.dashboard.owesAmount(amount)}
    </p>
  );
}
