"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import type { Provider } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProviderDashboard() {
  const { user } = useAuth()
  const [provider, setProvider] = useState<Provider | null>(null)

  useEffect(() => {
    if (user) {
      const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
      const currentProvider = providers.find((p) => p.id === user.id)
      setProvider(currentProvider || null)
    }
  }, [user])

  if (!provider) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Loading provider data...</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {provider.fullName}</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg font-bold capitalize ${
                  provider.status === "approved"
                    ? "text-green-600"
                    : provider.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {provider.status}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current verification status</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Specialty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold">{provider.medicalSpecialty}</div>
              <p className="text-xs text-muted-foreground mt-1">Your medical specialty</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold">{provider.yoe} years</div>
              <p className="text-xs text-muted-foreground mt-1">Years of experience</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your current profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
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
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="font-semibold">${provider.consultationFee}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Practice Address</p>
                <p className="font-semibold">{provider.practiceAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
