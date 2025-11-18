"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { OverviewCard } from "./OverviewCard";
import { QueryBreakdown } from "./QueryBreakdown";
import { CompetitorRankings } from "./CompetitorRankings";
import { QueryLog } from "./QueryLog";
import { OverviewCardSkeleton } from "./OverviewCardSkeleton";
import { QueryBreakdownSkeleton } from "./QueryBreakdownSkeleton";
import { CompetitorRankingsSkeleton } from "./CompetitorRankingsSkeleton";
import { QueryLogSkeleton } from "./QueryLogSkeleton";
import { generateMockReport, convertToCSV } from "@/lib/mockData";
import type { CompanyData } from "@/lib/types";

interface VisibilityReportProps {
  companyData: CompanyData;
  selectedModels: string[];
  onBack: () => void;
}

export function VisibilityReport({
  companyData,
  selectedModels,
  onBack,
}: VisibilityReportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<ReturnType<typeof generateMockReport> | null>(null);

  useEffect(() => {
    // Simulate loading with 1-2 second delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      const mockReport = generateMockReport(companyData.name, selectedModels);
      setReport(mockReport);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [companyData.name, selectedModels]);

  const handleDownload = () => {
    if (!report) return;

    const csv = convertToCSV(report.queryLog, report.companyName);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `visibility-report-${report.companyName.toLowerCase().replace(/\s+/g, "-")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Overview Card Skeleton */}
        <OverviewCardSkeleton />

        {/* Query Breakdown Skeleton */}
        <QueryBreakdownSkeleton />

        {/* Competitor Rankings Skeleton */}
        <CompetitorRankingsSkeleton />

        {/* Query Log Skeleton */}
        <QueryLogSkeleton />
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Visibility Report</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
            {report.companyName} • {report.models.join(" & ")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto" aria-label="Go back to model selection">
            Back
          </Button>
          <Button onClick={handleDownload} className="w-full sm:w-auto" aria-label="Download visibility report as CSV">
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <OverviewCard
        score={report.overallScore}
        totalQueries={report.totalQueries}
        mentions={report.mentionedIn}
        models={report.models}
      />

      {/* Query Breakdown */}
      <QueryBreakdown breakdown={report.breakdown} />

      {/* Competitor Rankings */}
      <CompetitorRankings competitors={report.competitors} />

      {/* Query Log */}
      <QueryLog queries={report.queryLog} />
    </div>
  );
}
