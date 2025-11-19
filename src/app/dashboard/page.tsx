"use client";

import { useState } from "react";
import { CompanyInput } from "@/components/dashboard/CompanyInput";
import { ModelSelector } from "@/components/dashboard/ModelSelector";
import { VisibilityReport } from "@/components/dashboard/VisibilityReport";
import type { CompanyData } from "@/lib/types";

type DashboardStep = "input" | "model-selection" | "results";

export default function DashboardPage() {
  const [step, setStep] = useState<DashboardStep>("input");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanySubmit = (data: CompanyData) => {
    setCompanyData(data);
    setStep("model-selection");
  };

  const handleModelSubmit = (models: string[]) => {
    setIsLoading(true);
    setSelectedModels(models);
    // Small delay to show loading state before transitioning
    setTimeout(() => {
      setStep("results");
      setIsLoading(false);
    }, 100);
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
        <CompanyInput onSubmit={handleCompanySubmit} />
      )}

      {step === "model-selection" && (
        <ModelSelector
          onSubmit={handleModelSubmit}
          onBack={handleBackToInput}
          isLoading={isLoading}
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
