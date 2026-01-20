import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { directus } from "@/lib/directus";
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

async function getUser() {
    const user = await directus.request<DirectusUser>(readMe({ fields: ["*", "role.*"] }));
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

                    const authData = await directus.login(email, password);
                    if (!authData || !authData.access_token) {
                        return null;
                    }

                    // We need to set the token manually for the next request during authorize
                    directus.setToken(authData.access_token);
                    const userData = await getUser();

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

            const expiresAt = (token.expires_at as number) || 0;
            const isExpiring = expiresAt - Date.now() < 60 * 1000; // 60 sec buffer

            if (token.access_token && !isExpiring) {
                return token;
            }

            // Refreshing token
            if (token.refresh_token && isExpiring) {
                try {
                    console.log("Refreshing directus token...");
                    const authData = await directus.request(refresh("json", token.refresh_token as string));

                    directus.setToken(authData.access_token as string);
                    const userData = await getUser();

                    return {
                        ...token,
                        access_token: authData.access_token,
                        refresh_token: authData.refresh_token,
                        expires_at: Date.now() + (authData.expires || 3600000),
                        user_data: userData,
                    };
                } catch (error) {
                    console.error("Error refreshing token", error);
                    return { ...token, error: "RefreshAccessTokenError" };
                }
            }

            return token;
        },
        async session({ session, token }: any) {
            if (token) {
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
});
