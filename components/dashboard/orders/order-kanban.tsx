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
    Wallet,
    CreditCard
} from "lucide-react";
import { OrderStatus, PaymentStatus, updateOrder } from "@/lib/order-actions";
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Truck, Receipt, Info, MapPin as MapPinIcon, ExternalLink, Phone, Mail, Search, Plus, Image as ImageIcon, Loader2, X, Camera } from "lucide-react";
import { uploadFile } from "@/lib/product-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface OrderKanbanProps {
    orders: any[];
    orderStatuses: OrderStatus[];
    paymentStatuses: PaymentStatus[];
    themeColor?: string;
}

type DatePreset = "today" | "yesterday" | "7days";

export function OrderKanban({ orders, orderStatuses, paymentStatuses, themeColor = "#6366F1" }: OrderKanbanProps) {
    const [localOrders, setLocalOrders] = useState(orders);
    const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [datePreset, setDatePreset] = useState<DatePreset>("today");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isUploadingVoucher, setIsUploadingVoucher] = useState<string | null>(null);
    const [editingAmounts, setEditingAmounts] = useState<Record<string, { monto_adelanto?: string; monto_faltante?: string }>>({});
    const [isSavingAmounts, setIsSavingAmounts] = useState<string | null>(null);

    // Get Directus URL for images
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://directus.pachistore.site";

    const handleAmountChange = (orderId: string, value: string, orderTotal: number) => {
        const numValue = value === '' ? 0 : parseFloat(value);

        // POS logic: Allow exceeding total, Faltante just becomes 0
        const adelanto = value; // Keep as typed to allow editing decimals naturally
        const calculatedFaltante = Math.max(0, orderTotal - numValue);
        const faltante = calculatedFaltante.toFixed(2);

        setEditingAmounts(prev => ({
            ...prev,
            [orderId]: {
                monto_adelanto: adelanto,
                monto_faltante: faltante
            }
        }));
    };

    const handleSaveAmounts = async (orderId: string) => {
        const editingData = editingAmounts[orderId];
        if (!editingData) return;

        const changes = {
            monto_adelanto: editingData.monto_adelanto ? parseFloat(editingData.monto_adelanto) : 0,
            monto_faltante: editingData.monto_faltante ? parseFloat(editingData.monto_faltante) : 0
        };

        try {
            setIsSavingAmounts(orderId);
            const result = await updateOrder(orderId, changes);

            if (result.data) {
                toast.success("Montos actualizados");
                setLocalOrders(prev => prev.map(order =>
                    order.id === orderId ? { ...order, ...changes } : order
                ));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder((prev: any) => ({ ...prev, ...changes }));
                }
                setEditingAmounts(prev => {
                    const updated = { ...prev };
                    delete updated[orderId];
                    return updated;
                });
            } else {
                toast.error(result.error || "Error al actualizar");
            }
        } catch (error) {
            toast.error("Error al actualizar");
        } finally {
            setIsSavingAmounts(null);
        }
    };

    const handleVoucherUpload = async (e: React.ChangeEvent<HTMLInputElement>, order: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingVoucher(order.id);
            const formData = new FormData();
            formData.append("file", file);

            const uploadResult = await uploadFile(formData);
            if (uploadResult.error || !uploadResult.data) {
                toast.error(`Error al subir imagen: ${uploadResult.error}`);
                return;
            }

            const newVoucherId = (uploadResult.data as any).id;
            const currentVouchers = Array.isArray(order.voucher) ? order.voucher : [];
            const junctionItems = currentVouchers.map((v: any) => ({
                directus_files_id: typeof v === 'object' ? v.directus_files_id : v
            }));

            junctionItems.push({ directus_files_id: newVoucherId });

            const updateResult = await updateOrder(order.id, {
                voucher: junctionItems
            });

            if (updateResult.error) {
                toast.error(`Error al actualizar la orden: ${updateResult.error}`);
            } else {
                toast.success("Comprobante agregado");
                // Local state update
                const newVoucherObj = { directus_files_id: newVoucherId };
                const updatedVouchers = [...currentVouchers, newVoucherObj];

                setLocalOrders(prev => prev.map(o =>
                    o.id === order.id ? { ...o, voucher: updatedVouchers } : o
                ));
                if (selectedOrder?.id === order.id) {
                    setSelectedOrder((prev: any) => ({ ...prev, voucher: updatedVouchers }));
                }
            }
        } catch (error) {
            toast.error("Error al procesar la subida");
        } finally {
            setIsUploadingVoucher(null);
            if (e.target) e.target.value = "";
        }
    };

    const handleRemoveVoucher = async (order: any, fileId: string) => {
        try {
            const currentVouchers = Array.isArray(order.voucher) ? order.voucher : [];
            const junctionItems = currentVouchers
                .map((v: any) => ({
                    directus_files_id: typeof v === 'object' ? v.directus_files_id : v
                }))
                .filter((v: any) => v.directus_files_id !== fileId);

            const result = await updateOrder(order.id, {
                voucher: junctionItems
            });

            if (result.error) {
                toast.error(`Error al eliminar: ${result.error}`);
            } else {
                toast.success("Comprobante eliminado");
                const updatedVouchers = currentVouchers.filter((v: any) =>
                    (typeof v === 'object' ? v.directus_files_id : v) !== fileId
                );
                setLocalOrders(prev => prev.map(o =>
                    o.id === order.id ? { ...o, voucher: updatedVouchers } : o
                ));
                if (selectedOrder?.id === order.id) {
                    setSelectedOrder((prev: any) => ({ ...prev, voucher: updatedVouchers }));
                }
            }
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    const getStatusColor = (id: string, type: 'order' | 'payment') => {
        const statuses = type === 'order' ? orderStatuses : paymentStatuses;
        const status = statuses.find((s: OrderStatus | PaymentStatus) => s.id === id);
        return status?.color || (type === 'order' ? '#e2e8f0' : '#cbd5e1');
    };

    const getPaymentStatusName = (id: string) => {
        const status = paymentStatuses.find((s: PaymentStatus) => s.id === id);
        return status?.name || "Estado Desconocido";
    };

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
            grouped[status.id] = [];
        });

        // Fill with actual orders
        filteredOrders.forEach(order => {
            const status = order.estado_pedido;
            if (status && grouped[status]) {
                grouped[status].push(order);
            } else if (status) {
                // If status exists but not in our list (maybe legacy?), create a bucket or ignore
                // For now, let's add it if it doesn't exist to avoid hiding data
                if (!grouped[status]) grouped[status] = [];
                grouped[status].push(order);
            }
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

    const handleDragOver = (e: React.DragEvent, statusValue: string) => {
        e.preventDefault();
        setDragOverColumn(statusValue);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
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
                toast.success(`Pedido movido a ${orderStatuses.find(s => s.id === newStatus)?.name}`);
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
                    <SelectContent position="popper" side="bottom" sideOffset={4} className="w-[180px]">
                        <SelectItem value="today" className="text-[11px] font-bold uppercase tracking-wider">Hoy</SelectItem>
                        <SelectItem value="yesterday" className="text-[11px] font-bold uppercase tracking-wider">Ayer</SelectItem>
                        <SelectItem value="7days" className="text-[11px] font-bold uppercase tracking-wider">Hace 7 Días</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-1 gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted">
                {orderStatuses.map((status) => (
                    <div
                        key={status.id}
                        className={cn(
                            "flex min-w-[300px] max-w-[300px] flex-col rounded-xl p-4 border transition-all duration-200 shadow-sm",
                            dragOverColumn === status.id ? "ring-2 ring-primary/20 scale-[1.01]" : "border-border/50"
                        )}
                        style={{
                            backgroundColor: dragOverColumn === status.id ? `${status.color}25` : `${status.color}08`,
                            borderColor: dragOverColumn === status.id ? status.color : `${status.color}20`
                        }}
                        onDragOver={(e) => handleDragOver(e, status.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status.id)}
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
                                    {ordersByStatus[status.id]?.length || 0}
                                </Badge>
                            </div>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 space-y-3 overflow-y-auto p-1 pt-2 scrollbar-none -m-1">
                            {
                                ordersByStatus[status.id]?.map((order) => (
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
                                        <Card
                                            className="border-border/50 bg-card shadow-sm group-hover:shadow-md group-hover:border-primary/20"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <CardContent className="p-3">
                                                {/* Card Header: ID & Date */}
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-primary/70">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                                        #{order.numero_correlativo || (order.id ? order.id.slice(0, 6).toUpperCase() : '------')}
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
                                                            <span className="truncate">
                                                                {order.courier_provincia_dpto ||
                                                                    (order.departamento ? `${order.departamento}${order.provincia ? `, ${order.provincia}` : ''}` :
                                                                        order.cliente_id?.departamento || "Sin ubicación")}
                                                            </span>
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
                                                            {typeof order.metodo_pago === 'object' ? order.metodo_pago.name : (order.metodo_pago === 'cash' ? 'EFECTIVO' : order.metodo_pago === 'card' ? 'TARJETA' : 'TRANSF.')}
                                                        </Badge>
                                                        {order.estado_pago && (
                                                            <div className="flex items-center gap-1 ml-1">
                                                                <div
                                                                    className="h-2 w-2 rounded-full"
                                                                    style={{ backgroundColor: getStatusColor(order.estado_pago, 'payment') }}
                                                                />
                                                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{getPaymentStatusName(order.estado_pago)}</span>
                                                            </div>
                                                        )}
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


                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            }



                            {(!ordersByStatus[status.id] || ordersByStatus[status.id].length === 0) && (
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

            {/* Detail Sheet */}
            <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <SheetContent className="sm:max-w-[450px] overflow-y-auto w-full bg-[#121212] border-border/10 text-white p-6">
                    <div className="flex flex-col gap-10 h-full">
                        <SheetHeader className="text-left space-y-1 pt-2">
                            <SheetTitle className="text-xl font-semibold text-white">
                                {selectedOrder?.cliente_id?.nombre_completo || selectedOrder?.cliente_nombre || "Cliente Mostrador"}
                            </SheetTitle>
                            <SheetDescription className="sr-only">
                                Detalles completos del pedido y estado de pago.
                            </SheetDescription>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/50 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3" />
                                    <span>{selectedOrder?.cliente_id?.documento_identificacion || "---"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1 w-1 rounded-full bg-white/20" />
                                    <span className="capitalize">{selectedOrder?.cliente_id?.tipo_cliente || "persona"}</span>
                                </div>
                                {selectedOrder?.cliente_id?.telefono && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-white/20" />
                                        <span>{selectedOrder.cliente_id.telefono}</span>
                                    </div>
                                )}
                            </div>
                        </SheetHeader>

                        {/* 1. Detalle de Productos */}
                        <div className="space-y-6">
                            <header className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 mb-4">
                                <Package className="h-4 w-4" />
                                Detalle de Productos
                            </header>

                            <div className="space-y-2">
                                {selectedOrder?.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="group relative bg-[#1A1A1A] hover:bg-[#222] transition-colors rounded-lg p-4 border border-white/[0.03]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-[14px] font-medium text-white mb-0.5 tracking-tight">
                                                    {item.product_id?.nombre || "Producto desconocido"}
                                                </div>
                                                <div className="text-[10px] font-normal text-white/40 uppercase tracking-wider">
                                                    Cant: {item.cantidad} x S/ {Number(item.precio_unitario).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-[14px] font-medium text-white tabular-nums">
                                                S/ {Number(item.subtotal || (item.cantidad * item.precio_unitario)).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!selectedOrder?.items || selectedOrder.items.length === 0) && (
                                    <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                                        <Package className="h-8 w-8 text-white/10 mb-2" />
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sin productos</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Logística y Envío */}
                        <div className="space-y-6">
                            <header className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 mb-4">
                                <Truck className="h-4 w-4" />
                                Logística y Envío
                            </header>

                            <div className="space-y-4 rounded-lg bg-[#1A1A1A]/50 p-5 border border-white/[0.03]">
                                {(selectedOrder?.departamento || selectedOrder?.provincia || selectedOrder?.distrito || selectedOrder?.direccion || selectedOrder?.fecha_entrega) && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">Localización y Entrega</div>
                                        <div className="space-y-3">
                                            {selectedOrder?.fecha_entrega && (
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Fecha Entrega:</span>
                                                    <span className="font-medium text-white uppercase text-right">
                                                        {format(new Date(selectedOrder.fecha_entrega), "dd 'de' MMM, yyyy", { locale: es })}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedOrder?.departamento && (
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Departamento:</span>
                                                    <span className="font-medium text-white uppercase text-right">{selectedOrder.departamento}</span>
                                                </div>
                                            )}
                                            {selectedOrder?.provincia && (
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Provincia:</span>
                                                    <span className="font-medium text-white uppercase text-right">{selectedOrder.provincia}</span>
                                                </div>
                                            )}
                                            {selectedOrder?.distrito && (
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Distrito:</span>
                                                    <span className="font-medium text-white uppercase text-right">{selectedOrder.distrito}</span>
                                                </div>
                                            )}
                                            {selectedOrder?.direccion && (
                                                <div className="flex flex-col gap-1.5 text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Dirección:</span>
                                                    <span className="font-medium text-white p-2 rounded bg-white/[0.02] border border-white/[0.05]">{selectedOrder.direccion}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedOrder?.configurar_envio && (
                                    <>
                                        <Separator className="bg-white/5 my-4" />
                                        <div className="space-y-4">
                                            <div className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">Datos del Courier</div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Agencia:</span>
                                                    <span className="font-medium text-white uppercase text-right">{selectedOrder?.courier_nombre || "---"}</span>
                                                </div>
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Departamento:</span>
                                                    <span className="font-medium text-white uppercase text-right">{selectedOrder?.courier_provincia_dpto || selectedOrder?.departamento || "---"}</span>
                                                </div>
                                                <div className="flex justify-between items-start text-[11px]">
                                                    <span className="font-normal text-white/40 uppercase">Destino:</span>
                                                    <span className="font-medium text-white uppercase text-right max-w-[180px]">
                                                        {selectedOrder?.courier_destino_agencia || "---"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="bg-white/5 my-4" />

                                        <div className="space-y-3">
                                            <div className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">Seguimiento</div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 flex-1 rounded bg-white/[0.03] border border-white/5 flex items-center px-3 text-[10px] font-mono text-white/40">
                                                    {selectedOrder?.courier_codigo || "Esperando guía..."}
                                                </div>
                                                {selectedOrder?.ubicacion && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" asChild>
                                                        <a href={selectedOrder.ubicacion} target="_blank" rel="noopener noreferrer">
                                                            <MapPinIcon className="h-4 w-4 text-white/60" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 3. Resumen de Operación */}
                        <div className="space-y-6 pb-10">
                            <header className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 mb-4">
                                <Package className="h-4 w-4" />
                                Resumen de Operación
                            </header>

                            <div className="space-y-6">

                                <div className="flex justify-between items-center text-xs font-normal">
                                    <span className="text-white/60">Método de Pago:</span>
                                    <Badge variant="outline" className="bg-[#1A1A1A] border-white/10 text-white font-medium text-[10px] px-3 py-1 gap-2">
                                        <Wallet className="h-3 w-3" />
                                        {typeof selectedOrder?.metodo_pago === 'object' ? selectedOrder.metodo_pago.name?.toUpperCase() : selectedOrder?.metodo_pago?.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="space-y-2.5 pt-4 border-t border-white/5">
                                    <div className="flex justify-between text-[11px] font-medium">
                                        <span className="text-white/30 uppercase tracking-wider">Subtotal Productos:</span>
                                        <span className="text-white/80 tabular-nums">S/ {Number(selectedOrder?.total - (selectedOrder?.costo_envio || 0)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-medium">
                                        <span className="text-white/30 uppercase tracking-wider">Cargo Adicional:</span>
                                        <span className="text-red-500 tabular-nums">+ S/ {Number(selectedOrder?.costo_envio || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-xs font-medium text-white/60 uppercase tracking-[0.2em]">Total Final:</span>
                                        <span className="text-xl font-medium tabular-nums text-white tracking-tighter">S/ {Number(selectedOrder?.total).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 border-y border-dashed border-white/10">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-white/70">Adelanto</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">S/</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="h-10 bg-[#1A1A1A] border-white/10 text-white pl-8 text-sm font-medium rounded-lg focus:ring-primary/20"
                                                value={
                                                    editingAmounts[selectedOrder?.id]?.monto_adelanto !== undefined
                                                        ? (editingAmounts[selectedOrder?.id]?.monto_adelanto === '0' || editingAmounts[selectedOrder?.id]?.monto_adelanto === '0.00' ? '' : editingAmounts[selectedOrder?.id]?.monto_adelanto)
                                                        : (selectedOrder?.monto_adelanto && Number(selectedOrder.monto_adelanto) > 0 ? Number(selectedOrder.monto_adelanto).toFixed(2) : '')
                                                }
                                                onChange={(e) => handleAmountChange(selectedOrder.id, e.target.value, selectedOrder.total)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-destructive/70">Faltante</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-destructive/50">S/</span>
                                            <Input
                                                readOnly
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="h-10 bg-destructive/5 border-destructive/10 text-destructive pl-8 text-sm font-medium text-right rounded-lg cursor-default"
                                                value={editingAmounts[selectedOrder?.id]?.monto_faltante ?? (selectedOrder?.monto_faltante ? Number(selectedOrder.monto_faltante).toFixed(2) : '0.00')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {editingAmounts[selectedOrder?.id] && (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleSaveAmounts(selectedOrder.id)}
                                        disabled={isSavingAmounts === selectedOrder.id}
                                    >
                                        {isSavingAmounts === selectedOrder.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                Guardar Pagos
                                            </span>
                                        )}
                                    </Button>
                                )}

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 text-[10px] font-medium text-white/40 uppercase tracking-[0.15em]">
                                            <ImageIcon className="h-3.5 w-3.5" />
                                            Comprobantes de Adelanto
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="voucher-upload-kanban"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleVoucherUpload(e, selectedOrder)}
                                                disabled={isUploadingVoucher === selectedOrder?.id}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-[9px] font-bold uppercase tracking-wider bg-transparent border-dashed border-white/20 hover:bg-white/5 hover:border-white/40 rounded-lg px-3"
                                                onClick={() => document.getElementById('voucher-upload-kanban')?.click()}
                                                disabled={isUploadingVoucher === selectedOrder?.id}
                                            >
                                                {isUploadingVoucher === selectedOrder?.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                                ) : (
                                                    <Plus className="h-3 w-3 mr-1.5" />
                                                )}
                                                Subir Más
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedOrder?.voucher && selectedOrder.voucher.length > 0 ? (
                                            selectedOrder.voucher.map((v: any, idx: number) => {
                                                const fileId = typeof v === 'object' ? v.directus_files_id : v;
                                                return (
                                                    <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group">
                                                        <Image
                                                            src={`${directusUrl}/assets/${fileId}`}
                                                            alt="Comprobante"
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveVoucher(selectedOrder, fileId)}
                                                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        >
                                                            <X className="h-3 w-3 text-white" />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-2 aspect-[3/1] rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] flex flex-col items-center justify-center gap-2.5 transition-colors hover:bg-white/[0.02]">
                                                <Camera className="h-5 w-5 text-white/10" />
                                                <span className="text-[9px] font-medium text-white/20 uppercase tracking-[0.2em]">Sin Comprobantes</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
