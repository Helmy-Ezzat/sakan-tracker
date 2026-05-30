import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonExpenseCard, SkeletonSettlementCard } from "@/components/ui/Skeleton";

export default function ArchiveDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back Link Skeleton */}
      <Skeleton className="h-4 w-32" />

      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Summary Card Skeleton */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
        </div>
      </Card>

      {/* Settlement Section Skeleton */}
      <section className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-2">
          <SkeletonSettlementCard />
          <SkeletonSettlementCard />
          <SkeletonSettlementCard />
        </div>
      </section>

      {/* Expenses Section Skeleton */}
      <section className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          <SkeletonExpenseCard />
          <SkeletonExpenseCard />
          <SkeletonExpenseCard />
        </div>
      </section>
    </div>
  );
}
