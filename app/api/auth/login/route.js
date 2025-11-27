import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, password } = await req.json();

    // Call your backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
        return NextResponse.json({
            success: false,
            error: data.error
        });
    }

    // Create response
    const response = NextResponse.json({ success: true });

    // Set REAL HttpOnly cookie (middleware can read this!)
    response.cookies.set("admin_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
}
