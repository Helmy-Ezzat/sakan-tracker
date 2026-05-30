import { Skeleton, SkeletonExpenseCard } from "@/components/ui/Skeleton";

export default function ExpensesLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          <SkeletonExpenseCard />
          <SkeletonExpenseCard />
          <SkeletonExpenseCard />
          <SkeletonExpenseCard />
          <SkeletonExpenseCard />
        </div>
      </section>
    </div>
  );
}
