import { NextResponse } from "next/server"

// Mock database - in production, replace with actual database
let mockProviders = [
  {
    id: "bdf53f09-9413-4a84-b39d-bc5966fdf495",
    name: "Dr. Sarah Parker",
    email: "sp@test.com",
    phone: "07396893315",
    profileImage: "/caring-doctor.png",
    specialty: "General Physician",
    isVerified: false,
    rating: "4.8",
    practiceAddress: "IIMA ventures, IIM Ahmedabad",
  },
  {
    id: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    name: "Dr. Michael Chen",
    email: "michael.chen@medilux.com",
    phone: "07391234567",
    profileImage: "/male-doctor.jpg",
    specialty: "Cardiologist",
    isVerified: true,
    rating: "4.9",
    practiceAddress: "City Hospital, Medical District",
  },
  {
    id: "b2c3d4e5-6789-01bc-def1-234567890abc",
    name: "Dr. Emily Rodriguez",
    email: "emily.r@medilux.com",
    phone: "07392345678",
    profileImage: "/female-doctor.jpg",
    specialty: "Pediatrician",
    isVerified: false,
    rating: "4.7",
    practiceAddress: "Children's Care Center, Downtown",
  },
  {
    id: "c3d4e5f6-7890-12cd-ef12-34567890abcd",
    name: "Dr. James Wilson",
    email: "james.wilson@medilux.com",
    phone: "07393456789",
    profileImage: "/senior-doctor.jpg",
    specialty: "Orthopedic Surgeon",
    isVerified: true,
    rating: "4.6",
    practiceAddress: "Sports Medicine Clinic, North Campus",
  },
  {
    id: "d4e5f6g7-8901-23de-f123-4567890abcde",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@medilux.com",
    phone: "07394567890",
    profileImage: "/indian-female-doctor.jpg",
    specialty: "Dermatologist",
    isVerified: false,
    rating: "4.5",
    practiceAddress: "Skin Care Institute, Central Plaza",
  },
  {
    id: "e5f6g7h8-9012-34ef-1234-567890abcdef",
    name: "Dr. Robert Taylor",
    email: "robert.t@medilux.com",
    phone: "07395678901",
    profileImage: "/doctor-glasses.jpg",
    specialty: "Neurologist",
    isVerified: true,
    rating: "4.9",
    practiceAddress: "Brain & Spine Center, Medical Tower",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({ providers: mockProviders })
}

export async function PUT(request) {
  try {
    const { providerId, isVerified } = await request.json()

    // Update provider verification status
    mockProviders = mockProviders.map((provider) =>
      provider.id === providerId ? { ...provider, isVerified } : provider,
    )

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      provider: mockProviders.find((p) => p.id === providerId),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update provider" }, { status: 500 })
  }
}
