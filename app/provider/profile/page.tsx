"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import type { Provider } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ProviderProfilePage() {
  const { user } = useAuth()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
      const currentProvider = providers.find((p) => p.id === user.id)
      setProvider(currentProvider || null)
      setIsLoading(false)
    }
  }, [user])

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
          <AlertDescription>Provider profile not found</AlertDescription>
        </Alert>
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
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your professional information</p>
          </div>
          <Link href="/provider/profile/edit">
            <Button>Edit Profile</Button>
          </Link>
        </div>

        {/* Status Alert */}
        {provider.status === "pending" && (
          <Alert>
            <AlertDescription>
              Your profile is pending admin approval. Your services won't be visible to patients until approved.
            </AlertDescription>
          </Alert>
        )}

        {provider.status === "rejected" && (
          <Alert variant="destructive">
            <AlertDescription>
              Your profile was not approved. Please contact support for more information or update your information and
              resubmit.
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Status</p>
              <Badge className={getStatusColor(provider.status)}>{provider.status.toUpperCase()}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(provider.createdAt).toLocaleDateString()}
            </p>
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
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-semibold">{provider.fullName}</p>
              </div>
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
                <p className="whitespace-pre-wrap text-sm">{provider.qualificationsCertifications}</p>
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
                <p className="whitespace-pre-wrap text-sm">{provider.practiceAddress}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Professional Bio</p>
                <p className="whitespace-pre-wrap text-sm">{provider.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
