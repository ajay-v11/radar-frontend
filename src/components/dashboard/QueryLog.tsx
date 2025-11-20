"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Check, X, ArrowUpDown } from "lucide-react";
import type { QueryResult } from "@/lib/types";

interface QueryLogProps {
  queries: QueryResult[];
}

type SortColumn = "query" | "mentioned" | "rank" | "model" | null;
type SortDirection = "asc" | "desc";

export function QueryLog({ queries }: QueryLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Handle column sorting
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort queries
  const filteredAndSortedQueries = useMemo(() => {
    let result = queries.filter((q) =>
      q.query.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let aValue: string | number | boolean;
        let bValue: string | number | boolean;

        switch (sortColumn) {
          case "query":
            aValue = a.query.toLowerCase();
            bValue = b.query.toLowerCase();
            break;
          case "mentioned":
            aValue = a.mentioned ? 1 : 0;
            bValue = b.mentioned ? 1 : 0;
            break;
          case "rank":
            aValue = a.rank ?? 999;
            bValue = b.rank ?? 999;
            break;
          case "model":
            aValue = a.model.toLowerCase();
            bValue = b.model.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [queries, searchTerm, sortColumn, sortDirection]);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300" role="region" aria-label="Query log">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Complete Query Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
              aria-label="Search queries"
            />
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap" aria-live="polite">
              {filteredAndSortedQueries.length} of {queries.length} queries
            </span>
          </div>

          {/* Data Table */}
          <div className="rounded-md border overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 min-w-[200px] text-xs sm:text-sm"
                    onClick={() => handleSort("query")}
                    role="button"
                    aria-label="Sort by query text"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSort("query")}
                  >
                    <div className="flex items-center gap-2">
                      Query Text
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-20 sm:w-24 cursor-pointer hover:bg-muted/50 text-xs sm:text-sm"
                    onClick={() => handleSort("mentioned")}
                    role="button"
                    aria-label="Sort by mentioned status"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSort("mentioned")}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="hidden sm:inline">Mentioned</span>
                      <span className="sm:hidden">✓</span>
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-20 sm:w-32 cursor-pointer hover:bg-muted/50 text-xs sm:text-sm"
                    onClick={() => handleSort("rank")}
                    role="button"
                    aria-label="Sort by rank"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSort("rank")}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="hidden sm:inline">Rank/Position</span>
                      <span className="sm:hidden">Rank</span>
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                  </TableHead>
                  <TableHead className="w-32 sm:w-48 text-xs sm:text-sm min-w-[120px]">
                    <span className="hidden sm:inline">Competitors Found</span>
                    <span className="sm:hidden">Competitors</span>
                  </TableHead>
                  <TableHead
                    className="w-24 sm:w-32 cursor-pointer hover:bg-muted/50 text-xs sm:text-sm"
                    onClick={() => handleSort("model")}
                    role="button"
                    aria-label="Sort by AI model"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSort("model")}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="hidden sm:inline">AI Model</span>
                      <span className="sm:hidden">Model</span>
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedQueries.length > 0 ? (
                  filteredAndSortedQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{query.query}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {query.mentioned ? (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" aria-label="Mentioned" />
                          ) : (
                            <X className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" aria-label="Not mentioned" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs sm:text-sm">
                        {query.rank !== null ? `#${query.rank}` : "-"}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">
                        {query.competitors.join(", ")}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{query.model}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
                      No queries found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
