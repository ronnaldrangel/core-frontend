"use server";

import { directus } from "./directus";
import { readItems, createItem, updateItem, deleteItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";

export interface Client {
    id: string;
    workspace_id: string;
    status: string;
    nombre_completo: string;
    email: string | null;
    telefono: string | null;
    direccion: string | null;
    documento_identificacion: string | null;
    puntos_lealtad: number;
    tipo_cliente: string;
    fecha_nacimiento: string | null;
    notas_preferencias: string | null;
    date_created?: string;
}

export async function getClientsByWorkspace(workspaceId: string) {
    try {
        console.log(`Buscando clientes para el workspace: ${workspaceId}`);
        const clients = await directus.request(
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
        const client = await directus.request(
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
        const client = await directus.request(
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
        await directus.request(deleteItem("clients", id));
        revalidatePath(`/dashboard`);
        return { error: null };
    } catch (error) {
        console.error("Error deleting client:", error);
        return { error: "Error al eliminar el cliente" };
    }
}
