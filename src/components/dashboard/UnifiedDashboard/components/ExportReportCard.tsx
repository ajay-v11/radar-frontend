'use client';

import {Card, CardContent} from '@/components/ui/card';
import {ExportButton} from './ExportButton';
import ReportSummaryStats from './ReportSummaryStats';

interface ExportReportCardProps {
  visibilityData: any;
  selectedModels: string[];
}

export function ExportReportCard({
  visibilityData,
  selectedModels,
}: ExportReportCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-primary/5">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Export & Reports
            </h3>
            <p className="text-sm text-muted-foreground">
              Download your visibility analysis in various formats
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-600">
              Complete
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ExportButton
            type="pdf"
            title="PDF Report"
            description="Complete analysis with charts and insights"
            color="red"
          />
          <ExportButton
            type="csv"
            title="CSV Data"
            description="Raw data for custom analysis"
            color="green"
          />
          <ExportButton
            type="json"
            title="JSON Export"
            description="API-ready structured data"
            color="blue"
          />
        </div>

        <ReportSummaryStats
          visibilityData={visibilityData}
          selectedModels={selectedModels}
        />
      </CardContent>
    </Card>
  );
}
