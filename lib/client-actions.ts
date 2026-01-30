"use server";

import { directus, directusAdmin } from "./directus";
import { readItems, createItem, updateItem, deleteItem, readItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { getMyPermissions } from "./rbac-actions";

export interface Client {
    id: string;
    workspace_id: string;
    status: string;
    nombre_completo: string;
    email: string | null;
    telefono: string | null;
    direccion: string | null;
    documento_identificacion: string | null;
    tipo_cliente: string;
    distrito: string | null;
    provincia: string | null;
    departamento: string | null;
    date_created?: string;
}

export async function getClientsByWorkspace(workspaceId: string) {
    try {
        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("clients.read")) {
            return { data: [], error: "No tienes permiso para ver clientes" };
        }

        console.log(`Buscando clientes para el workspace: ${workspaceId}`);
        const clients = await directusAdmin.request(
            readItems("clients", {
                filter: {
                    workspace_id: { _eq: workspaceId }
                },
                fields: ["*"],
                sort: ["nombre_completo"]
            })
        );

        const data = clients as Client[];
        console.log(`Se encontraron ${data.length} clientes`);
        return { data, error: null };
    } catch (error: any) {
        console.error("Error fetching clients:", error);
        return {
            data: [],
            error: error.message || "Error al cargar los clientes"
        };
    }
}

export async function createClient(data: Partial<Client>) {
    try {
        if (!data.workspace_id) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("clients.create")) {
            return { data: null, error: "No tienes permiso para crear clientes" };
        }

        const client = await directusAdmin.request(
            createItem("clients", data)
        );
        revalidatePath(`/dashboard`);
        return { data: client as Client, error: null };
    } catch (error) {
        console.error("Error creating client:", error);
        return { data: null, error: "Error al crear el cliente" };
    }
}

export async function updateClient(id: string, data: Partial<Client>) {
    try {
        if (!data.workspace_id) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(data.workspace_id);
        if (!permissions.includes("*") && !permissions.includes("clients.update")) {
            return { data: null, error: "No tienes permiso para actualizar clientes" };
        }

        const client = await directusAdmin.request(
            updateItem("clients", id, data)
        );
        revalidatePath(`/dashboard`);
        return { data: client as Client, error: null };
    } catch (error) {
        console.error("Error updating client:", error);
        return { data: null, error: "Error al actualizar el cliente" };
    }
}

export async function deleteClient(id: string) {
    try {
        const client = await directusAdmin.request(readItem("clients", id, { fields: ["workspace_id"] }));
        if (!client) return { error: "Cliente no encontrado" };

        // Verificar permisos
        const permissions = await getMyPermissions((client as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("clients.delete")) {
            return { error: "No tienes permiso para eliminar clientes" };
        }

        await directusAdmin.request(deleteItem("clients", id));
        revalidatePath(`/dashboard`);
        return { error: null };
    } catch (error) {
        console.error("Error deleting client:", error);
        return { error: "Error al eliminar el cliente" };
    }
}

/**
 * Verificar si un DNI/RUC ya existe en un workspace
 * @param workspaceId - ID del workspace
 * @param dni - DNI/RUC a verificar
 * @param excludeClientId - ID del cliente a excluir (útil para ediciones)
 * @returns true si el DNI ya existe, false si está disponible
 */
export async function checkDniExists(
    workspaceId: string,
    dni: string,
    excludeClientId?: string
): Promise<boolean> {
    try {
        if (!dni || dni.trim() === "") {
            return false;
        }

        const filter: any = {
            workspace_id: { _eq: workspaceId },
            documento_identificacion: { _eq: dni.trim() }
        };

        // Si estamos editando, excluir el cliente actual
        if (excludeClientId) {
            filter.id = { _neq: excludeClientId };
        }

        const clients = await directusAdmin.request(
            readItems("clients", {
                filter,
                fields: ["id"],
                limit: 1
            })
        );

        return clients.length > 0;
    } catch (error) {
        console.error("Error checking DNI:", error);
        return false;
    }
}

export interface ReniecResponse {
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    full_name: string;
    document_number: string;
}

/**
 * Consultar datos de una persona por DNI usando la API de RENIEC (Decolecta)
 * @param dni - Número de DNI (8 dígitos)
 * @returns Datos de la persona o null si no se encuentra
 */
export async function lookupDni(dni: string): Promise<ReniecResponse | null> {
    try {
        // Validar que el DNI tenga 8 dígitos
        if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
            return null;
        }

        const token = process.env.DECOLECTA_API_TOKEN;

        if (!token) {
            console.error("DECOLECTA_API_TOKEN no está configurado");
            return null;
        }

        const response = await fetch(
            `https://api.decolecta.com/v1/reniec/dni?numero=${dni}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            console.error("Error en la consulta de DNI:", response.status);
            return null;
        }

        const data = await response.json();

        // Verificar si hay error en la respuesta
        if (data.error) {
            console.error("Error de API:", data.error);
            return null;
        }

        return data as ReniecResponse;
    } catch (error) {
        console.error("Error consultando DNI:", error);
        return null;
    }
}

/**
 * Obtener un cliente por su DNI/RUC en un workspace
 */
export async function getClientByDni(workspaceId: string, dni: string) {
    try {
        if (!dni) return null;

        const clients = await directusAdmin.request(
            readItems("clients", {
                filter: {
                    workspace_id: { _eq: workspaceId },
                    documento_identificacion: { _eq: dni }
                },
                fields: ["*"],
                limit: 1
            })
        );

        return clients.length > 0 ? (clients[0] as Client) : null;
    } catch (error) {
        console.error("Error fetching client by DNI:", error);
        return null;
    }
}
