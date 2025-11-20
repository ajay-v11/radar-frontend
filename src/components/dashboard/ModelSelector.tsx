"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-white">
            Select AI Models
          </CardTitle>
          <p className="text-sm text-gray-400">
            Choose exactly 2 AI models to compare your brand visibility
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {AI_MODELS.map((model) => {
                const isChecked = selected.includes(model.id)
                const isDisabled = (!isChecked && selected.length >= 2) || isLoading

                return (
                  <div
                    key={model.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                      isChecked
                        ? "border-orange-500 bg-orange-500/10"
                        : isDisabled
                        ? "border-zinc-700 bg-zinc-800/50 opacity-50"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
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
                        className={`text-base font-medium cursor-pointer block text-white ${
                          isDisabled ? "cursor-not-allowed" : ""
                        }`}
                      >
                        {model.name}
                      </Label>
                      <p className="text-sm text-gray-400 mt-1">
                        {model.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {selected.length !== 2 && (
              <div className="text-sm text-gray-400 bg-zinc-800/50 p-3 rounded-md border border-zinc-700">
                {selected.length === 0
                  ? "Please select 2 AI models to continue"
                  : selected.length === 1
                  ? "Please select 1 more AI model"
                  : "Please select only 2 AI models"}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onBack}
                disabled={isLoading}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={!isValid || isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-semibold"
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
        </CardContent>
      </Card>
    </div>
  )
}
