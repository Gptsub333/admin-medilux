"use client"

import { useState, useEffect } from "react"
import type { Provider } from "@/lib/types"
import { ProviderTable } from "@/components/provider-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = () => {
    const storedProviders = JSON.parse(localStorage.getItem("providers") || "[]")
    setProviders(storedProviders)
    setIsLoading(false)
  }

  const handleApprove = (id: string) => {
    const updated = providers.map((p) => (p.id === id ? { ...p, status: "approved" as const } : p))
    setProviders(updated)
    localStorage.setItem("providers", JSON.stringify(updated))
  }

  const handleReject = (id: string) => {
    const updated = providers.map((p) => (p.id === id ? { ...p, status: "rejected" as const } : p))
    setProviders(updated)
    localStorage.setItem("providers", JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this provider?")) {
      const updated = providers.filter((p) => p.id !== id)
      setProviders(updated)
      localStorage.setItem("providers", JSON.stringify(updated))
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading providers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Providers</h1>
            <p className="text-muted-foreground mt-1">Manage all healthcare providers in the system</p>
          </div>
          <Link href="/admin/providers">
            <Button variant="outline">Refresh</Button>
          </Link>
        </div>

        <ProviderTable
          providers={providers}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
