'use client';

import {Card, CardContent} from '@/components/ui/card';
import {ModelCategoryMatrix} from '@/lib/api/types';

interface ModelCategoryMatrixCardProps {
  modelCategoryMatrix: ModelCategoryMatrix;
}

export function ModelCategoryMatrixCard({
  modelCategoryMatrix,
}: ModelCategoryMatrixCardProps) {
  if (!modelCategoryMatrix || Object.keys(modelCategoryMatrix).length === 0) {
    return null;
  }

  const models = Object.keys(modelCategoryMatrix);
  const categories =
    models.length > 0 ? Object.keys(modelCategoryMatrix[models[0]] || {}) : [];

  if (categories.length === 0) {
    return null;
  }

  // Helper to get color based on score
  const getScoreColor = (score: number) => {
    const normalizedScore = score < 1 ? score * 100 : score;
    if (normalizedScore >= 70)
      return 'bg-green-500/20 text-green-500 border-green-500/30';
    if (normalizedScore >= 40)
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-red-500/20 text-red-500 border-red-500/30';
  };

  return (
    <Card className='overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardContent className='p-4'>
        {/* Header */}
        <div className='mb-4'>
          <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Model × Category Matrix
          </div>
        </div>

        {/* Matrix Table */}
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='border border-border/50 bg-background/60 p-2 text-left text-xs font-semibold text-muted-foreground'>
                  Model / Category
                </th>
                {categories.map((category) => (
                  <th
                    key={category}
                    className='border border-border/50 bg-background/60 p-2 text-center text-xs font-semibold capitalize text-muted-foreground'>
                    {category.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model}
                  className='transition-colors hover:bg-primary/5'>
                  <td className='border border-border/50 bg-background/40 p-2 text-sm font-semibold capitalize text-foreground'>
                    {model}
                  </td>
                  {categories.map((category) => {
                    const score = modelCategoryMatrix[model]?.[category] || 0;
                    const normalizedScore = score < 1 ? score * 100 : score;

                    return (
                      <td
                        key={`${model}-${category}`}
                        className='border border-border/50 p-2 text-center'>
                        <div
                          className={`inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-bold transition-all duration-300 hover:scale-110 ${getScoreColor(
                            score
                          )}`}>
                          {normalizedScore.toFixed(0)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
