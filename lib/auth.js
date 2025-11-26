"use server"

import { cookies } from "next/headers"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@medilux.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const SESSION_COOKIE_NAME = "medilux_session"

export async function login(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return { success: true }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  return session?.value === "authenticated"
}
