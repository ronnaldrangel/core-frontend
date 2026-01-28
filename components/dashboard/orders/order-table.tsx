"use client";

import { useState, useMemo, Fragment } from "react";
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
    Wallet
} from "lucide-react";
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from "@/lib/peru-locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteOrder, OrderStatus, PaymentStatus } from "@/lib/order-actions";
import { toast } from "sonner";
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

interface OrderTableProps {
    orders: any[];
    orderStatuses: OrderStatus[];
    paymentStatuses: PaymentStatus[];
    themeColor?: string;
}

type DatePreset = "all" | "today" | "3days" | "7days" | "month" | "custom";

export function OrderTable({ orders, orderStatuses, paymentStatuses, themeColor = "#6366F1" }: OrderTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [datePreset, setDatePreset] = useState<DatePreset>("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
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

                if (datePreset === "today") {
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
            if (selectedDepartment !== "all") {
                if (order.courier_provincia_dpto !== selectedDepartment) return false;
            }

            return true;
        });
    }, [orders, searchQuery, datePreset, dateFrom, dateTo, selectedDepartment]);

    const stats = useMemo(() => {
        return filteredOrders.reduce((acc, order) => {
            const total = Number(order.total) || 0;
            const shipping = order.tipo_cobro_envio === 'destino' ? 0 : (Number(order.costo_envio) || 0);
            const faltante = Number(order.monto_faltante) || 0;

            acc.neto += (total - shipping);
            acc.faltante += faltante;
            acc.ventas += 1;

            return acc;
        }, { neto: 0, faltante: 0, ventas: 0 });
    }, [filteredOrders]);

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
        const status = statuses.find(s => s.value === val);
        return status?.color || "#808080";
    };

    const getStatusName = (val: string, type: 'order' | 'payment') => {
        const statuses = type === 'order' ? orderStatuses : paymentStatuses;
        const status = statuses.find(s => s.value === val);
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
            {/* Estadísticas Rápidas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ingreso Neto</CardTitle>
                        <Wallet className="h-4 w-4" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight">S/ {stats.neto.toFixed(2)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            (Total - Envíos)
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Abono Faltante</CardTitle>
                        <AlertCircle className="h-4 w-4" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">S/ {stats.faltante.toFixed(2)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Pendiente por cobrar
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ventas</CardTitle>
                        <ShoppingBag className="h-4 w-4" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight">{stats.ventas}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Órdenes registradas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros y Buscador - Estilo simplificado tipo Toolbar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                        placeholder="Buscar pedido..."
                        className="pl-10 h-10 bg-muted/10 border-border/40 focus:bg-background/50 transition-all rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground/70" />
                        <Select value={datePreset} onValueChange={(val: DatePreset) => setDatePreset(val)}>
                            <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg">
                                <SelectValue placeholder="Periodo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todo el tiempo</SelectItem>
                                <SelectItem value="today">Hoy</SelectItem>
                                <SelectItem value="3days">Últimos 3 días</SelectItem>
                                <SelectItem value="7days">Últimos 7 días</SelectItem>
                                <SelectItem value="month">Este mes</SelectItem>
                                <SelectItem value="custom">Rango personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {datePreset === "custom" && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                            <Input
                                type="date"
                                className="h-10 w-[140px] bg-muted/10 border-border/40 text-xs rounded-lg"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                            <span className="text-muted-foreground text-xs font-bold">a</span>
                            <Input
                                type="date"
                                className="h-10 w-[140px] bg-muted/10 border-border/40 text-xs rounded-lg"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground/70" />
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="h-10 w-[180px] bg-muted/10 border-border/40 font-medium rounded-lg">
                                <SelectValue placeholder="Departamento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los dptos.</SelectItem>
                                {DEPARTAMENTOS.map((dep) => (
                                    <SelectItem key={dep.id} value={dep.nombre}>
                                        {dep.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg border-border/50 overflow-x-auto bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50 text-muted-foreground border-b border-border/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-4 py-4 font-medium text-sm">Fecha de Venta</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Cliente</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Destino</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Productos</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Estados</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm text-right">Total</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/50">
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
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
                                            <TableCell className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-xs font-semibold">
                                                    <CalendarIcon className="h-3.5 w-3.5" style={{ color: themeColor }} />
                                                    {format(new Date(order.fecha_venta), "dd/MM/yyyy HH:mm", { locale: es })}
                                                </div>
                                            </TableCell>
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
                                            <TableCell className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                                                    <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                                    {order.courier_provincia_dpto || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="flex flex-col gap-0.5 max-w-[240px]">
                                                    {order.items?.slice(0, 3).map((item: any) => (
                                                        <div
                                                            key={item.id}
                                                            className="text-[11px] font-medium text-muted-foreground line-clamp-1"
                                                        >
                                                            <span className="font-semibold text-primary mr-1.5 opacity-80">{item.cantidad}×</span>
                                                            <span className="capitalize">{item.product_id?.nombre.toLowerCase()}</span>
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 3 && (
                                                        <span className="text-[10px] text-primary font-bold uppercase tracking-tighter mt-1 opacity-60">
                                                            + {order.items.length - 3} items adicionales
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-2 w-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: getStatusColor(order.estado_pago, 'payment') }}
                                                        />
                                                        <span className="text-xs font-semibold tracking-tight opacity-90">
                                                            {getStatusName(order.estado_pago, 'payment')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-2 w-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: getStatusColor(order.estado_pedido, 'order') }}
                                                        />
                                                        <span className="text-xs font-semibold tracking-tight text-muted-foreground opacity-70">
                                                            {getStatusName(order.estado_pedido, 'order')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
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
                                            <TableCell className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                        onClick={() => window.open(`/ticket/${order.id}`, '_blank')}
                                                        title="Boleta Térmica"
                                                    >
                                                        <Receipt className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        onClick={() => window.open(`/shipping-guide/${order.id}`, '_blank')}
                                                        title="Guía de Envío (A4)"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                        onClick={() => toggleRow(order.id)}
                                                    >
                                                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                        onClick={() => setOrderToDelete(order.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                            <TableRow className="bg-muted/20">
                                                <TableCell colSpan={7} className="p-6">
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
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <div className="flex items-center gap-2 text-xs">
                                                                            <Phone className="h-3 w-3 text-primary/70" />
                                                                            <span>{order.cliente_id?.telefono || "Sin teléfono"}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs">
                                                                            <Mail className="h-3 w-3 text-primary/70" />
                                                                            <span className="truncate">{order.cliente_id?.email || "Sin email"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {order.configurar_envio && (
                                                                    <>
                                                                        <Separator className="bg-border/40" />
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
                                                                            {getPaymentMethodLabel(order.metodo_pago)}
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
                                                                <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10">
                                                                    <span className="text-xs font-semibold tracking-widest text-primary">Total Final</span>
                                                                    <span className="text-xl font-semibold text-primary tracking-tight tabular-nums">S/ {Number(order.total).toFixed(2)}</span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                                    <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                                                                        <p className="text-[10px] font-semibold tracking-tight text-green-600 opacity-60">Adelantado</p>
                                                                        <p className="text-sm font-semibold text-green-600 tabular-nums">S/ {Number(order.monto_adelanto || 0).toFixed(2)}</p>
                                                                    </div>
                                                                    <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                                                        <p className="text-[10px] font-semibold tracking-tight text-red-600 opacity-60">Faltante</p>
                                                                        <p className="text-sm font-semibold text-red-600 tabular-nums">S/ {Number(order.monto_faltante || 0).toFixed(2)}</p>
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
            </div >

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
        </div >
    );
}
