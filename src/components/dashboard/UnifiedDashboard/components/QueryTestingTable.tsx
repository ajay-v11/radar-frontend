'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {QueryTableSkeleton} from './QueryTableSkeleton';
import {QueryTableContent} from './QueryTableContent';

interface QueryTestingTableProps {
  batchResults: any[];
  streamingQueries: any[];
  isAnalyzing: boolean;
}

export function QueryTestingTable({
  batchResults,
  streamingQueries,
  isAnalyzing,
}: QueryTestingTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          Query Testing Results
          {isAnalyzing && (
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {batchResults.length === 0 && isAnalyzing ? (
          <QueryTableSkeleton />
        ) : (
          <QueryTableContent
            batchResults={batchResults}
            streamingQueries={streamingQueries}
          />
        )}
      </CardContent>
    </Card>
  );
}
