"use server";

import { directus } from "./directus";
import { createItem, createItems } from "@directus/sdk";
import { revalidatePath } from "next/cache";

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
    metodo_pago: string;
    status: string;
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
    items?: OrderItem[];
}

export async function createOrder(orderData: Partial<Order>, items: OrderItem[]) {
    try {
        // 1. Crear la orden principal
        const order = await directus.request(
            createItem("orders", {
                workspace_id: orderData.workspace_id,
                cliente_id: orderData.cliente_id,
                total: orderData.total,
                metodo_pago: orderData.metodo_pago,
                status: "paid",
                fecha_venta: new Date().toISOString(),
                estado_pago: orderData.estado_pago || "pendiente",
                estado_pedido: orderData.estado_pedido || "preparando",
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
            })
        );

        // 2. Crear los items de la orden vinculados al ID de la orden creada
        const itemsWithOrderId = items.map(item => ({
            ...item,
            order_id: (order as any).id
        }));

        await directus.request(createItems("order_items", itemsWithOrderId));

        revalidatePath(`/dashboard`);
        return { data: order, error: null };
    } catch (error: any) {
        console.error("Error creating order:", error);
        return { data: null, error: "Error al procesar la venta" };
    }
}
