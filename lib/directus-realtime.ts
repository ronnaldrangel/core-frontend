import { createDirectus, realtime, authentication, rest } from '@directus/sdk';

const url = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';

/**
 * Crea una instancia del cliente de Directus optimizada para tiempo real.
 */
export const getDirectusClient = (accessToken?: string) => {
    const client = createDirectus(url).with(rest()).with(realtime());
    if (accessToken) client.with(authentication('json'));
    return client;
};
