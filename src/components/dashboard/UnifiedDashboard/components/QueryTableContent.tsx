'use client';

interface QueryTableContentProps {
  batchResults: any[];
  streamingQueries: any[];
}

export function QueryTableContent({
  batchResults,
  streamingQueries,
}: QueryTableContentProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              BATCH
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              QUERY
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              RESULT
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
              STATUS
            </th>
          </tr>
        </thead>
        <tbody>
          {batchResults.map((batch: any, batchIndex: number) => {
            const queriesPerBatch = Math.ceil(
              streamingQueries.length / batchResults.length
            );
            const startIndex = batchIndex * queriesPerBatch;
            const endIndex = startIndex + queriesPerBatch;
            const batchQueries = streamingQueries.slice(startIndex, endIndex);

            return batchQueries.map((mention: string, queryIndex: number) => {
              const parts = mention.split(' -> ');
              const query = parts[0]?.replace("Query: '", '').replace("'", '');
              const result = parts[1];
              const isMentioned = result?.toLowerCase().includes('mentioned');

              return (
                <tr
                  key={`${batchIndex}-${queryIndex}`}
                  className="border-b border-border/50 transition-colors hover:bg-muted/20">
                  {queryIndex === 0 && (
                    <td
                      rowSpan={batchQueries.length}
                      className="border-r border-border/50 px-4 py-3 align-top">
                      <div className="sticky top-0">
                        <div className="mb-2 inline-block rounded-md bg-primary/10 px-2 py-1">
                          <span className="text-xs font-semibold text-primary">
                            #{batch.batch_num}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Visibility:
                            </span>
                            <span className="ml-1 font-bold text-primary">
                              {batch.visibility_score}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Mentions:
                            </span>
                            <span className="ml-1 font-semibold">
                              {batch.total_mentions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {query}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-muted-foreground">{result}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div
                      className={`mx-auto inline-flex h-6 w-6 items-center justify-center rounded-full ${
                        isMentioned ? 'bg-green-500/20' : 'bg-gray-400/20'
                      }`}>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isMentioned ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
