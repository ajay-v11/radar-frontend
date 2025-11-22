'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ModelSelector} from '@/components/dashboard/ModelSelector';
import {VisibilityReport} from '@/components/dashboard/VisibilityReport';
import {StreamingDashboard} from '@/components/dashboard/StreamingDashboard';
import {LoadingWizard} from '@/components/dashboard/LoadingWizard';
import {ApiModeToggle} from '@/components/dev/ApiModeToggle';
import {ErrorDisplay} from '@/components/dashboard/ErrorDisplay';
import type {CompanyData} from '@/lib/types';
import type {
  CompanyAnalysisData,
  VisibilityAnalysisData,
  SSEEvent,
} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

type DashboardStep =
  | 'model-selection'
  | 'loading-report'
  | 'streaming-results'
  | 'results'
  | 'error';

export default function DashboardPage() {
  const router = useRouter();

  // Check if we should skip model selection
  const shouldSkipModelSelection =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('skipModelSelection') === 'true'
      : false;

  const [step, setStep] = useState<DashboardStep>(
    shouldSkipModelSelection ? 'streaming-results' : 'model-selection'
  );

  // Initialize state from sessionStorage
  const [companyData] = useState<CompanyData | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('companyData');
    return stored ? JSON.parse(stored) : null;
  });

  const [companyAnalysisData] = useState<CompanyAnalysisData | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('companyAnalysisData');
    return stored ? JSON.parse(stored) : null;
  });

  const [selectedModels, setSelectedModels] = useState<string[]>(() => {
    // Default models for streaming dashboard
    return shouldSkipModelSelection ? ['chatgpt', 'gemini'] : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sseEvents, setSseEvents] = useState<SSEEvent[]>([]);
  const [error, setError] = useState<FormattedError | null>(null);
  const [lastFailedStep, setLastFailedStep] =
    useState<DashboardStep>('model-selection');

  // Redirect if no data
  useEffect(() => {
    if (!companyData || !companyAnalysisData) {
      router.push('/company-input');
    }
  }, [companyData, companyAnalysisData, router]);

  // Clear the skip flag after initial load
  useEffect(() => {
    if (shouldSkipModelSelection && typeof window !== 'undefined') {
      sessionStorage.removeItem('skipModelSelection');
    }
  }, [shouldSkipModelSelection]);

  const [visibilityData, setVisibilityData] =
    useState<VisibilityAnalysisData | null>(null);

  const handleModelSubmit = (
    models: string[],
    visibilityAnalysisData: VisibilityAnalysisData
  ) => {
    setIsLoading(true);
    setSelectedModels(models);
    setVisibilityData(visibilityAnalysisData);
    setSseEvents([]); // Reset SSE events
    setError(null); // Clear any previous errors
    // Go directly to streaming results with the data
    setStep('streaming-results');
  };

  const handlePhase2Progress = (event: SSEEvent) => {
    setSseEvents((prev) => [...prev, event]);
  };

  const handlePhase2Error = (formattedError: FormattedError) => {
    setError(formattedError);
    setIsLoading(false);
    setLastFailedStep('model-selection');
    setStep('error');
  };

  const handleReportLoadingComplete = () => {
    setStep('results');
    setIsLoading(false);
  };

  const handleBackToInput = () => {
    // Clear session storage and redirect to company input
    sessionStorage.removeItem('companyData');
    sessionStorage.removeItem('companyAnalysisData');
    router.push('/company-input');
  };

  const handleBackToModelSelection = () => {
    setStep('model-selection');
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setStep(lastFailedStep);
  };

  const handleDismissError = () => {
    setError(null);
    setStep(lastFailedStep);
  };

  return (
    <div className='min-h-screen bg-background'>
      {step === 'model-selection' && (
        <ModelSelector
          companyData={companyData || undefined}
          analysisData={companyAnalysisData || undefined}
          onSubmit={handleModelSubmit}
          onProgress={handlePhase2Progress}
          onError={handlePhase2Error}
          onBack={handleBackToInput}
          isLoading={isLoading}
        />
      )}

      {step === 'loading-report' && (
        <LoadingWizard
          onComplete={handleReportLoadingComplete}
          duration={16000}
          startStep={0}
          endStep={2}
          sseEvents={sseEvents}
          phase={2}
        />
      )}

      {step === 'streaming-results' && companyData && (
        <StreamingDashboard
          companyData={companyData}
          selectedModels={selectedModels}
          visibilityData={visibilityData}
          sseEvents={sseEvents}
          onBack={handleBackToModelSelection}
          onProgress={handlePhase2Progress}
          autoStart={shouldSkipModelSelection}
        />
      )}

      {step === 'results' && companyData && (
        <VisibilityReport
          companyData={companyData}
          selectedModels={selectedModels}
          visibilityData={visibilityData || undefined}
          onBack={handleBackToModelSelection}
        />
      )}

      {step === 'error' && error && (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      {/* API mode toggle - only visible in development */}
      <ApiModeToggle />
    </div>
  );
}
