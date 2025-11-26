"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout()
      router.push("/")
    }
  }

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }
    alert("Password changed successfully")
    setNewPassword("")
    setShowPasswordChange(false)
  }

  return (
    <div className="p-8">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage system and admin settings</p>
        </div>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto Approval</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-muted-foreground">Auto-approve provider registrations</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maintenance Mode</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-muted-foreground">Enable maintenance mode</span>
              </div>
            </div>
            <Button className="bg-[#008a8d] hover:bg-[#006d70]">Save Configuration</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">New Provider Registration</label>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Appointment Issues</label>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">System Alerts</label>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <Button className="bg-[#008a8d] hover:bg-[#006d70]">Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password regularly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPasswordChange ? (
              <Button onClick={() => setShowPasswordChange(true)} className="bg-[#008a8d] hover:bg-[#006d70]">Change Password</Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false)
                      setNewPassword("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="">
          <CardHeader>
            <CardTitle className="text-[#000]">Logout</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              
              <p className="text-sm text-muted-foreground mb-3">Sign out from your admin account</p>
              <Button variant="destructive" onClick={handleLogout} className="bg-[#008a8d] hover:bg-[#006d70]">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
