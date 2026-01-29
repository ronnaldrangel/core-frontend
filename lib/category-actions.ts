"use server";

import { directus } from "./directus";
import { readItems, createItem, updateItem, deleteItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";

export interface Category {
    id: string;
    status: string;
    workspace: string;
    nombre: string;
    descripcion: string | null;
    color: string;
    date_created?: string;
    user_created?: string;
}

export async function getCategoriesByWorkspace(workspaceId: string) {
    try {
        const categories = await directus.request(
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
        // Validar que el nombre sea único en el workspace (case-insensitive)
        if (data.nombre && data.workspace) {
            const existingCategories = await directus.request(
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

        const category = await directus.request(
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
        const category = await directus.request(
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
        await directus.request(deleteItem("categories", id));
        revalidatePath(`/dashboard`);
        return { error: null };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { error: "Error al eliminar la categoría" };
    }
}
