"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CategoryBreakdown } from "@/lib/types";

interface QueryBreakdownProps {
  breakdown: CategoryBreakdown[];
}

export function QueryBreakdown({ breakdown }: QueryBreakdownProps) {
  const [activeTab, setActiveTab] = useState(breakdown[0]?.category || "Product Selection");

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
  };

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100" role="region" aria-label="Query breakdown by category">
      <CardHeader>
        <CardTitle>Query Breakdown by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} aria-label="Query categories">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            {breakdown.map((category) => (
              <TabsTrigger 
                key={category.category} 
                value={category.category}
                className="text-xs sm:text-sm px-2 py-2 sm:px-3"
              >
                <span className="hidden sm:inline">{category.category}</span>
                <span className="sm:hidden">
                  {category.category === "Product Selection" ? "Product" :
                   category.category === "Comparison Queries" ? "Compare" :
                   category.category === "How-To Queries" ? "How-To" :
                   "Best-Of"}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {breakdown.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <div className="space-y-6 pt-4">
                {/* Visibility Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {category.visibility}%
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Visibility</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {category.mentioned}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Mentions</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {category.totalQueries}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Queries</p>
                  </div>
                </div>

                {/* Top Competitors */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Top 3 Competitors</h3>
                  <div className="space-y-2">
                    {category.topCompetitors.length > 0 ? (
                      category.topCompetitors.map((competitor, index) => (
                        <div
                          key={competitor.name}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="font-medium text-sm sm:text-base truncate">{competitor.name}</span>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-semibold text-sm sm:text-base">{competitor.mentions}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {competitor.percentage}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                        No competitor data available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
