'use client';

interface ReportSummaryStatsProps {
  visibilityData: any;
  selectedModels: string[];
}

export function ReportSummaryStats({
  visibilityData,
  selectedModels,
}: ReportSummaryStatsProps) {
  return (
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
  );
}
