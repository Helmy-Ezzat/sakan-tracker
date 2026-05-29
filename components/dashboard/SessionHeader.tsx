import { Card } from "@/components/ui/Card";
import { ar, formatMemberCount } from "@/lib/i18n/ar";
import { formatCurrency } from "@/lib/utils";

interface SessionHeaderProps {
  sessionLabel?: string;
  totalExpenses: number;
  memberCount: number;
}

export function SessionHeader({
  sessionLabel = ar.dashboard.currentCycle,
  totalExpenses,
  memberCount,
}: SessionHeaderProps) {
  const average = memberCount > 0 ? totalExpenses / memberCount : 0;

  return (
    <Card className="space-y-3">
      <p className="text-sm font-medium text-muted">{sessionLabel}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted">{ar.dashboard.totalSpent}</p>
          <p className="text-xl font-semibold tabular-nums">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">{ar.dashboard.perPerson}</p>
          <p className="text-xl font-semibold tabular-nums">
            {formatCurrency(average)}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted">{formatMemberCount(memberCount)}</p>
    </Card>
  );
}
