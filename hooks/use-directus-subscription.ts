"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getDirectusClient } from "@/lib/directus-realtime";

interface SubscriptionOptions {
    collection: string;
    query?: {
        fields?: string[];
        filter?: Record<string, any>;
    };
    onMessage: (message: any) => void;
}

/**
 * Hook universal para suscribirse a cualquier colección de Directus en tiempo real.
 * Optimizado para evitar re-suscripciones infinitas.
 */
export function useDirectusSubscription({ collection, query, onMessage }: SubscriptionOptions) {
    const { data: session } = useSession();
    const clientRef = useRef<any>(null);
    const onMessageRef = useRef(onMessage);

    // Mantenemos el callback actualizado sin disparar efectos
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    // Serializamos el query para una comparación de dependencias estable
    const queryKey = JSON.stringify(query);

    useEffect(() => {
        const token = (session as any)?.access_token;
        if (!token || !collection) return;

        const client = getDirectusClient(token);
        clientRef.current = client;

        const start = async () => {
            try {
                await client.connect();
                await client.sendMessage({ type: 'auth', access_token: token });

                const { subscription } = await client.subscribe(collection, {
                    query: query || { fields: ['id'] }
                });

                (async () => {
                    try {
                        for await (const message of subscription) {
                            if (message.type === 'subscription') {
                                onMessageRef.current(message);
                            }
                        }
                    } catch (e) { /* Loop finalizado */ }
                })();
            } catch (err) {
                console.warn(`[Realtime:${collection}] Conexión no disponible.`);
            }
        };

        start();

        return () => {
            if (clientRef.current) {
                clientRef.current.disconnect();
                clientRef.current = null;
            }
        };
    }, [session, collection, queryKey]);
}
