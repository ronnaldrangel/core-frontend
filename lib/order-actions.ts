"use server";

import { directus, directusAdmin } from "./directus";
import { createItem, createItems, readItems, readItem, updateItem, deleteItem, deleteItems } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { getMyPermissions } from "./rbac-actions";

export interface OrderItem {
    id?: string;
    order_id?: string;
    product_id: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    variante_seleccionada?: string;
}

export interface Order {
    id: string;
    workspace_id: string;
    cliente_id: string | any;
    metodo_pago: string | any;
    fecha_venta: string;
    total: number;
    monto_adelanto: number;
    monto_faltante: number;
    estado_pago: string;
    estado_pedido: string;
    voucher: any;
    items?: OrderItem[];
    // Logística
    provincia?: string;
    departamento?: string;
    distrito?: string;
    direccion?: string;
    courier_nombre?: string;
    configurar_envio?: boolean;
    tipo_cobro_envio?: string;
    costo_envio?: number;
    courier_destino_agencia?: string;
    courier_nro_orden?: string;
    courier_codigo?: string;
    courier_clave?: string;
}

export interface OrderStatus {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
    default_message?: string;
}

export interface PaymentStatus {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
}

export interface CourierType {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
}

export interface PaymentMethod {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
}

export async function createOrder(data: any) {
    try {
        const { items = [], numero_correlativo, ...orderData } = data;

        // Eliminamos el split('T')[0] que causaba desfases de zona horaria (mostraba el día anterior)
        // Directus manejará el timestamp correctamente si enviamos el ISO string completo o el default NOW()
        if (!orderData.fecha_venta) {
            // Si no viene fecha, dejamos que el default de Directus actúe o podríamos asignar new Date()
        }

        if (!orderData.workspace_id) {
            return { data: null, error: "Workspace ID es requerido" };
        }

        // 1. Verificar permisos
        const permissions = await getMyPermissions(orderData.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("orders.create")) {
            return { data: null, error: "No tienes permiso para crear pedidos" };
        }

        // 2. Crear la Orden Base
        // 1. Preparar los items para creación anidada en Directus
        // Esto es más robusto y atómico que crear el pedido y luego los items por separado
        const nestedItems = Array.isArray(items) ? items.map((item: any) => ({
            product_id: typeof item.product_id === 'object' ? item.product_id.id : item.product_id,
            cantidad: Number(item.cantidad || 0),
            precio_unitario: Number(item.precio_unitario || 0),
            subtotal: Number(item.subtotal || 0),
            variante_seleccionada: item.variante_seleccionada || null,
            variant_id: item.variant_id || null
        })) : [];

        console.log(`Creating order with ${nestedItems.length} items`);

        // 2. Crear el pedido con sus items en una sola operación atómica
        const order = await directusAdmin.request(createItem("orders", {
            ...orderData,
            items: nestedItems
        }, {
            fields: ["*", "items.*"]
        })) as any;

        if (!order || !order.id) {
            throw new Error("No se pudo obtener el ID del pedido creado");
        }

        // 3. Reducir stock (esto sigue siendo un paso separado)
        if (nestedItems.length > 0) {
            for (const item of nestedItems) {
                try {
                    const product = await directusAdmin.request(readItem("products", item.product_id, {
                        fields: ["id", "stock", "usar_variantes", "variantes_producto"]
                    })) as any;

                    if (product) {
                        // Lógica de variantes... (igual que antes)
                        if (item.variante_seleccionada && product.usar_variantes && product.variantes_producto) {
                            const updatedVariantes = [...product.variantes_producto];
                            const variantIndex = updatedVariantes.findIndex(
                                (v: any) => v.nombre === item.variante_seleccionada || v.id === item.variant_id
                            );

                            if (variantIndex !== -1) {
                                const currentStock = Number(updatedVariantes[variantIndex].stock || 0);
                                updatedVariantes[variantIndex].stock = Math.max(0, currentStock - item.cantidad);

                                await directusAdmin.request(updateItem("products", product.id, {
                                    variantes_producto: updatedVariantes
                                }));
                            }
                        } else {
                            // Stock general
                            const currentStock = Number(product.stock || 0);
                            await directusAdmin.request(updateItem("products", product.id, {
                                stock: Math.max(0, currentStock - item.cantidad)
                            }));
                        }
                    }
                } catch (stockError: any) {
                    console.error(`Error actualizando stock para producto ${item.product_id}:`, stockError);
                    // No relanzamos para no romper la creación del pedido si ya se guardó
                }
            }
        }

        revalidatePath(`/dashboard`, "layout");
        return { data: order, error: null };
    } catch (error: any) {
        console.error("Detailed Error creating order:", error);
        const errorMessage = error.errors?.[0]?.message || error.message || "Error al procesar la venta";
        return { data: null, error: errorMessage };
    }
}

export async function getOrderStatuses(workspaceId: string) {
    try {
        const statuses = await directusAdmin.request(
            readItems("order_statuses", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"] as any
            })
        );
        return { data: statuses as any[], error: null };
    } catch (error: any) {
        console.error("Error fetching order statuses:", error);
        return { data: [], error: error.message || "Error al cargar los estados de pedido" };
    }
}

export async function getPaymentStatuses(workspaceId: string) {
    try {
        const statuses = await directusAdmin.request(
            readItems("payment_statuses", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"] as any
            })
        );
        return { data: statuses as any[], error: null };
    } catch (error: any) {
        console.error("Error fetching payment statuses:", error);
        return { data: [], error: error.message || "Error al cargar los estados de pago" };
    }
}

export async function getCourierTypes(workspaceId: string) {
    try {
        const types = await directusAdmin.request(
            readItems("courier_types", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"] as any
            })
        );
        return { data: types as any[], error: null };
    } catch (error: any) {
        console.error("Error fetching courier types:", error);
        return { data: [], error: error.message || "Error al cargar los tipos de courier" };
    }
}

export async function getPaymentMethods(workspaceId: string) {
    try {
        const methods = await directusAdmin.request(
            readItems("payment_methods", {
                filter: { workspace_id: { _eq: workspaceId } }
            })
        );
        return { data: methods as any[], error: null };
    } catch (error: any) {
        console.error("Error fetching payment methods:", error);
        return { data: [], error: error.message || "Error al cargar los métodos de pago" };
    }
}

export async function getOrdersByWorkspace(workspaceId: string) {
    try {
        const orders = await directusAdmin.request(
            readItems("orders", {
                filter: { workspace_id: { _eq: workspaceId } },
                fields: [
                    "*",
                    "cliente_id.*",
                    "metodo_pago.*",
                    "items.*",
                    "items.id",
                    "items.cantidad",
                    "items.precio_unitario",
                    "items.subtotal",
                    "items.variante_seleccionada",
                    "items.product_id.id",
                    "items.product_id.nombre",
                    "items.product_id.sku",
                    "items.product_id.imagen"
                ],
                sort: ["-date_created"] as any
            })
        );
        return { data: orders as any[], error: null };
    } catch (error: any) {
        console.error("Error fetching orders:", error);
        return { data: [], error: error.message || "Error al cargar los pedidos" };
    }
}

export async function getOrderById(id: string) {
    try {
        const order = await directusAdmin.request(
            readItem("orders", id, {
                fields: [
                    "*",
                    "cliente_id.*",
                    "metodo_pago.*",
                    "items.*",
                    "items.id",
                    "items.cantidad",
                    "items.precio_unitario",
                    "items.subtotal",
                    "items.variante_seleccionada",
                    "items.product_id.id",
                    "items.product_id.nombre",
                    "items.product_id.sku",
                    "items.product_id.imagen"
                ]
            })
        );
        return { data: order as any, error: null };
    } catch (error: any) {
        console.error("Error fetching order by id:", error);
        return { data: null, error: "Error al obtener los detalles de la orden" };
    }
}

export async function deleteOrder(id: string) {
    try {
        const order = await directusAdmin.request(readItem("orders", id, { fields: ["workspace_id"] }));
        if (!order) return { success: false, error: "Orden no encontrada" };

        const permissions = await getMyPermissions((order as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("orders.delete")) {
            return { success: false, error: "No tienes permiso para eliminar pedidos" };
        }

        await directusAdmin.request(deleteItem("orders", id));
        revalidatePath(`/dashboard`);
        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting order:", error);
        return { success: false, error: "Error al eliminar la orden" };
    }
}

export async function updateOrder(id: string, data: any) {
    try {
        const orderRecord = await directusAdmin.request(readItem("orders", id, { fields: ["workspace_id"] }));
        if (!orderRecord) return { data: null, error: "Orden no encontrada" };

        const permissions = await getMyPermissions((orderRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("orders.update")) {
            return { data: null, error: "No tienes permiso para actualizar pedidos" };
        }

        // Clean up data to ensure it only has order fields, no items
        const { items, total, numero_correlativo, ...orderData } = data;

        const updatedOrder = await directusAdmin.request(updateItem("orders", id, orderData));

        revalidatePath(`/dashboard`);
        return { data: updatedOrder, error: null };
    } catch (error: any) {
        console.error("Error updating order:", error);
        const errorMessage = error.errors?.[0]?.message || error.message || "Error al actualizar la orden";
        return { data: null, error: errorMessage };
    }
}
