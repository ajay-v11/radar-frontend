'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {formatErrorMessage, logError} from '@/lib/api/errors';
import type {FormattedError} from '@/lib/api/errors';

export default function FullReportPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FormattedError | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
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

      try {
        const {getAPIClient} = await import('@/lib/api/client');
        const apiClient = getAPIClient();
        const report = await apiClient.getFullReport(visibilitySlugId);
        setReportData(report as Record<string, unknown>);
      } catch (error) {
        console.error('[FullReport] Error fetching report:', error);
        const formattedError = formatErrorMessage(error);
        logError(formattedError, {context: 'Full report page'});
        setError(formattedError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Full Report</h1>
          <button
            onClick={() => router.back()}
            className='rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90'>
            Back
          </button>
        </div>

        {isLoading && (
          <div className='rounded-lg border bg-card p-8 text-center'>
            <p className='text-muted-foreground'>Loading report...</p>
          </div>
        )}

        {error && (
          <div className='rounded-lg border border-destructive bg-destructive/10 p-6'>
            <h3 className='mb-2 font-semibold text-destructive'>Error</h3>
            <p className='text-sm text-destructive'>{error.userMessage}</p>
          </div>
        )}

        {!isLoading && !error && reportData && (
          <div className='rounded-lg border bg-card p-6 shadow-sm'>
            <pre className='overflow-auto rounded bg-muted p-4 text-xs'>
              {JSON.stringify(reportData, null, 2) as string}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
