"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Provider } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ProviderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const providerId = params.id as string
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
    const found = providers.find((p) => p.id === providerId)
    setProvider(found || null)
    setIsLoading(false)
  }, [providerId])

  const handleStatusUpdate = (newStatus: "approved" | "rejected" | "pending") => {
    if (!provider) return

    const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
    const updated = providers.map((p) => (p.id === provider.id ? { ...p, status: newStatus } : p))
    localStorage.setItem("providers", JSON.stringify(updated))
    setProvider({ ...provider, status: newStatus })
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

  if (!provider) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Provider not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600 hover:bg-green-700"
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "rejected":
        return "bg-red-600 hover:bg-red-700"
      default:
        return ""
    }
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{provider.fullName}</h1>
            <p className="text-muted-foreground mt-1">{provider.medicalSpecialty}</p>
          </div>
          <Link href="/admin/providers">
            <Button variant="outline">Back to Providers</Button>
          </Link>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Status</p>
              <Badge className={getStatusColor(provider.status)}>{provider.status.toUpperCase()}</Badge>
            </div>

            {provider.status === "pending" && (
              <div className="flex gap-3">
                <Button onClick={() => handleStatusUpdate("approved")} className="bg-green-600 hover:bg-green-700">
                  Approve Provider
                </Button>
                <Button onClick={() => handleStatusUpdate("rejected")} variant="destructive">
                  Reject Provider
                </Button>
              </div>
            )}

            {provider.status !== "pending" && (
              <Button onClick={() => handleStatusUpdate("pending")} variant="outline">
                Reset to Pending
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{provider.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{provider.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-semibold">{provider.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold">{new Date(provider.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Medical Specialty</p>
                <p className="font-semibold">{provider.medicalSpecialty}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Years of Experience</p>
                <p className="font-semibold">{provider.yoe} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medical License ID</p>
                <p className="font-semibold">{provider.medicalLicenseID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NPI Number</p>
                <p className="font-semibold">{provider.npiNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Credentials</p>
                <p className="font-semibold">{provider.credentials}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Qualifications & Certifications</p>
                <p className="whitespace-pre-wrap">{provider.qualificationsCertifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Information */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="font-semibold">${provider.consultationFee}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Services Offered</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {provider.servicesOffered.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Practice Address</p>
                <p className="whitespace-pre-wrap">{provider.practiceAddress}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Professional Bio</p>
                <p className="whitespace-pre-wrap">{provider.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
