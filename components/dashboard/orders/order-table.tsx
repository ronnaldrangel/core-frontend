"use client";

import { useState, useMemo, Fragment, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isWithinInterval, startOfDay, endOfDay, subDays, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import {
    Calendar,
    User,
    Eye,
    EyeOff,
    Trash2,
    Package,
    Search,
    Filter,
    Truck,
    Hash,
    Key,
    Mail,
    Phone,
    Clock,
    MapPin,
    CreditCard,
    ClipboardList,
    Receipt,
    FileText,
    ChevronDown,
    Calendar as CalendarIcon,
    AlertCircle,
    ShoppingBag,
    Wallet,
    ImageIcon,
    ExternalLink,
    Plus,
    Loader2,
    Camera,
    X,
    MoreVertical,
    MessageSquare,
    Send,
    Settings,
    Upload
} from "lucide-react";
import Image from "next/image";
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from "@/lib/peru-locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteOrder, updateOrder, OrderStatus, PaymentStatus, CourierType } from "@/lib/order-actions";
import { updateClient } from "@/lib/client-actions";
import { uploadFile } from "@/lib/product-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRBAC } from "@/components/providers/rbac-provider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderTableProps {
    orders: any[];
    orderStatuses: OrderStatus[];
    paymentStatuses: PaymentStatus[];
    couriers: CourierType[];
    paymentMethods: any[];
    themeColor?: string;
}
type DatePreset = "all" | "yesterday" | "today" | "3days" | "7days" | "month" | "custom";


export function OrderTable({ orders, orderStatuses, paymentStatuses, couriers, paymentMethods, themeColor = "#6366F1" }: OrderTableProps) {
    const { hasPermission } = useRBAC();
    const canUpdate = hasPermission("orders.update");
    const canDelete = hasPermission("orders.delete");

    const [localOrders, setLocalOrders] = useState(orders);
    const [searchQuery, setSearchQuery] = useState("");
    const [datePreset, setDatePreset] = useState<DatePreset>("today");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedCourier, setSelectedCourier] = useState<string>("all");
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("all");

    // Sync local orders when props change
    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [orderToEdit, setOrderToEdit] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploadingVoucher, setIsUploadingVoucher] = useState<string | null>(null);
    const [editingAmounts, setEditingAmounts] = useState<Record<string, { monto_adelanto?: string; monto_faltante?: string }>>({});
    const [isSavingAmounts, setIsSavingAmounts] = useState<string | null>(null);
    const [noteDraft, setNoteDraft] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Update noteDraft when selectedOrder changes
    useEffect(() => {
        if (selectedOrder) {
            setNoteDraft(selectedOrder.notas || "");
        }
    }, [selectedOrder]);

    const handleSaveNote = async () => {
        if (!selectedOrder || isSavingNote) return;

        try {
            setIsSavingNote(true);
            const result = await updateOrder(selectedOrder.id, { notas: noteDraft });

            if (result.data) {
                toast.success("Comentario guardado");
                // Update local orders
                setLocalOrders(prev => prev.map(o =>
                    o.id === selectedOrder.id ? { ...o, notas: noteDraft } : o
                ));
                // Update selected order reference
                setSelectedOrder((prev: any) => prev ? { ...prev, notas: noteDraft } : null);
            } else {
                toast.error(result.error || "Error al guardar comentario");
            }
        } catch (error) {
            toast.error("Error al guardar comentario");
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleVoucherUpload = async (e: React.ChangeEvent<HTMLInputElement>, order: any) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setIsUploadingVoucher(order.id);
            const junctionItems = [...(Array.isArray(order.voucher) ? order.voucher : [])].map((v: any) => ({
                directus_files_id: typeof v === 'object' ? v.directus_files_id : v
            }));

            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadResult = await uploadFile(formData);
                if (uploadResult.error || !uploadResult.data) {
                    toast.error(`Error al subir ${file.name}: ${uploadResult.error}`);
                    continue;
                }

                const newVoucherId = (uploadResult.data as any).id;
                junctionItems.push({ directus_files_id: newVoucherId });
            }

            const updateResult = await updateOrder(order.id, {
                voucher: junctionItems
            });

            if (updateResult.error) {
                toast.error(`Error al actualizar la orden: ${updateResult.error}`);
            } else {
                toast.success(`${files.length > 1 ? files.length + ' comprobantes agregados' : 'Comprobante agregado'} correctamente`);

                if (selectedOrder?.id === order.id) {
                    setSelectedOrder({ ...selectedOrder, voucher: junctionItems });
                }
                if (orderToEdit?.id === order.id) {
                    setOrderToEdit({ ...orderToEdit, voucher: junctionItems });
                }
                setLocalOrders(prev => prev.map(o => o.id === order.id ? { ...o, voucher: junctionItems } : o));
            }
        } catch (error: any) {
            toast.error("Error al procesar la subida");
            console.error(error);
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

                if (selectedOrder?.id === order.id) {
                    setSelectedOrder({ ...selectedOrder, voucher: junctionItems });
                }
                if (orderToEdit?.id === order.id) {
                    setOrderToEdit({ ...orderToEdit, voucher: junctionItems });
                }
                setLocalOrders(prev => prev.map(o => o.id === order.id ? { ...o, voucher: junctionItems } : o));
            }
        } catch (error) {
            toast.error("Error al eliminar el comprobante");
            console.error(error);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpenDetails = (order: any) => {
        setSelectedOrder(order);
    };

    const handleAmountChange = (orderId: string, field: 'monto_adelanto' | 'monto_faltante', value: string, orderTotal: number) => {
        const numValue = value === '' ? 0 : parseFloat(value);

        let adelanto: string;
        let faltante: string;

        if (field === 'monto_adelanto') {
            adelanto = value;
            const calculatedFaltante = Math.max(0, orderTotal - numValue);
            faltante = calculatedFaltante.toFixed(2);
        } else {
            faltante = value;
            const calculatedAdelanto = Math.max(0, orderTotal - numValue);
            adelanto = calculatedAdelanto.toFixed(2);
        }

        const numericAdelanto = parseFloat(adelanto) || 0;
        const numericFaltante = parseFloat(faltante) || 0;

        // Actualización optimista para reflejar cambios al instante en la UI global
        setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, monto_adelanto: numericAdelanto, monto_faltante: numericFaltante } : o));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder((prev: any) => ({ ...prev, monto_adelanto: numericAdelanto, monto_faltante: numericFaltante }));
        }

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

        // Convert string values to numbers for API
        const changes = {
            monto_adelanto: editingData.monto_adelanto ? parseFloat(editingData.monto_adelanto) : 0,
            monto_faltante: editingData.monto_faltante ? parseFloat(editingData.monto_faltante) : 0
        };

        try {
            setIsSavingAmounts(orderId);
            const result = await updateOrder(orderId, changes);

            if (result.data) {
                toast.success("Montos actualizados correctamente");

                // Update local orders state
                setLocalOrders(prev => prev.map(order =>
                    order.id === orderId
                        ? { ...order, ...changes }
                        : order
                ));

                // Clear editing state for this order
                setEditingAmounts(prev => {
                    const updated = { ...prev };
                    delete updated[orderId];
                    return updated;
                });
            } else {
                toast.error(result.error || "Error al actualizar montos");
            }
        } catch (error) {
            toast.error("Error al actualizar montos");
            console.error(error);
        } finally {
            setIsSavingAmounts(null);
        }
    };

    const filteredOrders = useMemo(() => {
        return localOrders.filter(order => {
            // Search filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesClient =
                    order.cliente_id?.nombre_completo?.toLowerCase().includes(searchLower) ||
                    order.cliente_id?.documento_identificacion?.includes(searchLower) ||
                    order.cliente_id?.telefono?.includes(searchLower) ||
                    order.cliente_id?.email?.toLowerCase().includes(searchLower);

                const matchesOrder =
                    order.id.toLowerCase().includes(searchLower) ||
                    order.courier_destino_agencia?.toLowerCase().includes(searchLower) ||
                    order.courier_provincia_dpto?.toLowerCase().includes(searchLower);

                if (!matchesClient && !matchesOrder) return false;
            }

            // Date filter
            if (datePreset !== "all") {
                const orderDate = new Date(order.fecha_venta);
                const now = new Date();

                let start: Date;
                let end: Date = endOfDay(now);

                if (datePreset === "yesterday") {
                    start = startOfDay(subDays(now, 1));
                    end = endOfDay(subDays(now, 1));
                } else if (datePreset === "today") {
                    start = startOfDay(now);
                } else if (datePreset === "3days") {
                    start = startOfDay(subDays(now, 2));
                } else if (datePreset === "7days") {
                    start = startOfDay(subDays(now, 6));
                } else if (datePreset === "month") {
                    start = startOfMonth(now);
                } else if (datePreset === "custom") {
                    if (dateFrom && dateTo) {
                        start = startOfDay(new Date(dateFrom));
                        end = endOfDay(new Date(dateTo));
                    } else if (dateFrom) {
                        start = startOfDay(new Date(dateFrom));
                    } else if (dateTo) {
                        start = new Date(0);
                        end = endOfDay(new Date(dateTo));
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
                if (!isWithinInterval(orderDate, { start, end })) return false;
            }

            // Department filter
            const orderDept = order.courier_provincia_dpto?.toUpperCase()?.trim() || "";

            if (selectedDepartment === "lima") {
                if (orderDept !== "LIMA") return false;
            } else if (selectedDepartment === "no_lima") {
                if (orderDept === "LIMA" || !orderDept) return false;
            } else if (selectedDepartment !== "all") {
                const filterValue = selectedDepartment.toUpperCase().trim();
                if (orderDept !== filterValue) return false;
            }

            // Courier filter
            if (selectedCourier !== "all") {
                const orderCourier = order.courier_nombre?.toLowerCase()?.trim() || "";
                const selectedLower = selectedCourier.toLowerCase().trim();

                // Allow matching by name or value (if stored that way)
                const courierObj = couriers.find(c => c.name === selectedCourier || c.value === selectedCourier);
                const courierName = courierObj?.name?.toLowerCase()?.trim() || "";
                const courierValue = courierObj?.value?.toLowerCase()?.trim() || "";

                if (orderCourier !== courierName && orderCourier !== courierValue && orderCourier !== selectedLower) {
                    return false;
                }
            }

            // Order Status filter
            if (selectedOrderStatus !== "all") {
                const orderStatus = order.estado_pedido?.toLowerCase()?.trim() || "";
                const targetStatus = selectedOrderStatus.toLowerCase().trim();
                if (orderStatus !== targetStatus) return false;
            }

            return true;
        });
    }, [localOrders, searchQuery, datePreset, dateFrom, dateTo, selectedDepartment, selectedCourier, selectedOrderStatus]);

    const stats = useMemo(() => {
        const counts: Record<string, number> = {};
        orderStatuses.forEach(s => { counts[s.value] = 0; });

        return filteredOrders.reduce((acc, order) => {
            const total = Number(order.total) || 0;
            const shipping = order.tipo_cobro_envio === 'destino' ? 0 : (Number(order.costo_envio) || 0);
            const faltante = Number(order.monto_faltante) || 0;
            const adelanto = Number(order.monto_adelanto) || 0;
            const statusValue = order.estado_pedido;

            acc.neto += (total - shipping);
            acc.faltante += faltante;
            acc.adelantos += adelanto;
            acc.ventas += 1;

            if (statusValue !== undefined && statusValue !== null) {
                acc.counts[statusValue] = (acc.counts[statusValue] || 0) + 1;
            }

            return acc;
        }, { neto: 0, faltante: 0, adelantos: 0, ventas: 0, counts });
    }, [filteredOrders, orderStatuses]);

    const handleDelete = async () => {
        if (!orderToDelete) return;

        try {
            setIsDeleting(true);
            const { success, error } = await deleteOrder(orderToDelete);
            if (success) {
                toast.success("Orden eliminada correctamente");
            } else {
                toast.error(error || "Error al eliminar la orden");
            }
        } catch (error) {
            toast.error("Error al eliminar la orden");
        } finally {
            setIsDeleting(false);
            setOrderToDelete(null);
        }
    };

    const getStatusColor = (val: string, type: 'order' | 'payment') => {
        const statuses = type === 'order' ? orderStatuses : paymentStatuses;
        const status = statuses.find(s => s.id === val);
        return status?.color || "#808080";
    };

    const getStatusName = (val: string, type: 'order' | 'payment') => {
        const statuses = type === 'order' ? orderStatuses : paymentStatuses;
        const status = statuses.find(s => s.id === val);
        return status?.name || val;
    };

    const getLocationName = (id: string | null, type: 'dep' | 'prov' | 'dist') => {
        if (!id) return null;
        if (type === 'dep') return DEPARTAMENTOS.find(d => d.id === id)?.nombre || id;
        if (type === 'prov') return PROVINCIAS.find(p => p.id === id)?.nombre || id;
        if (type === 'dist') return DISTRITOS.find(d => d.id === id)?.nombre || id;
        return id;
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'cash': return "Efectivo";
            case 'card': return "Tarjeta";
            case 'transfer': return "Transferencia";
            default: return method;
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-1 gap-4 overflow-hidden">
                <div className={cn(
                    "flex flex-col gap-4 transition-all duration-300 ease-in-out",
                    selectedOrder ? "w-[60%] lg:w-[70%]" : "w-full"
                )}>
                    {/* Filtros y Buscador - Una sola fila */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {/* Buscador */}
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                placeholder="Buscar pedido..."
                                className="pl-10 h-10 bg-muted/10 border-border/40 focus:bg-background/50 transition-all rounded-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filtro de Fecha */}
                        <Select value={datePreset} onValueChange={(val: DatePreset) => setDatePreset(val)}>
                            <SelectTrigger className="h-10 w-[160px] bg-muted/10 border-border/40 font-medium rounded-lg">
                                <SelectValue placeholder="Fecha" />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                                <SelectItem value="today">Hoy</SelectItem>
                                <SelectItem value="yesterday">Ayer</SelectItem>
                                <SelectItem value="3days">Últimos 3 días</SelectItem>
                                <SelectItem value="7days">Últimos 7 días</SelectItem>
                                <SelectItem value="month">Este mes</SelectItem>
                                <SelectItem value="all">Todas las fechas</SelectItem>
                                <SelectItem value="custom">Rango personalizado</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Inputs personalizados de fecha */}
                        {datePreset === "custom" && (
                            <>
                                <Input
                                    type="date"
                                    placeholder="Desde"
                                    className="h-10 w-[140px] bg-muted/10 border-border/40 text-sm rounded-lg"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                                <Input
                                    type="date"
                                    placeholder="Hasta"
                                    className="h-10 w-[140px] bg-muted/10 border-border/40 text-sm rounded-lg"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </>
                        )}

                        {/* Departamento */}
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg">
                                <SelectValue placeholder="Departamento" />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                                <SelectItem value="all">Todos los dptos.</SelectItem>
                                <SelectItem value="lima">Lima</SelectItem>
                                <SelectItem value="no_lima">Todos menos Lima</SelectItem>
                                <div className="border-t my-1"></div>
                                {DEPARTAMENTOS.map((dep) => (
                                    <SelectItem key={dep.id} value={dep.nombre}>
                                        {dep.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Courier */}
                        <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                            <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg">
                                <SelectValue placeholder="Courier" />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                                <SelectItem value="all">Todos los couriers</SelectItem>
                                {couriers.map((courier) => (
                                    <SelectItem key={courier.id} value={courier.name}>
                                        {courier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Estado de Pedido */}
                        <Select value={selectedOrderStatus} onValueChange={setSelectedOrderStatus}>
                            <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {orderStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: status.color }}
                                            />
                                            {status.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-lg border-border/50 overflow-x-auto bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50 text-muted-foreground border-b border-border/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="px-4 py-4 font-medium text-sm">ID</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm">Fechas</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm">Cliente</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm">Destino/Courier</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm">Estado de Pedido</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm">Estado de Pago</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm text-right">Total</TableHead>
                                    <TableHead className="px-4 py-4 font-medium text-sm text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/50">
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Filter className="h-8 w-8" />
                                                <p className="font-medium">No se encontraron ventas con los filtros actuales.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => {
                                        return (
                                            <Fragment key={order.id}>
                                                <TableRow
                                                    className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                                    onClick={() => handleOpenDetails(order)}
                                                >
                                                    {/* ID */}
                                                    <TableCell className="px-4 py-4 focus-within:z-10">
                                                        <div className="text-xs font-mono font-semibold text-primary/80">
                                                            {order.id.slice(0, 8).toUpperCase()}
                                                        </div>
                                                    </TableCell>

                                                    {/* Fechas (Envío y Entrega) */}
                                                    <TableCell className="px-4 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                                <CalendarIcon className="h-3 w-3" style={{ color: themeColor }} />
                                                                {format(new Date(order.fecha_venta), "dd/MM/yyyy HH:mm", { locale: es })}
                                                            </div>
                                                            {order.fecha_entrega ? (
                                                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                                    <Truck className="h-3 w-3" />
                                                                    {format(new Date(order.fecha_entrega), "dd/MM/yyyy", { locale: es })}
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-muted-foreground/50 italic ml-5">Sin fecha entrega</span>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Cliente */}
                                                    <TableCell className="px-4 py-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2 font-semibold text-sm tracking-tight capitalize">
                                                                <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                                                                {order.cliente_id?.nombre_completo || "Cliente Mostrador"}
                                                            </div>
                                                            {order.cliente_id?.documento_identificacion && (
                                                                <span className="text-[10px] text-muted-foreground/60 ml-5 font-medium">
                                                                    {order.cliente_id.documento_identificacion}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Destino/Courier */}
                                                    <TableCell className="px-4 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                                <MapPin className="h-3 w-3 text-primary/60" />
                                                                <span className="text-muted-foreground uppercase tracking-tight">{order.departamento || "-"}</span>
                                                            </div>
                                                            {order.configurar_envio ? (
                                                                order.courier_nombre && (
                                                                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/70">
                                                                        <Truck className="h-3 w-3" />
                                                                        {order.courier_nombre}
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                                                                    <Truck className="h-3 w-3 opacity-30" />
                                                                    Sin courier
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Estado de Pedido - EDITABLE */}
                                                    <TableCell className="px-4 py-4">
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <Select
                                                                value={order.estado_pedido}
                                                                onValueChange={async (value) => {
                                                                    const result = await updateOrder(order.id, { estado_pedido: value });
                                                                    if (result.data) {
                                                                        setLocalOrders(prev => prev.map(o =>
                                                                            o.id === order.id ? { ...o, estado_pedido: value } : o
                                                                        ));
                                                                        // Actualizar sidebar si esta orden está seleccionada
                                                                        if (selectedOrder?.id === order.id) {
                                                                            setSelectedOrder((prev: any) => prev ? { ...prev, estado_pedido: value } : null);
                                                                        }
                                                                        toast.success("Estado de pedido actualizado");
                                                                    } else {
                                                                        toast.error(result.error || "Error al actualizar");
                                                                    }
                                                                }}
                                                                disabled={!canUpdate}
                                                            >
                                                                <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg px-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="h-2 w-2 rounded-full flex-shrink-0"
                                                                            style={{ backgroundColor: getStatusColor(order.estado_pedido, 'order') }}
                                                                        />
                                                                        <span className="text-sm font-medium truncate">
                                                                            {getStatusName(order.estado_pedido, 'order')}
                                                                        </span>
                                                                    </div>
                                                                </SelectTrigger>
                                                                <SelectContent position="popper" align="start">
                                                                    {orderStatuses.map((status) => (
                                                                        <SelectItem key={status.id} value={status.id}>
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className="h-2 w-2 rounded-full"
                                                                                    style={{ backgroundColor: status.color }}
                                                                                />
                                                                                {status.name}
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </TableCell>

                                                    {/* Estado de Pago - EDITABLE */}
                                                    <TableCell className="px-4 py-4">
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <Select
                                                                value={order.estado_pago}
                                                                onValueChange={async (value) => {
                                                                    const result = await updateOrder(order.id, { estado_pago: value });
                                                                    if (result.data) {
                                                                        setLocalOrders(prev => prev.map(o =>
                                                                            o.id === order.id ? { ...o, estado_pago: value } : o
                                                                        ));
                                                                        // Actualizar sidebar si esta orden está seleccionada
                                                                        if (selectedOrder?.id === order.id) {
                                                                            setSelectedOrder((prev: any) => prev ? { ...prev, estado_pago: value } : null);
                                                                        }
                                                                        toast.success("Estado de pago actualizado");
                                                                    } else {
                                                                        toast.error(result.error || "Error al actualizar");
                                                                    }
                                                                }}
                                                                disabled={!canUpdate}
                                                            >
                                                                <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg px-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="h-2 w-2 rounded-full flex-shrink-0"
                                                                            style={{ backgroundColor: getStatusColor(order.estado_pago, 'payment') }}
                                                                        />
                                                                        <span className="text-sm font-medium truncate">
                                                                            {getStatusName(order.estado_pago, 'payment')}
                                                                        </span>
                                                                    </div>
                                                                </SelectTrigger>
                                                                <SelectContent position="popper" align="start">
                                                                    {paymentStatuses.map((status) => (
                                                                        <SelectItem key={status.id} value={status.id}>
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className="h-2 w-2 rounded-full"
                                                                                    style={{ backgroundColor: status.color }}
                                                                                />
                                                                                {status.name}
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </TableCell>

                                                    {/* Total */}
                                                    <TableCell className="px-4 py-4 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm font-semibold text-green-600 dark:text-green-500 tabular-nums">
                                                                S/ {Number(order.total).toFixed(2)}
                                                            </span>
                                                            {Number(order.monto_faltante) > 0 && (
                                                                <span className="text-[10px] font-medium text-red-600 dark:text-red-500 tabular-nums tracking-tight">
                                                                    Faltante: S/ {Number(order.monto_faltante).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    {/* Acciones */}
                                                    <TableCell className="px-4 py-4 text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all mx-auto"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuItem onClick={() => setOrderToEdit(order)}>
                                                                    <Settings className="h-4 w-4 mr-2" />
                                                                    Editar Orden
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => window.open(`/ticket/${order.id}`, '_blank')}>
                                                                    <Receipt className="h-4 w-4 mr-2" />
                                                                    Boleta Térmica
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => window.open(`/shipping-guide/${order.id}`, '_blank')}>
                                                                    <FileText className="h-4 w-4 mr-2" />
                                                                    Guía de Envío
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {canDelete && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => setOrderToDelete(order.id)}
                                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                </div>

                {/* Panel de Detalles al mismo plano */}
                {selectedOrder && (
                    <div className="w-[40%] lg:w-[30%] border rounded-lg border-border/50 bg-card shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col h-full bg-background overflow-y-auto">
                            <div className="sticky top-0 z-10 p-6 border-b bg-muted/10 backdrop-blur-md flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="flex items-center gap-3 text-lg font-medium">
                                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                            <ShoppingBag className="h-5 w-5 opacity-70" />
                                        </div>
                                        Detalles de la Orden
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-muted-foreground/60 uppercase bg-muted px-2 py-0.5 rounded">
                                            OF-{selectedOrder.id.slice(0, 8).toUpperCase()}
                                        </span>
                                        <div
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: getStatusColor(selectedOrder.estado_pedido, 'order') }}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {getStatusName(selectedOrder.estado_pedido, 'order')}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedOrder(null)}
                                    className="h-8 w-8 rounded-full hover:bg-muted"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                {/* 1. Comentarios / Notas */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Notas del pedido</h4>
                                    <div className="space-y-2">
                                        <textarea
                                            className="w-full min-h-[80px] bg-transparent border border-input rounded-md p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all resize-none"
                                            placeholder="Añadir una nota interna..."
                                            value={noteDraft}
                                            onChange={(e) => setNoteDraft(e.target.value)}
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={handleSaveNote}
                                                disabled={isSavingNote || noteDraft === (selectedOrder.notas || "")}
                                                className="h-8"
                                            >
                                                {isSavingNote ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                                                Guardar nota
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* 2. Productos y Resumen - Estilo Boleta */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">
                                        Detalle de Venta
                                    </h4>

                                    {/* Lista de productos estilo boleta */}
                                    <div className="space-y-2">
                                        {selectedOrder.items?.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium leading-tight">
                                                        {item.product_id?.nombre}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.cantidad} × S/ {Number(item.precio_unitario).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-semibold tabular-nums">
                                                        S/ {Number(item.subtotal).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Línea divisoria */}
                                    <div className="border-t border-dashed border-border/60 my-3" />

                                    {/* Subtotales */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Subtotal productos</span>
                                            <span className="tabular-nums font-medium">
                                                S/ {(Number(selectedOrder.total) - (selectedOrder.tipo_cobro_envio === 'destino' ? 0 : Number(selectedOrder.costo_envio || 0))).toFixed(2)}
                                            </span>
                                        </div>

                                        {selectedOrder.configurar_envio && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">
                                                    Costo de envío
                                                    {selectedOrder.tipo_cobro_envio === 'destino' && (
                                                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                                                            A destino
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="tabular-nums font-medium">
                                                    {selectedOrder.tipo_cobro_envio === 'destino'
                                                        ? 'S/ 0.00'
                                                        : `S/ ${Number(selectedOrder.costo_envio || 0).toFixed(2)}`
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {/* Adelanto */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Adelanto</span>
                                            <span className="tabular-nums font-medium">
                                                S/ {Number(selectedOrder.monto_adelanto).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Faltante */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Faltante</span>
                                            <span className="tabular-nums font-medium">
                                                S/ {Number(selectedOrder.monto_faltante).toFixed(2)}
                                            </span>
                                        </div>


                                    </div>

                                    {/* Línea divisoria doble */}
                                    <div className="border-t-2 border-border/70 my-3" />

                                    {/* Total */}
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm font-bold">TOTAL</span>
                                        <span className="text-base font-bold tabular-nums text-primary">
                                            S/ {Number(selectedOrder.total).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Método de pago */}
                                    <div className="flex justify-between items-center text-sm pb-3 border-b border-dashed border-border/60">
                                        <span className="text-muted-foreground">Método de pago</span>
                                        <span className="font-semibold">
                                            {(() => {
                                                // Si es un objeto con name, usarlo directamente
                                                if (typeof selectedOrder.metodo_pago === 'object' && selectedOrder.metodo_pago?.name) {
                                                    return selectedOrder.metodo_pago.name;
                                                }
                                                // Si es un string (UUID), buscar en paymentMethods
                                                if (typeof selectedOrder.metodo_pago === 'string') {
                                                    const method = paymentMethods.find(m => m.id === selectedOrder.metodo_pago);
                                                    return method?.name || selectedOrder.metodo_pago;
                                                }
                                                return '-';
                                            })()}
                                        </span>

                                    </div>
                                </div>

                                <Separator />

                                {/* 3. Destinatario */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Destinatario</h4>
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Nombre completo</dt>
                                            <dd>{selectedOrder.cliente_id?.nombre_completo || "-"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Celular</dt>
                                            <dd>{selectedOrder.cliente_id?.telefono || "-"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">DNI / RUC</dt>
                                            <dd>{selectedOrder.cliente_id?.documento_identificacion || "-"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Tipo</dt>
                                            <dd className="capitalize">{selectedOrder.cliente_id?.tipo_cliente || "Natural"}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <Separator />

                                {/* 4. Entrega */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Entrega</h4>
                                    <div className="text-sm space-y-1.5">
                                        <p>
                                            {selectedOrder.distrito || "-"} — {selectedOrder.provincia || "-"} — {selectedOrder.departamento || "-"}
                                        </p>
                                        {selectedOrder.direccion && (
                                            <p className="text-muted-foreground text-xs leading-relaxed">
                                                {selectedOrder.direccion}
                                            </p>
                                        )}
                                        {selectedOrder.ubicacion && (
                                            <a
                                                href={selectedOrder.ubicacion}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs text-blue-600 hover:underline"
                                            >
                                                Ver en mapa
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* 6. Fecha y Hora */}
                                <div className="pb-4">
                                    <p className="text-[10px] text-muted-foreground text-center">
                                        Pedido realizado el {format(new Date(selectedOrder.fecha_venta), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de eliminar esta orden?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la orden.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Popup de Edición / Detalles (Tuerca) */}
            <Dialog open={!!orderToEdit} onOpenChange={(open) => !open && setOrderToEdit(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Gestión del Pedido
                        </DialogTitle>
                        <DialogDescription>
                            Actualiza la información de entrega, pagos y detalles del pedido.
                        </DialogDescription>
                    </DialogHeader>

                    {orderToEdit && (
                        <>
                            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 -mr-2">
                                {/* ¿Quién entrega? */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Empresa de transporte</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Shalom', 'Olva', 'Dinsides'].map((courier) => (
                                            <Button
                                                key={courier}
                                                variant={orderToEdit.courier_nombre === courier ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setOrderToEdit({ ...orderToEdit, courier_nombre: courier })}
                                                className="h-8"
                                            >
                                                {courier}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* ¿Qué envías? */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Resumen de productos</Label>
                                        <Button variant="outline" size="sm" className="h-8">
                                            Editar items
                                        </Button>
                                    </div>
                                    <div className="rounded-md border divide-y bg-muted/10">
                                        {orderToEdit.items?.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center p-3 text-sm">
                                                <div>
                                                    <p className="font-medium">{item.product_id?.nombre}</p>
                                                    <p className="text-xs text-muted-foreground">S/ {Number(item.precio_unitario).toFixed(2)} x {item.cantidad}</p>
                                                </div>
                                                <p className="font-medium">S/ {Number(item.subtotal).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Observación */}
                                <div className="space-y-2">
                                    <Label htmlFor="edit-notas" className="text-sm font-medium">Observación de la orden</Label>
                                    <textarea
                                        id="edit-notas"
                                        className="w-full min-h-[80px] bg-transparent border border-input rounded-md p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all resize-none font-normal"
                                        placeholder="Escribe alguna observación o nota interna..."
                                        value={orderToEdit.notas || ""}
                                        onChange={(e) => setOrderToEdit({ ...orderToEdit, notas: e.target.value })}
                                    />
                                </div>

                                {/* Recibe */}
                                <div className="space-y-3">
                                    <Label className="text-sm">Recibe:</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Nombre</Label>
                                            <Input
                                                value={orderToEdit.cliente_id?.nombre_completo || ""}
                                                onChange={(e) => {
                                                    const updated = { ...orderToEdit };
                                                    updated.cliente_id = { ...updated.cliente_id, nombre_completo: e.target.value };
                                                    setOrderToEdit(updated);
                                                }}
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Contacto (Teléfono)</Label>
                                            <Input
                                                value={orderToEdit.cliente_id?.telefono || ""}
                                                onChange={(e) => {
                                                    const updated = { ...orderToEdit };
                                                    updated.cliente_id = { ...updated.cliente_id, telefono: e.target.value };
                                                    setOrderToEdit(updated);
                                                }}
                                                className="h-10"
                                                placeholder="999 999 999"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Destino */}
                                <div className="space-y-3">
                                    <Label className="text-sm">Destino:</Label>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Departamento</Label>
                                            <Input
                                                value={orderToEdit.departamento || ""}
                                                onChange={(e) => setOrderToEdit({ ...orderToEdit, departamento: e.target.value })}
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground">Provincia</Label>
                                                <Input
                                                    value={orderToEdit.provincia || ""}
                                                    onChange={(e) => setOrderToEdit({ ...orderToEdit, provincia: e.target.value })}
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground">Distrito</Label>
                                                <Input
                                                    value={orderToEdit.distrito || ""}
                                                    onChange={(e) => setOrderToEdit({ ...orderToEdit, distrito: e.target.value })}
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Dirección</Label>
                                            <Input
                                                value={orderToEdit.direccion || ""}
                                                onChange={(e) => setOrderToEdit({ ...orderToEdit, direccion: e.target.value })}
                                                className="h-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Pagos y Balance */}
                                <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-8 items-start">
                                        <div className="space-y-2">
                                            <Label className="text-sm">Método de pago</Label>
                                            <Select
                                                value={typeof orderToEdit.metodo_pago === 'object' ? orderToEdit.metodo_pago?.id : orderToEdit.metodo_pago}
                                                onValueChange={(val) => setOrderToEdit({ ...orderToEdit, metodo_pago: val })}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethods.map((method) => (
                                                        <SelectItem key={method.id} value={method.id}>
                                                            {method.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Total Venta</p>
                                            <p className="text-2xl font-semibold tracking-tight">S/ {Number(orderToEdit.total).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 items-end">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Adelanto</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">S/</span>
                                                <Input
                                                    type="number"
                                                    value={orderToEdit.monto_adelanto}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setOrderToEdit({
                                                            ...orderToEdit,
                                                            monto_adelanto: val,
                                                            monto_faltante: Math.max(0, Number(orderToEdit.total) - val)
                                                        });
                                                    }}
                                                    className="h-10 pl-8 text-sm font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-destructive">Faltante</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-destructive">S/</span>
                                                <Input
                                                    readOnly
                                                    className="h-10 pl-8 text-sm font-medium text-right text-destructive bg-destructive/5"
                                                    value={Number(orderToEdit.monto_faltante).toFixed(2)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Vouchers (POS Style) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Camera className="h-4 w-4" />
                                            <Label className="text-sm font-semibold">Comprobantes de Pago</Label>
                                        </div>

                                        {(orderToEdit.voucher ? (Array.isArray(orderToEdit.voucher) ? orderToEdit.voucher : [orderToEdit.voucher]) : []).length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 border p-2 rounded-xl bg-muted/5 min-h-[60px]">
                                                {(orderToEdit.voucher ? (Array.isArray(orderToEdit.voucher) ? orderToEdit.voucher : [orderToEdit.voucher]) : []).map((v: any) => {
                                                    const fileId = typeof v === 'object' ? v.directus_files_id : v;
                                                    if (!fileId) return null;
                                                    return (
                                                        <div key={fileId} className="aspect-square relative rounded-lg overflow-hidden border group bg-background">
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}?width=100&height=100&fit=cover`}
                                                                alt="Voucher"
                                                                fill
                                                                className="object-cover cursor-pointer"
                                                                onClick={() => window.open(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}`, '_blank')}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveVoucher(orderToEdit, fileId)}
                                                                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="relative group">
                                            <Input
                                                type="file"
                                                id="voucher-upload-edit"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleVoucherUpload(e, orderToEdit)}
                                                disabled={isUploadingVoucher === orderToEdit.id}
                                            />
                                            <Label
                                                htmlFor="voucher-upload-edit"
                                                className={cn(
                                                    "flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                                                    (orderToEdit.voucher ? (Array.isArray(orderToEdit.voucher) ? orderToEdit.voucher : [orderToEdit.voucher]) : []).length > 0
                                                        ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
                                                        : "border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/30",
                                                    isUploadingVoucher === orderToEdit.id && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {isUploadingVoucher === orderToEdit.id ? (
                                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="h-5 w-5 text-muted-foreground/40 mb-1 group-hover:text-primary transition-colors" />
                                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase group-hover:text-primary transition-colors">
                                                            {(orderToEdit.voucher ? (Array.isArray(orderToEdit.voucher) ? orderToEdit.voucher : [orderToEdit.voucher]) : []).length > 0 ? "Agregar más imágenes" : "Subir Comprobante(s)"}
                                                        </span>
                                                    </div>
                                                )}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex justify-between mt-6">
                                <Button variant="outline" onClick={() => setOrderToEdit(null)}>
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={async () => {
                                        try {
                                            // Preparar datos del cliente
                                            const clienteData: any = {};
                                            if (orderToEdit.cliente_id?.nombre_completo) {
                                                clienteData.nombre_completo = orderToEdit.cliente_id.nombre_completo;
                                            }
                                            if (orderToEdit.cliente_id?.telefono) {
                                                clienteData.telefono = orderToEdit.cliente_id.telefono;
                                            }

                                            // Actualizar cliente si hay cambios
                                            if (Object.keys(clienteData).length > 0 && orderToEdit.cliente_id?.id) {
                                                // Agregar workspace_id para la validación de permisos
                                                clienteData.workspace_id = orderToEdit.workspace_id;
                                                const clientResult = await updateClient(orderToEdit.cliente_id.id, clienteData);
                                                if (clientResult.error) {
                                                    toast.error(`Error al actualizar cliente: ${clientResult.error}`);
                                                    return;
                                                }
                                                console.log('Cliente actualizado:', clientResult.data);
                                            }


                                            // Actualizar orden
                                            const orderUpdateData: any = {
                                                courier_nombre: orderToEdit.courier_nombre,
                                                notas: orderToEdit.notas,
                                                departamento: orderToEdit.departamento,
                                                provincia: orderToEdit.provincia,
                                                distrito: orderToEdit.distrito,
                                                direccion: orderToEdit.direccion,
                                                monto_adelanto: orderToEdit.monto_adelanto,
                                                monto_faltante: orderToEdit.monto_faltante,
                                            };

                                            // Solo incluir metodo_pago si tiene un ID válido (UUID)
                                            if (orderToEdit.metodo_pago) {
                                                // Si es un objeto con id, usar el id
                                                if (typeof orderToEdit.metodo_pago === 'object' && orderToEdit.metodo_pago.id) {
                                                    orderUpdateData.metodo_pago = orderToEdit.metodo_pago.id;
                                                }
                                                // Si es directamente un string (UUID), usarlo
                                                else if (typeof orderToEdit.metodo_pago === 'string') {
                                                    orderUpdateData.metodo_pago = orderToEdit.metodo_pago;
                                                }
                                            }


                                            const orderResult = await updateOrder(orderToEdit.id, orderUpdateData);


                                            if (orderResult.error) {
                                                toast.error(`Error al actualizar orden: ${orderResult.error}`);
                                                return;
                                            }

                                            console.log('Orden actualizada:', orderResult.data);

                                            // Actualizar estado local
                                            setLocalOrders(prev => prev.map(o =>
                                                o.id === orderToEdit.id ? orderToEdit : o
                                            ));

                                            // Actualizar sidebar si esta orden está seleccionada
                                            if (selectedOrder?.id === orderToEdit.id) {
                                                setSelectedOrder(orderToEdit);
                                            }

                                            toast.success("Pedido actualizado con éxito");
                                            setOrderToEdit(null);
                                        } catch (error) {
                                            toast.error("Error al actualizar el pedido");
                                            console.error(error);
                                        }
                                    }}
                                >
                                    Guardar Cambios
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
