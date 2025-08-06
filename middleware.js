import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/auth/session";

const protectedRoutes = ["/dashboard", "/api/cv"];
const authRoutes = ["/login", "/register"];
const publicApiRoutes = ["/api/login", "/api/register", "/api/logout", "/api/profile"];

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const session = getSessionFromRequest(request);

    const isPublicApi = publicApiRoutes.some((route) => pathname.startsWith(route));
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(pathname);

    // 1. Jika route public API, lanjutkan saja
    if (isPublicApi) return NextResponse.next();

    // 2. Jika route yang dilindungi tapi tidak ada session
    if (isProtected && !session) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Jika sudah login dan mencoba akses /login atau /register
    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4. Jika ada session, verifikasi token ke backend
    if (isProtected && session) {
        try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
            });

            if (!verifyResponse.ok) {
                const response = pathname.startsWith("/api/") ? NextResponse.json({ error: "Invalid session" }, { status: 401 }) : NextResponse.redirect(new URL("/login", request.url));

                // Hapus cookie session jika token invalid
                response.cookies.delete("session");
                return response;
            }
        } catch (error) {
            const response = pathname.startsWith("/api/") ? NextResponse.json({ error: "Session verification failed" }, { status: 401 }) : NextResponse.redirect(new URL("/login", request.url));

            response.cookies.delete("session");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
