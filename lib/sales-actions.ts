"use server";

import { directus } from "@/lib/directus";
import { readItems, aggregate } from "@directus/sdk";

interface SalesData {
    date: string;
    total: number;
    count?: number; // Agregamos contador de órdenes
}

export async function getSalesData(workspaceId: string, days: number = 90) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get all orders for the workspace within the date range
        const orders = await directus.request(
            readItems("orders", {
                filter: {
                    workspace_id: {
                        _eq: workspaceId,
                    },
                    fecha_venta: {
                        _gte: startDate.toISOString(),
                        _lte: endDate.toISOString(),
                    },
                },
                fields: ["fecha_venta", "total"],
                sort: ["fecha_venta"],
            })
        );

        // Group by date and sum totals + count orders
        const salesByDate = new Map<string, { total: number; count: number }>();

        orders.forEach((order) => {
            const date = new Date(order.fecha_venta).toISOString().split("T")[0];
            const current = salesByDate.get(date) || { total: 0, count: 0 };
            salesByDate.set(date, {
                total: current.total + (order.total || 0),
                count: current.count + 1,
            });
        });

        // Fill in missing dates with 0
        const result: SalesData[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split("T")[0];
            const data = salesByDate.get(dateStr) || { total: 0, count: 0 };
            result.push({
                date: dateStr,
                total: data.total,
                count: data.count,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            success: true,
            data: result,
        };
    } catch (error: any) {
        console.error("Error fetching sales data:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch sales data",
            data: [],
        };
    }
}

export async function getSalesStats(workspaceId: string) {
    try {
        const result = await directus.request(
            aggregate("orders", {
                aggregate: {
                    sum: ["total"],
                    count: ["id"],
                },
                query: {
                    filter: {
                        workspace_id: {
                            _eq: workspaceId,
                        },
                    },
                },
            })
        );

        return {
            success: true,
            data: {
                totalRevenue: result[0]?.sum?.total || 0,
                totalOrders: result[0]?.count?.id || 0,
            },
        };
    } catch (error: any) {
        console.error("Error fetching sales stats:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch sales stats",
            data: {
                totalRevenue: 0,
                totalOrders: 0,
            },
        };
    }
}

// Nueva función: Top productos más vendidos
export async function getTopProducts(workspaceId: string, limit: number = 5) {
    try {
        const orders = await directus.request(
            readItems("orders", {
                filter: {
                    workspace_id: {
                        _eq: workspaceId,
                    },
                },
                fields: ["items.product_id.nombre", "items.product_id.id", "items.cantidad"],
            })
        );

        // Agrupar por producto y sumar cantidades
        const productMap = new Map<string, { name: string; quantity: number }>();

        orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
                if (item.product_id) {
                    const productId = item.product_id.id;
                    const productName = item.product_id.nombre;
                    const current = productMap.get(productId) || { name: productName, quantity: 0 };
                    productMap.set(productId, {
                        name: productName,
                        quantity: current.quantity + (item.cantidad || 0),
                    });
                }
            });
        });

        // Convertir a array y ordenar por cantidad
        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);

        return {
            success: true,
            data: topProducts,
        };
    } catch (error: any) {
        console.error("Error fetching top products:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch top products",
            data: [],
        };
    }
}

// Nueva función: Ventas por vendedor (user_created)
export async function getSalesByUser(workspaceId: string) {
    try {
        const orders = await directus.request(
            readItems("orders", {
                filter: {
                    workspace_id: {
                        _eq: workspaceId,
                    },
                },
                fields: ["user_created.first_name", "user_created.last_name", "user_created.id", "total"],
            })
        );

        // Agrupar por usuario y sumar totales
        const userMap = new Map<string, { name: string; total: number; count: number }>();

        orders.forEach((order: any) => {
            if (order.user_created) {
                const userId = order.user_created.id;
                const userName = `${order.user_created.first_name || ""} ${order.user_created.last_name || ""}`.trim() || "Usuario";
                const current = userMap.get(userId) || { name: userName, total: 0, count: 0 };
                userMap.set(userId, {
                    name: userName,
                    total: current.total + (order.total || 0),
                    count: current.count + 1,
                });
            }
        });

        // Convertir a array y ordenar por total
        const salesByUser = Array.from(userMap.values())
            .sort((a, b) => b.total - a.total);

        return {
            success: true,
            data: salesByUser,
        };
    } catch (error: any) {
        console.error("Error fetching sales by user:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch sales by user",
            data: [],
        };
    }
}
