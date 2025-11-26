"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Provider } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

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

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState<Partial<Provider>>({})

  useEffect(() => {
    if (user) {
      const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
      const currentProvider = providers.find((p) => p.id === user.id)
      if (currentProvider) {
        setProvider(currentProvider)
        setFormData(currentProvider)
      }
      setIsLoading(false)
    }
  }, [user])

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
        ? [...(prev.servicesOffered || []), service]
        : (prev.servicesOffered || []).filter((s) => s !== service),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
      const updatedProviders = providers.map((p) => (p.id === user?.id ? { ...p, ...formData } : p))
      localStorage.setItem("providers", JSON.stringify(updatedProviders))
      setProvider({ ...provider, ...formData } as Provider)
      setSuccess("Profile updated successfully!")
      setTimeout(() => {
        router.push("/provider/profile")
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground mt-1">Update your professional information</p>
          </div>
          <Link href="/provider/profile">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="fullName" value={formData.fullName || ""} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email (Read-only)</label>
                  <Input name="email" value={formData.email || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input name="phone" value={formData.phone || ""} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <select
                    name="country"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical Specialty</label>
                  <select
                    name="medicalSpecialty"
                    value={formData.medicalSpecialty || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  <label className="text-sm font-medium">Years of Experience</label>
                  <Input name="yoe" type="number" value={formData.yoe || ""} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical License ID</label>
                  <Input name="medicalLicenseID" value={formData.medicalLicenseID || ""} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">NPI Number</label>
                  <Input name="npiNumber" value={formData.npiNumber || ""} onChange={handleInputChange} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Credentials</label>
                  <Input
                    name="credentials"
                    value={formData.credentials || ""}
                    onChange={handleInputChange}
                    placeholder="MD, Board Certified"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Qualifications & Certifications</label>
                  <textarea
                    name="qualificationsCertifications"
                    value={formData.qualificationsCertifications || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Information */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Fee (USD)</label>
                  <Input
                    name="consultationFee"
                    type="number"
                    step="0.01"
                    value={formData.consultationFee || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Practice Address</label>
                  <textarea
                    name="practiceAddress"
                    value={formData.practiceAddress || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-20"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
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
                          id={`edit-${service}`}
                          value={service}
                          checked={(formData.servicesOffered || []).includes(service)}
                          onChange={handleServicesChange}
                          className="rounded border-input"
                        />
                        <label htmlFor={`edit-${service}`} className="ml-2 text-sm cursor-pointer">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link href="/provider/profile" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
