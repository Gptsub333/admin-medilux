"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ProviderCard({ provider, onAccept, onReject, showActions = true }) {
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [rejectReason, setRejectReason] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleAccept = async () => {
        setIsProcessing(true)
        await onAccept(provider.id)
        setIsProcessing(false)
    }

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            return
        }
        setIsProcessing(true)
        await onReject(provider.id, rejectReason)
        setShowRejectDialog(false)
        setRejectReason("")
        setIsProcessing(false)
    }

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {provider.profileImage ? (
                                <img
                                    src={provider.profileImage}
                                    alt={provider.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-lg font-semibold text-primary">
                                        {provider.name?.charAt(0) || "P"}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{provider.name}</h3>
                                <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                            </div>
                        </div>
                        {provider.isVerified ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                        ) : (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                Pending
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <span className="text-muted-foreground">{provider.email}</span>
                        </div>

                        {provider.phone && (
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span className="text-muted-foreground">{provider.phone}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="text-muted-foreground">
                                {provider.city && provider.state
                                    ? `${provider.city}, ${provider.state}`
                                    : provider.county || "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">License ID:</span>
                            <span className="font-medium">{provider.licenseId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="font-medium">{provider.yearsOfExperience} years</span>
                        </div>
                        {provider.consultationFee && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Fee:</span>
                                <span className="font-medium">${provider.consultationFee}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                {showActions && !provider.isVerified && (
                    <CardFooter className="flex gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowRejectDialog(true)}
                            disabled={isProcessing}
                        >
                            Reject
                        </Button>
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleAccept}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Verify"}
                        </Button>
                    </CardFooter>
                )}
            </Card>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Provider Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting {provider.name}'s application.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Rejection Reason</Label>
                            <Textarea
                                id="reason"
                                placeholder="Enter reason for rejection..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || isProcessing}
                        >
                            {isProcessing ? "Rejecting..." : "Reject Application"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}