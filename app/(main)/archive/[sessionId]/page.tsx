import { Card } from "@/components/ui/Card";
import { ar } from "@/lib/i18n/ar";
import Link from "next/link";

interface ArchiveDetailPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ArchiveDetailPage({
  params,
}: ArchiveDetailPageProps) {
  const { sessionId } = await params;

  return (
    <div className="space-y-4">
      <Link
        href="/archive"
        className="inline-flex text-sm text-primary touch-manipulation"
      >
        → {ar.archive.backToArchive}
      </Link>
      <Card>
        <p className="text-sm text-muted">{ar.archive.archivedSession}</p>
        <p className="mt-1 font-mono text-xs text-muted/80" dir="ltr">
          {sessionId}
        </p>
        <p className="mt-4 text-sm text-muted">{ar.archive.detailPlaceholder}</p>
      </Card>
    </div>
  );
}
