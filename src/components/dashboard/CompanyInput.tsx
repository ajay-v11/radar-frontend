"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowingStarsBackground } from "@/components/ui/glowing-stars"
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
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      <GlowingStarsBackground />
      
      <div className="relative z-10">
        {/* <BackgroundGradient className="rounded-[22px] p-1 bg-card"> */}
          <Card className="w-full max-w-md bg-card border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Analyze Your Brand's AI Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm text-muted-foreground">
                    Brand Name
                  </Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder=""
                    value={companyName}
                    onChange={handleNameChange}
                    disabled={isLoading}
                    className={`bg-background text-foreground ${errors.name ? "border-destructive" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm text-muted-foreground">
                    Website URL
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    placeholder=""
                    value={website}
                    onChange={handleWebsiteChange}
                    disabled={isLoading}
                    className={`bg-background text-foreground ${errors.website ? "border-destructive" : ""}`}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!isValid || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Run Scan
                </Button>
              </form>
            </CardContent>
          </Card>
        {/* </BackgroundGradient> */}
      </div>
    </div>
  )
}