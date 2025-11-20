import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  score: number;
  totalQueries: number;
  mentions: number;
  models: string[];
}

export function OverviewCard({ score, totalQueries, mentions, models }: OverviewCardProps) {
  // Color coding for score ranges
  const getScoreColor = (score: number) => {
    if (score <= 33) return "text-destructive";
    if (score <= 66) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (score: number) => {
    if (score <= 33) return "text-destructive";
    if (score <= 66) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" role="region" aria-label="Visibility overview">
      <CardHeader>
        <CardTitle>Visibility Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Visibility Score with Progress Ring */}
          <div className="flex flex-col items-center justify-center space-y-2 col-span-2 md:col-span-1">
            <div className={cn("relative", getProgressColor(score))} role="img" aria-label={`Visibility score: ${score} percent`}>
              <Progress value={score} variant="circular" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Visibility Score</p>
              <p className={cn("text-base sm:text-lg font-semibold", getScoreColor(score))}>
                {score}%
              </p>
            </div>
          </div>

          {/* Total Queries */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-primary" aria-label={`${totalQueries} total queries`}>{totalQueries}</div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Total Queries</p>
          </div>

          {/* Mentions */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-primary" aria-label={`${mentions} mentions`}>{mentions}</div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Mentions</p>
          </div>

          {/* Selected Models */}
          <div className="flex flex-col items-center justify-center space-y-2 col-span-2 md:col-span-1">
            <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Selected AI models">
              {models.map((model) => (
                <Badge key={model} variant="secondary" className="text-xs" role="listitem">
                  {model}
                </Badge>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">AI Models</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
