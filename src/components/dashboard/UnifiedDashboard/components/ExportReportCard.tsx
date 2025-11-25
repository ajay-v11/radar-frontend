'use client';

import {Card, CardContent} from '@/components/ui/card';
import {ExportButton} from './ExportButton';
import {ReportSummaryStats} from './ReportSummaryStats';

interface ExportReportCardProps {
  visibilityData: any;
  selectedModels: string[];
  companyName: string;
}

export function ExportReportCard({
  visibilityData,
  selectedModels,
  companyName,
}: ExportReportCardProps) {
  const normalizeScore = (score: number) => (score < 1 ? score * 100 : score);

  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const handleExportJSON = () => {
    const normalizedScore = normalizeScore(visibilityData.visibility_score);
    const totalMentions =
      visibilityData.total_mentions ||
      visibilityData.analysis_report?.total_mentions ||
      0;
    const totalQueries = visibilityData.total_queries || 0;
    const mentionRate = totalQueries > 0 ? totalMentions / totalQueries : 0;

    const data = {
      company: companyName,
      models: selectedModels,
      visibility_score: normalizedScore,
      total_queries: totalQueries,
      total_mentions: totalMentions,
      mention_rate: mentionRate,
      model_scores: visibilityData.model_scores || {},
      category_breakdown: visibilityData.category_breakdown || [],
      model_category_matrix: visibilityData.model_category_matrix || {},
      analysis_report: visibilityData.analysis_report,
      batch_results: visibilityData.batch_results,
      sample_mentions: visibilityData.analysis_report?.sample_mentions || [],
      timestamp: new Date().toISOString(),
      generated_date: new Date().toLocaleDateString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '-')}-visibility-report-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const normalizedScore = normalizeScore(visibilityData.visibility_score);
    const totalMentions =
      visibilityData.total_mentions ||
      visibilityData.analysis_report?.total_mentions ||
      0;

    // Header rows
    const rows = [
      ['AI Visibility Report'],
      ['Company', escapeCSV(companyName)],
      ['Generated', new Date().toLocaleDateString()],
      ['Overall Visibility Score', `${normalizedScore.toFixed(1)}%`],
      ['Total Queries', visibilityData.total_queries?.toString() || '0'],
      ['Total Mentions', totalMentions.toString()],
      ['Models Tested', selectedModels.join('; ')],
      [], // Empty row
      ['Model Performance'],
      ['Model', 'Visibility Score'],
    ];

    // Model scores (new flat structure)
    if (visibilityData.model_scores) {
      Object.entries(visibilityData.model_scores).forEach(
        ([model, score]: [string, any]) => {
          const modelScore = normalizeScore(score || 0);
          rows.push([escapeCSV(model), `${modelScore.toFixed(2)}%`]);
        }
      );
    } else if (visibilityData.analysis_report?.by_model) {
      // Fallback to old structure if available
      Object.entries(visibilityData.analysis_report.by_model).forEach(
        ([model, data]: [string, any]) => {
          const mentionRate = normalizeScore(data.mention_rate || 0);
          rows.push([escapeCSV(model), `${mentionRate.toFixed(2)}%`]);
        }
      );
    }

    // Category breakdown (new structure)
    if (
      visibilityData.category_breakdown &&
      visibilityData.category_breakdown.length > 0
    ) {
      rows.push([]); // Empty row
      rows.push(['Category Breakdown']);
      rows.push(['Category', 'Score', 'Queries', 'Mentions']);

      visibilityData.category_breakdown.forEach((category: any) => {
        rows.push([
          escapeCSV(category.category || ''),
          `${category.score?.toFixed(1) || 0}%`,
          category.queries?.toString() || '0',
          category.mentions?.toString() || '0',
        ]);
      });
    }

    // Batch results
    if (
      visibilityData.batch_results &&
      visibilityData.batch_results.length > 0
    ) {
      rows.push([]); // Empty row
      rows.push(['Batch Results']);
      rows.push(['Batch #', 'Visibility Score', 'Total Mentions']);

      visibilityData.batch_results.forEach((batch: any) => {
        const batchScore = normalizeScore(batch.visibility_score || 0);
        rows.push([
          batch.batch_num?.toString() || '',
          `${batchScore.toFixed(1)}%`,
          batch.total_mentions?.toString() || '0',
        ]);
      });
    }

    // Sample mentions
    if (
      visibilityData.analysis_report?.sample_mentions &&
      visibilityData.analysis_report.sample_mentions.length > 0
    ) {
      rows.push([]); // Empty row
      rows.push(['Sample Query Results']);
      rows.push(['Query', 'Result']);

      visibilityData.analysis_report.sample_mentions.forEach(
        (mention: string) => {
          const parts = mention.split(' -> ');
          const query =
            parts[0]?.replace("Query: '", '').replace("'", '') || '';
          const result = parts[1] || '';
          rows.push([escapeCSV(query), escapeCSV(result)]);
        }
      );
    }

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '-')}-visibility-report-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const normalizedScore = normalizeScore(visibilityData.visibility_score);
    const totalMentions =
      visibilityData.total_mentions ||
      visibilityData.analysis_report?.total_mentions ||
      0;
    const totalQueries = visibilityData.total_queries || 0;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${companyName} - Visibility Report</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #0a0a0a;
              color: #e5e5e5;
              padding: 40px;
              line-height: 1.6;
            }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { 
              color: #f59e0b;
              font-size: 36px;
              margin-bottom: 10px;
              border-bottom: 3px solid #f59e0b;
              padding-bottom: 10px;
            }
            h2 { 
              color: #f59e0b;
              font-size: 24px;
              margin-top: 30px;
              margin-bottom: 15px;
              border-bottom: 2px solid #27272a;
              padding-bottom: 8px;
            }
            h3 {
              color: #a1a1aa;
              font-size: 18px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .meta { 
              color: #a1a1aa;
              font-size: 14px;
              margin-bottom: 30px;
            }
            .summary { 
              background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
              padding: 30px;
              border-radius: 12px;
              margin: 30px 0;
              border: 1px solid #3f3f46;
            }
            .score { 
              font-size: 72px;
              font-weight: bold;
              color: #f59e0b;
              text-align: center;
              margin: 20px 0;
              text-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-top: 20px;
            }
            .stat-card {
              background: #18181b;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #3f3f46;
              text-align: center;
            }
            .stat-label {
              color: #a1a1aa;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .stat-value {
              color: #e5e5e5;
              font-size: 24px;
              font-weight: bold;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              background: #18181b;
              border-radius: 8px;
              overflow: hidden;
            }
            th, td { 
              padding: 12px 16px;
              text-align: left;
              border-bottom: 1px solid #27272a;
            }
            th { 
              background: #f59e0b;
              color: #0a0a0a;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            td {
              color: #e5e5e5;
            }
            tr:last-child td {
              border-bottom: none;
            }
            tr:hover td {
              background: #27272a;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .badge-success {
              background: rgba(34, 197, 94, 0.2);
              color: #22c55e;
            }
            .badge-warning {
              background: rgba(234, 179, 8, 0.2);
              color: #eab308;
            }
            .query-list {
              background: #18181b;
              border: 1px solid #27272a;
              border-radius: 8px;
              padding: 20px;
              margin-top: 15px;
            }
            .query-item {
              padding: 12px;
              margin-bottom: 10px;
              background: #0a0a0a;
              border-left: 3px solid #f59e0b;
              border-radius: 4px;
            }
            .query-text {
              color: #e5e5e5;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .query-result {
              color: #a1a1aa;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${companyName} - AI Visibility Report</h1>
            <p class="meta"><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            
            <div class="summary">
              <h2 style="margin-top: 0; border: none;">Overall Visibility Score</h2>
              <div class="score">${Math.round(normalizedScore)}%</div>
              <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="stat-card">
                  <div class="stat-label">Total Queries</div>
                  <div class="stat-value">${
                    visibilityData.total_queries || 0
                  }</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Total Mentions</div>
                  <div class="stat-value">${totalMentions}</div>
                </div>
              </div>
              <p style="margin-top: 20px; color: #a1a1aa;"><strong>Models Tested:</strong> ${selectedModels
                .map((m) => `<span class="badge badge-warning">${m}</span>`)
                .join(' ')}</p>
            </div>

            <h2>Model Performance Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Visibility Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(
                  visibilityData.model_scores ||
                    visibilityData.analysis_report?.by_model ||
                    {}
                )
                  .map(([model, data]: [string, any]) => {
                    const score =
                      typeof data === 'number' ? data : data.mention_rate || 0;
                    const modelScore = normalizeScore(score);
                    const status =
                      modelScore >= 70
                        ? 'Excellent'
                        : modelScore >= 40
                        ? 'Good'
                        : 'Needs Improvement';
                    const badgeClass =
                      modelScore >= 70 ? 'badge-success' : 'badge-warning';
                    return `
                      <tr>
                        <td style="text-transform: capitalize; font-weight: 600;">${model}</td>
                        <td style="font-weight: 600; color: #f59e0b;">${modelScore.toFixed(
                          1
                        )}%</td>
                        <td><span class="badge ${badgeClass}">${status}</span></td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>

            ${
              visibilityData.category_breakdown &&
              visibilityData.category_breakdown.length > 0
                ? `
              <h2>Category Breakdown</h2>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Queries</th>
                    <th>Mentions</th>
                  </tr>
                </thead>
                <tbody>
                  ${visibilityData.category_breakdown
                    .map(
                      (category: unknown) => `
                    <tr>
                      <td style="text-transform: capitalize; font-weight: 600;">${
                        category.category?.replace(/_/g, ' ') || ''
                      }</td>
                      <td style="font-weight: 600; color: #f59e0b;">${
                        category.score?.toFixed(1) || 0
                      }%</td>
                      <td>${category.queries || 0}</td>
                      <td>${category.mentions || 0}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            `
                : ''
            }

            ${
              visibilityData.batch_results &&
              visibilityData.batch_results.length > 0
                ? `
              <h2>Batch Analysis Results</h2>
              <table>
                <thead>
                  <tr>
                    <th>Batch #</th>
                    <th>Visibility Score</th>
                    <th>Total Mentions</th>
                  </tr>
                </thead>
                <tbody>
                  ${visibilityData.batch_results
                    .map((batch: unknown) => {
                      const batchScore = normalizeScore(
                        batch.visibility_score || 0
                      );
                      return `
                      <tr>
                        <td><strong>#${batch.batch_num || 0}</strong></td>
                        <td style="font-weight: 600; color: #f59e0b;">${batchScore.toFixed(
                          1
                        )}%</td>
                        <td>${batch.total_mentions || 0}</td>
                      </tr>
                    `;
                    })
                    .join('')}
                </tbody>
              </table>
            `
                : ''
            }

            ${
              visibilityData.analysis_report?.sample_mentions &&
              visibilityData.analysis_report.sample_mentions.length > 0
                ? `
              <h2>Sample Query Results</h2>
              <div class="query-list">
                ${visibilityData.analysis_report.sample_mentions
                  .slice(0, 10)
                  .map((mention: string) => {
                    const parts = mention.split(' -> ');
                    const query =
                      parts[0]?.replace("Query: '", '').replace("'", '') || '';
                    const result = parts[1] || '';
                    const isMentioned = result
                      .toLowerCase()
                      .includes('mentioned');
                    return `
                    <div class="query-item">
                      <div class="query-text">${query}</div>
                      <div class="query-result">
                        ${
                          isMentioned
                            ? '<span class="badge badge-success">✓ Mentioned</span>'
                            : '<span class="badge badge-warning">Not Mentioned</span>'
                        }
                        ${result}
                      </div>
                    </div>
                  `;
                  })
                  .join('')}
                ${
                  visibilityData.analysis_report.sample_mentions.length > 10
                    ? `
                  <p style="text-align: center; color: #a1a1aa; margin-top: 15px;">
                    Showing 10 of ${visibilityData.analysis_report.sample_mentions.length} queries
                  </p>
                `
                    : ''
                }
              </div>
            `
                : ''
            }
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Card className='overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-primary/5'>
      <CardContent className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-bold text-foreground'>
              Export & Reports
            </h3>
            <p className='text-sm text-muted-foreground'>
              Download your visibility analysis in various formats
            </p>
          </div>
          <div className='flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5'>
            <div className='h-2 w-2 rounded-full bg-green-500' />
            <span className='text-xs font-semibold text-green-600'>
              Complete
            </span>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <ExportButton
            type='pdf'
            title='PDF Report'
            description='Complete analysis with charts and insights'
            color='red'
            onClick={handleExportPDF}
          />
          <ExportButton
            type='csv'
            title='CSV Data'
            description='Raw data for custom analysis'
            color='green'
            onClick={handleExportCSV}
          />
          <ExportButton
            type='json'
            title='JSON Export'
            description='API-ready structured data'
            color='blue'
            onClick={handleExportJSON}
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
