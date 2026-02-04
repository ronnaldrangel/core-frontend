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
    MoreVertical
} from "lucide-react";
import Image from "next/image";
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from "@/lib/peru-locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteOrder, updateOrder, OrderStatus, PaymentStatus, CourierType } from "@/lib/order-actions";
import { uploadFile } from "@/lib/product-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
    themeColor?: string;
}
type DatePreset = "all" | "yesterday" | "today" | "3days" | "7days" | "month" | "custom";


export function OrderTable({ orders, orderStatuses, paymentStatuses, couriers, themeColor = "#6366F1" }: OrderTableProps) {
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploadingVoucher, setIsUploadingVoucher] = useState<string | null>(null);
    const [editingAmounts, setEditingAmounts] = useState<Record<string, { monto_adelanto?: string; monto_faltante?: string }>>({});
    const [isSavingAmounts, setIsSavingAmounts] = useState<string | null>(null);

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

            // Obtener vouchers actuales
            const currentVouchers = Array.isArray(order.voucher) ? order.voucher : [];

            // Preparar el array para Directus M2M
            // Nota: order.voucher viene del readItems con fields "voucher.*", 
            // así que ya son objetos de la tabla intermedia si se cargaron bien, 
            // o IDs si no se expandieron. Pero en lib/order-history-actions.ts pusimos "voucher.*".

            const junctionItems = currentVouchers.map((v: any) => ({
                directus_files_id: typeof v === 'object' ? v.directus_files_id : v
            }));

            // Agregar el nuevo
            junctionItems.push({ directus_files_id: newVoucherId });

            const updateResult = await updateOrder(order.id, {
                voucher: junctionItems
            });

            if (updateResult.error) {
                toast.error(`Error al actualizar la orden: ${updateResult.error}`);
            } else {
                toast.success("Comprobante agregado correctamente");
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
            // Obtener vouchers actuales
            const currentVouchers = Array.isArray(order.voucher) ? order.voucher : [];

            // Filtrar el que queremos eliminar
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
        <div className="space-y-4">
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
                                const isExpanded = !!expandedRows[order.id];
                                return (
                                    <Fragment key={order.id}>
                                        <TableRow className="group hover:bg-muted/30 transition-colors">
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
                                                <Select
                                                    value={order.estado_pedido}
                                                    onValueChange={async (value) => {
                                                        const result = await updateOrder(order.id, { estado_pedido: value });
                                                        if (result.data) {
                                                            setLocalOrders(prev => prev.map(o =>
                                                                o.id === order.id ? { ...o, estado_pedido: value } : o
                                                            ));
                                                            toast.success("Estado de pedido actualizado");
                                                        } else {
                                                            toast.error(result.error || "Error al actualizar");
                                                        }
                                                    }}
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
                                            </TableCell>

                                            {/* Estado de Pago - EDITABLE */}
                                            <TableCell className="px-4 py-4">
                                                <Select
                                                    value={order.estado_pago}
                                                    onValueChange={async (value) => {
                                                        const result = await updateOrder(order.id, { estado_pago: value });
                                                        if (result.data) {
                                                            setLocalOrders(prev => prev.map(o =>
                                                                o.id === order.id ? { ...o, estado_pago: value } : o
                                                            ));
                                                            toast.success("Estado de pago actualizado");
                                                        } else {
                                                            toast.error(result.error || "Error al actualizar");
                                                        }
                                                    }}
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
                                            <TableCell className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleRow(order.id)}
                                                        className={cn(
                                                            "h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all",
                                                            isExpanded && "text-primary bg-primary/10"
                                                        )}
                                                        title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
                                                    >
                                                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem onClick={() => window.open(`/ticket/${order.id}`, '_blank')}>
                                                                <Receipt className="h-4 w-4 mr-2" />
                                                                Boleta Térmica
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => window.open(`/shipping-guide/${order.id}`, '_blank')}>
                                                                <FileText className="h-4 w-4 mr-2" />
                                                                Guía de Envío
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setOrderToDelete(order.id)}
                                                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {isExpanded && (
                                            <TableRow className="bg-muted/20">
                                                <TableCell colSpan={8} className="p-6">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-300">
                                                        {/* Detalle de Productos */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase opacity-70">
                                                                <Package className="h-4 w-4 text-primary" /> Detalle de Productos
                                                            </div>
                                                            <div className="space-y-2">
                                                                {order.items?.map((item: any) => (
                                                                    <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-card rounded-lg border border-border/50 shadow-sm">
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold tracking-tight">{item.product_id?.nombre}</span>
                                                                            <span className="text-[10px] text-muted-foreground font-medium tracking-tight">
                                                                                Cant: {item.cantidad} x S/ {Number(item.precio_unitario).toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                        <span className="font-semibold text-xs tabular-nums text-primary/80">S/ {Number(item.subtotal).toFixed(2)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Logística y Envío */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase opacity-70">
                                                                <Truck className="h-4 w-4 text-primary" /> Logística y Envío
                                                            </div>
                                                            <div className="bg-card p-5 rounded-lg border border-border/50 shadow-sm space-y-4">
                                                                <div className="space-y-2">
                                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-50">Contacto Cliente</p>
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-center text-xs">
                                                                            <span className="text-muted-foreground">{order.cliente_id?.tipo_cliente === 'empresa' ? 'RUC:' : 'DNI/RUC:'}</span>
                                                                            <span className="font-semibold">{order.cliente_id?.documento_identificacion || "-"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center text-xs">
                                                                            <span className="text-muted-foreground">Tipo:</span>
                                                                            <span className="font-semibold capitalize">{order.cliente_id?.tipo_cliente || "persona"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center text-xs">
                                                                            <span className="text-muted-foreground">Nombre Completo:</span>
                                                                            <span className="font-semibold text-right max-w-[180px] truncate">{order.cliente_id?.nombre_completo || "-"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center text-xs">
                                                                            <span className="text-muted-foreground">Teléfono:</span>
                                                                            <span className="font-semibold">{order.cliente_id?.telefono || "-"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {(order.departamento || order.provincia || order.distrito || order.direccion || order.ubicacion || order.fecha_entrega) && (
                                                                    <>
                                                                        <Separator className="bg-border/40" />
                                                                        <div className="space-y-2">
                                                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-50">Localización y Entrega</p>
                                                                            <div className="space-y-2">
                                                                                {order.fecha_entrega && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Fecha Entrega:</span>
                                                                                        <span className="font-semibold">{format(new Date(order.fecha_entrega), "dd 'de' MMM, yyyy", { locale: es })}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.departamento && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Departamento:</span>
                                                                                        <span className="font-semibold">{order.departamento}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.provincia && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Provincia:</span>
                                                                                        <span className="font-semibold">{order.provincia}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.distrito && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Distrito:</span>
                                                                                        <span className="font-semibold">{order.distrito}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.direccion && (
                                                                                    <div className="flex flex-col gap-1 text-xs">
                                                                                        <span className="text-muted-foreground">Dirección:</span>
                                                                                        <span className="font-semibold bg-muted/30 p-2 rounded border border-border/20">{order.direccion}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.ubicacion && (
                                                                                    <div className="flex flex-col gap-2 pt-1">
                                                                                        <div className="flex justify-between items-center text-xs">
                                                                                            <span className="text-muted-foreground">Ubicación GPS / Referencia:</span>
                                                                                        </div>
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            className="w-full h-8 text-[10px] uppercase font-bold gap-2"
                                                                                            onClick={() => {
                                                                                                const url = order.ubicacion.startsWith('http')
                                                                                                    ? order.ubicacion
                                                                                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.ubicacion)}`;
                                                                                                window.open(url, '_blank');
                                                                                            }}
                                                                                        >
                                                                                            <MapPin className="h-3 w-3" />
                                                                                            Ver Mapa
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {order.configurar_envio && (
                                                                    <>
                                                                        <Separator className="bg-border/40" />
                                                                        <div className="space-y-2">
                                                                            <div className="space-y-2">
                                                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-50">Datos del Courier</p>
                                                                                <div className="space-y-2">
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Agencia:</span>
                                                                                        <span className="font-semibold">{order.courier_nombre || "-"}</span>
                                                                                    </div>
                                                                                    {order.courier_provincia_dpto && (
                                                                                        <div className="flex justify-between items-center text-xs">
                                                                                            <span className="text-muted-foreground">Departamento:</span>
                                                                                            <span className="font-semibold">{order.courier_provincia_dpto}</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {order.courier_destino_agencia && (
                                                                                        <div className="flex justify-between items-start text-xs">
                                                                                            <span className="text-muted-foreground">Destino:</span>
                                                                                            <span className="font-semibold text-right max-w-[140px]">{order.courier_destino_agencia}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <Separator className="bg-border/40" />
                                                                        <div className="space-y-2">
                                                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-50">Seguimiento</p>
                                                                            <div className="space-y-2">
                                                                                {order.courier_nro_orden && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">N° Orden:</span>
                                                                                        <span className="font-semibold">{order.courier_nro_orden}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.courier_codigo && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Código:</span>
                                                                                        <span className="font-semibold">{order.courier_codigo}</span>
                                                                                    </div>
                                                                                )}
                                                                                {order.courier_clave && (
                                                                                    <div className="flex justify-between items-center text-xs">
                                                                                        <span className="text-muted-foreground">Clave:</span>
                                                                                        <span className="font-semibold">{order.courier_clave}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Resumen de Operación */}
                                                        <div className="space-y-6">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase opacity-70">
                                                                    <Receipt className="h-4 w-4 text-primary" /> Resumen de Operación
                                                                </div>
                                                                <div className="bg-card p-5 rounded-lg border border-border/50 shadow-sm space-y-4">
                                                                    <div className="space-y-3">
                                                                        <div className="flex justify-between items-center text-xs">
                                                                            <span className="text-muted-foreground font-semibold">Método de Pago:</span>
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md border font-medium">
                                                                                <CreditCard className="h-3 w-3 text-primary" />
                                                                                {typeof order.metodo_pago === 'object' ? order.metodo_pago.name : getPaymentMethodLabel(order.metodo_pago)}
                                                                            </div>
                                                                        </div>
                                                                        <Separator className="bg-border/40" />
                                                                        <div className="space-y-1.5">
                                                                            <div className="flex justify-between text-[11px] font-semibold tracking-tight">
                                                                                <span className="text-muted-foreground opacity-60">Subtotal de Productos:</span>
                                                                                <span>S/ {(order.items?.reduce((acc: number, item: any) => acc + Number(item.subtotal), 0) || 0).toFixed(2)}</span>
                                                                            </div>

                                                                            {Number(order.ajuste_total) !== 0 && (
                                                                                <div className="flex justify-between text-[11px] font-semibold tracking-tight">
                                                                                    <span className="text-muted-foreground opacity-60">
                                                                                        {Number(order.ajuste_total) < 0 ? "Descuento Aplicado:" : "Cargo Adicional:"}
                                                                                    </span>
                                                                                    <span className={Number(order.ajuste_total) < 0 ? "text-green-600" : "text-destructive"}>
                                                                                        {Number(order.ajuste_total) < 0 ? `- S/ ${Math.abs(order.ajuste_total).toFixed(2)}` : `+ S/ ${Number(order.ajuste_total).toFixed(2)}`}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {Number(order.costo_envio) > 0 && (
                                                                                <div className="flex justify-between text-[11px] font-semibold tracking-tight">
                                                                                    <span className="text-muted-foreground opacity-60 flex items-center gap-1">
                                                                                        Envío {order.tipo_cobro_envio === 'destino' ? '(Pago Destino)' : '(Prepagado)'}:
                                                                                    </span>
                                                                                    <span className={order.tipo_cobro_envio === 'destino' ? "text-muted-foreground/50 line-through" : ""}>
                                                                                        S/ {Number(order.costo_envio).toFixed(2)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <Separator className="bg-border/60" />
                                                                    <div className="flex justify-between text-[11px] font-bold tracking-tight pt-1">
                                                                        <span className="text-muted-foreground opacity-60">Total Final:</span>
                                                                        <span className="text-foreground">S/ {Number(order.total).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                                    </div>

                                                                    <div className="space-y-3">
                                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 border-y border-dashed border-border/50">
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium">Adelanto</Label>
                                                                                <div className="relative">
                                                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">S/</span>
                                                                                    <Input
                                                                                        type="number"
                                                                                        step="0.01"
                                                                                        placeholder="0.00"
                                                                                        value={
                                                                                            editingAmounts[order.id]?.monto_adelanto !== undefined
                                                                                                ? (editingAmounts[order.id]?.monto_adelanto === '0' || editingAmounts[order.id]?.monto_adelanto === '0.00' ? '' : editingAmounts[order.id]?.monto_adelanto)
                                                                                                : (order.monto_adelanto && Number(order.monto_adelanto) > 0 ? Number(order.monto_adelanto).toFixed(2) : '')
                                                                                        }
                                                                                        onChange={(e) => handleAmountChange(order.id, 'monto_adelanto', e.target.value, Number(order.total))}
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
                                                                                        type="number"
                                                                                        step="0.01"
                                                                                        placeholder="0.00"
                                                                                        value={
                                                                                            editingAmounts[order.id]?.monto_faltante !== undefined
                                                                                                ? editingAmounts[order.id]?.monto_faltante
                                                                                                : (order.monto_faltante && order.monto_faltante > 0 ? Number(order.monto_faltante).toFixed(2) : '')
                                                                                        }
                                                                                        className="h-10 pl-8 text-sm font-medium text-right text-destructive bg-destructive/5 cursor-default"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {editingAmounts[order.id] && (
                                                                            <Button
                                                                                onClick={() => handleSaveAmounts(order.id)}
                                                                                disabled={isSavingAmounts === order.id}
                                                                                className="w-full"
                                                                            >
                                                                                {isSavingAmounts === order.id ? (
                                                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                                                ) : (
                                                                                    <span className="flex items-center gap-2">
                                                                                        <CreditCard className="h-4 w-4" />
                                                                                        Guardar Pagos
                                                                                    </span>
                                                                                )}
                                                                            </Button>
                                                                        )}
                                                                    </div>

                                                                    {/* Comprobantes / Vouchers */}
                                                                    <div className="space-y-3 pt-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                                                                                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                                                                                Comprobantes de Adelanto
                                                                            </div>

                                                                            <div className="relative">
                                                                                <Input
                                                                                    type="file"
                                                                                    id={`history-voucher-${order.id}`}
                                                                                    className="hidden"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleVoucherUpload(e, order)}
                                                                                    disabled={isUploadingVoucher === order.id}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`history-voucher-${order.id}`}
                                                                                    className={cn(
                                                                                        "flex items-center gap-1.5 px-2 py-1 rounded-md border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all text-[10px] font-bold uppercase text-primary",
                                                                                        isUploadingVoucher === order.id && "opacity-50 cursor-not-allowed"
                                                                                    )}
                                                                                >
                                                                                    {isUploadingVoucher === order.id ? (
                                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                                    ) : (
                                                                                        <Plus className="h-3 w-3" />
                                                                                    )}
                                                                                    Subir Más
                                                                                </Label>
                                                                            </div>
                                                                        </div>

                                                                        {order.voucher && (Array.isArray(order.voucher) ? order.voucher.length > 0 : !!order.voucher) ? (
                                                                            <div className="grid grid-cols-3 gap-2">
                                                                                {(() => {
                                                                                    const vouchers = Array.isArray(order.voucher) ? order.voucher : [order.voucher];
                                                                                    return vouchers.map((v: any, idx: number) => {
                                                                                        const fileId = typeof v === 'object' ? v.directus_files_id : v;
                                                                                        if (!fileId) return null;
                                                                                        return (
                                                                                            <div key={fileId || idx} className="group relative aspect-square rounded-md overflow-hidden border border-border/50 bg-muted/30 hover:border-primary/50 transition-colors shadow-sm">
                                                                                                <Image
                                                                                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}?width=150&height=150&fit=cover`}
                                                                                                    alt={`Voucher ${idx + 1}`}
                                                                                                    fill
                                                                                                    className="object-cover"
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                                                                    <a
                                                                                                        href={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}`}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                                                                                                        title="Ver imagen"
                                                                                                    >
                                                                                                        <ExternalLink className="h-4 w-4 text-white" />
                                                                                                    </a>
                                                                                                    <button
                                                                                                        onClick={() => handleRemoveVoucher(order, fileId)}
                                                                                                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                                                                                                        title="Eliminar comprobante"
                                                                                                    >
                                                                                                        <X className="h-4 w-4 text-white" />
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    });
                                                                                })()}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex flex-col items-center justify-center py-6 border rounded-md border-dashed border-muted-foreground/20 bg-muted/5">
                                                                                <Camera className="h-6 w-6 text-muted-foreground/20 mb-2" />
                                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold opacity-40">Sin comprobantes</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de eliminar esta orden?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la orden y sus items permanentemente del sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
