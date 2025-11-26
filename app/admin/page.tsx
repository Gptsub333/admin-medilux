"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import type { Provider } from "@/lib/types"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProviders: 0,
    approvedProviders: 0,
    pendingProviders: 0,
    rejectedProviders: 0,
  })

  useEffect(() => {
    const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
    setStats({
      totalProviders: providers.length,
      approvedProviders: providers.filter((p) => p.status === "approved").length,
      pendingProviders: providers.filter((p) => p.status === "pending").length,
      rejectedProviders: providers.filter((p) => p.status === "rejected").length,
    })
  }, [])

  return (
    <div className="p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to the HomeCare Admin Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProviders}</div>
              <p className="text-xs text-muted-foreground mt-1">All registered providers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approvedProviders}</div>
              <p className="text-xs text-muted-foreground mt-1">Active providers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingProviders}</div>
              <p className="text-xs text-muted-foreground mt-1">Waiting for approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejectedProviders}</div>
              <p className="text-xs text-muted-foreground mt-1">Not approved</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to manage providers and system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <h3 className="font-semibold">Manage Providers</h3>
                <p className="text-sm text-muted-foreground mt-1">Approve, reject, or view all providers</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <h3 className="font-semibold">View Appointments</h3>
                <p className="text-sm text-muted-foreground mt-1">Track all bookings and schedules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
