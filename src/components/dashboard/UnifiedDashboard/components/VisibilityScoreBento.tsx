'use client';

import {Card, CardContent} from '@/components/ui/card';

interface VisibilityScoreBentoProps {
  visibilityScore: number;
  totalMentions: number;
  totalQueries: number;
  mentionRate: number;
}

export function VisibilityScoreBento({
  visibilityScore,
  totalMentions,
  totalQueries,
  mentionRate,
}: VisibilityScoreBentoProps) {
  // Normalize score to percentage (handle both 0.7 and 70 formats)
  const normalizedScore = visibilityScore < 1 ? visibilityScore * 100 : visibilityScore;
  const normalizedRate = mentionRate < 1 ? mentionRate * 100 : mentionRate;
  
  // Calculate circle properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedScore / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22c55e'; // green-500
    if (score >= 40) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  const scoreColor = getScoreColor(normalizedScore);

  return (
    <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 via-card to-card backdrop-blur-sm">
      <CardContent className="flex h-full flex-col justify-between p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overall Visibility
          </div>
        </div>

        {/* Circular Progress - Centered */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative">
            {/* SVG Circle Progress */}
            <svg className="h-48 w-48 -rotate-90 transform">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke={scoreColor}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${scoreColor}40)`,
                }}
              />
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold" style={{color: scoreColor}}>
                {Math.round(normalizedScore)}
                <span className="text-2xl">%</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Visibility Score
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/50 pt-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {totalMentions}
            </div>
            <div className="text-xs text-muted-foreground">Mentions</div>
          </div>
          <div className="border-l border-r border-border/50 text-center">
            <div className="text-lg font-bold text-foreground">
              {totalQueries}
            </div>
            <div className="text-xs text-muted-foreground">Queries</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {normalizedRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
