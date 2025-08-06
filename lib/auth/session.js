import { cookies } from "next/headers";

export async function createSession(token) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function getSession() {
    const cookieStore = await cookies();
    return cookieStore.get("session")?.value;
}

// For client-side usage (middleware, api routes)
export function getSessionFromRequest(request) {
    console.log("request cookies:", request.cookies);
    return request.cookies.get("session")?.value;
}

export function createSessionResponse(response, token) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });

    return response;
}

export function deleteSessionResponse(response) {
    response.cookies.delete("session");
    return response;
}
