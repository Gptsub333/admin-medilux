"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/providers", label: "Providers", icon: "👨‍⚕️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
]

const providerNavItems = [
  { href: "/provider", label: "Dashboard", icon: "📊" },
  { href: "/provider/profile", label: "Profile", icon: "👤" },
  { href: "/provider/appointments", label: "Appointments", icon: "📅" },
  { href: "/provider/settings", label: "Settings", icon: "⚙️" },
]

export function SidebarNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (!user) return null

  const items = user.role === "admin" ? adminNavItems : providerNavItems

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-[#f1fbfb] text-[#000] border border-sidebar-border"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative top-0 left-0 z-40 flex flex-col h-screen w-64 bg-[#f1fbfb] text-sidebar-foreground border-r border-sidebar-border transition-transform md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border mt-12 md:mt-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent font-serif">
            MediLux
          </h1>
          <p className="text-sm text-sidebar-accent-foreground mt-2 font-serif">
            {user.role === "admin" ? "Admin Dashboard" : "Provider Dashboard"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start transition-colors",
                    ` text-black hover:bg-[#37b3a9] hover:text-black`,
                    isActive && "bg-[#37b3a9] text-black"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-black">{item.label}</span>
                </Button>

              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-sidebar-border space-y-3 bg-sidebar-accent/10">
          <div className="text-sm">
            <p className="font-semibold truncate text-[#000]">{user.email}</p>
            <p className="text-xs text-sidebar-accent-foreground capitalize mt-1">{user.role}</p>
          </div>
          <Button
            onClick={() => {
              handleLogout()
              setIsMobileOpen(false)
            }}
            variant="destructive"
            className="w-full bg-[#008a8d] hover:bg-[#006d70]"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}
