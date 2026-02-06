"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { MessageBubble } from "./message-bubble";
import { createOrderMessage } from "@/lib/message-actions";
import {
    subscribeToOrderMessages,
    playNotificationSound,
} from "@/lib/websocket";
import type { OrderMessage } from "@/types/messages";

interface ConversationPanelProps {
    orderId: string;
    orderNumber: string;
    clientName: string;
    workspaceId: string;
    initialMessages: OrderMessage[];
    currentUserId: string;
}

export function ConversationPanel({
    orderId,
    orderNumber,
    clientName,
    workspaceId,
    initialMessages,
    currentUserId,
}: ConversationPanelProps) {
    const [messages, setMessages] = useState<OrderMessage[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Suscribirse a polling para mensajes en tiempo real
    useEffect(() => {
        console.log("Starting polling for order messages:", orderId);

        const unsubscribe = subscribeToOrderMessages(
            orderId,
            workspaceId,
            (newMessages) => {
                console.log("New messages received via polling:", newMessages);

                // Agregar nuevos mensajes
                setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => m.id));
                    const uniqueNewMessages = newMessages.filter(
                        (m) => !existingIds.has(m.id)
                    );

                    if (uniqueNewMessages.length > 0) {
                        // Reproducir sonido solo si algún mensaje NO es del usuario actual
                        const hasExternalMessage = uniqueNewMessages.some(
                            (m) => m.user_created.id !== currentUserId
                        );

                        if (hasExternalMessage) {
                            playNotificationSound();
                        }

                        return [...prev, ...uniqueNewMessages];
                    }

                    return prev;
                });
            },
            (error) => {
                console.error("Polling error:", error);
                setIsConnected(false);
            }
        );

        setIsConnected(true);

        return () => {
            console.log("Stopping polling for order messages");
            unsubscribe();
            setIsConnected(false);
        };
    }, [orderId, workspaceId, currentUserId]);


    const handleSendMessage = async () => {
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);

        try {
            const result = await createOrderMessage({
                order_id: orderId,
                message: newMessage.trim(),
                workspace_id: workspaceId,
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            // Limpiar input
            setNewMessage("");

            // El mensaje aparecerá automáticamente vía WebSocket
            // No necesitamos agregarlo manualmente aquí
        } catch (error: any) {
            toast.error(error.message || "Error al enviar mensaje");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">{orderNumber}</h2>
                        <p className="text-sm text-muted-foreground">
                            {clientName}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"
                                }`}
                        />
                        <span className="text-xs text-muted-foreground">
                            {isConnected ? "Conectado" : "Desconectado"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <p className="text-muted-foreground">
                                No hay mensajes aún
                            </p>
                            <p className="text-sm text-muted-foreground/60">
                                Inicia la conversación enviando un mensaje
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isOwnMessage={
                                    message.user_created.id === currentUserId
                                }
                            />
                        ))
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <Separator />

            {/* Input */}
            <div className="p-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isSending}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                    >
                        {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Presiona Enter para enviar
                </p>
            </div>
        </div>
    );
}
