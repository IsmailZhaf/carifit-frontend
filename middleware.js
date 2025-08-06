import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/auth/session";

const protectedRoutes = ["/dashboard", "/api/cv"];

const authRoutes = ["/login", "/register"];

const publicApiRoutes = ["/api/login", "/api/register", "/api/logout", "/api/profile"];

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const session = getSessionFromRequest(request);

    const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));

    if (isPublicApiRoute) {
        return NextResponse.next();
    }

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    const isAuthRoute = authRoutes.includes(pathname);

    if (isProtectedRoute && !session) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtectedRoute && session) {
        try {
            const verifyResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/verify-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
            });

            console.log("Verify response status:", verifyResponse.status);

            if (!verifyResponse.ok) {
                if (pathname.startsWith("/api/")) {
                    const response = NextResponse.json({ error: "Invalid session" }, { status: 401 });
                    response.cookies.delete("session");
                    return response;
                }

                const response = NextResponse.redirect(new URL("/login", request.url));
                response.cookies.delete("session");
                return response;
            }
        } catch (error) {
            if (pathname.startsWith("/api/")) {
                const response = NextResponse.json({ error: "Session verification failed" }, { status: 401 });
                response.cookies.delete("session");
                return response;
            }

            const response = NextResponse.redirect(new URL("/login", request.url));
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
