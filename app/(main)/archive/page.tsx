import { ArchiveSessionList } from "@/components/archive/ArchiveSessionList";
import { ar } from "@/lib/i18n/ar";

export default function ArchivePage() {
  const archivedSessions: never[] = [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{ar.archive.title}</h2>
        <p className="text-sm text-muted">{ar.archive.subtitle}</p>
      </div>
      <ArchiveSessionList sessions={archivedSessions} />
    </div>
  );
}
