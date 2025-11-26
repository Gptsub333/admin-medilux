"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { Provider } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SPECIALTIES = [
  "General Practitioner",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedist",
  "Neurologist",
  "Psychiatrist",
  "Nurse Practitioner",
]

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "Other"]

export function ProviderRegistrationForm() {
  const router = useRouter()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState("basic")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    medicalSpecialty: "",
    medicalLicenseID: "",
    npiNumber: "",
    credentials: "",
    country: "",
    yoe: "",
    qualificationsCertifications: "",
    bio: "",
    servicesOffered: [] as string[],
    consultationFee: "",
    practiceAddress: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const service = e.target.value
    setFormData((prev) => ({
      ...prev,
      servicesOffered: e.target.checked
        ? [...prev.servicesOffered, service]
        : prev.servicesOffered.filter((s) => s !== service),
    }))
  }

  const validateBasicInfo = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill in all basic information")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const validateMedicalInfo = () => {
    if (!formData.medicalSpecialty || !formData.medicalLicenseID || !formData.npiNumber || !formData.yoe) {
      setError("Please fill in all medical information")
      return false
    }
    if (isNaN(Number.parseInt(formData.yoe)) || Number.parseInt(formData.yoe) < 0) {
      setError("Please enter a valid years of experience")
      return false
    }
    return true
  }

  const validatePracticeInfo = () => {
    if (!formData.consultationFee || !formData.practiceAddress || !formData.country) {
      setError("Please fill in all practice information")
      return false
    }
    if (isNaN(Number.parseFloat(formData.consultationFee)) || Number.parseFloat(formData.consultationFee) <= 0) {
      setError("Please enter a valid consultation fee")
      return false
    }
    return true
  }

  const handleStepChange = (step: string) => {
    if (step === "medical") {
      if (!validateBasicInfo()) return
    } else if (step === "practice") {
      if (!validateMedicalInfo()) return
    }
    setError("")
    setCurrentStep(step)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validatePracticeInfo()) return

    setIsLoading(true)
    try {
      const providerData: Provider = {
        id: "",
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      await signup(providerData)
      router.push("/provider")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Provider Registration</CardTitle>
        <CardDescription>Complete all sections to register as a healthcare provider</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={currentStep} onValueChange={handleStepChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Info</TabsTrigger>
              <TabsTrigger value="practice">Practice Info</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Professional Email *</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="john@hospital.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password *</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <Button type="button" onClick={() => handleStepChange("medical")} className="w-full mt-6">
                Next: Medical Information
              </Button>
            </TabsContent>

            {/* Medical Information */}
            <TabsContent value="medical" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical Specialty *</label>
                  <select
                    name="medicalSpecialty"
                    value={formData.medicalSpecialty}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select a specialty</option>
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical License ID *</label>
                  <Input
                    name="medicalLicenseID"
                    placeholder="LIC-123456"
                    value={formData.medicalLicenseID}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">NPI Number *</label>
                  <Input
                    name="npiNumber"
                    placeholder="1234567890"
                    value={formData.npiNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Years of Experience *</label>
                  <Input
                    name="yoe"
                    type="number"
                    placeholder="10"
                    value={formData.yoe}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Credentials</label>
                  <Input
                    name="credentials"
                    placeholder="MD, Board Certified"
                    value={formData.credentials}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Qualifications & Certifications</label>
                  <textarea
                    name="qualificationsCertifications"
                    placeholder="List your qualifications and certifications..."
                    value={formData.qualificationsCertifications}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-24"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("basic")} className="flex-1">
                  Back
                </Button>
                <Button type="button" onClick={() => handleStepChange("practice")} className="flex-1">
                  Next: Practice Information
                </Button>
              </div>
            </TabsContent>

            {/* Practice Information */}
            <TabsContent value="practice" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Fee (USD) *</label>
                  <Input
                    name="consultationFee"
                    type="number"
                    placeholder="100"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Practice Address *</label>
                  <textarea
                    name="practiceAddress"
                    placeholder="Street address, city, state, zip code"
                    value={formData.practiceAddress}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-20"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Professional Bio</label>
                  <textarea
                    name="bio"
                    placeholder="Tell patients about your experience and approach to care..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-24"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium">Services Offered</label>
                  <div className="space-y-2">
                    {[
                      "Consultation",
                      "Follow-up Visit",
                      "Home Checkup",
                      "Prescription Refill",
                      "Lab Orders",
                      "Mental Health Support",
                    ].map((service) => (
                      <div key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          id={service}
                          value={service}
                          checked={formData.servicesOffered.includes(service)}
                          onChange={handleServicesChange}
                          className="rounded border-input"
                        />
                        <label htmlFor={service} className="ml-2 text-sm cursor-pointer">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("medical")} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Registering..." : "Complete Registration"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  )
}
