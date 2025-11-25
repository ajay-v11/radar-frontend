'use client';

import {useEffect, useState, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {ChevronDown, ChevronRight, Search} from 'lucide-react';
import {formatErrorMessage, logError} from '@/lib/api/errors';
import type {FormattedError} from '@/lib/api/errors';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';

interface QueryResult {
  query: string;
  category: string;
  results: Record<
    string,
    {
      mentioned: boolean;
      rank: number | null;
      competitors_mentioned: string[];
      response_preview: string;
    }
  >;
}

interface QueryLogResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  queries: QueryResult[];
  filters: {
    category?: string;
    model?: string;
    mentioned?: boolean;
  };
}

interface ProcessedCategory {
  category_name: string;
  category_display_name: string;
  visibility_percentage: number;
  queries_mentioned: number;
  total_queries: number;
  queries: ProcessedQuery[];
}

interface ProcessedQuery {
  query_text: string;
  mentioned: boolean;
  rank: number | null;
  models_tested: string[];
  competitors: string[];
  model_details: Record<
    string,
    {
      mentioned: boolean;
      rank: number | null;
      competitors_mentioned: string[];
      response_preview: string;
    }
  >;
}

interface QueryLogData {
  brand: string;
  total_queries: number;
  overall_visibility: number;
  models: string[];
  categories: ProcessedCategory[];
}

export default function QueryLogPage() {
  const router = useRouter();
  const [queryLogData, setQueryLogData] = useState<QueryLogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FormattedError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedQueries, setExpandedQueries] = useState<Set<string>>(
    new Set()
  );
  const [allQueries, setAllQueries] = useState<QueryResult[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<string>('');

  const fetchQueryLog = useCallback(async () => {
    const visibilitySlugId = sessionStorage.getItem('visibilitySlugId');

    if (!visibilitySlugId) {
      const error = formatErrorMessage(
        new Error(
          'Visibility slug ID not found. Please complete the analysis first.'
        )
      );
      setError(error);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const {getAPIClient} = await import('@/lib/api/client');
      const apiClient = getAPIClient();

      // Fetch all pages of query log data
      let allQueriesData: QueryResult[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        setLoadingProgress(`Loading page ${currentPage}...`);
        const queryLog = (await apiClient.getQueryLog(visibilitySlugId, {
          page: currentPage,
          limit: 100, // Max allowed by backend
        })) as unknown as QueryLogResponse;

        allQueriesData = [...allQueriesData, ...queryLog.queries];
        totalPages = queryLog.total_pages;
        currentPage++;
      } while (currentPage <= totalPages);

      setLoadingProgress('');

      setAllQueries(allQueriesData);

      // Process the query log data into categories
      const processedData = processQueryLogData(allQueriesData);
      setQueryLogData(processedData);
    } catch (error) {
      console.error('[QueryLog] Error fetching query log:', error);
      const formattedError = formatErrorMessage(error);
      logError(formattedError, {context: 'Query log page'});
      setError(formattedError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueryLog();
  }, [fetchQueryLog]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const toggleQuery = (queryId: string) => {
    setExpandedQueries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(queryId)) {
        newSet.delete(queryId);
      } else {
        newSet.add(queryId);
      }
      return newSet;
    });
  };

  const filterQueries = (queries: ProcessedQuery[]) => {
    if (!searchQuery) return queries;
    return queries.filter((q) =>
      q.query_text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const processQueryLogData = (queries: QueryResult[]): QueryLogData | null => {
    if (!queries || queries.length === 0) return null;

    // Group queries by category
    const categoriesMap = new Map<string, QueryResult[]>();
    const allModels = new Set<string>();

    queries.forEach((query) => {
      if (!categoriesMap.has(query.category)) {
        categoriesMap.set(query.category, []);
      }
      categoriesMap.get(query.category)!.push(query);

      // Collect all models
      Object.keys(query.results).forEach((model) => allModels.add(model));
    });

    // Process each category
    const categories: ProcessedCategory[] = [];
    let totalQueries = 0;
    let totalMentioned = 0;

    categoriesMap.forEach((queries, categoryName) => {
      const processedQueries: ProcessedQuery[] = queries.map((q) => {
        const models = Object.keys(q.results);
        const mentioned = Object.values(q.results).some((r) => r.mentioned);

        // Get the best rank (lowest number) across all models
        const ranks = Object.values(q.results)
          .map((r) => r.rank)
          .filter((r): r is number => r !== null);
        const bestRank = ranks.length > 0 ? Math.min(...ranks) : null;

        // Collect all unique competitors mentioned
        const allCompetitors = new Set<string>();
        Object.values(q.results).forEach((r) => {
          r.competitors_mentioned.forEach((c) => allCompetitors.add(c));
        });

        return {
          query_text: q.query,
          mentioned,
          rank: bestRank,
          models_tested: models,
          competitors: Array.from(allCompetitors),
          model_details: q.results,
        };
      });

      const queriesMentioned = processedQueries.filter(
        (q) => q.mentioned
      ).length;
      const visibilityPercentage =
        queries.length > 0
          ? Math.round((queriesMentioned / queries.length) * 100)
          : 0;

      categories.push({
        category_name: categoryName,
        category_display_name: categoryName
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        visibility_percentage: visibilityPercentage,
        queries_mentioned: queriesMentioned,
        total_queries: queries.length,
        queries: processedQueries,
      });

      totalQueries += queries.length;
      totalMentioned += queriesMentioned;
    });

    const overallVisibility =
      totalQueries > 0 ? Math.round((totalMentioned / totalQueries) * 100) : 0;

    // Try to get company name from session storage
    const companyName = sessionStorage.getItem('companyName') || 'Your Company';

    return {
      brand: companyName,
      total_queries: totalQueries,
      overall_visibility: overallVisibility,
      models: Array.from(allModels),
      categories,
    };
  };

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Query Log</h1>
            {queryLogData && (
              <div className='mt-2 flex gap-6 text-sm text-muted-foreground'>
                <span>Brand: {queryLogData.brand}</span>
                <span>Total Queries: {queryLogData.total_queries}</span>
                <span>
                  Overall Visibility: {queryLogData.overall_visibility}%
                </span>
                <span>Models: {queryLogData.models.join(', ')}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => router.back()}
            className='rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90'>
            Back
          </button>
        </div>

        {/* Search */}
        {queryLogData && (
          <div className='mb-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search queries...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
        )}

        {isLoading && (
          <div className='rounded-lg border bg-card p-8 text-center'>
            <p className='text-muted-foreground'>
              {loadingProgress || 'Loading query log...'}
            </p>
          </div>
        )}

        {error && (
          <div className='rounded-lg border border-destructive bg-destructive/10 p-6'>
            <h3 className='mb-2 font-semibold text-destructive'>Error</h3>
            <p className='text-sm text-destructive'>{error.userMessage}</p>
          </div>
        )}

        {!isLoading && !error && queryLogData && (
          <div className='space-y-4'>
            {queryLogData.categories.map((category) => {
              const filteredQueries = filterQueries(category.queries);
              if (filteredQueries.length === 0 && searchQuery) return null;

              return (
                <Collapsible
                  key={category.category_name}
                  open={expandedCategories.has(category.category_name)}
                  onOpenChange={() => toggleCategory(category.category_name)}>
                  <div className='rounded-lg border bg-card'>
                    <CollapsibleTrigger className='flex w-full items-center justify-between p-4 text-left hover:bg-muted/50'>
                      <div className='flex items-center gap-3'>
                        {expandedCategories.has(category.category_name) ? (
                          <ChevronDown className='h-5 w-5' />
                        ) : (
                          <ChevronRight className='h-5 w-5' />
                        )}
                        <div>
                          <h3 className='font-semibold'>
                            {category.category_display_name} (
                            {category.total_queries} queries)
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            Visibility: {category.visibility_percentage}% (
                            {category.queries_mentioned}/
                            {category.total_queries})
                          </p>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className='border-t p-4'>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Query</TableHead>
                              <TableHead>Mentioned</TableHead>
                              <TableHead>Rank</TableHead>
                              <TableHead>Models</TableHead>
                              <TableHead>Competitors</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredQueries.map((query, idx) => {
                              const queryId = `${category.category_name}-${idx}`;
                              const isExpanded = expandedQueries.has(queryId);

                              return (
                                <>
                                  <TableRow
                                    key={idx}
                                    onClick={() => toggleQuery(queryId)}
                                    className={`cursor-pointer ${
                                      query.mentioned
                                        ? 'bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30'
                                        : 'bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30'
                                    }`}>
                                    <TableCell className='font-medium'>
                                      <div className='flex items-center gap-2'>
                                        {isExpanded ? (
                                          <ChevronDown className='h-4 w-4' />
                                        ) : (
                                          <ChevronRight className='h-4 w-4' />
                                        )}
                                        {query.query_text}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          query.mentioned
                                            ? 'default'
                                            : 'secondary'
                                        }>
                                        {query.mentioned ? '✓ Yes' : '✗ No'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {query.rank !== null ? query.rank : '—'}
                                    </TableCell>
                                    <TableCell>
                                      {query.models_tested.join(', ')}
                                    </TableCell>
                                    <TableCell>
                                      {query.competitors.length > 0
                                        ? query.competitors.join(', ')
                                        : '—'}
                                    </TableCell>
                                  </TableRow>
                                  {isExpanded && (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        className='bg-muted/50 p-6'>
                                        <div className='space-y-4'>
                                          <h4 className='font-semibold text-sm'>
                                            Model Responses:
                                          </h4>
                                          {Object.entries(
                                            query.model_details
                                          ).map(([model, details]) => (
                                            <div
                                              key={model}
                                              className='rounded-lg border bg-card p-4'>
                                              <div className='mb-2 flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                  <span className='font-semibold'>
                                                    {model}
                                                  </span>
                                                  <Badge
                                                    variant={
                                                      details.mentioned
                                                        ? 'default'
                                                        : 'secondary'
                                                    }
                                                    className='text-xs'>
                                                    {details.mentioned
                                                      ? 'Mentioned'
                                                      : 'Not Mentioned'}
                                                  </Badge>
                                                  {details.rank !== null && (
                                                    <Badge
                                                      variant='outline'
                                                      className='text-xs'>
                                                      Rank: {details.rank}
                                                    </Badge>
                                                  )}
                                                </div>
                                                {details.competitors_mentioned
                                                  .length > 0 && (
                                                  <span className='text-xs text-muted-foreground'>
                                                    Competitors:{' '}
                                                    {details.competitors_mentioned.join(
                                                      ', '
                                                    )}
                                                  </span>
                                                )}
                                              </div>
                                              <div className='mt-3 rounded bg-muted p-3 text-sm'>
                                                <p className='whitespace-pre-wrap'>
                                                  {details.response_preview}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
