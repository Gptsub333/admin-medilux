"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProviderCard } from "@/components/provider-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiCall } from "@/lib/auth"

export default function ProvidersPage() {
    const [providers, setProviders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("unverified")
    const [searchQuery, setSearchQuery] = useState("")
    const [specialtyFilter, setSpecialtyFilter] = useState("")
    const [countyFilter, setCountyFilter] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 12, totalPages: 1 })

    useEffect(() => {
        fetchProviders()
    }, [activeTab, pagination.page, searchQuery, specialtyFilter, countyFilter])

    const fetchProviders = async () => {
        setIsLoading(true)
        try {
            const endpoint =
                activeTab === "unverified"
                    ? "/api/admin/providers/unverified"
                    : "/api/admin/providers/verified"

            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(specialtyFilter && { specialty: specialtyFilter }),
                ...(countyFilter && { county: countyFilter }),
            })

            const data = await apiCall(`${endpoint}?${params}`)

            if (data.success) {
                setProviders(data.providers)
                setPagination((prev) => ({ ...prev, totalPages: data.pagination.totalPages }))
            }
        } catch (error) {
            console.error("Error fetching providers:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async (providerId) => {
        try {
            const data = await apiCall(`/api/admin/providers/${providerId}/verify`, {
                method: "PATCH",
            })

            if (data.success) {
                // Remove from list if on unverified tab
                if (activeTab === "unverified") {
                    setProviders(providers.filter((p) => p.id !== providerId))
                } else {
                    // Update in list if on verified tab
                    setProviders(
                        providers.map((p) => (p.id === providerId ? { ...p, isVerified: true } : p))
                    )
                }
            }
        } catch (error) {
            console.error("Error verifying provider:", error)
        }
    }

    const handleReject = async (providerId, reason) => {
        try {
            const data = await apiCall(`/api/admin/providers/${providerId}/reject`, {
                method: "PATCH",
                body: JSON.stringify({ reason }),
            })

            if (data.success) {
                // Remove from list or update
                setProviders(providers.filter((p) => p.id !== providerId))
            }
        } catch (error) {
            console.error("Error rejecting provider:", error)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPagination((prev) => ({ ...prev, page: 1 }))
        fetchProviders()
    }

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }))
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Provider Management</h1>
                    <p className="text-muted-foreground">Review and verify healthcare provider applications</p>
                </div>

                {/* Filters */}
                <div className="mb-6 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <Input
                            placeholder="Search by name, email, license ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex gap-4">
                        <Select value={specialtyFilter || "all"} onValueChange={(value) => setSpecialtyFilter(value === "all" ? "" : value)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Specialties</SelectItem>
                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                <SelectItem value="Dermatology">Dermatology</SelectItem>
                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Filter by county"
                            value={countyFilter}
                            onChange={(e) => setCountyFilter(e.target.value)}
                            className="w-[200px]"
                        />

                        {(searchQuery || specialtyFilter || countyFilter) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("")
                                    setSpecialtyFilter("")
                                    setCountyFilter("")
                                    setPagination((prev) => ({ ...prev, page: 1 }))
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList>
                        <TabsTrigger value="unverified">Pending Verification</TabsTrigger>
                        <TabsTrigger value="verified">Verified Providers</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                        {isLoading ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-80 rounded-lg bg-muted/50 animate-pulse" />
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
                                <p className="text-muted-foreground max-w-md">
                                    {activeTab === "unverified"
                                        ? "There are currently no provider applications to review."
                                        : "No verified providers found with the selected filters."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {providers.map((provider) => (
                                        <ProviderCard
                                            key={provider.id}
                                            provider={provider}
                                            onAccept={handleVerify}
                                            onReject={handleReject}
                                            showActions={activeTab === "unverified"}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {pagination.page} of {pagination.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}