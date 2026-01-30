"use server";

import { directus, directusAdmin } from "./directus";
import { readItems, createItem, updateItem, deleteItem, readItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { getMyPermissions } from "./rbac-actions";

export interface Category {
    id: string;
    status: string;
    workspace: string; // ID del workspace
    nombre: string;
    descripcion: string | null;
    color: string;
    date_created?: string;
    user_created?: string;
}

export async function getCategoriesByWorkspace(workspaceId: string) {
    try {
        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("products.read")) {
            return { data: [], error: "No tienes permiso para ver categorías" };
        }

        const categories = await directusAdmin.request(
            readItems("categories", {
                filter: {
                    workspace: { _eq: workspaceId }
                },
                fields: ["*"],
                sort: ["-date_created"]
            })
        );
        return { data: categories as Category[], error: null };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { data: null, error: "Error al cargar las categorías" };
    }
}

export async function createCategory(data: Partial<Category>) {
    try {
        if (!data.workspace) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(data.workspace);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar categorías" };
        }

        // Validar que el nombre sea único en el workspace (case-insensitive)
        if (data.nombre) {
            const existingCategories = await directusAdmin.request(
                readItems("categories", {
                    filter: {
                        workspace: { _eq: data.workspace },
                        nombre: { _icontains: data.nombre }
                    },
                    fields: ["id", "nombre"]
                })
            );

            // Verificar coincidencia exacta ignorando mayúsculas/minúsculas
            const duplicate = existingCategories.find(
                (cat: any) => cat.nombre.toLowerCase() === data.nombre?.toLowerCase()
            );

            if (duplicate) {
                return { data: null, error: "Ya existe una categoría con ese nombre" };
            }
        }

        const category = await directusAdmin.request(
            createItem("categories", data)
        );
        revalidatePath(`/dashboard`);
        return { data: category as Category, error: null };
    } catch (error) {
        console.error("Error creating category:", error);
        return { data: null, error: "Error al crear la categoría" };
    }
}

export async function updateCategory(id: string, data: Partial<Category>) {
    try {
        if (!data.workspace) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(data.workspace);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { data: null, error: "No tienes permiso para gestionar categorías" };
        }

        const category = await directusAdmin.request(
            updateItem("categories", id, data)
        );
        revalidatePath(`/dashboard`);
        return { data: category as Category, error: null };
    } catch (error) {
        console.error("Error updating category:", error);
        return { data: null, error: "Error al actualizar la categoría" };
    }
}

export async function deleteCategory(id: string) {
    try {
        const categoryRecord = await directusAdmin.request(readItem("categories", id, { fields: ["workspace"] }));
        if (!categoryRecord || !categoryRecord.workspace) return { error: "Categoría no encontrada" };

        const workspaceId = typeof categoryRecord.workspace === 'object' ? categoryRecord.workspace.id : categoryRecord.workspace;

        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permiso para gestionar categorías" };
        }

        await directusAdmin.request(deleteItem("categories", id));
        revalidatePath(`/dashboard`);
        return { error: null };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { error: "Error al eliminar la categoría" };
    }
}
