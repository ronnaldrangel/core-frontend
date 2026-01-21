import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const hasRefreshError = (req.auth as any)?.error === "RefreshAccessTokenError";
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/signup") ||
        nextUrl.pathname.startsWith("/forgot-password") ||
        nextUrl.pathname.startsWith("/reset-password") ||
        nextUrl.pathname.startsWith("/verify-email");

    if (isAuthRoute) {
        if (isLoggedIn && !hasRefreshError) {
            return Response.redirect(new URL("/workspaces", nextUrl));
        }
        return;
    }

    // Redirect to login if not logged in or if there's a refresh token error
    if (!isLoggedIn || hasRefreshError) {
        if (!nextUrl.pathname.startsWith("/api/auth")) {
            return Response.redirect(new URL("/login", nextUrl));
        }
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
