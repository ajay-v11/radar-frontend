'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface InlineModelSelectorProps {
  onSubmit: (models: string[], numQueries: number) => void;
  isCollapsed?: boolean;
  selectedModels?: string[];
  selectedQueries?: number;
}

const AI_MODELS = [
  {id: 'chatgpt', name: 'ChatGPT'},
  {id: 'claude', name: 'Claude'},
  {id: 'perplexity', name: 'Perplexity'},
  {id: 'gemini', name: 'Gemini'},
];

export function InlineModelSelector({
  onSubmit,
  isCollapsed = false,
  selectedModels: initialModels = [],
  selectedQueries: initialQueries = 20,
}: InlineModelSelectorProps) {
  const [selected, setSelected] = useState<string[]>(initialModels);
  const [numQueries, setNumQueries] = useState<number>(initialQueries);

  const handleToggle = (modelId: string) => {
    setSelected((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else if (prev.length < 2) {
        return [...prev, modelId];
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 2) {
      onSubmit(selected, numQueries);
    }
  };

  if (isCollapsed) {
    return (
      <Card className='bg-muted/50 border-border'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Testing:</span>
            <span className='text-foreground font-medium'>
              {selected
                .map((id) => AI_MODELS.find((m) => m.id === id)?.name)
                .join(' & ')}{' '}
              • {numQueries} queries
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-card border-border'>
      <CardHeader>
        <CardTitle className='text-lg text-foreground'>
          Configure Visibility Test
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          Select 2 AI models and number of queries to test
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='num-queries' className='text-sm font-medium'>
              Number of Queries
            </Label>
            <input
              id='num-queries'
              type='number'
              min='5'
              max='50'
              value={numQueries}
              onChange={(e) => setNumQueries(parseInt(e.target.value) || 20)}
              className='w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium'>
              Select AI Models (Choose 2)
            </Label>
            <div className='grid grid-cols-2 gap-3'>
              {AI_MODELS.map((model) => {
                const isChecked = selected.includes(model.id);
                const isDisabled = !isChecked && selected.length >= 2;

                return (
                  <div
                    key={model.id}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      isChecked
                        ? 'border-primary bg-primary/10'
                        : isDisabled
                        ? 'border-border bg-muted/50 opacity-50'
                        : 'border-border bg-muted/50 hover:border-primary/50'
                    }`}>
                    <Checkbox
                      id={model.id}
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(model.id)}
                      disabled={isDisabled}
                    />
                    <Label
                      htmlFor={model.id}
                      className={`text-sm font-medium cursor-pointer text-foreground ${
                        isDisabled ? 'cursor-not-allowed' : ''
                      }`}>
                      {model.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {selected.length !== 2 && (
            <p className='text-sm text-muted-foreground'>
              {selected.length === 0
                ? 'Please select 2 AI models'
                : selected.length === 1
                ? 'Please select 1 more AI model'
                : 'Please select only 2 AI models'}
            </p>
          )}

          <Button
            type='submit'
            size='lg'
            disabled={selected.length !== 2}
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'>
            Start Visibility Test
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
