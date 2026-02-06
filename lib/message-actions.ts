"use server";

import { directusAdmin } from "@/lib/directus";
import { createItem, readItems } from "@directus/sdk";
import { getMyPermissions } from "./rbac-actions";
import { revalidatePath } from "next/cache";
import type { OrderMessage } from "@/types/messages";

/**
 * Crear un nuevo mensaje en un pedido
 */
import { auth } from "@/auth";
import { createDirectus, rest, staticToken } from "@directus/sdk";

/**
 * Crear un nuevo mensaje en un pedido
 */
export async function createOrderMessage(data: {
    order_id: string;
    message: string;
    workspace_id: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session.access_token) {
            return { data: null, error: "Usuario no autenticado" };
        }

        if (!data.workspace_id) {
            return { data: null, error: "Workspace no especificado" };
        }

        // Verificar permisos (opcional si confiamos en los permisos de Directus, pero buena práctica mantenerlo)
        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("orders.read")) {
            return { data: null, error: "No tienes permiso para enviar mensajes" };
        }

        // Crear cliente temporal con el token del usuario
        const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
        const userClient = createDirectus(directusUrl)
            .with(staticToken(session.access_token))
            .with(rest());

        // Crear mensaje usando el cliente del usuario
        // Directus asignará automáticamente user_created al usuario del token
        const message = await userClient.request(
            createItem("order_messages", {
                order_id: data.order_id,
                message: data.message,
                workspace_id: data.workspace_id,
            })
        );

        revalidatePath(`/dashboard`);
        return { data: message, error: null };
    } catch (error: any) {
        console.error("Error creating message:", error);
        return { data: null, error: error.message || "Error al crear mensaje" };
    }
}

/**
 * Obtener mensajes de un pedido
 */
export async function getOrderMessages(orderId: string, workspaceId: string) {
    try {
        if (!workspaceId) {
            return { data: null, error: "Workspace no especificado" };
        }

        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("orders.read")) {
            return { data: null, error: "No tienes permiso para ver mensajes" };
        }

        const messages = await directusAdmin.request<OrderMessage[]>(
            readItems("order_messages", {
                filter: {
                    order_id: { _eq: orderId },
                    workspace_id: { _eq: workspaceId },
                },
                fields: [
                    "*",
                    {
                        user_created: ["id", "first_name", "last_name", "email", "avatar"],
                    },
                ],
                sort: ["date_created"],
            })
        );

        return { data: messages, error: null };
    } catch (error: any) {
        console.error("Error fetching messages:", error);
        return { data: null, error: error.message || "Error al obtener mensajes" };
    }
}

/**
 * Obtener pedidos con sus últimos mensajes para la lista
 */
export async function getOrdersWithMessages(workspaceId: string) {
    try {
        if (!workspaceId) {
            return { data: null, error: "Workspace no especificado" };
        }

        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("orders.read")) {
            return { data: null, error: "No tienes permiso para ver pedidos" };
        }

        const orders = await directusAdmin.request(
            readItems("orders", {
                filter: {
                    workspace_id: { _eq: workspaceId },
                },
                fields: [
                    "id",
                    "correlativo",
                    "total",
                    "estado_pedido",
                    "date_created",
                    { cliente_id: ["nombre_completo"] },
                    {
                        messages: [
                            "id",
                            "message",
                            "date_created",
                            { user_created: ["first_name", "last_name"] },
                        ],
                    },
                ],
                sort: ["-date_created"],
                limit: 50,
            })
        );

        return { data: orders, error: null };
    } catch (error: any) {
        console.error("Error fetching orders with messages:", error);
        return { data: null, error: error.message || "Error al obtener pedidos" };
    }
}
