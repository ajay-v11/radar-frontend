"use client";

import { useState } from "react";
import { CompanyInput } from "@/components/dashboard/CompanyInput";
import { ModelSelector } from "@/components/dashboard/ModelSelector";
import { VisibilityReport } from "@/components/dashboard/VisibilityReport";
import { LoadingWizard } from "@/components/dashboard/LoadingWizard";
import type { CompanyData } from "@/lib/types";

type DashboardStep = "input" | "loading-models" | "model-selection" | "loading-report" | "results";

export default function DashboardPage() {
  const [step, setStep] = useState<DashboardStep>("input");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanySubmit = (data: CompanyData) => {
    setCompanyData(data);
    setIsLoading(true);
    setStep("loading-models");
  };

  const handleLoadingComplete = () => {
    setStep("model-selection");
    setIsLoading(false);
  };

  const handleModelSubmit = (models: string[]) => {
    setIsLoading(true);
    setSelectedModels(models);
    setStep("loading-report");
  };

  const handleReportLoadingComplete = () => {
    setStep("results");
    setIsLoading(false);
  };

  const handleBackToInput = () => {
    setStep("input");
  };

  const handleBackToModelSelection = () => {
    setStep("model-selection");
  };

  return (
    <div className="min-h-screen bg-black">
      {step === "input" && (
        <CompanyInput onSubmit={handleCompanySubmit} isLoading={isLoading} />
      )}

      {step === "loading-models" && (
        <LoadingWizard 
          onComplete={handleLoadingComplete} 
          duration={8000}
          startStep={0}
          endStep={0}
        />
      )}

      {step === "model-selection" && (
        <ModelSelector
          onSubmit={handleModelSubmit}
          onBack={handleBackToInput}
          isLoading={isLoading}
        />
      )}

      {step === "loading-report" && (
        <LoadingWizard 
          onComplete={handleReportLoadingComplete} 
          duration={16000}
          startStep={1}
          endStep={2}
        />
      )}

      {step === "results" && companyData && (
        <VisibilityReport
          companyData={companyData}
          selectedModels={selectedModels}
          onBack={handleBackToModelSelection}
        />
      )}
    </div>
  );
}