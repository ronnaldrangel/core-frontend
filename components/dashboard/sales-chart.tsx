"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface SalesChartProps {
    data: Array<{
        date: string
        total: number
    }>
    workspaceId: string
    externalTimeRange?: string
    onTimeRangeChange?: (value: string) => void
    themeColor?: string
}

export function SalesChart({
    data,
    workspaceId,
    externalTimeRange,
    onTimeRangeChange,
    themeColor = "hsl(var(--primary))"
}: SalesChartProps) {
    const isMobile = useIsMobile()
    const [internalTimeRange, setInternalTimeRange] = React.useState("90d")

    const chartConfig = {
        ingresos: {
            label: "Ingresos",
        },
        total: {
            label: "Total",
            color: themeColor,
        },
    } satisfies ChartConfig

    // Usar el timeRange externo si está disponible, si no usar el interno
    const timeRange = externalTimeRange || internalTimeRange

    const handleTimeRangeChange = (value: string) => {
        if (onTimeRangeChange) {
            onTimeRangeChange(value)
        } else {
            setInternalTimeRange(value)
        }
    }

    React.useEffect(() => {
        if (isMobile && !externalTimeRange) {
            setInternalTimeRange("7d")
        }
    }, [isMobile, externalTimeRange])

    const filteredData = React.useMemo(() => {
        if (!data || data.length === 0) return []

        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)

        return data.filter((item) => {
            const date = new Date(item.date)
            return date >= startDate
        })
    }, [data, timeRange])

    const totalRevenue = React.useMemo(() => {
        return filteredData.reduce((acc, item) => {
            const value = Number(item?.total) || 0;
            return acc + value;
        }, 0);
    }, [filteredData]);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Ingresos por Ventas</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Total: S/ {totalRevenue.toFixed(2)}
                    </span>
                    <span className="@[540px]/card:hidden">Gráfico de ventas</span>
                </CardDescription>
                {!externalTimeRange && (
                    <CardAction>
                        <ToggleGroup
                            type="single"
                            value={timeRange}
                            onValueChange={handleTimeRangeChange}
                            variant="outline"
                            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                        >
                            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
                            <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
                            <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
                        </ToggleGroup>
                        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                            <SelectTrigger
                                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                                size="sm"
                                aria-label="Seleccionar período"
                            >
                                <SelectValue placeholder="Últimos 3 meses" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="rounded-lg">
                                    Últimos 3 meses
                                </SelectItem>
                                <SelectItem value="30d" className="rounded-lg">
                                    Últimos 30 días
                                </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                    Últimos 7 días
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </CardAction>
                )}
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={themeColor}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={themeColor}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("es-ES", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("es-ES", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                    formatter={(value, name) => (
                                        <>
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                S/
                                                <span className="font-normal text-muted-foreground">
                                                    {" "}
                                                </span>
                                                {Number(value).toFixed(2)}
                                            </div>
                                        </>
                                    )}
                                />
                            }
                        />
                        <Area
                            dataKey="total"
                            type="natural"
                            fill="url(#fillTotal)"
                            stroke={themeColor}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
