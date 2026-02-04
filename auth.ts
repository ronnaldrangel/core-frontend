import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { directusPublic } from "@/lib/directus";
import { readMe, refresh } from "@directus/sdk";

// Extend types
declare module "next-auth" {
    interface Session {
        access_token?: string;
        refresh_token?: string;
        expires_at?: number;
        user: {
            id: string;
            first_name: string;
            last_name: string;
            role: {
                id: string;
                name: string;
            };
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        access_token?: string;
        refresh_token?: string;
        expires_at?: number;
        user_data?: any;
    }
}

interface DirectusUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    role: string | { id: string; name: string };
}

interface DirectusRole {
    id: string;
    name: string;
}

async function getUser(token: string) {
    const directusUrl = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const response = await fetch(`${directusUrl}/users/me?fields=*,role.*`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    const result = await response.json();
    const user = result.data as DirectusUser;
    if (!user) {
        throw new Error("User is invalid");
    }

    const role = user.role && typeof user.role === 'object' ? user.role as DirectusRole : null;

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar as string,
        role: {
            id: role?.id || "",
            name: role?.name || "No Role",
        },
    };
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const email = credentials?.email as string;
                    const password = credentials?.password as string;

                    const authData = await directusPublic.login(email, password);
                    if (!authData || !authData.access_token) {
                        return null;
                    }

                    // Fetch user data with the new token
                    const userData = await getUser(authData.access_token as string);

                    return {
                        id: userData.id,
                        email: userData.email,
                        access_token: authData.access_token as string,
                        refresh_token: authData.refresh_token as string,
                        expires_at: Date.now() + (authData.expires || 3600000), // Default 1 hour if not provided
                        user_data: userData,
                    };
                } catch (e) {
                    console.error("Authorize error:", e);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // First-time login, save the information inside jwt
            if (account && user) {
                return {
                    ...token,
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                    expires_at: user.expires_at,
                    user_data: user.user_data,
                };
            }

            // If no access token, return as-is (will redirect to login)
            if (!token.access_token) {
                return token;
            }

            const expiresAt = (token.expires_at as number) || 0;
            const now = Date.now();
            const isExpiring = expiresAt - now < 60 * 1000; // 60 sec buffer

            // Token is still valid, return it
            if (!isExpiring) {
                return token;
            }

            // Token is expiring and we have a refresh token
            if (token.refresh_token && !token._isRefreshing) {
                try {
                    console.log("Refreshing directus token...");

                    // Mark as refreshing to prevent loops
                    token._isRefreshing = true;

                    const authData = await directusPublic.request(refresh("json", token.refresh_token as string));

                    // Use fetch directly to avoid circular dependency with auth
                    const directusUrl = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
                    const userResponse = await fetch(`${directusUrl}/users/me?fields=*,role.*`, {
                        headers: {
                            'Authorization': `Bearer ${authData.access_token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!userResponse.ok) {
                        throw new Error("Failed to fetch user data");
                    }

                    const userResult = await userResponse.json();
                    const userData = userResult.data;
                    const role = userData.role && typeof userData.role === 'object' ? userData.role : null;

                    return {
                        ...token,
                        access_token: authData.access_token,
                        refresh_token: authData.refresh_token,
                        expires_at: Date.now() + (authData.expires || 3600000),
                        user_data: {
                            id: userData.id,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            email: userData.email,
                            avatar: userData.avatar,
                            role: {
                                id: role?.id || "",
                                name: role?.name || "No Role",
                            },
                        },
                        _isRefreshing: false,
                    };
                } catch (error) {
                    // console.error("Error refreshing token", error);
                    return { ...token, error: "RefreshAccessTokenError", _isRefreshing: false };
                }
            }

            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                // If there was a refresh error, signal it to the client
                if (token.error === "RefreshAccessTokenError") {
                    session.error = "RefreshAccessTokenError";
                }

                session.access_token = token.access_token;
                session.user = {
                    ...session.user,
                    ...token.user_data,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    trustHost: true,
});
