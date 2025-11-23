'use client';

export function QueryTableSkeleton() {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </th>
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </th>
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </th>
              <th className="pb-2 text-center text-xs font-medium text-muted-foreground">
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-muted" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((item) => (
              <tr key={item} className="border-b border-border/50">
                <td className="py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
                </td>
                <td className="py-3">
                  <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                </td>
                <td className="py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
                </td>
                <td className="py-3 text-center">
                  <div className="mx-auto h-4 w-12 animate-pulse rounded bg-muted/50" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
