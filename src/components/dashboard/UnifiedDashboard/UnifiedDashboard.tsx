'use client';

import {useState, useEffect} from 'react';
import {DashboardHeader} from './components/DashboardHeader';
import {ProgressWizard} from './components/ProgressWizard';
import {CompanySummaryCard} from './components/CompanySummaryCard';
import {ModelSelectionCard} from './components/ModelSelectionCard';
import {VisibilityMetricsGrid} from './components/VisibilityMetricsGrid';
import {QueryTestingTable} from './components/QueryTestingTable';
import {ExportReportCard} from './components/ExportReportCard';
import {ErrorDisplay} from '../ErrorDisplay';
import type {CompanyData} from '@/lib/types';
import type {
  CompanyAnalysisData,
  VisibilityAnalysisData,
  BatchResult,
  StreamingProgress,
  CategoryProgress,
  SSEEvent,
} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';
import {formatErrorMessage, logError} from '@/lib/api/errors';

interface UnifiedDashboardProps {
  companyData: CompanyData;
  companyAnalysis: CompanyAnalysisData;
  onBack: () => void;
}

type DashboardStep =
  | 'summary'
  | 'model-selection'
  | 'queries'
  | 'model-performance'
  | 'reports';

const WIZARD_STEPS = [
  'Company Summary',
  'Select AI Models',
  'Testing Queries',
  'Model Performance',
  'Complete Statistics',
];

export function UnifiedDashboard({
  companyData,
  companyAnalysis,
  onBack,
}: UnifiedDashboardProps) {
  const [currentStep, setCurrentStep] = useState<DashboardStep>('summary');
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visibilityData, setVisibilityData] =
    useState<VisibilityAnalysisData | null>(null);
  const [streamingQueries, setStreamingQueries] = useState<string[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);

  // Error state management
  const [error, setError] = useState<FormattedError | null>(null);

  // Streaming progress state management
  const [streamingProgress, setStreamingProgress] = useState<StreamingProgress>(
    {
      currentCategory: null,
      completedCategories: 0,
      totalCategories: 0,
      partialVisibilityScore: 0,
      partialModelScores: {},
      categoryBreakdown: [],
    }
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>(
    []
  );

  // Auto-progress from summary to model selection after 3 seconds
  useEffect(() => {
    if (currentStep === 'summary') {
      const timer = setTimeout(() => {
        setCurrentStep('model-selection');
        setWizardStep(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // SSE event handler for visibility analysis streaming
  const handleVisibilityProgress = (event: SSEEvent) => {
    console.log('[UnifiedDashboard] SSE Event:', event.step, event);

    switch (event.step) {
      case 'step1':
        // Display cached company data
        console.log('[UnifiedDashboard] Cached company data:', event.data);
        break;

      case 'initialization':
        // Set total categories and initialize category progress
        if (event.data) {
          const {total_categories, categories} = event.data;
          setStreamingProgress((prev) => ({
            ...prev,
            totalCategories: total_categories,
          }));

          // Initialize category progress for all categories
          const initialProgress: CategoryProgress[] = categories.map(
            (cat: string) => ({
              category: cat,
              status: 'pending' as const,
            })
          );
          setCategoryProgress(initialProgress);

          console.log(
            '[UnifiedDashboard] Initialized with',
            total_categories,
            'categories'
          );
        }
        break;

      case 'category_queries':
        // Update category progress for query generation
        if (event.data) {
          const {category, queries_generated, progress} = event.data;
          setStreamingProgress((prev) => ({
            ...prev,
            currentCategory: category,
          }));

          setCategoryProgress((prev) =>
            prev.map((cat) =>
              cat.category === category
                ? {
                    ...cat,
                    status: 'generating' as const,
                    queriesGenerated: queries_generated,
                  }
                : cat
            )
          );

          console.log(
            '[UnifiedDashboard] Category queries:',
            category,
            queries_generated,
            progress
          );
        }
        break;

      case 'category_testing':
        // Update category progress for testing
        if (event.data) {
          const {category, responses_tested, progress} = event.data;
          setCategoryProgress((prev) =>
            prev.map((cat) =>
              cat.category === category
                ? {
                    ...cat,
                    status: 'testing' as const,
                    responsesTested: responses_tested,
                  }
                : cat
            )
          );

          console.log(
            '[UnifiedDashboard] Category testing:',
            category,
            responses_tested,
            progress
          );
        }
        break;

      case 'category_analysis':
        // Update category progress for analysis
        if (event.data) {
          const {category, category_score, category_mentions, progress} =
            event.data;
          setCategoryProgress((prev) =>
            prev.map((cat) =>
              cat.category === category
                ? {
                    ...cat,
                    status: 'analyzing' as const,
                    score: category_score,
                    mentions: category_mentions,
                  }
                : cat
            )
          );

          console.log(
            '[UnifiedDashboard] Category analysis:',
            category,
            category_score,
            progress
          );
        }
        break;

      case 'category_complete':
        // Update partial scores and category breakdown
        if (event.data) {
          const {
            category,
            category_score,
            completed_categories,
            total_categories,
            partial_visibility_score,
            partial_model_scores,
            category_breakdown,
          } = event.data;

          setStreamingProgress({
            currentCategory: category,
            completedCategories: completed_categories,
            totalCategories: total_categories,
            partialVisibilityScore: partial_visibility_score,
            partialModelScores: partial_model_scores,
            categoryBreakdown: category_breakdown,
          });

          setCategoryProgress((prev) =>
            prev.map((cat) =>
              cat.category === category
                ? {
                    ...cat,
                    status: 'complete' as const,
                    score: category_score,
                  }
                : cat
            )
          );

          console.log(
            '[UnifiedDashboard] Category complete:',
            category,
            `${completed_categories}/${total_categories}`,
            'Partial score:',
            partial_visibility_score
          );
        }
        break;

      case 'complete':
        // Finalize data and stop streaming
        if (event.data && 'visibility_score' in event.data) {
          console.log('[UnifiedDashboard] Complete event data:', event.data);
          console.log(
            '[UnifiedDashboard] Category breakdown:',
            event.data.category_breakdown
          );
          console.log(
            '[UnifiedDashboard] Model category matrix:',
            event.data.model_category_matrix
          );

          setVisibilityData(event.data as VisibilityAnalysisData);
          setIsStreaming(false);
          setIsAnalyzing(false);

          // Clear category progress after completion
          setTimeout(() => {
            setCategoryProgress([]);
          }, 1000);

          // Store visibility slug_id if present
          if (event.data.slug_id) {
            sessionStorage.setItem('visibilitySlugId', event.data.slug_id);
            console.log(
              '[UnifiedDashboard] Stored visibility slug_id:',
              event.data.slug_id
            );
          }

          // Move to model performance step
          setCurrentStep('model-performance');
          setWizardStep(3);

          // Move to final reports after a delay
          setTimeout(() => {
            setCurrentStep('reports');
            setWizardStep(4);
          }, 2000);

          console.log('[UnifiedDashboard] Analysis complete:', event.data);
        }
        break;

      case 'error':
        // Handle error events
        const errorMessage =
          event.data?.error || event.message || 'Unknown error occurred';
        console.error('[UnifiedDashboard] SSE Error:', errorMessage);

        const formattedError = formatErrorMessage(new Error(errorMessage));
        logError(formattedError, {
          context: 'SSE streaming',
          event: event.step,
        });

        setError(formattedError);
        setIsStreaming(false);
        setIsAnalyzing(false);
        break;

      default:
        console.log('[UnifiedDashboard] Unhandled event:', event.step);
    }
  };

  const handleModelSelection = async (
    models: string[],
    numQueries: number,
    llmProvider: string
  ) => {
    // Clear any previous errors
    setError(null);

    // Retrieve company slug ID from session storage or from companyAnalysis
    let companySlugId = sessionStorage.getItem('companySlugId');

    // If not in session storage, try to get it from companyAnalysis
    if (!companySlugId && companyAnalysis.slug_id) {
      companySlugId = companyAnalysis.slug_id;
      sessionStorage.setItem('companySlugId', companySlugId);
      console.log(
        '[UnifiedDashboard] Retrieved slug_id from companyAnalysis:',
        companySlugId
      );
    }

    // Handle missing company slug ID error
    if (!companySlugId) {
      console.error('[UnifiedDashboard] Missing company slug_id');
      console.error(
        '[UnifiedDashboard] Session storage keys:',
        Object.keys(sessionStorage)
      );
      console.error('[UnifiedDashboard] companyAnalysis:', companyAnalysis);

      const missingSlugError = formatErrorMessage(
        new Error(
          'Company slug ID not found. Please restart the analysis from the beginning.'
        )
      );
      logError(missingSlugError, {
        context: 'Model selection',
        action: 'retrieve company slug ID',
      });

      setError(missingSlugError);
      return;
    }

    console.log('[UnifiedDashboard] Using company slug_id:', companySlugId);
    console.log('[UnifiedDashboard] LLM Provider:', llmProvider);

    setSelectedModels(models);
    setIsAnalyzing(true);
    setIsStreaming(true);
    setCurrentStep('queries');
    setWizardStep(2);
    setStreamingQueries([]);
    setBatchResults([]);

    // Reset streaming progress
    setStreamingProgress({
      currentCategory: null,
      completedCategories: 0,
      totalCategories: 0,
      partialVisibilityScore: 0,
      partialModelScores: {},
      categoryBreakdown: [],
    });
    setCategoryProgress([]);

    try {
      const {getAPIClient} = await import('@/lib/api/client');
      const apiClient = getAPIClient();

      // Pass llmProvider parameter to API call and handleVisibilityProgress as onProgress callback
      const result = await apiClient.analyzeVisibility(
        {
          company_url: companyData.website,
          company_slug_id: companySlugId,
          num_queries: numQueries,
          models: models,
          llm_provider: llmProvider as
            | 'claude'
            | 'gemini'
            | 'llama'
            | 'openai'
            | 'grok'
            | 'deepseek',
        },
        handleVisibilityProgress
      );

      // Handle cached responses (non-streaming)
      if (result) {
        console.log('[UnifiedDashboard] Cached result received:', result);

        // Only set if we don't already have better data from streaming
        // The streaming complete event has category_breakdown, cached result might not
        setVisibilityData((prevData) => {
          // If we already have data with category_breakdown, keep it
          if (
            prevData &&
            prevData.category_breakdown &&
            prevData.category_breakdown.length > 0
          ) {
            console.log(
              '[UnifiedDashboard] Keeping streaming data, ignoring cached result'
            );
            return prevData;
          }
          // Otherwise use the cached result
          return result;
        });

        setIsStreaming(false);
        setIsAnalyzing(false);

        // Clear category progress for cached responses (no streaming occurred)
        setCategoryProgress([]);

        // Store visibility slug ID on completion
        if (result.slug_id) {
          sessionStorage.setItem('visibilitySlugId', result.slug_id);
          console.log(
            '[UnifiedDashboard] Stored visibility slug_id:',
            result.slug_id
          );
        }

        // Move to model performance
        setCurrentStep('model-performance');
        setWizardStep(3);

        // Move to final reports after a delay
        setTimeout(() => {
          setCurrentStep('reports');
          setWizardStep(4);
        }, 2000);

        console.log('[UnifiedDashboard] Cached result received:', result);
      }
    } catch (error) {
      console.error('[UnifiedDashboard] Analysis error:', error);

      // Format and log the error
      const formattedError = formatErrorMessage(error);
      logError(formattedError, {
        context: 'Visibility analysis',
        models,
        numQueries,
        llmProvider,
      });

      // Reset analyzing state to allow retry
      setIsAnalyzing(false);
      setIsStreaming(false);

      // Display error to user
      setError(formattedError);
    }
  };

  // Retry handler for error recovery
  const handleRetry = () => {
    setError(null);
    // Reset to model selection step to allow user to retry
    setCurrentStep('model-selection');
    setWizardStep(1);
  };

  // Dismiss error handler
  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto p-4 lg:p-8'>
        <DashboardHeader onBack={onBack} />

        {/* Error Display */}
        {error && (
          <div className='mt-6'>
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          </div>
        )}

        {/* Main Dashboard Content - Hidden when error is displayed */}
        {!error && (
          <div className='mt-6 flex items-start gap-6'>
            {/* Progress Wizard Sidebar - Slide from Left (Sticky) */}
            <div
              className={`shrink-0 self-start overflow-hidden transition-all duration-500 ease-in-out ${
                wizardStep < 4 ? 'w-[260px] opacity-100' : 'w-0 opacity-0'
              }`}>
              <div
                className={`w-[260px] transform transition-transform duration-500 ease-in-out ${
                  wizardStep < 4 ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className='sticky top-6'>
                  <ProgressWizard
                    steps={WIZARD_STEPS}
                    currentStep={wizardStep}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              </div>
            </div>

            {/* Main Content (Scrollable) */}
            <div className='flex-1 space-y-6 transition-all duration-500 ease-in-out'>
              {/* Company Summary Card */}
              <CompanySummaryCard
                companyAnalysis={companyAnalysis}
                companyData={companyData}
                selectedModels={selectedModels}
                wizardStep={wizardStep}
              />

              {/* Model Selection */}
              {wizardStep === 1 && (
                <ModelSelectionCard
                  onSubmit={handleModelSelection}
                  selectedModels={selectedModels}
                />
              )}

              {/* Visibility Metrics Grid */}
              {wizardStep >= 2 && visibilityData && (
                <VisibilityMetricsGrid
                  visibilityData={visibilityData}
                  selectedModels={selectedModels}
                  streamingProgress={streamingProgress}
                  isStreaming={isStreaming}
                />
              )}

              {/* Query Testing Table - Category Progress */}
              {wizardStep >= 2 && (
                <QueryTestingTable
                  batchResults={batchResults}
                  streamingQueries={streamingQueries}
                  isAnalyzing={isAnalyzing}
                  categoryProgress={categoryProgress}
                />
              )}

              {/* Export Report Card */}
              {wizardStep >= 4 && visibilityData && (
                <ExportReportCard
                  visibilityData={visibilityData}
                  selectedModels={selectedModels}
                  companyName={companyData.name}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
