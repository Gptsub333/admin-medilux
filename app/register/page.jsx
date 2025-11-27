"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { register } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        secretKey: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        setIsLoading(true)

        const result = await register(
            formData.email,
            formData.password,
            formData.name,
            formData.secretKey
        )

        if (result.success) {
            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } else {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8 text-primary-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
                    <CardDescription>Register as an administrator for Medilux</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@medilux.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secretKey">Admin Secret Key</Label>
                            <Input
                                id="secretKey"
                                name="secretKey"
                                type="password"
                                placeholder="Enter admin secret key"
                                value={formData.secretKey}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Contact your system administrator for the secret key
                            </p>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-green-50 border-green-200">
                                <AlertDescription className="text-green-800">
                                    Registration successful! Redirecting to login...
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading || success}>
                            {isLoading ? "Creating account..." : "Create Admin Account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}