"use client"

import * as React from "react"
import { useEffect, useState } from "react"

interface LoadingWizardProps {
  onComplete?: () => void
  duration?: number
  startStep?: number
  endStep?: number
}

const STEPS = [
  "Detecting Industry",
  "Generating Buyer-Intent Queries",
  "Testing Across AI Models"
]

export function LoadingWizard({ 
  onComplete, 
  duration = 24000,
  startStep = 0,
  endStep = 2
}: LoadingWizardProps) {
  const [currentStep, setCurrentStep] = useState(startStep)
  const stepsToComplete = endStep - startStep + 1
  const stepDuration = duration / stepsToComplete

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Progress through steps from startStep to endStep
    let stepIndex = 0
    for (let i = startStep; i <= endStep; i++) {
      if (i > startStep) {
        stepIndex++
        const timer = setTimeout(() => {
          setCurrentStep(i)
        }, stepDuration * stepIndex)
        timers.push(timer)
      }
    }

    // Complete after all steps
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, duration)
    timers.push(completeTimer)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [duration, stepDuration, onComplete, startStep, endStep])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-2xl">
        <div className="space-y-8">
          <h2 className="text-gray-400 text-xl text-center">Analyzing your brand's visibility...</h2>
          
          <div className="relative space-y-6 max-w-md mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-zinc-800" />
            
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep
              const isActive = index === currentStep
              const isPending = index > currentStep
              
              return (
                <div key={index} className="relative flex items-center gap-4">
                  <div className="relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted ? "bg-orange-500" : ""
                      } ${
                        isActive ? "bg-orange-500 animate-pulse" : ""
                      } ${
                        isPending ? "bg-zinc-700" : ""
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
                      )}
                      <div className="w-3 h-3 rounded-full bg-black" />
                    </div>
                  </div>
                  
                  <span
                    className={`text-lg transition-colors duration-300 ${
                      isActive ? "text-white font-semibold" : ""
                    } ${
                      isCompleted ? "text-gray-400" : ""
                    } ${
                      isPending ? "text-gray-600" : ""
                    }`}
                  >
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
          
          <p className="text-gray-400 text-sm text-center animate-pulse">This will just take a moment.</p>
        </div>
      </div>
    </div>
  )
}
