import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/forgot-password") ||
        nextUrl.pathname.startsWith("/reset-password");

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/", nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !nextUrl.pathname.startsWith("/api/auth")) {
        return Response.redirect(new URL("/login", nextUrl));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
