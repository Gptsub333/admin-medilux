"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiCall } from "@/lib/auth"

export default function LogsPage() {
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 })

    useEffect(() => {
        fetchLogs()
    }, [pagination.page])

    const fetchLogs = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            })

            const data = await apiCall(`/api/admin/logs?${params}`)

            if (data.success) {
                setLogs(data.logs)
                setPagination((prev) => ({ ...prev, totalPages: data.pagination.totalPages }))
            }
        } catch (error) {
            console.error("Error fetching logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getActionColor = (action) => {
        switch (action) {
            case "VERIFY_PROVIDER":
                return "bg-green-100 text-green-800 border-green-200"
            case "REJECT_PROVIDER":
                return "bg-red-100 text-red-800 border-red-200"
            case "DELETE_USER":
            case "DELETE_PROVIDER":
                return "bg-orange-100 text-orange-800 border-orange-200"
            default:
                return "bg-blue-100 text-blue-800 border-blue-200"
        }
    }

    const getActionIcon = (action) => {
        if (action.includes("VERIFY")) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            )
        }
        if (action.includes("REJECT")) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            )
        }
        if (action.includes("DELETE")) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            )
        }
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        )
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Activity Logs</h1>
                    <p className="text-muted-foreground">Track all administrative actions and changes</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Complete history of admin actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />
                                ))}
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
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
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="12" y1="18" x2="12" y2="12" />
                                        <line x1="9" y1="15" x2="15" y2="15" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">No Activity Yet</h2>
                                <p className="text-muted-foreground">Activity logs will appear here</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                                                {getActionIcon(log.action)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={getActionColor(log.action)}>
                                                        {log.action.replace(/_/g, " ")}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
                                                </div>
                                                <p className="text-sm font-medium text-foreground mb-1">
                                                    {log.admin.name} ({log.admin.email})
                                                </p>
                                                {log.details && <p className="text-sm text-muted-foreground">{log.details}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {pagination.page} of {pagination.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}