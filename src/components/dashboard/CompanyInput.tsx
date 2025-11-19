"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-white">
            Analyze Your Brand's AI Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-sm text-gray-300">
                Brand Name
              </Label>
              <Input
                id="company-name"
                type="text"
                placeholder=""
                value={companyName}
                onChange={handleNameChange}
                disabled={isLoading}
                className={`bg-white text-black ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm text-gray-300">
                Website URL
              </Label>
              <Input
                id="website"
                type="text"
                placeholder=""
                value={website}
                onChange={handleWebsiteChange}
                disabled={isLoading}
                className={`bg-white text-black ${errors.website ? "border-destructive" : ""}`}
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!isValid || isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              Run Scan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
