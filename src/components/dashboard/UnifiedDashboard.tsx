'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ProgressWizard} from './ProgressWizard';
import {InlineModelSelector} from './InlineModelSelector';
import {CategoryQueryLog} from './CategoryQueryLog';
import {DashboardStats} from './DashboardStats';
import {CompetitorList} from './CompetitorList';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData, SSEEvent} from '@/lib/api/types';

interface UnifiedDashboardProps {
  companyData: CompanyData;
  companyAnalysis: CompanyAnalysisData;
  onBack: () => void;
}

type DashboardStep = 'summary' | 'model-selection' | 'queries' | 'reports';

const WIZARD_STEPS = [
  'Company Summary',
  'Model Selection',
  'Query Testing',
  'Analysis Complete',
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
  const [categories, setCategories] = useState<any[]>([]);
  const [visibilityData, setVisibilityData] = useState<any>(null);

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
        setCurrentStep('reports');
        setWizardStep(3);
        setIsAnalyzing(false);
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
          {/* Left Side: Loading Wizard */}
          <div className="lg:col-span-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Analysis Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {WIZARD_STEPS.map((step, index) => {
                    const isCompleted = index < wizardStep;
                    const isActive = index === wizardStep;
                    const isPending = index > wizardStep;

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                            isCompleted ? 'bg-primary text-primary-foreground' : ''
                          } ${isActive ? 'animate-pulse bg-primary text-primary-foreground' : ''} ${
                            isPending ? 'bg-muted text-muted-foreground' : ''
                          }`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <span
                          className={`text-sm ${
                            isActive ? 'font-semibold text-foreground' : ''
                          } ${isCompleted ? 'text-muted-foreground' : ''} ${
                            isPending ? 'text-muted-foreground/50' : ''
                          }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                  {isAnalyzing && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Analyzing your visibility...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-6 lg:col-span-8">
            {/* Step 1: Company Summary */}
            <Card
              className={`transition-all duration-500 ${
                wizardStep >= 0 ? 'opacity-100' : 'opacity-50'
              }`}>
              <CardHeader>
                <CardTitle>Company Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Company:{' '}
                  </span>
                  <span className="font-medium">
                    {companyAnalysis.company_name}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Industry:{' '}
                  </span>
                  <span>{companyAnalysis.industry}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Description:{' '}
                  </span>
                  <p className="mt-1 text-sm">
                    {companyAnalysis.company_description}
                  </p>
                </div>
                {companyAnalysis.competitors &&
                  companyAnalysis.competitors.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Competitors:{' '}
                      </span>
                      <p className="mt-1 text-sm">
                        {companyAnalysis.competitors.join(', ')}
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Step 2: Model Selection */}
            {wizardStep >= 1 && (
              <Card
                className={`transition-all duration-500 ${
                  wizardStep >= 1 ? 'opacity-100' : 'opacity-50'
                }`}>
                <CardHeader>
                  <CardTitle>Select AI Models</CardTitle>
                </CardHeader>
                <CardContent>
                  {wizardStep === 1 ? (
                    <InlineModelSelector
                      onSubmit={handleModelSelection}
                      selectedModels={selectedModels}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Models selected: {selectedModels.join(', ')}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Query Testing */}
            {wizardStep >= 2 && (
              <Card
                className={`transition-all duration-500 ${
                  wizardStep >= 2 ? 'opacity-100' : 'opacity-50'
                }`}>
                <CardHeader>
                  <CardTitle>Query Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-muted-foreground">
                    {isAnalyzing
                      ? 'Testing queries across AI models...'
                      : categories.length > 0
                        ? `Testing ${categories.length} categories`
                        : 'Waiting to start query testing...'}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Reports */}
            {wizardStep >= 3 && visibilityData && (
              <>
                <Card className="transition-all duration-500 opacity-100">
                  <CardHeader>
                    <CardTitle>Visibility Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="text-2xl font-bold">
                          {visibilityData.visibility_score}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Visibility Score
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-2xl font-bold">
                          {visibilityData.total_mentions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Mentions
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-2xl font-bold">
                          {visibilityData.total_queries}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Queries
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-500 opacity-100">
                  <CardHeader>
                    <CardTitle>Top Competitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CompetitorList
                      companyName={companyData.name}
                      competitors={visibilityData.top_competitors || []}
                      isAnimating={false}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
