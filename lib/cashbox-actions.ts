"use server";

import { directus, directusAdmin } from "./directus";
import { readItems, createItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { getMyPermissions } from "./rbac-actions";

export async function getCashboxTransactions(workspaceId: string) {
    try {
        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("cashbox.read")) {
            return { data: [], error: "No tienes permiso para ver movimientos de caja" };
        }

        const transactions = await directusAdmin.request(
            readItems("cashbox", {
                filter: {
                    workspace_id: { _eq: workspaceId }
                },
                sort: ["-date_created"]
            })
        );
        return { data: transactions as any[], error: null };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { data: null, error: "Error al cargar los movimientos" };
    }
}

export async function createTransaction(data: {
    workspace_id: string;
    tipo: "ingreso" | "egreso";
    monto: number;
    descripcion?: string;
    metodo_pago: "cash" | "card" | "transfer";
}) {
    try {
        // Verificar permisos
        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("cashbox.create")) {
            return { data: null, error: "No tienes permiso para registrar movimientos de caja" };
        }

        // Asegurar que el egreso sea siempre negativo
        const finalAmount = data.tipo === "egreso" ? -Math.abs(data.monto) : Math.abs(data.monto);

        const transaction = await directusAdmin.request(
            createItem("cashbox", {
                workspace_id: data.workspace_id,
                tipo: data.tipo,
                monto: finalAmount,
                descripcion: data.descripcion,
                metodo_pago: data.metodo_pago,
                status: "published"
            })
        );

        revalidatePath(`/dashboard/${data.workspace_id}/cashbox`);
        return { data: transaction, error: null };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { data: null, error: "Error al registrar el movimiento" };
    }
}
