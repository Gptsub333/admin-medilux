// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    const response = NextResponse.json({ success: true });

    // Delete the httpOnly cookie
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0 // Expire immediately
    });

    return response;
}