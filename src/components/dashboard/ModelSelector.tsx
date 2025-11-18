"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ModelSelectorProps {
  onSubmit: (models: string[]) => void
  onBack: () => void
  isLoading?: boolean
}

const AI_MODELS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI's conversational AI model"
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's AI assistant"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI-powered search engine"
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's multimodal AI model"
  }
]

export function ModelSelector({ onSubmit, onBack, isLoading = false }: ModelSelectorProps) {
  const [selected, setSelected] = React.useState<string[]>([])

  const handleToggle = (modelId: string) => {
    if (isLoading) return // Prevent changes during loading
    
    setSelected(prev => {
      if (prev.includes(modelId)) {
        // Remove if already selected
        return prev.filter(id => id !== modelId)
      } else if (prev.length < 2) {
        // Add if less than 2 selected
        return [...prev, modelId]
      }
      // Don't add if already 2 selected
      return prev
    })
  }

  const isValid = selected.length === 2

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isValid && !isLoading) {
      onSubmit(selected)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Select AI Models
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Choose exactly 2 AI models to compare your brand visibility
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {AI_MODELS.map((model) => {
              const isChecked = selected.includes(model.id)
              const isDisabled = (!isChecked && selected.length >= 2) || isLoading

              return (
                <div
                  key={model.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors min-h-[60px] ${
                    isChecked
                      ? "border-primary bg-primary/5"
                      : isDisabled
                      ? "border-muted bg-muted/20 opacity-60"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    id={model.id}
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(model.id)}
                    disabled={isDisabled}
                    className="mt-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={model.id}
                      className={`text-base font-medium cursor-pointer block ${
                        isDisabled ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {model.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {model.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {selected.length !== 2 && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {selected.length === 0
                ? "Please select 2 AI models to continue"
                : selected.length === 1
                ? "Please select 1 more AI model"
                : "Please select only 2 AI models"}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              disabled={isLoading}
              className="flex-1 w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={!isValid || isLoading}
              className="flex-1 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
