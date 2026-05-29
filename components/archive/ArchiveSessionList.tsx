import { Card } from "@/components/ui/Card";
import { ar, formatArchiveMemberLine } from "@/lib/i18n/ar";
import { formatCurrency } from "@/lib/utils";
import type { Session } from "@/types/database";
import Link from "next/link";

export interface ArchivedSessionSummary extends Session {
  totalExpenses: number;
  memberCount: number;
}

interface ArchiveSessionListProps {
  sessions: ArchivedSessionSummary[];
}

export function ArchiveSessionList({ sessions }: ArchiveSessionListProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">{ar.archive.empty}</p>
      </Card>
    );
  }

  return (
    <ul className="space-y-2">
      {sessions.map((session) => (
        <li key={session.id}>
          <Link href={`/archive/${session.id}`} className="block touch-manipulation">
            <Card className="transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{ar.archive.archivedCycle}</p>
                  <p className="text-xs text-muted">
                    {session.ended_at
                      ? new Date(session.ended_at).toLocaleDateString("ar-SA", {
                          dateStyle: "medium",
                        })
                      : "—"}
                  </p>
                </div>
                <span className="font-semibold tabular-nums">
                  {formatCurrency(session.totalExpenses)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {formatArchiveMemberLine(session.memberCount)}
              </p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
