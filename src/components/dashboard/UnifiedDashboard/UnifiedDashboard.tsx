'use client';

import {useState, useEffect} from 'react';
import {DashboardHeader} from './components/DashboardHeader';
import {ProgressWizard} from './components/ProgressWizard';
import {CompanySummaryCard} from './components/CompanySummaryCard';
import {ModelSelectionCard} from './components/ModelSelectionCard';
import {VisibilityMetricsGrid} from './components/VisibilityMetricsGrid';
import {QueryTestingTable} from './components/QueryTestingTable';
import {ExportReportCard} from './components/ExportReportCard';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData} from '@/lib/api/types';

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
          result.analysis_report.sample_mentions.forEach(
            (mention: string, index: number) => {
              setTimeout(() => {
                setStreamingQueries((prev) => [...prev, mention]);
              }, index * 500);
            }
          );
        }

        // Simulate streaming batch results
        if (result.batch_results) {
          result.batch_results.forEach((batch: any, index: number) => {
            setTimeout(() => {
              setBatchResults((prev) => [...prev, batch]);
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
        <DashboardHeader onBack={onBack} />

        <div className="mt-6 flex items-start gap-6">
          {/* Progress Wizard Sidebar - Slide from Left (Sticky) */}
          <div
            className={`flex-shrink-0 self-start overflow-hidden transition-all duration-500 ease-in-out ${
              wizardStep < 4 ? 'w-[260px] opacity-100' : 'w-0 opacity-0'
            }`}>
            <div
              className={`w-[260px] transform transition-transform duration-500 ease-in-out ${
                wizardStep < 4 ? 'translate-x-0' : '-translate-x-full'
              }`}>
              <div className="sticky top-6">
                <ProgressWizard
                  steps={WIZARD_STEPS}
                  currentStep={wizardStep}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </div>
          </div>

          {/* Main Content (Scrollable) */}
          <div className="flex-1 space-y-6 transition-all duration-500 ease-in-out">
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
              />
            )}

            {/* Query Testing Table */}
            {wizardStep >= 2 && (
              <QueryTestingTable
                batchResults={batchResults}
                streamingQueries={streamingQueries}
                isAnalyzing={isAnalyzing}
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
      </div>
    </div>
  );
}
