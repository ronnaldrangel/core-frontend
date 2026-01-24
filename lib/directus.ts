import { createDirectus, rest, authentication } from '@directus/sdk';

const url = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || '';

// Client WITHOUT automatic auth injection - used for refresh and login operations
export const directusPublic = createDirectus(url)
    .with(authentication("json"))
    .with(rest());

// Client WITH automatic auth injection from session - used for authenticated requests
export const directus = createDirectus(url, {
    globals: {
        fetch: async (url: string, options: any) => {
            const headers = { ...(options.headers || {}) };
            const existingAuth = options?.headers?.["Authorization"];

            if (!existingAuth) {
                try {
                    const { auth } = await import("@/auth");
                    const session = await auth();
                    const accessToken = (session as any)?.access_token;

                    if (accessToken) {
                        headers["Authorization"] = `Bearer ${accessToken}`;
                    }
                } catch (error) {
                    // Auth not available
                }
            }

            // Ensure no caching for authenticated requests to avoid stale data issues
            return fetch(url, {
                ...options,
                headers,
                cache: 'no-store', // Crucial to prevent empty/incorrect cached results
                next: { revalidate: 0 }
            });
        },
    },
})
    .with(authentication("json"))
    .with(rest());

