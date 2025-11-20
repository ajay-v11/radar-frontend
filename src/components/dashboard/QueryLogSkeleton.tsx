import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QueryLogSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input Skeleton */}
          <Skeleton className="h-10 w-full sm:w-64" />

          {/* Table Skeleton */}
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 pb-2 border-b">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Table Rows */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
