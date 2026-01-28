"use server";

import { directus } from "./directus";
import { readItems } from "@directus/sdk";

export async function getOrdersByWorkspace(workspaceId: string) {
    try {
        const orders = await directus.request(
            readItems("orders", {
                filter: {
                    workspace_id: { _eq: workspaceId }
                },
                fields: [
                    "*",
                    { cliente_id: ["nombre_completo", "documento_identificacion", "email", "telefono", "departamento", "provincia", "distrito"] },
                    { items: ["*", { product_id: ["nombre"] }] },
                    "voucher.*"
                ],
                sort: ["-fecha_venta"]
            })
        );
        return { data: orders as any[], error: null };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { data: null, error: "Error al cargar el historial" };
    }
}
