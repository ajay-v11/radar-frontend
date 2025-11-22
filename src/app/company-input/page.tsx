'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {CompanyInput} from '@/components/dashboard/CompanyInput';
import {ApiModeToggle} from '@/components/dev/ApiModeToggle';
import {ErrorDisplay} from '@/components/dashboard/ErrorDisplay';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData, SSEEvent} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

type PageStep = 'input' | 'error';

export default function CompanyInputPage() {
  const router = useRouter();
  const [step, setStep] = useState<PageStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FormattedError | null>(null);

  const handleCompanySubmit = (
    data: CompanyData,
    analysis: CompanyAnalysisData
  ) => {
    // Store data immediately and navigate to streaming dashboard
    sessionStorage.setItem('companyData', JSON.stringify(data));
    sessionStorage.setItem('companyAnalysisData', JSON.stringify(analysis));
    sessionStorage.setItem('skipModelSelection', 'true');

    // Navigate directly to dashboard (streaming)
    router.push('/dashboard');
  };

  const handleProgress = (_event: SSEEvent) => {
    // Progress events handled in streaming dashboard
  };

  const handleError = (formattedError: FormattedError) => {
    setError(formattedError);
    setIsLoading(false);
    setStep('error');
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
