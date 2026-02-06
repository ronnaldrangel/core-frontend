"use client";

import { useState, useEffect } from "react";
import { OrderList } from "@/components/dashboard/messages/order-list";
import { ConversationPanel } from "@/components/dashboard/messages/conversation-panel";
import { getOrderMessages } from "@/lib/message-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { OrderWithMessages, OrderMessage } from "@/types/messages";

interface MessagesClientProps {
    initialOrders: OrderWithMessages[];
    workspaceId: string;
    currentUserId: string;
    initialSelectedOrderId?: string;
}

export function MessagesClient({
    initialOrders,
    workspaceId,
    currentUserId,
    initialSelectedOrderId,
}: MessagesClientProps) {
    const [orders] = useState<OrderWithMessages[]>(initialOrders);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
        initialSelectedOrderId || (initialOrders[0]?.id ?? null)
    );
    const [messages, setMessages] = useState<OrderMessage[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    const selectedOrder = orders.find((o) => o.id === selectedOrderId);

    // Cargar mensajes cuando se selecciona un pedido
    useEffect(() => {
        if (!selectedOrderId) return;

        const loadMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const result = await getOrderMessages(
                    selectedOrderId,
                    workspaceId
                );

                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                setMessages(result.data || []);
            } catch (error: any) {
                toast.error(error.message || "Error al cargar mensajes");
            } finally {
                setIsLoadingMessages(false);
            }
        };

        loadMessages();
    }, [selectedOrderId, workspaceId]);

    return (
        <div className="grid grid-cols-[350px_1fr] h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-card">
            {/* Lista de pedidos */}
            <OrderList
                orders={orders}
                selectedOrderId={selectedOrderId}
                onSelectOrder={setSelectedOrderId}
            />

            {/* Panel de conversación */}
            {selectedOrder ? (
                isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ConversationPanel
                        orderId={selectedOrder.id}
                        orderNumber={selectedOrder.correlativo}
                        clientName={selectedOrder.cliente_id.nombre_completo}
                        workspaceId={workspaceId}
                        initialMessages={messages}
                        currentUserId={currentUserId}
                    />
                )
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Selecciona un pedido para ver la conversación</p>
                </div>
            )}
        </div>
    );
}
