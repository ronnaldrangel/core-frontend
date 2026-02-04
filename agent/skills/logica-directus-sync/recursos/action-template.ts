import { directus } from "@/lib/directus";
import { readItems, updateItem, createItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";

/**
 * Template para lectura de items con manejo de errores y tipado.
 */
export async function getCollectionItems(workspaceId: string) {
    try {
        const items = await directus.request(
            readItems("nombre_coleccion", {
                filter: {
                    workspace: { _eq: workspaceId },
                    status: { _eq: "published" }
                },
                fields: ["*", "relacion.nombre"],
                sort: ["-date_created"]
            })
        );
        return items;
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
}

/**
 * Template para mutación con revalidación.
 */
export async function updateCollectionItem(id: string, data: any, path: string) {
    try {
        await directus.request(updateItem("nombre_coleccion", id, data));
        revalidatePath(path);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}
