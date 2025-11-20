import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Visibility Score Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-2 col-span-2 md:col-span-1">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>

          {/* Total Queries Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Mentions Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Selected Models Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-2 col-span-2 md:col-span-1">
            <div className="flex flex-wrap gap-2 justify-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
