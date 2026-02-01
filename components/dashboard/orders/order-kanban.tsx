"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    User,
    MapPin,
    MoreHorizontal,
    ArrowRight,
    GripVertical,
    Package,
    Calendar,
    Wallet
} from "lucide-react";
import { OrderStatus, updateOrder } from "@/lib/order-actions";
import { toast } from "sonner";
import { format, isWithinInterval, startOfDay, endOfDay, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OrderKanbanProps {
    orders: any[];
    orderStatuses: OrderStatus[];
    themeColor?: string;
}

type DatePreset = "today" | "yesterday" | "7days";

export function OrderKanban({ orders, orderStatuses, themeColor = "#6366F1" }: OrderKanbanProps) {
    const [localOrders, setLocalOrders] = useState(orders);
    const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
    const [datePreset, setDatePreset] = useState<DatePreset>("today");

    // Sync local orders when props change
    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    // Filter orders by date preset
    const filteredOrders = useMemo(() => {
        const now = new Date();
        let start: Date;
        let end: Date = endOfDay(now);

        switch (datePreset) {
            case "today":
                start = startOfDay(now);
                break;
            case "yesterday":
                start = startOfDay(subDays(now, 1));
                end = endOfDay(subDays(now, 1));
                break;
            case "7days":
                start = startOfDay(subDays(now, 7));
                break;
            default:
                start = startOfDay(now);
        }

        return localOrders.filter(order => {
            if (!order.fecha_venta) return false;
            const orderDate = new Date(order.fecha_venta);
            return isWithinInterval(orderDate, { start, end });
        });
    }, [localOrders, datePreset]);

    // Group orders by status
    const ordersByStatus = useMemo(() => {
        const grouped: Record<string, any[]> = {};

        // Initialize with empty arrays for all statuses
        orderStatuses.forEach(status => {
            grouped[status.value] = [];
        });

        // Fill with actual orders
        filteredOrders.forEach(order => {
            const status = order.estado_pedido || "pendiente";
            if (!grouped[status]) {
                grouped[status] = [];
            }
            grouped[status].push(order);
        });

        return grouped;
    }, [filteredOrders, orderStatuses]);

    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        setDraggedOrderId(orderId);
        e.dataTransfer.setData("orderId", orderId);
        // Visual effect for drag image
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "0.5";
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedOrderId(null);
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "1";
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Required to allow drop
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const orderId = e.dataTransfer.getData("orderId");

        if (!orderId) return;

        const order = localOrders.find(o => o.id === orderId);
        if (order?.estado_pedido === newStatus) return;

        // Optimistic update
        setLocalOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, estado_pedido: newStatus } : o
        ));

        try {
            const result = await updateOrder(orderId, { estado_pedido: newStatus });
            if (result.error) {
                toast.error(`Error al mover pedido: ${result.error}`);
                setLocalOrders(orders); // Rollback to props
            } else {
                toast.success(`Pedido movido a ${orderStatuses.find(s => s.value === newStatus)?.name}`);
            }
        } catch (error) {
            toast.error("Error al actualizar el estado");
            setLocalOrders(orders); // Rollback to props
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2 mb-2">
                <Select value={datePreset} onValueChange={(val: DatePreset) => setDatePreset(val)}>
                    <SelectTrigger className="w-[180px] h-9 bg-card font-bold uppercase text-[10px] tracking-wider">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <SelectValue placeholder="Filtrar por fecha" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today" className="text-[11px] font-bold uppercase tracking-wider">Hoy</SelectItem>
                        <SelectItem value="yesterday" className="text-[11px] font-bold uppercase tracking-wider">Ayer</SelectItem>
                        <SelectItem value="7days" className="text-[11px] font-bold uppercase tracking-wider">Hace 7 Días</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-1 gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted">
                {orderStatuses.map((status) => (
                    <div
                        key={status.value}
                        className="flex min-w-[300px] max-w-[300px] flex-col rounded-xl p-3"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status.value)}
                    >
                        {/* Column Header */}
                        <div className="mb-4 flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: status.color }}
                                />
                                <h3 className="font-bold tracking-tight text-sm uppercase">
                                    {status.name}
                                </h3>
                                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] justify-center px-1 font-mono text-[10px]">
                                    {ordersByStatus[status.value]?.length || 0}
                                </Badge>
                            </div>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-none">
                            {
                                ordersByStatus[status.value]?.map((order) => (
                                    <div
                                        key={order.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, order.id)}
                                        onDragEnd={handleDragEnd}
                                        className={cn(
                                            "group relative cursor-grab active:cursor-grabbing transition-all duration-200",
                                            draggedOrderId === order.id ? "scale-95" : "hover:-translate-y-1"
                                        )}
                                    >
                                        <Card className="border-border/50 bg-card shadow-sm group-hover:shadow-md group-hover:border-primary/20">
                                            <CardContent className="p-3">
                                                {/* Card Header: ID & Date */}
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-primary/70">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                                        #{order.id ? order.id.slice(0, 6).toUpperCase() : '------'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                                        <Clock className="h-3 w-3" />
                                                        {(() => {
                                                            try {
                                                                return order.fecha_venta ? format(new Date(order.fecha_venta), "dd MMM", { locale: es }) : "S/F";
                                                            } catch (e) {
                                                                return "Error Fecha";
                                                            }
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* Client Info */}
                                                <div className="mb-3 flex items-start gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                                                            {order.cliente_id?.nombre_completo || order.cliente_nombre || "Cliente Mostrador"}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 font-medium">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="truncate">{order.courier_provincia_dpto || order.cliente_id?.departamento || "Sin ubicación"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary & Price */}
                                                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40">
                                                    <div className="flex items-center gap-1.5">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-muted/50 text-[10px] font-bold px-1.5 py-0 h-5"
                                                        >
                                                            {order.metodo_pago === 'cash' ? 'EFECTIVO' : order.metodo_pago === 'card' ? 'TARJETA' : 'TRANSF.'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-sm font-black text-foreground tabular-nums tracking-tight">
                                                            S/ {Number(order.total).toFixed(2)}
                                                        </div>
                                                        {Number(order.monto_faltante) > 0 && (
                                                            <div className="text-[9px] font-bold text-red-500 tabular-nums uppercase tracking-tighter">
                                                                Faltan S/ {Number(order.monto_faltante).toFixed(2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Drag Handle Overlay (optional visual cue) */}
                                                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            }

                            {(!ordersByStatus[status.value] || ordersByStatus[status.value].length === 0) && (
                                <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 text-muted-foreground/40">
                                    <Package className="h-6 w-6 mb-1 opacity-20" />
                                    <span className="text-[10px] font-medium uppercase tracking-widest">Vacío</span>
                                </div>
                            )}
                        </div>
                    </div >
                ))
                }
            </div>
        </div>
    );
}
