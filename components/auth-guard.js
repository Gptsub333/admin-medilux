"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export function AuthGuard({ children }) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check authentication on client side
        if (!isAuthenticated()) {
            router.push("/login")
        } else {
            setIsChecking(false)
        }
    }, [router])

    // Show loading while checking
    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}