import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;
        console.log("Session token:", token);

        if (!token) {
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
