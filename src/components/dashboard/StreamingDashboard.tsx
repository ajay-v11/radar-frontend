'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {CompanySummaryCard} from './CompanySummaryCard';
import {InlineModelSelector} from './InlineModelSelector';
import {CategoryQueryLog} from './CategoryQueryLog';
import {DashboardStats} from './DashboardStats';
import {CompetitorList} from './CompetitorList';
import {InsightsPanel} from './InsightsPanel';
import {ExportPanel} from './ExportPanel';
import {ProgressWizard} from './ProgressWizard';
import type {CompanyData} from '@/lib/types';
import type {
  VisibilityAnalysisData,
  SSEEvent,
  CompanyAnalysisData,
} from '@/lib/api/types';

interface StreamingDashboardProps {
  companyData: CompanyData;
  selectedModels: string[];
  visibilityData: VisibilityAnalysisData | null;
  sseEvents: SSEEvent[];
  onBack: () => void;
  onProgress?: (event: SSEEvent) => void;
  autoStart?: boolean;
}

type StreamingPhase =
  | 'loading-summary'
  | 'show-summary'
  | 'model-selection'
  | 'streaming'
  | 'stats'
  | 'competitors'
  | 'insights'
  | 'complete';

interface QueryData {
  query: string;
  model: string;
  mentioned: boolean;
}

interface CategoryProgress {
  name: string;
  status: 'pending' | 'loading' | 'complete';
  queries: QueryData[];
  visibility: number;
}

export function StreamingDashboard({
  companyData,
  onBack,
}: StreamingDashboardProps) {
  const [phase, setPhase] = useState<StreamingPhase>('loading-summary');
  const [companyAnalysis, setCompanyAnalysis] =
    useState<CompanyAnalysisData | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [numQueries, setNumQueries] = useState<number>(20);
  const [categories, setCategories] = useState<CategoryProgress[]>([]);
  const [visibilityData, setVisibilityData] =
    useState<VisibilityAnalysisData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Load company analysis on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('companyAnalysisData');
      if (stored) {
        const analysis = JSON.parse(stored) as CompanyAnalysisData;
        setCompanyAnalysis(analysis);
        setPhase('show-summary');
      }
    }
  }, []);

  // Start visibility analysis
  const startVisibilityAnalysis = async (models: string[], queries: number) => {
    setSelectedModels(models);
    setNumQueries(queries);
    setIsLoadingData(true);
    setPhase('streaming');
    setCurrentStep(0);

    try {
      const {getAPIClient} = await import('@/lib/api/client');
      const apiClient = getAPIClient();

      let hasReceivedEvents = false;

      console.log(
        '[StreamingDashboard] Starting visibility analysis with URL:',
        companyData.website
      );

      const result = await apiClient.analyzeVisibility(
        {
          company_url: companyData.website,
          models: models,
          num_queries: queries,
        },
        (event) => {
          hasReceivedEvents = true;

          // Update progress based on events
          if (event.step === 'step1') {
            setCurrentStep(0);
          } else if (event.step === 'step2') {
            setCurrentStep(1);
            if (event.status === 'testing_started') {
              const categoryNames = [
                'Product Recommendations',
                'Comparisons',
                'Reviews',
                'Features',
                'Pricing',
              ];
              setCategories(
                categoryNames.map((name) => ({
                  name,
                  status: 'pending',
                  queries: [],
                  visibility: 0,
                }))
              );
            }
          } else if (event.step === 'batch') {
            setCurrentStep(2);
            if (event.data) {
              const batchNum = event.data.batch_num || 0;
              setCategories((prev) =>
                prev.map((cat, idx) =>
                  idx === batchNum
                    ? {
                        ...cat,
                        status:
                          event.status === 'completed' ? 'complete' : 'loading',
                        visibility: event.data?.visibility_score || 0,
                      }
                    : cat
                )
              );
            }
          } else if (event.step === 'step4') {
            setCurrentStep(2);
          } else if (event.step === 'complete') {
            if (event.status === 'success' && event.data) {
              setVisibilityData(event.data as VisibilityAnalysisData);
              setPhase('stats');
              setIsLoadingData(false);
            }
          }
        }
      );

      // Handle cached response
      if (!hasReceivedEvents && result) {
        setIsCached(true);
        setVisibilityData(result);

        const categoryNames = [
          'Product Recommendations',
          'Comparisons',
          'Reviews',
          'Features',
          'Pricing',
        ];

        setCategories(
          categoryNames.map((name, idx) => ({
            name,
            status: 'complete',
            queries: [],
            visibility: result.batch_results?.[idx]?.visibility_score || 0,
          }))
        );

        setPhase('stats');
        setIsLoadingData(false);
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      setIsLoadingData(false);
    }
  };

  // Phase progression
  useEffect(() => {
    if (phase === 'stats') {
      const timer = setTimeout(() => setPhase('competitors'), 800);
      return () => clearTimeout(timer);
    } else if (phase === 'competitors') {
      const timer = setTimeout(() => setPhase('insights'), 800);
      return () => clearTimeout(timer);
    } else if (phase === 'insights' && visibilityData) {
      const timer = setTimeout(() => setPhase('complete'), 800);
      return () => clearTimeout(timer);
    }
  }, [phase, visibilityData]);

  const showStats = ['stats', 'competitors', 'insights', 'complete'].includes(
    phase
  );
  const showCompetitors = ['competitors', 'insights', 'complete'].includes(
    phase
  );
  const showInsights = ['insights', 'complete'].includes(phase);
  const showExport = phase === 'complete';

  return (
    <div className='min-h-screen bg-background flex'>
      {/* Progress Sidebar */}
      {phase === 'streaming' && (
        <ProgressWizard
          currentStep={currentStep}
          phase={2}
          categories={categories}
        />
      )}

      {/* Main Content */}
      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground'>
                Visibility Dashboard
              </h1>
              <div className='flex items-center gap-2 mt-1'>
                <p className='text-muted-foreground'>{companyData.name}</p>
                {isCached && (
                  <span className='text-xs px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full'>
                    Cached Results
                  </span>
                )}
              </div>
            </div>
            <Button variant='outline' onClick={onBack}>
              Back
            </Button>
          </div>

          {/* Phase 1: Loading Summary */}
          {phase === 'loading-summary' && (
            <div className='flex items-center justify-center min-h-[400px]'>
              <div className='text-center'>
                <div className='animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4' />
                <p className='text-muted-foreground'>
                  Loading company analysis...
                </p>
              </div>
            </div>
          )}

          {/* Phase 2: Show Summary + Competitors */}
          {phase === 'show-summary' && companyAnalysis && (
            <CompanySummaryCard analysis={companyAnalysis} />
          )}

          {/* Phase 3: Model Selection */}
          {phase === 'model-selection' && (
            <InlineModelSelector onSubmit={startVisibilityAnalysis} />
          )}

          {/* Phase 4: Collapsed Model Selection + Streaming */}
          {phase === 'streaming' && selectedModels.length > 0 && (
            <>
              <InlineModelSelector
                isCollapsed
                selectedModels={selectedModels}
                selectedQueries={numQueries}
                onSubmit={() => {}}
              />
              <CategoryQueryLog categories={categories} />
            </>
          )}

          {/* Phase 5+: Results */}
          {(showStats || showCompetitors || showInsights || showExport) && (
            <>
              {selectedModels.length > 0 && (
                <InlineModelSelector
                  isCollapsed
                  selectedModels={selectedModels}
                  selectedQueries={numQueries}
                  onSubmit={() => {}}
                />
              )}

              {categories.length > 0 && (
                <CategoryQueryLog categories={categories} />
              )}

              {showStats && visibilityData && (
                <DashboardStats
                  data={visibilityData}
                  models={selectedModels}
                  isAnimating={phase === 'stats'}
                />
              )}

              {(showCompetitors || showInsights) && (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                  {showCompetitors && visibilityData && (
                    <CompetitorList
                      competitors={visibilityData.analysis_report.by_model}
                      companyName={companyData.name}
                      isAnimating={phase === 'competitors'}
                    />
                  )}

                  {showInsights && (
                    <InsightsPanel isAnimating={phase === 'insights'} />
                  )}
                </div>
              )}

              {showExport && visibilityData && (
                <ExportPanel
                  data={visibilityData}
                  companyName={companyData.name}
                />
              )}
            </>
          )}

          {/* Show Model Selection Button after summary */}
          {phase === 'show-summary' && (
            <div className='flex justify-center pt-4'>
              <Button
                size='lg'
                onClick={() => setPhase('model-selection')}
                className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'>
                Configure Visibility Test
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
