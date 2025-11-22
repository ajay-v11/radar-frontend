'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {CompanyInput} from '@/components/dashboard/CompanyInput';
import {LoadingWizard} from '@/components/dashboard/LoadingWizard';
import {ApiModeToggle} from '@/components/dev/ApiModeToggle';
import {ErrorDisplay} from '@/components/dashboard/ErrorDisplay';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData, SSEEvent} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

type PageStep = 'input' | 'loading' | 'error';

export default function CompanyInputPage() {
  const router = useRouter();
  const [step, setStep] = useState<PageStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [sseEvents, setSseEvents] = useState<SSEEvent[]>([]);
  const [error, setError] = useState<FormattedError | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [analysisData, setAnalysisData] = useState<CompanyAnalysisData | null>(
    null
  );

  const handleCompanySubmit = (
    data: CompanyData,
    analysis: CompanyAnalysisData
  ) => {
    setCompanyData(data);
    setAnalysisData(analysis);
    setIsLoading(true);
    setSseEvents([]);
    setError(null);
    setStep('loading');
  };

  const handleProgress = (event: SSEEvent) => {
    setSseEvents((prev) => [...prev, event]);
  };

  const handleError = (formattedError: FormattedError) => {
    setError(formattedError);
    setIsLoading(false);
    setStep('error');
  };

  const handleLoadingComplete = () => {
    // Store data in sessionStorage for the dashboard
    if (companyData && analysisData) {
      sessionStorage.setItem('companyData', JSON.stringify(companyData));
      sessionStorage.setItem(
        'companyAnalysisData',
        JSON.stringify(analysisData)
      );
    }

    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleRetry = () => {
    setError(null);
    setStep('input');
  };

  const handleDismissError = () => {
    setError(null);
    setStep('input');
  };

  return (
    <div className='min-h-screen bg-background'>
      {step === 'input' && (
        <CompanyInput
          onSubmit={handleCompanySubmit}
          onProgress={handleProgress}
          onError={handleError}
          isLoading={isLoading}
        />
      )}

      {step === 'loading' && (
        <LoadingWizard
          onComplete={handleLoadingComplete}
          duration={8000}
          startStep={0}
          endStep={1}
          sseEvents={sseEvents}
          phase={1}
        />
      )}

      {step === 'error' && error && (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      <ApiModeToggle />
    </div>
  );
}
