"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompanyData {
  name: string
  website: string
}

interface CompanyInputProps {
  onSubmit: (data: CompanyData) => void
  isLoading?: boolean
}

export function CompanyInput({ onSubmit, isLoading = false }: CompanyInputProps) {
  const [companyName, setCompanyName] = React.useState("")
  const [website, setWebsite] = React.useState("")
  const [errors, setErrors] = React.useState<{
    name?: string
    website?: string
  }>({})

  const isValid = companyName.trim() !== "" && website.trim() !== ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return // Prevent submission during loading
    
    // Validate fields
    const newErrors: { name?: string; website?: string } = {}
    
    if (companyName.trim() === "") {
      newErrors.name = "Company name is required"
    }
    
    if (website.trim() === "") {
      newErrors.website = "Website URL is required"
    }
    
    setErrors(newErrors)
    
    // Only submit if valid
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name: companyName.trim(),
        website: website.trim()
      })
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
    // Clear error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }))
    }
  }

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value)
    // Clear error when user starts typing
    if (errors.website) {
      setErrors(prev => ({ ...prev, website: undefined }))
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Enter Your Company Information
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Provide your company details to analyze your AI visibility
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={handleNameChange}
              disabled={isLoading}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="text"
              placeholder="https://example.com"
              value={website}
              onChange={handleWebsiteChange}
              disabled={isLoading}
              className={errors.website ? "border-destructive" : ""}
            />
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isLoading}
            className="w-full"
          >
            Analyze
          </Button>
        </form>
      </div>
    </div>
  )
}
