"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProviderCard } from "@/components/provider-card"

export default function HomePage() {
  const [providers, setProviders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/providers")
      const data = await response.json()
      setProviders(data.providers)
    } catch (error) {
      console.error("[v0] Error fetching providers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (providerId) => {
    try {
      const response = await fetch("/api/providers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ providerId, isVerified: true }),
      })

      if (response.ok) {
        // Optimistic update
        setProviders(
          providers.map((provider) => (provider.id === providerId ? { ...provider, isVerified: true } : provider)),
        )
      }
    } catch (error) {
      console.error("[v0] Error accepting provider:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Provider Management</h1>
          <p className="text-muted-foreground">Review and verify healthcare provider applications</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Providers Found</h2>
            <p className="text-muted-foreground max-w-md">There are currently no provider applications to review.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onAccept={handleAccept} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
