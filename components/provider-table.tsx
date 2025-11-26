"use client"

import { useState, useEffect } from "react"
import type { Provider } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProviderTableProps {
  providers: Provider[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}

export function ProviderTable({ providers, onApprove, onReject, onDelete }: ProviderTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [filteredProviders, setFilteredProviders] = useState(providers)

  useEffect(() => {
    let filtered = providers

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.medicalSpecialty.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    setFilteredProviders(filtered)
  }, [searchTerm, statusFilter, providers])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-600 hover:bg-red-700">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Providers Management</CardTitle>
        <CardDescription>Manage and approve healthcare providers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by name, email, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <Link href={`/admin/providers/${provider.id}`} className="font-medium hover:underline text-primary">
                      {provider.fullName}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{provider.email}</td>
                  <td className="py-3 px-4 text-muted-foreground">{provider.medicalSpecialty}</td>
                  <td className="py-3 px-4">{getStatusBadge(provider.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {provider.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => onApprove(provider.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onReject(provider.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(provider.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProviders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No providers found</div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredProviders.length} of {providers.length} providers
        </div>
      </CardContent>
    </Card>
  )
}
