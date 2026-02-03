"use server";

import { directus, directusAdmin } from "./directus";
import { readItems } from "@directus/sdk";
import { getMyPermissions } from "./rbac-actions";

export async function getOrdersByWorkspace(workspaceId: string) {
    try {
        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("orders.read")) {
            return { data: [], error: "No tienes permiso para ver el historial de pedidos" };
        }

        const orders = await directusAdmin.request(
            readItems("orders", {
                filter: {
                    workspace_id: { _eq: workspaceId }
                },
                fields: [
                    "*",
                    { cliente_id: ["nombre_completo", "documento_identificacion", "email", "telefono"] },
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
