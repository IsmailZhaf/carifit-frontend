import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const token = request.cookies.get("session")?.value || request.cookies.get("_vercel_jwt")?.value;

        console.log("Session token from route:", token);

        if (!token) {
            console.log("No session token found");
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Verify token with Django backend
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/verify-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.log("Response status:", response.status);
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const userData = await response.json();

        return NextResponse.json({
            user: {
                id: userData.user.id,
                name: userData.user.name,
                email: userData.user.email,
                // Only return safe user data
            },
        });
    } catch (error) {
        console.error("Me API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
