"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock appointment data
const mockAppointments = [
  {
    id: "1",
    patientName: "John Smith",
    date: "2025-01-15",
    time: "10:00 AM",
    type: "Initial Consultation",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    date: "2025-01-16",
    time: "02:30 PM",
    type: "Follow-up Visit",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "Mike Davis",
    date: "2025-01-17",
    time: "09:00 AM",
    type: "Home Checkup",
    status: "pending",
  },
]

export default function AppointmentsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600 hover:bg-green-700">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-600 hover:bg-red-700">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Accept or reject appointment requests from patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{appointment.patientName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{appointment.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{appointment.time}</td>
                      <td className="py-3 px-4 text-muted-foreground">{appointment.type}</td>
                      <td className="py-3 px-4">{getStatusBadge(appointment.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                                Accept
                              </Button>
                              <Button size="sm" variant="destructive">
                                Reject
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Set your working hours and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <div key={day} className="space-y-2">
                  <label className="text-sm font-medium">{day}</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue="09:00"
                    />
                    <span className="text-muted-foreground px-2 py-2">to</span>
                    <input
                      type="time"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue="17:00"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-6">Save Availability</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
