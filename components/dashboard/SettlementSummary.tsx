import { Card } from "@/components/ui/Card";
import { ar } from "@/lib/i18n/ar";
import { cn, formatCurrency } from "@/lib/utils";
import type { SettlementLine } from "@/types/database";

interface SettlementSummaryProps {
  lines: SettlementLine[];
}

export function SettlementSummary({ lines }: SettlementSummaryProps) {
  if (lines.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">{ar.dashboard.noMembers}</p>
      </Card>
    );
  }

  return (
    <section className="space-y-2" aria-labelledby="settlement-heading">
      <h2 id="settlement-heading" className="text-sm font-medium text-muted">
        {ar.dashboard.settlement}
      </h2>
      <ul className="space-y-2">
        {lines.map((line) => (
          <li key={line.userId}>
            <Card className="space-y-3">
              <p className="font-semibold">{line.userName}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted">{ar.dashboard.totalPaid}</p>
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
    </section>
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
