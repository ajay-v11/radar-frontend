"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search, CheckCircle2, XCircle, TrendingUp, Lightbulb } from "lucide-react";
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

  const filteredQueries = report?.queryLog.filter(q => 
    q.query.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-48 bg-zinc-800" />
            <Skeleton className="h-48 bg-zinc-800" />
            <Skeleton className="h-48 bg-zinc-800" />
            <Skeleton className="h-48 bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Results Dashboard</h1>
          <p className="text-gray-400">Here's an overview of your brand's visibility across AI models.</p>
        </div>

        {/* Top Stats Grid - Bento Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Visibility Score - Large Card */}
          <Card className="bg-zinc-900 border-zinc-800 sm:col-span-1">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <p className="text-sm text-gray-400 mb-4">Visibility Score</p>
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-zinc-800"
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
                    className="text-orange-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{report.overallScore}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">Your brand's overall visibility in AI responses</p>
            </CardContent>
          </Card>

          {/* Queries Tested */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-2">Queries Tested</p>
              <p className="text-4xl font-bold text-white">{report.totalQueries}</p>
            </CardContent>
          </Card>

          {/* Times Mentioned */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-2">Times Mentioned</p>
              <p className="text-4xl font-bold text-white">{report.mentionedIn}</p>
            </CardContent>
          </Card>

          {/* AI Models Tested */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-2">AI Models Tested</p>
              <p className="text-4xl font-bold text-white">{report.models.length}</p>
            </CardContent>
          </Card>

          {/* Model-specific visibility */}
          {report.models.map((model, idx) => (
            <Card key={model} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-sm text-gray-400 mb-2">{model} Visibility</p>
                <p className="text-4xl font-bold text-white">
                  {Math.round(report.overallScore + (idx === 0 ? 7 : -7))}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section - Query Breakdown & Competitor Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Query Category Breakdown */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Query Category Breakdown</CardTitle>
              <p className="text-sm text-gray-400">How often your brand appears in different query types.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.breakdown.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="text-white font-semibold">{Math.round(item.visibility)}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${item.visibility}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Competitor Rankings */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Competitor Rankings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.competitors.map((competitor, idx) => (
                <div
                  key={competitor.name}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    idx === 0 ? "bg-orange-500/10 border border-orange-500/30" : "bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-semibold">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {competitor.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-white font-medium">{competitor.name}</span>
                    {idx === 0 && <span className="text-xs text-gray-400">(You)</span>}
                  </div>
                  <span className="text-orange-500 font-bold">{Math.round(competitor.visibility)}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Query Log */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-white">Query Log</CardTitle>
                <p className="text-sm text-gray-400 mt-1">A detailed log of all queries tested.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search queries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                  All Models
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 pb-2 border-b border-zinc-800">
                <div className="col-span-5">Query</div>
                <div className="col-span-3">AI Model</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-1 text-center">Mentioned</div>
              </div>
              
              {/* Table Rows */}
              <div className="space-y-1">
                {filteredQueries.map((query, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-4 text-sm py-3 hover:bg-zinc-800/50 rounded-lg px-2 transition-colors"
                  >
                    <div className="col-span-5 text-white">{query.query}</div>
                    <div className="col-span-3 text-gray-300">{query.model}</div>
                    <div className="col-span-3 text-gray-300">{query.category}</div>
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
          </CardContent>
        </Card>

        {/* Bottom Section - Insights & Export */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Insights & Recommendations */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange-500" />
                Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Strengthen 'Comparison' Keywords</h4>
                    <p className="text-sm text-gray-400">
                      Your brand is rarely mentioned in comparison queries. Focus on content that directly compares your features against competitors.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Boost 'Reviews' Visibility</h4>
                    <p className="text-sm text-gray-400">
                      Your reviews visibility is low. Encourage satisfied customers to leave reviews on popular platforms to improve mentions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Reports */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Export Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownloadPDF}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold justify-start"
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Download Full Report (PDF)
              </Button>
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 justify-start"
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
