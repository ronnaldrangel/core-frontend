"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Box, Clock, TrendingUp, Package, UserCheck, CreditCard, ShoppingBag, Receipt, AlertCircle } from "lucide-react"
import { SalesChart } from "@/components/dashboard/sales-chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface DashboardContentProps {
    workspace: any
    initialSalesData: Array<{
        date: string
        total: number
        net?: number
        count?: number
        items_count?: number
        pending?: number
    }>
    topProducts: Array<{
        name: string
        quantity: number
    }>
    salesByUser: Array<{
        name: string
        total: number
        count: number
    }>
}

type DatePreset = "today" | "yesterday" | "7d" | "30d" | "90d" | "custom"

export function DashboardContent({ workspace, initialSalesData, topProducts, salesByUser }: DashboardContentProps) {
    const [datePreset, setDatePreset] = React.useState<DatePreset>("90d")
    const [dateFrom, setDateFrom] = React.useState("")
    const [dateTo, setDateTo] = React.useState("")

    // El color del workspace
    const themeColor = workspace.color || "#6366F1"

    // Filtrar datos según el rango de tiempo seleccionado
    const filteredData = React.useMemo(() => {
        if (!initialSalesData || initialSalesData.length === 0) return []

        if (datePreset === "custom") {
            if (!dateFrom && !dateTo) return initialSalesData

            const start = dateFrom ? new Date(dateFrom) : new Date(0)
            const end = dateTo ? new Date(dateTo) : new Date()

            return initialSalesData.filter((item) => {
                const itemDate = new Date(item.date)
                return itemDate >= start && itemDate <= end
            })
        }

        // Hoy
        if (datePreset === "today") {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            return initialSalesData.filter((item) => {
                const itemDate = new Date(item.date)
                return itemDate >= today && itemDate < tomorrow
            })
        }

        // Ayer
        if (datePreset === "yesterday") {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            return initialSalesData.filter((item) => {
                const itemDate = new Date(item.date)
                return itemDate >= yesterday && itemDate < today
            })
        }

        // Rangos predefinidos
        const daysMap = {
            "7d": 7,
            "30d": 30,
            "90d": 90,
        }

        const days = daysMap[datePreset as keyof typeof daysMap] || 90
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        const endDate = new Date()

        return initialSalesData.filter((item) => {
            const itemDate = new Date(item.date)
            return itemDate >= startDate && itemDate <= endDate
        })
    }, [initialSalesData, datePreset, dateFrom, dateTo])

    // Calcular estadísticas basadas en datos filtrados
    const stats = React.useMemo(() => {
        const result = filteredData.reduce((acc, item) => {
            return {
                totalRevenue: acc.totalRevenue + (Number(item?.total) || 0),
                totalNet: acc.totalNet + (Number(item?.net) || 0),
                totalOrders: acc.totalOrders + (Number(item?.count) || 0),
                totalPending: acc.totalPending + (Number(item?.pending) || 0),
            }
        }, { totalRevenue: 0, totalNet: 0, totalOrders: 0, totalPending: 0 })

        const ticketPromedio = result.totalOrders > 0
            ? result.totalRevenue / result.totalOrders
            : 0

        return {
            ...result,
            ticketPromedio
        }
    }, [filteredData])

    // Configuración del gráfico de cantidad de ventas
    const ordersChartConfig = {
        count: {
            label: "Cantidad",
            color: themeColor,
        },
    } satisfies ChartConfig

    return (
        <div className="space-y-6">
            {/* Header con nombre del workspace y selector de tiempo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm text-white text-xl"
                            style={{ backgroundColor: themeColor }}
                        >
                            {workspace.icon === 'boxes' ? <Box className="h-5 w-5" /> : (workspace.name?.[0]?.toUpperCase() || "W")}
                        </div>
                        {workspace.name}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {workspace.description || "Vista general de tu espacio de trabajo."}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground/70" />
                    <Select value={datePreset} onValueChange={(val: DatePreset) => setDatePreset(val)}>
                        <SelectTrigger className="h-10 w-[200px] bg-muted/10 border-border/40 font-medium rounded-lg">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="yesterday">Ayer</SelectItem>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                            <SelectItem value="90d">Últimos 3 meses</SelectItem>
                            <SelectItem value="custom">Rango personalizado</SelectItem>
                        </SelectContent>
                    </Select>

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
                </div>
            </div>

            {/* Quick Stats Grid - 5 CARDS CON ESTILO UNIFORME */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* 1. Ingreso Bruto */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingreso Bruto</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Ventas totales bruta
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Ingreso Neto */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingreso Neto</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {stats.totalNet.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            (Total - Envíos)
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Abono Faltante */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Abono Faltante</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {stats.totalPending.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Pendiente por cobrar
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Número de Ventas */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes registradas
                        </p>
                    </CardContent>
                </Card>

                {/* 5. Ticket Promedio */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" style={{ color: themeColor }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {stats.ticketPromedio.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Promedio por orden
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <SalesChart
                    data={filteredData}
                    workspaceId={workspace.id}
                    externalTimeRange={datePreset === "custom" ? "custom" : datePreset}
                    onTimeRangeChange={(val) => setDatePreset(val as DatePreset)}
                    themeColor={themeColor}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" style={{ color: themeColor }} />
                            Ventas en el Tiempo (Órdenes)
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Total: {stats.totalOrders} órdenes
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={ordersChartConfig} className="h-[300px] w-full">
                            <BarChart data={filteredData}>
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("es-PE", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    fill={themeColor}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" style={{ color: themeColor }} />
                            Comparación de Ventas por Vendedor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[100px]">Vendedor</TableHead>
                                        <TableHead className="text-center">Ventas</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesByUser && salesByUser.length > 0 ? (
                                        salesByUser.map((user, index) => (
                                            <TableRow key={index} className="group">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                                                            style={{ backgroundColor: themeColor }}
                                                        >
                                                            {user.name[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium truncate max-w-[120px]">{user.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                    {user.count} ventas
                                                </TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums text-sm whitespace-nowrap">
                                                    S/ {Number(user.total || 0).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-sm text-muted-foreground text-center py-4">
                                                No hay datos de ventas por vendedor
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" style={{ color: themeColor }} />
                            Top Productos Más Vendidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[50px]">Pos.</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-right">Cantidad</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topProducts && topProducts.length > 0 ? (
                                        topProducts.map((product, index) => (
                                            <TableRow key={index} className="group">
                                                <TableCell className="text-center">
                                                    <div
                                                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0"
                                                        style={{ backgroundColor: themeColor }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium line-clamp-1">{product.name}</span>
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    <span className="text-sm font-semibold" style={{ color: themeColor }}>
                                                        {product.quantity} uds.
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-sm text-muted-foreground text-center py-4">
                                                No hay datos de productos vendidos
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
