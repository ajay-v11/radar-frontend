'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {InlineModelSelector} from './InlineModelSelector';
import {VisibilityScoreBento} from './VisibilityScoreBento';
import {ModelPerformanceBento} from './ModelPerformanceBento';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData} from '@/lib/api/types';

interface UnifiedDashboardProps {
  companyData: CompanyData;
  companyAnalysis: CompanyAnalysisData;
  onBack: () => void;
}

type DashboardStep = 'summary' | 'model-selection' | 'queries' | 'model-performance' | 'reports';

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
  const [visibilityData, setVisibilityData] = useState<any>(null);
  const [streamingQueries, setStreamingQueries] = useState<any[]>([]);
  const [batchResults, setBatchResults] = useState<any[]>([]);

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

  const handleModelSelection = async (models: string[], numQueries: number) => {
    setSelectedModels(models);
    setIsAnalyzing(true);
    setCurrentStep('queries');
    setWizardStep(2);
    setStreamingQueries([]);
    setBatchResults([]);

    // Simulate API call for visibility analysis
    try {
      const {getAPIClient} = await import('@/lib/api/client');
      const apiClient = getAPIClient();

      const result = await apiClient.analyzeVisibility({
        company_url: companyData.website,
        num_queries: numQueries,
        models: models,
      });
      
      if (result) {
        setVisibilityData(result);
        
        // Simulate streaming queries
        if (result.analysis_report?.sample_mentions) {
          result.analysis_report.sample_mentions.forEach((mention: string, index: number) => {
            setTimeout(() => {
              setStreamingQueries(prev => [...prev, mention]);
            }, index * 500);
          });
        }
        
        // Simulate streaming batch results
        if (result.batch_results) {
          result.batch_results.forEach((batch: any, index: number) => {
            setTimeout(() => {
              setBatchResults(prev => [...prev, batch]);
            }, index * 1000);
          });
        }
        
        // Move to model performance after queries
        setTimeout(() => {
          setCurrentStep('model-performance');
          setWizardStep(3);
        }, (result.analysis_report?.sample_mentions?.length || 0) * 500 + 1000);
        
        // Move to final reports
        setTimeout(() => {
          setCurrentStep('reports');
          setWizardStep(4);
          setIsAnalyzing(false);
        }, (result.analysis_report?.sample_mentions?.length || 0) * 500 + 3000);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-akira text-2xl font-bold text-[#f59e0b] md:text-3xl">
            Dashboard
          </h1>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>

        {/* Main Layout: Wizard Left, Content Right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Side: Step Wizard - Only show when not complete */}
          {wizardStep < 4 && (
            <div className="lg:col-span-3">
              <div className="sticky top-4 rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
                <h3 className="mb-6 text-sm font-semibold text-muted-foreground">
                  PROGRESS
                </h3>
                <div className="relative space-y-6">
                  {/* Connecting Line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-border" />

                  {WIZARD_STEPS.map((step, index) => {
                    const isCompleted = index < wizardStep;
                    const isActive = index === wizardStep;
                    const isPending = index > wizardStep;

                    return (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className="relative z-10">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              isCompleted
                                ? 'border-primary bg-primary'
                                : ''
                            } ${
                              isActive
                                ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                                : ''
                            } ${isPending ? 'border-border bg-background' : ''}`}>
                            {isActive && (
                              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                            )}
                            <div
                              className={`h-2 w-2 rounded-full ${
                                isCompleted || isActive
                                  ? 'bg-primary-foreground'
                                  : 'bg-muted-foreground'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex-1 pt-1">
                          <span
                            className={`text-sm transition-colors duration-300 ${
                              isActive ? 'font-semibold text-foreground' : ''
                            } ${isCompleted ? 'text-muted-foreground' : ''} ${
                              isPending ? 'text-muted-foreground/50' : ''
                            }`}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isAnalyzing && (
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    Processing...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side: Content */}
          <div
            className={`space-y-6 ${wizardStep < 4 ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            {/* Step 1 & 2: Company Summary + Model Selection - Combined Row */}
            <Card className="transition-all duration-500 opacity-100">
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-12">
                  {/* Left: Company Info */}
                  <div className="md:col-span-3 space-y-2">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">COMPANY</div>
                      <div className="text-lg font-bold">{companyAnalysis.company_name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Industry</div>
                      <div className="text-sm font-medium capitalize">{companyAnalysis.industry}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Website</div>
                      <div className="truncate text-xs text-primary">{companyData.website}</div>
                    </div>
                  </div>

                  {/* Middle: Description */}
                  <div className="md:col-span-4 flex flex-col justify-center border-l border-border pl-4">
                    <div className="text-xs font-medium text-muted-foreground mb-1">DESCRIPTION</div>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {companyAnalysis.company_description}
                    </p>
                  </div>

                  {/* Right: Competitors (Wrapped Tags) */}
                  {companyAnalysis.competitors && companyAnalysis.competitors.length > 0 && (
                    <div className="md:col-span-3 flex flex-col border-l border-border pl-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">COMPETITORS</div>
                      <div className="flex flex-wrap gap-1">
                        {companyAnalysis.competitors.map((competitor: string, index: number) => (
                          <div
                            key={index}
                            className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                            {competitor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Right: Selected Models (Compact Tags) */}
                  {wizardStep >= 1 && selectedModels.length > 0 && (
                    <div className="md:col-span-2 flex flex-col border-l border-border pl-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">MODELS</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedModels.map((model) => (
                          <div
                            key={model}
                            className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary whitespace-nowrap">
                            {model}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Model Selection Interface - Only show when selecting */}
            {wizardStep === 1 && (
              <div className="transition-all duration-500 opacity-100">
                <InlineModelSelector
                  onSubmit={handleModelSelection}
                  selectedModels={selectedModels}
                />
              </div>
            )}

            {/* Visibility Score + Model Performance - Bento Grid */}
            {wizardStep >= 2 && visibilityData && (
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Left: Visibility Score - Takes more height */}
                <div className="lg:col-span-2">
                  <VisibilityScoreBento
                    visibilityScore={visibilityData.visibility_score}
                    totalMentions={visibilityData.analysis_report?.total_mentions || 0}
                    totalQueries={visibilityData.total_queries || 0}
                    mentionRate={visibilityData.analysis_report?.mention_rate || 0}
                  />
                </div>

                {/* Right: Model Performance - Column layout */}
                {visibilityData.analysis_report?.by_model && (
                  <div className="lg:col-span-3">
                    <ModelPerformanceBento
                      modelData={visibilityData.analysis_report.by_model}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Query Testing - Optimized Table Layout */}
            {wizardStep >= 2 && (
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
                    /* Shimmer Loading */
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
                                <div className="h-4 w-16 animate-pulse rounded bg-muted mx-auto" />
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
                                  <div className="h-4 w-12 animate-pulse rounded bg-muted/50 mx-auto" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Optimized Table Layout */
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
                              const query = parts[0]
                                ?.replace("Query: '", '')
                                .replace("'", '');
                              const result = parts[1];
                              const isMentioned = result
                                ?.toLowerCase()
                                .includes('mentioned');

                              return (
                                <tr
                                  key={`${batchIndex}-${queryIndex}`}
                                  className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                  {queryIndex === 0 && (
                                    <td
                                      rowSpan={batchQueries.length}
                                      className="px-4 py-3 align-top border-r border-border/50">
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
                                    <p className="text-xs text-muted-foreground">
                                      {result}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div
                                      className={`mx-auto inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                        isMentioned
                                          ? 'bg-green-500/20'
                                          : 'bg-gray-400/20'
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
                  )}
                </CardContent>
              </Card>
            )}



            {/* Step 5: Reporting & Download Section */}
            {wizardStep >= 4 && visibilityData && (
              <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Export & Reports</h3>
                      <p className="text-sm text-muted-foreground">
                        Download your visibility analysis in various formats
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold text-green-600">Complete</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* PDF Report */}
                    <button className="group rounded-lg border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                          <svg
                            className="h-5 w-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <svg
                          className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <h4 className="mb-1 font-semibold text-foreground">PDF Report</h4>
                      <p className="text-xs text-muted-foreground">
                        Complete analysis with charts and insights
                      </p>
                    </button>

                    {/* CSV Export */}
                    <button className="group rounded-lg border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <svg
                          className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <h4 className="mb-1 font-semibold text-foreground">CSV Data</h4>
                      <p className="text-xs text-muted-foreground">
                        Raw data for custom analysis
                      </p>
                    </button>

                    {/* JSON Export */}
                    <button className="group rounded-lg border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                          <svg
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                        </div>
                        <svg
                          className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <h4 className="mb-1 font-semibold text-foreground">JSON Export</h4>
                      <p className="text-xs text-muted-foreground">
                        API-ready structured data
                      </p>
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-6 grid gap-4 rounded-lg border border-border/50 bg-background/30 p-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Analysis Date</div>
                      <div className="text-sm font-semibold text-foreground">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Total Queries</div>
                      <div className="text-sm font-semibold text-foreground">
                        {visibilityData.total_queries || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Models Tested</div>
                      <div className="text-sm font-semibold text-foreground">
                        {selectedModels.length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Visibility Score</div>
                      <div className="text-sm font-semibold text-primary">
                        {visibilityData.visibility_score}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
