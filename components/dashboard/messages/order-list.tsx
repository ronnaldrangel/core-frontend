"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { OrderWithMessages } from "@/types/messages";

interface OrderListProps {
    orders: OrderWithMessages[];
    selectedOrderId: string | null;
    onSelectOrder: (orderId: string) => void;
}

export function OrderList({
    orders,
    selectedOrderId,
    onSelectOrder,
}: OrderListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = orders.filter((order) => {
        const query = searchQuery.toLowerCase();
        return (
            order.correlativo.toLowerCase().includes(query) ||
            order.cliente_id.nombre_completo.toLowerCase().includes(query)
        );
    });

    const getLastMessage = (order: OrderWithMessages) => {
        if (!order.messages || order.messages.length === 0) return null;
        return order.messages[order.messages.length - 1];
    };

    return (
        <div className="flex flex-col h-full border-r">
            {/* Search */}
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar pedidos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Orders List */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No se encontraron pedidos</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const lastMessage = getLastMessage(order);
                            const isSelected = order.id === selectedOrderId;
                            const messageCount = order.messages?.length || 0;

                            return (
                                <button
                                    key={order.id}
                                    onClick={() => onSelectOrder(order.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-all duration-200",
                                        "hover:bg-accent/50",
                                        isSelected &&
                                        "bg-accent border-l-4 border-primary"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">
                                                {order.correlativo}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {order.cliente_id.nombre_completo}
                                            </p>
                                        </div>
                                        {messageCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {messageCount}
                                            </Badge>
                                        )}
                                    </div>

                                    {lastMessage && (
                                        <div className="mt-2">
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                <span className="font-medium">
                                                    {lastMessage.user_created
                                                        .first_name}
                                                    :
                                                </span>{" "}
                                                {lastMessage.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">
                                                {formatDistanceToNow(
                                                    new Date(
                                                        lastMessage.date_created
                                                    ),
                                                    {
                                                        addSuffix: true,
                                                        locale: es,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {!lastMessage && (
                                        <p className="text-xs text-muted-foreground/60 mt-1">
                                            Sin mensajes
                                        </p>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
