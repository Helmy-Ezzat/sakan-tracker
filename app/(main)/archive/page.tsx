import { ArchiveSessionList } from "@/components/archive/ArchiveSessionList";
import { getRoomCodeFromCookies } from "@/lib/auth/cookies";
import { getArchivedSessionsWithSummary } from "@/lib/data/session";
import { ar } from "@/lib/i18n/ar";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default async function ArchivePage() {
  const roomCode = await getRoomCodeFromCookies();
  if (!roomCode) {
    redirect(ROUTES.login);
  }

  const archivedSessions = await getArchivedSessionsWithSummary(roomCode);

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
