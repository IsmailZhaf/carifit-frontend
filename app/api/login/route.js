import { NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/auth/session";

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Forward the request to the backend
        const backendResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await backendResponse.json();
        console.log("Backend response:", data);

        // If the backend request failed, return the error
        if (!backendResponse.ok) {
            return NextResponse.json({ error: data.non_field_errors || "Login failed" }, { status: backendResponse.status });
        }

        // Create response with secure session cookie
        const response = NextResponse.json(
            {
                message: data.message,
                user: data.user,
                token: data.token,
                success: true,
            },
            { status: 200 }
        );

        // Set secure HTTP-only cookie with the token
        return createSessionResponse(response, data.token);
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
