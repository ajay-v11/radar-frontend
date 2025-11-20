"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface WizardStep {
  label: string
  status: "pending" | "active" | "completed"
}

interface ProgressWizardProps {
  steps: WizardStep[]
  message?: string
  className?: string
}

export function ProgressWizard({ steps, message, className }: ProgressWizardProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Steps */}
      <div className="relative space-y-6">
        {/* Connecting Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-zinc-800" />
        
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-center gap-4">
            {/* Step Indicator */}
            <div className="relative z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                  step.status === "completed" && "bg-orange-500",
                  step.status === "active" && "bg-orange-500 animate-pulse",
                  step.status === "pending" && "bg-zinc-700"
                )}
              >
                {step.status === "active" && (
                  <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
                )}
                <div className="w-3 h-3 rounded-full bg-black" />
              </div>
            </div>
            
            {/* Step Label */}
            <span
              className={cn(
                "text-lg transition-colors duration-300",
                step.status === "active" && "text-white font-semibold",
                step.status === "completed" && "text-gray-400",
                step.status === "pending" && "text-gray-600"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Message */}
      {message && (
        <p className="text-gray-400 text-sm animate-pulse">{message}</p>
      )}
    </div>
  )
}
