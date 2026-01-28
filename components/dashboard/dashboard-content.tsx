"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Box, Clock, TrendingUp, Package, UserCheck } from "lucide-react"
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

interface DashboardContentProps {
    workspace: any
    initialSalesData: Array<{
        date: string
        total: number
        count?: number
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

        // Hoy - solo las ventas de hoy
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

        // Ayer - solo las ventas de ayer
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

        // Rangos predefinidos (7d, 30d, 90d)
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
        const totalRevenue = filteredData.reduce((acc, item) => {
            return acc + (Number(item?.total) || 0)
        }, 0)

        const totalOrders = filteredData.filter(item => item.total > 0).length

        const averagePerDay = filteredData.length > 0
            ? totalRevenue / filteredData.length
            : 0

        return {
            totalRevenue,
            totalOrders,
            averagePerDay,
        }
    }, [filteredData])

    // Configuración del gráfico de cantidad de ventas
    const ordersChartConfig = {
        count: {
            label: "Cantidad",
            color: "hsl(var(--chart-2))",
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
                            style={{ backgroundColor: workspace.color || "#6366F1" }}
                        >
                            {workspace.icon === 'boxes' ? <Box className="h-5 w-5" /> : (workspace.name?.[0]?.toUpperCase() || "W")}
                        </div>
                        {workspace.name}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {workspace.description || "Vista general de tu espacio de trabajo."}
                    </p>
                </div>

                {/* Selector de período al estilo de historial de ventas */}
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

            {/* Quick Stats Grid - CARDS QUE RESPONDEN AL FILTRO */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Total de Ingresos */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            En el período seleccionado
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Total de Órdenes */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes con ventas
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: Promedio por Día */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {stats.averagePerDay.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Ingreso promedio por día
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row - Ingresos y Cantidad de Ventas */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Sales Chart (Ingresos) */}
                <SalesChart
                    data={filteredData}
                    workspaceId={workspace.id}
                    externalTimeRange={datePreset === "custom" ? "custom" : datePreset}
                    onTimeRangeChange={(val) => setDatePreset(val as DatePreset)}
                />

                {/* Cantidad de Ventas en el Tiempo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Cantidad de Ventas en el Tiempo
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Total: {filteredData.reduce((acc, item) => acc + (item.count || 0), 0)} órdenes
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
                                    fill="var(--color-count)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row - Ventas por Vendedor y Top Productos */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Comparación de Ventas por Vendedor */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Comparación de Ventas por Vendedor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {salesByUser && salesByUser.length > 0 ? (
                                salesByUser.map((user, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                                                {user.name[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.count} ventas</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold">S/ {Number(user.total || 0).toFixed(2)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No hay datos de ventas por vendedor
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Productos Más Vendidos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Top Productos Más Vendidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts && topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm font-medium">{product.name}</p>
                                        </div>
                                        <p className="text-sm font-semibold">{product.quantity} unidades</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No hay datos de productos vendidos
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
