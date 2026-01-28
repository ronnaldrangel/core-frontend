"use server";

import { directus } from "@/lib/directus";
import { readItems, aggregate } from "@directus/sdk";

interface SalesData {
    date: string;
    total: number;
    net?: number;
    count?: number; // Cantidad de órdenes
    items_count?: number; // Cantidad de productos (unidades)
    pending?: number; // Abono faltante
}

export async function getSalesData(workspaceId: string, days: number = 90) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get all orders for the workspace within the date range
        // Agregamos costo_envio para calcular el neto e items para las unidades
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
                fields: [
                    "fecha_venta",
                    "total",
                    "costo_envio",
                    "monto_faltante",
                    { items: ["cantidad"] }
                ],
                sort: ["fecha_venta"],
            })
        );

        // Group by date and sum totals + count orders + items + pending
        const salesByDate = new Map<string, { total: number; net: number; count: number; items_count: number; pending: number }>();

        orders.forEach((order: any) => {
            const date = new Date(order.fecha_venta).toISOString().split("T")[0];
            const current = salesByDate.get(date) || { total: 0, net: 0, count: 0, items_count: 0, pending: 0 };

            const orderTotal = Number(order.total) || 0;
            const orderShipping = Number(order.costo_envio) || 0;
            const orderPending = Number(order.monto_faltante) || 0;
            const orderNet = orderTotal - orderShipping;

            const orderItemsCount = order.items?.reduce((acc: number, item: any) => acc + (Number(item.cantidad) || 0), 0) || 0;

            salesByDate.set(date, {
                total: current.total + orderTotal,
                net: current.net + orderNet,
                count: current.count + 1,
                items_count: current.items_count + orderItemsCount,
                pending: current.pending + orderPending,
            });
        });

        // Fill in missing dates with 0
        const result: SalesData[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split("T")[0];
            const data = salesByDate.get(dateStr) || { total: 0, net: 0, count: 0, items_count: 0, pending: 0 };
            result.push({
                date: dateStr,
                total: data.total,
                net: data.net,
                count: data.count,
                items_count: data.items_count,
                pending: data.pending,
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

// Top productos más vendidos
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

        const productMap = new Map<string, { name: string; quantity: number }>();

        orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
                if (item.product_id) {
                    const productId = item.product_id.id;
                    const productName = item.product_id.nombre;
                    const current = productMap.get(productId) || { name: productName, quantity: 0 };
                    productMap.set(productId, {
                        name: productName,
                        quantity: current.quantity + (Number(item.cantidad) || 0),
                    });
                }
            });
        });

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

// Ventas por vendedor (user_created)
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

        const userMap = new Map<string, { name: string; total: number; count: number }>();

        orders.forEach((order: any) => {
            if (order.user_created) {
                const userId = order.user_created.id;
                const userName = `${order.user_created.first_name || ""} ${order.user_created.last_name || ""}`.trim() || "Usuario";
                const current = userMap.get(userId) || { name: userName, total: 0, count: 0 };
                userMap.set(userId, {
                    name: userName,
                    total: current.total + (Number(order.total) || 0),
                    count: current.count + 1,
                });
            }
        });

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
