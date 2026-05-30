import { Skeleton, SkeletonSettlementCard } from "@/components/ui/Skeleton";

export default function SettlementLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-2">
          <SkeletonSettlementCard />
          <SkeletonSettlementCard />
          <SkeletonSettlementCard />
          <SkeletonSettlementCard />
        </div>
      </section>

      {/* Settle Button Skeleton */}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
