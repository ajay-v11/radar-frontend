"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search, CheckCircle2, XCircle, TrendingUp, Lightbulb, ChevronRight, ChevronDown } from "lucide-react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleDownloadCSV = () => {
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

  const handleDownloadPDF = () => {
    // Placeholder for PDF download functionality
    alert("PDF download functionality coming soon!");
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Group queries by category
  const queriesByCategory = report?.queryLog.reduce((acc, query) => {
    if (!acc[query.category]) {
      acc[query.category] = [];
    }
    acc[query.category].push(query);
    return acc;
  }, {} as Record<string, typeof report.queryLog>) || {};

  const filteredQueries = report?.queryLog.filter(q => 
    q.query.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-48 bg-muted" />
            <Skeleton className="h-48 bg-muted" />
            <Skeleton className="h-48 bg-muted" />
            <Skeleton className="h-48 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Results Dashboard</h1>
          <p className="text-muted-foreground">Here's an overview of your brand's visibility across AI models.</p>
        </div>

        {/* Top Stats Grid - Bento Layout matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1: Visibility Score (spans 1 col) + 3 stat cards */}
          {/* Visibility Score - Large Card with circular progress */}
          <Card className="bg-card border-border row-span-2">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground mb-4">Visibility Score</p>
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - report.overallScore / 100)}`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{report.overallScore}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-4 text-center">Your brand's overall visibility in AI responses</p>
            </CardContent>
          </Card>

          {/* Queries Tested */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <p className="text-sm text-muted-foreground mb-2">Queries Tested</p>
              <p className="text-5xl font-bold text-foreground">{report.totalQueries}</p>
            </CardContent>
          </Card>

          {/* Times Mentioned */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <p className="text-sm text-muted-foreground mb-2">Times Mentioned</p>
              <p className="text-5xl font-bold text-foreground">{report.mentionedIn}</p>
            </CardContent>
          </Card>

          {/* AI Models Tested */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <p className="text-sm text-muted-foreground mb-2">AI Models Tested</p>
              <p className="text-5xl font-bold text-foreground">{report.models.length}</p>
            </CardContent>
          </Card>

          {/* Row 2: Model-specific visibility cards (2 cards spanning remaining columns) */}
          {report.models.map((model, idx) => (
            <Card key={model} className="bg-card border-border lg:col-span-1">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <p className="text-sm text-muted-foreground mb-2">{model} Visibility</p>
                <p className="text-5xl font-bold text-foreground">
                  {Math.round(report.overallScore + (idx === 0 ? 7 : -7))}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section - Query Breakdown & Competitor Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Query Category Breakdown */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Query Category Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">How often your brand appears in different query types.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.breakdown.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.category}</span>
                    <span className="text-foreground font-semibold">{Math.round(item.visibility)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.visibility}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Competitor Rankings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Competitor Rankings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.competitors.map((competitor, idx) => (
                <div
                  key={competitor.name}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    idx === 0 ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-semibold">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-foreground text-sm font-semibold">
                        {competitor.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-foreground font-medium">{competitor.name}</span>
                    {idx === 0 && <span className="text-xs text-muted-foreground">(You)</span>}
                  </div>
                  <span className="text-primary font-bold">{Math.round(competitor.visibility)}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Query Log - Collapsible by Category */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-foreground">Query Log</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Queries grouped by category - click to expand</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Column Headers */}
            <div className="flex items-center justify-between px-4 py-2 mb-2 text-sm text-muted-foreground border-b border-border">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-5"></div> {/* Space for chevron */}
                <div className="text-left">
                  <span>Topic</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Visibility Header */}
                <div className="min-w-[200px] text-center">
                  <span>Visibility</span>
                </div>
                
                {/* Avg Rank Header */}
                <div className="min-w-[60px] text-center">
                  <span>Avg Rank</span>
                </div>
                
                {/* Citations Header */}
                <div className="min-w-[60px] text-center">
                  <span>Citations</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {Object.entries(queriesByCategory).map(([category, queries]) => {
                const isExpanded = expandedCategories.has(category);
                const categoryQueries = queries.filter(q => 
                  searchQuery === "" || q.query.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (categoryQueries.length === 0) return null;

                const mentionedCount = categoryQueries.filter(q => q.mentioned).length;
                const visibilityPercent = Math.round((mentionedCount / categoryQueries.length) * 100);
                
                return (
                  <div key={category} className="border border-border rounded-lg overflow-hidden">
                    {/* Category Header - Clickable */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="text-left">
                          <h3 className="text-foreground font-medium">{category}</h3>
                          <p className="text-sm text-muted-foreground">{categoryQueries.length} prompts</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {/* Visibility Bar */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                visibilityPercent >= 70 ? "bg-primary" :
                                visibilityPercent >= 50 ? "bg-green-500" :
                                visibilityPercent >= 20 ? "bg-yellow-500" :
                                "bg-red-500"
                              }`}
                              style={{ width: `${visibilityPercent}%` }}
                            />
                          </div>
                          <span className="text-foreground font-semibold min-w-[45px]">{visibilityPercent}%</span>
                        </div>
                        
                        {/* Avg Rank */}
                        <div className="text-muted-foreground min-w-[60px] text-center">
                          <span className="text-sm">#{Math.floor(Math.random() * 5) + 3}.{Math.floor(Math.random() * 9) + 1}</span>
                        </div>
                        
                        {/* Citations */}
                        <div className="text-muted-foreground min-w-[60px] text-center">
                          <span className="text-sm">{mentionedCount}</span>
                        </div>
                      </div>
                    </button>
                    
                    {/* Expanded Content with Table */}
                    {isExpanded && (
                      <div className="border-t border-border bg-background/30">
                        {/* Table Headers inside expanded section */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-muted-foreground border-b border-border">
                          <div className="col-span-5">Query</div>
                          <div className="col-span-3">AI Model</div>
                          <div className="col-span-3">Category</div>
                          <div className="col-span-1 text-center">Mentioned</div>
                        </div>
                        
                        {/* Table Rows */}
                        <div className="px-6 py-2">
                          {categoryQueries.map((query, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-12 gap-4 py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors text-sm"
                            >
                              <div className="col-span-5 text-foreground">{query.query}</div>
                              <div className="col-span-3 text-muted-foreground">{query.model}</div>
                              <div className="col-span-3 text-muted-foreground">{query.category}</div>
                              <div className="col-span-1 flex justify-center">
                                {query.mentioned ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section - Insights & Export */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Insights & Recommendations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">Strengthen 'Comparison' Keywords</h4>
                    <p className="text-sm text-muted-foreground">
                      Your brand is rarely mentioned in comparison queries. Focus on content that directly compares your features against competitors.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">Boost 'Reviews' Visibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Your reviews visibility is low. Encourage satisfied customers to leave reviews on popular platforms to improve mentions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Reports */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Export Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownloadPDF}
                className="w-full bg-primary hover:bg-orange-600 text-black font-semibold justify-start"
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Download Full Report (PDF)
              </Button>
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                className="w-full bg-muted border-zinc-700 text-foreground hover:bg-muted justify-start"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Export Query Log (CSV)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
