"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { Competitor } from "@/lib/types";

interface CompetitorRankingsProps {
  competitors: Competitor[];
}

export function CompetitorRankings({ competitors }: CompetitorRankingsProps) {
  // Sort competitors by mention count (descending)
  const sortedCompetitors = [...competitors].sort((a, b) => b.mentions - a.mentions);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200" role="region" aria-label="Competitor rankings">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Competitor Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sm:w-16 text-xs sm:text-sm">Rank</TableHead>
                <TableHead className="text-xs sm:text-sm min-w-[120px]">Competitor</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Mentions</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Visibility</TableHead>
                <TableHead className="w-32 sm:w-48 text-xs sm:text-sm">Visual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompetitors.map((competitor, index) => (
                <TableRow key={competitor.name}>
                  <TableCell className="font-medium text-xs sm:text-sm">#{index + 1}</TableCell>
                  <TableCell className="font-medium text-xs sm:text-sm">{competitor.name}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">{competitor.mentions}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">{competitor.visibility}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={competitor.visibility} className="h-2" aria-label={`${competitor.name} visibility: ${competitor.visibility} percent`} />
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline" aria-hidden="true">
                        {competitor.visibility}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
