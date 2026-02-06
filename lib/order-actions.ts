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
    cliente_id: string | null;
    fecha_venta: string;
    total: number;
    metodo_pago: any;
    status: string;
    numero_correlativo?: number;
    estado_pago?: string;
    estado_pedido?: string;
    monto_adelanto?: number;
    monto_faltante?: number;
    configurar_envio?: boolean;
    tipo_cobro_envio?: string;
    costo_envio?: number;
    courier_nombre?: string;
    courier_provincia_dpto?: string;
    courier_destino_agencia?: string;
    courier_nro_orden?: string;
    courier_codigo?: string;
    courier_clave?: string;
    ajuste_total?: number;
    voucher?: any;
    items?: OrderItem[];
    fecha_entrega?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion?: string;
    ubicacion?: string;
    user_created?: any;
    date_created?: string;
}

export async function createOrder(orderData: Partial<Order>, items: OrderItem[]) {
    try {
        if (!orderData.workspace_id) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(orderData.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("orders.create")) {
            return { data: null, error: "No tienes permiso para crear pedidos" };
        }

        // 1. Crear la orden principal
        const order = await directusAdmin.request(
            createItem("orders", {
                workspace_id: orderData.workspace_id,
                cliente_id: orderData.cliente_id,
                total: orderData.total,
                metodo_pago: orderData.metodo_pago,
                status: "paid",
                fecha_venta: new Date().toISOString(),
                estado_pago: orderData.estado_pago,
                estado_pedido: orderData.estado_pedido,
                monto_adelanto: orderData.monto_adelanto || 0,
                monto_faltante: orderData.monto_faltante || 0,
                configurar_envio: orderData.configurar_envio || false,
                tipo_cobro_envio: orderData.tipo_cobro_envio || "adicional",
                costo_envio: orderData.costo_envio || 0,
                courier_nombre: orderData.courier_nombre,
                courier_provincia_dpto: orderData.courier_provincia_dpto,
                courier_destino_agencia: orderData.courier_destino_agencia,
                courier_nro_orden: orderData.courier_nro_orden,
                courier_codigo: orderData.courier_codigo,
                courier_clave: orderData.courier_clave,
                ajuste_total: orderData.ajuste_total || 0,
                voucher: orderData.voucher,
                fecha_entrega: orderData.fecha_entrega,
                departamento: orderData.departamento,
                provincia: orderData.provincia,
                distrito: orderData.distrito,
                direccion: orderData.direccion,
                ubicacion: orderData.ubicacion,
            })
        );

        // 2. Crear los items de la orden vinculados al ID de la orden creada
        const itemsWithOrderId = items.map(item => ({
            ...item,
            order_id: (order as any).id
        }));

        await directusAdmin.request(createItems("order_items", itemsWithOrderId));

        // 3. Reducir Stock de Productos
        for (const item of items) {
            try {
                const product = await directusAdmin.request(readItem("products", item.product_id, {
                    fields: ["id", "stock", "variantes_producto"]
                })) as any;

                if (product) {
                    const updateData: any = {};

                    if (item.variante_seleccionada && Array.isArray(product.variantes_producto)) {
                        const updatedVariantes = product.variantes_producto.map((v: any) => {
                            if (v.nombre === item.variante_seleccionada || v.sku === item.variante_seleccionada) {
                                return { ...v, stock: (Number(v.stock) || 0) - item.cantidad };
                            }
                            return v;
                        });
                        updateData.variantes_producto = updatedVariantes;
                    }

                    // Siempre intentamos reducir el stock base si existe
                    updateData.stock = (Number(product.stock) || 0) - item.cantidad;

                    await directusAdmin.request(updateItem("products", product.id, updateData));
                }
            } catch (stockError) {
                console.error(`Error actualizando stock para producto ${item.product_id}:`, stockError);
            }
        }

        revalidatePath(`/dashboard`);
        return { data: order, error: null };
    } catch (error: any) {
        console.error("Detailed Error creating order:", error);
        // Intentar obtener el mensaje de error de Directus
        const errorMessage = error.errors?.[0]?.message || error.message || "Error al procesar la venta";
        return { data: null, error: errorMessage };
    }
}

export interface OrderStatus {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
    sort?: number;
    default_message?: string;
}

export async function updateOrderStatus(id: string, data: Partial<OrderStatus>) {
    try {
        const statusRecord = await directusAdmin.request(readItem("order_statuses", id, { fields: ["workspace_id"] }));
        if (!statusRecord) return { data: null, error: "Estado no encontrado" };

        const permissions = await getMyPermissions((statusRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar configuraciones" };
        }

        const status = await directusAdmin.request(
            updateItem("order_statuses", id, data)
        );
        revalidatePath(`/dashboard`);
        return { data: status, error: null };
    } catch (error: any) {
        console.error("Error updating order status:", error);
        return { data: null, error: "Error al actualizar el estado de pedido" };
    }
}

export async function getOrderStatuses(workspaceId: string) {
    try {
        const statuses = await directusAdmin.request(
            readItems("order_statuses", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"]
            })
        );
        return { data: statuses as OrderStatus[], error: null };
    } catch (error: any) {
        console.error("Error fetching order statuses:", error);
        return { data: [], error: "Error al obtener los estados de pedido" };
    }
}

export async function createOrderStatus(data: Partial<OrderStatus>) {
    try {
        if (!data.workspace_id) return { data: null, error: "Workspace no especificado" };

        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar configuraciones" };
        }

        const status = await directusAdmin.request(
            createItem("order_statuses", data)
        );
        revalidatePath(`/dashboard`);
        return { data: status, error: null };
    } catch (error: any) {
        console.error("Error creating order status:", error);
        return { data: null, error: "Error al crear el estado de pedido" };
    }
}

export async function deleteOrderStatus(id: string) {
    try {
        const statusRecord = await directusAdmin.request(readItem("order_statuses", id, { fields: ["workspace_id"] }));
        if (!statusRecord) return { success: false, error: "Estado no encontrado" };

        const permissions = await getMyPermissions((statusRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { success: false, error: "No tienes permiso para gestionar configuraciones" };
        }

        await directusAdmin.request(deleteItem("order_statuses", id));
        revalidatePath(`/dashboard`);
        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting order status:", error);
        return { success: false, error: "Error al eliminar el estado de pedido" };
    }
}

// Payment Status Actions
export interface PaymentStatus {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
    sort?: number;
}

export async function getPaymentStatuses(workspaceId: string) {
    try {
        const statuses = await directusAdmin.request(
            readItems("payment_statuses", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"]
            })
        );
        return { data: statuses as PaymentStatus[], error: null };
    } catch (error: any) {
        console.error("Error fetching payment statuses:", error);
        return { data: [], error: "Error al obtener los estados de pago" };
    }
}

export async function createPaymentStatus(data: Partial<PaymentStatus>) {
    try {
        if (!data.workspace_id) return { data: null, error: "Workspace no especificado" };

        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar configuraciones" };
        }

        const status = await directusAdmin.request(
            createItem("payment_statuses", data)
        );
        revalidatePath(`/dashboard`);
        return { data: status, error: null };
    } catch (error: any) {
        console.error("Error creating payment status:", error);
        return { data: null, error: "Error al crear el estado de pago" };
    }
}

export async function deletePaymentStatus(id: string) {
    try {
        const statusRecord = await directusAdmin.request(readItem("payment_statuses", id, { fields: ["workspace_id"] }));
        if (!statusRecord) return { success: false, error: "Estado no encontrado" };

        const permissions = await getMyPermissions((statusRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { success: false, error: "No tienes permiso para gestionar configuraciones" };
        }

        await directusAdmin.request(deleteItem("payment_statuses", id));
        revalidatePath(`/dashboard`);
        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting payment status:", error);
        return { success: false, error: "Error al eliminar el estado de pago" };
    }
}

// Courier Type Actions
export interface CourierType {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
    sort?: number;
}

export async function getCourierTypes(workspaceId: string) {
    try {
        const types = await directusAdmin.request(
            readItems("courier_types", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"]
            })
        );
        return { data: types as CourierType[], error: null };
    } catch (error: any) {
        console.error("Error fetching courier types:", error);
        return { data: [], error: "Error al obtener los tipos de courier" };
    }
}

export async function createCourierType(data: Partial<CourierType>) {
    try {
        if (!data.workspace_id) return { data: null, error: "Workspace no especificado" };

        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar configuraciones" };
        }

        const type = await directusAdmin.request(
            createItem("courier_types", data)
        );
        revalidatePath(`/dashboard`);
        return { data: type, error: null };
    } catch (error: any) {
        console.error("Error creating courier type:", error);
        return { data: null, error: "Error al crear el tipo de courier" };
    }
}

export async function deleteCourierType(id: string) {
    try {
        const typeRecord = await directusAdmin.request(readItem("courier_types", id, { fields: ["workspace_id"] }));
        if (!typeRecord) return { success: false, error: "Tipo de courier no encontrado" };

        const permissions = await getMyPermissions((typeRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { success: false, error: "No tienes permiso para gestionar configuraciones" };
        }

        await directusAdmin.request(deleteItem("courier_types", id));
        revalidatePath(`/dashboard`);
        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting courier type:", error);
        return { success: false, error: "Error al eliminar el tipo de courier" };
    }
}

// Payment Method Actions
export interface PaymentMethod {
    id: string;
    workspace_id: string;
    name: string;
    value: string;
    color: string;
    sort?: number;
}

export async function getPaymentMethods(workspaceId: string) {
    try {
        const methods = await directusAdmin.request(
            readItems("payment_methods", {
                filter: { workspace_id: { _eq: workspaceId } },
                sort: ["sort"]
            })
        );
        return { data: methods as PaymentMethod[], error: null };
    } catch (error: any) {
        console.error("Error fetching payment methods:", error);
        return { data: [], error: "Error al obtener los métodos de pago" };
    }
}

export async function createPaymentMethod(data: Partial<PaymentMethod>) {
    try {
        if (!data.workspace_id) return { data: null, error: "Workspace no especificado" };

        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar configuraciones" };
        }

        const method = await directusAdmin.request(
            createItem("payment_methods", data)
        );
        revalidatePath(`/dashboard`);
        return { data: method, error: null };
    } catch (error: any) {
        console.error("Error creating payment method:", error);
        return { data: null, error: "Error al crear el método de pago" };
    }
}

export async function deletePaymentMethod(id: string) {
    try {
        const methodRecord = await directusAdmin.request(readItem("payment_methods", id, { fields: ["workspace_id"] }));
        if (!methodRecord) return { success: false, error: "Método no encontrado" };

        const permissions = await getMyPermissions((methodRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { success: false, error: "No tienes permiso para gestionar configuraciones" };
        }

        await directusAdmin.request(deleteItem("payment_methods", id));
        revalidatePath(`/dashboard`);
        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting payment method:", error);
        return { success: false, error: "Error al eliminar el método de pago" };
    }
}


export async function getOrderById(id: string) {
    try {
        const order = await directusAdmin.request(
            readItem("orders", id, {
                fields: ["*", { items: ["*", { product_id: ["nombre"] }] }, "cliente_id.*", "user_created.*", "metodo_pago.*"],
            })
        );

        if (!order) return { data: null, error: "Orden no encontrada" };

        // Verificar permisos
        const permissions = await getMyPermissions((order as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("orders.read")) {
            return { data: null, error: "No tienes permiso para ver esta orden" };
        }

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

        // Logic for Stock and Items
        if (data.items && Array.isArray(data.items)) {
            // 1. Get Old Items
            const oldOrder = await directusAdmin.request(readItem("orders", id, {
                fields: ["items.*"]
            })) as any;
            const oldItems = oldOrder?.items || [];

            // 2. Perform Update (Directus handles upsert of items in the array)
            const updatedOrder = await directusAdmin.request(updateItem("orders", id, data));

            // 3. Handle Deletions (Items in oldItems but not in data.items)
            const newIds = data.items.map((i: any) => i.id).filter(Boolean);
            const idsToDelete = oldItems
                .filter((old: any) => !newIds.includes(old.id))
                .map((old: any) => old.id);

            if (idsToDelete.length > 0) {
                await directusAdmin.request(deleteItems("order_items", idsToDelete));
            }

            // 4. Stock Reversion (Old Items) - Add back the old quantity
            for (const item of oldItems) {
                await updateProductStock(item.product_id, item.cantidad, item.variante_seleccionada, true);
            }

            // 5. Stock Deduction (New Items) - Subtract the new quantity
            for (const item of data.items) {
                await updateProductStock(item.product_id, item.cantidad, item.variante_seleccionada, false);
            }

            revalidatePath(`/dashboard`);
            return { data: updatedOrder, error: null };
        } else {
            // Standard update without items
            const order = await directusAdmin.request(
                updateItem("orders", id, data)
            );
            revalidatePath(`/dashboard`);
            return { data: order, error: null };
        }
    } catch (error: any) {
        console.error("Error updating order:", error);
        const errorMessage = error.errors?.[0]?.message || error.message || "Error al actualizar la orden";
        return { data: null, error: errorMessage };
    }
}

// Helper to update product stock
async function updateProductStock(productId: string | any, quantity: number, variant: string | undefined, isRevert: boolean) {
    try {
        const id = typeof productId === 'object' ? productId.id : productId;

        const product = await directusAdmin.request(readItem("products", id, {
            fields: ["id", "stock", "variantes_producto"]
        })) as any;

        if (product) {
            const updateData: any = {};
            const delta = isRevert ? quantity : -quantity; // Positive to add back, negative to subtract

            if (variant && Array.isArray(product.variantes_producto)) {
                const updatedVariantes = product.variantes_producto.map((v: any) => {
                    if (v.nombre === variant || v.sku === variant) {
                        return { ...v, stock: (Number(v.stock) || 0) + delta };
                    }
                    return v;
                });
                updateData.variantes_producto = updatedVariantes;
            }

            // Update base stock
            updateData.stock = (Number(product.stock) || 0) + delta;

            await directusAdmin.request(updateItem("products", product.id, updateData));
        }
    } catch (stockError) {
        console.error(`Error actualizando stock para producto ${productId}:`, stockError);
    }
}
