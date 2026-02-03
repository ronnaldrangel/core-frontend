"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Wallet,
    CreditCard,
    AlertCircle,
    TrendingUp,
    Calendar,
    ChevronDown
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { format, isWithinInterval, startOfDay, endOfDay, subDays, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

interface OrderAnalyticsProps {
    orders: any[];
    orderStatuses: any[];
    themeColor?: string;
}

type DatePreset = "today" | "yesterday" | "3days" | "7days" | "month" | "all";

export function OrderAnalytics({ orders, orderStatuses, themeColor = "#6366F1" }: OrderAnalyticsProps) {
    const [datePreset, setDatePreset] = useState<DatePreset>("month");

    const filteredOrders = useMemo(() => {
        if (datePreset === "all") return orders;

        const now = new Date();
        let start: Date;
        let end: Date = endOfDay(now);

        if (datePreset === "today") {
            start = startOfDay(now);
        } else if (datePreset === "yesterday") {
            start = startOfDay(subDays(now, 1));
            end = endOfDay(subDays(now, 1));
        } else if (datePreset === "3days") {
            start = startOfDay(subDays(now, 2));
        } else if (datePreset === "7days") {
            start = startOfDay(subDays(now, 6));
        } else if (datePreset === "month") {
            start = startOfMonth(now);
        } else {
            return orders;
        }

        return orders.filter(order => {
            const orderDate = new Date(order.fecha_venta);
            return isWithinInterval(orderDate, { start, end });
        });
    }, [orders, datePreset]);

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

            if (statusValue && acc.counts[statusValue] !== undefined) {
                acc.counts[statusValue] += 1;
            }

            return acc;
        }, { neto: 0, faltante: 0, adelantos: 0, ventas: 0, counts });
    }, [filteredOrders, orderStatuses]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Análisis de Pedidos</h2>
                    <p className="text-muted-foreground text-sm">
                        Resumen estadístico del rendimiento de tus ventas.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={datePreset} onValueChange={(val: DatePreset) => setDatePreset(val)}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={4}>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="yesterday">Ayer</SelectItem>
                            <SelectItem value="3days">Últimos 3 días</SelectItem>
                            <SelectItem value="7days">Últimos 7 días</SelectItem>
                            <SelectItem value="month">Este mes</SelectItem>
                            <SelectItem value="all">Todo el tiempo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tarjetas Principales Monetarias */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ingreso Neto</CardTitle>
                        <Wallet className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums">S/ {stats.neto.toFixed(2)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Neto real (Sin envíos)
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ingreso en Caja</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">S/ {stats.adelantos.toFixed(2)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Total Adelantos Recibidos
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Abono Faltante</CardTitle>
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-500">S/ {stats.faltante.toFixed(2)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Pendiente por Cobrar
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Resumen de Estados Dinámico Estilo Shadcn UI */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Estado de la Operación
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {orderStatuses.map((status) => (
                        <Card key={status.value} className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: status.color }}>
                            <CardContent className="p-4 flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-muted-foreground truncate">{status.name}</span>
                                <span className="text-sm font-bold tabular-nums">{stats.counts[status.value] || 0}</span>
                            </CardContent>
                        </Card>
                    ))}
                    <Card className="hover:shadow-md transition-shadow bg-muted/20 border-l-4 border-l-primary">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Total Pedidos</span>
                            <span className="text-sm font-bold tabular-nums">{stats.ventas}</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
