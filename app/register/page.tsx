"use client"
import { ProviderRegistrationForm } from "@/components/provider-registration-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Join HomeCare</h1>
          <p className="text-muted-foreground">Register as a healthcare provider to start offering your services</p>
        </div>

        <ProviderRegistrationForm />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/" className="font-semibold text-primary hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  )
}
