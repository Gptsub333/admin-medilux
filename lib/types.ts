// Provider and Admin types for the system
export type UserRole = "admin" | "provider"

export interface Provider {
  id: string
  fullName: string
  email: string
  phone: string
  medicalSpecialty: string
  medicalLicenseID: string
  npiNumber: string
  credentials: string
  country: string
  yoe: string
  qualificationsCertifications: string
  bio: string
  servicesOffered: string[]
  consultationFee: string
  practiceAddress: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  profileImage?: string
}

export interface User {
  id: string
  email: string
  role: UserRole
  token: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  signup: (data: Provider) => Promise<void>
  isAuthenticated: boolean
}
