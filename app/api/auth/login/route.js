// app/api/auth/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        console.log("🔐 Login attempt for:", email);

        // Call your backend API with userType
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        console.log("📡 Calling backend at:", `${API_URL}/api/admin/login`);

        const res = await fetch(`${API_URL}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                userType: "ADMIN"  // ← Added userType
            })
        });

        console.log("📥 Backend response status:", res.status);
        const data = await res.json();
        console.log("📥 Backend response data:", {
            success: data.success,
            hasToken: !!data.token,
            hasAdmin: !!data.admin
        });

        if (!data.success) {
            console.log("❌ Login failed:", data.error);
            return NextResponse.json({
                success: false,
                error: data.error || "Login failed"
            }, { status: 401 });
        }

        if (!data.token) {
            console.log("❌ No token in response");
            return NextResponse.json({
                success: false,
                error: "No token received from server"
            }, { status: 500 });
        }

        // Create response with user data
        const response = NextResponse.json({
            success: true,
            user: data.admin
        });

        // Set cookie
        response.cookies.set("admin_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60
        });

        console.log("✅ Login successful, cookie set");

        return response;
    } catch (error) {
        console.error("💥 Login API error:", error);
        return NextResponse.json({
            success: false,
            error: "Server error: " + error.message
        }, { status: 500 });
    }
}