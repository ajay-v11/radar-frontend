'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface InlineModelSelectorProps {
  onSubmit: (models: string[], numQueries: number, llmProvider: string) => void;
  isCollapsed?: boolean;
  selectedModels?: string[];
  selectedQueries?: number;
  selectedLlmProvider?: string;
}

const AI_MODELS = [
  {id: 'chatgpt', name: 'ChatGPT'},
  {id: 'claude', name: 'Claude'},
  {id: 'llama', name: 'LLama'},
  {id: 'gemini', name: 'Gemini'},
];

export function InlineModelSelector({
  onSubmit,
  isCollapsed = false,
  selectedModels: initialModels = [],
  selectedQueries: initialQueries = 20,
  selectedLlmProvider: initialLlmProvider = 'claude',
}: InlineModelSelectorProps) {
  const [selected, setSelected] = useState<string[]>(initialModels);
  const [numQueries, setNumQueries] = useState<number>(initialQueries);
  const [llmProvider, setLlmProvider] = useState<string>(initialLlmProvider);

  const handleToggle = (modelId: string) => {
    setSelected((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else if (prev.length < 4) {
        return [...prev, modelId];
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length >= 2 && selected.length <= 4) {
      onSubmit(selected, numQueries, llmProvider);
    }
  };

  if (isCollapsed) {
    const providerDisplayName =
      llmProvider.charAt(0).toUpperCase() + llmProvider.slice(1);

    return (
      <Card className='bg-muted/50 border-border'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Testing:</span>
            <span className='text-foreground font-medium'>
              {selected
                .map((id) => AI_MODELS.find((m) => m.id === id)?.name)
                .join(' & ')}{' '}
              • {numQueries} queries • {providerDisplayName}
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
          Select 2-4 AI models and number of queries to test
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='num-queries' className='text-sm font-medium'>
              Number of Queries
            </Label>
            <select
              id='num-queries'
              value={numQueries}
              onChange={(e) => setNumQueries(parseInt(e.target.value) || 20)}
              className='w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer'>
              {[20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                <option key={num} value={num}>
                  {num} queries
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='llm-provider' className='text-sm font-medium'>
              LLM Provider-For query generation
            </Label>
            <select
              id='llm-provider'
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value)}
              className='w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer'>
              <option value='claude'>Claude</option>
              <option value='gemini'>Gemini</option>
              <option value='llama'>Llama</option>
              <option value='openai'>OpenAI</option>
              <option value='grok'>Grok</option>
              <option value='deepseek'>DeepSeek</option>
            </select>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium'>
              Select AI Models (Choose 2-4) For testing
            </Label>
            <div className='grid grid-cols-2 gap-3'>
              {AI_MODELS.map((model) => {
                const isChecked = selected.includes(model.id);
                const isDisabled = !isChecked && selected.length >= 4;

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

          {(selected.length < 2 || selected.length > 4) && (
            <p className='text-sm text-muted-foreground'>
              {selected.length === 0
                ? 'Please select 2-4 AI models'
                : selected.length === 1
                ? 'Please select at least 1 more AI model'
                : 'Please select at most 4 AI models'}
            </p>
          )}

          <Button
            type='submit'
            size='lg'
            disabled={selected.length < 2 || selected.length > 4}
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'>
            Start Visibility Test
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
