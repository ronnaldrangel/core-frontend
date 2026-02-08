"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDirectusSubscription } from "./use-directus-subscription";
import { getOrderMessages } from "@/lib/message-actions";
import { playNotificationSound } from "@/lib/websocket";
import type { OrderMessage } from "@/types/messages";

export function useRealtimeOrderMessages(
    orderId: string | null,
    workspaceId: string | null,
    initialMessages?: OrderMessage[]
) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<OrderMessage[]>(initialMessages || []);
    const userId = session?.user?.id;

    // Sincronización segura: Solo actualizamos si el ID de la orden cambia o llegan nuevos mensajes iniciales
    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        } else if (!orderId) {
            setMessages([]);
        }
    }, [orderId, initialMessages]);

    const refreshMessages = useCallback(async () => {
        if (!orderId || !workspaceId) return;

        try {
            const result = await getOrderMessages(orderId, workspaceId);
            if (result.data) {
                setMessages(prev => {
                    const nextMessages = result.data!;
                    if (nextMessages.length > prev.length) {
                        const newest = nextMessages[nextMessages.length - 1];
                        const isFromMe = typeof newest.user_created === 'object'
                            ? newest.user_created.id === userId
                            : newest.user_created === userId;

                        if (!isFromMe) playNotificationSound();
                    }
                    return nextMessages;
                });
            }
        } catch (error) {
            console.error("Error refreshing order messages:", error);
        }
    }, [orderId, workspaceId, userId]);

    // Memorizamos el query para que useDirectusSubscription no se reinicie constantemente
    const subscriptionQuery = useMemo(() => ({
        fields: ['id'],
        filter: orderId && workspaceId ? {
            order_id: { _eq: orderId },
            workspace_id: { _eq: workspaceId }
        } : undefined
    }), [orderId, workspaceId]);

    useDirectusSubscription({
        collection: 'order_messages',
        query: subscriptionQuery,
        onMessage: refreshMessages
    });

    return { messages, setMessages };
}
