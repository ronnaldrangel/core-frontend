"use server";

import { directus, directusAdmin } from "./directus";
import { readItems, createItem, updateItem, deleteItem, readItem, uploadFiles } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { getMyPermissions } from "./rbac-actions";

export interface Product {
    id: string;
    status: string;
    workspace: string; // ID del workspace
    nombre: string;
    sku: string;
    precio_venta: string | number | null;
    precio_compra: string | number | null;
    imagen: any | null;
    descripcion_corta: string | null;
    descripcion_normal: string | null;
    stock: number;
    variantes_producto: any[] | null;
    pack2: string | number | null;
    pack3: string | number | null;
    category?: string | any | null;
    date_created?: string;
}

export async function uploadFile(formData: FormData) {
    try {
        console.log("Iniciando subida de archivo...");
        // La subida de archivos la permitimos con el cliente normal o admin
        // dependiendo de si queremos que el usuario sea el 'owner' en Directus.
        // Lo dejamos con directusAdmin para evitar líos de permisos en directus_files.
        const response = await directusAdmin.request(uploadFiles(formData));

        // Asegurarnos de devolver un objeto plano y serializable
        const fileData = JSON.parse(JSON.stringify(response));

        console.log("Archivo subido con éxito:", fileData);
        return { data: fileData, error: null };
    } catch (error: any) {
        console.error("Error detallado en uploadFile (lib/product-actions.ts):", error);

        // Extraer mensaje de error de Directus si existe
        const msg = error.errors?.[0]?.message || error.message || "Error al subir la imagen";
        return { data: null, error: String(msg) };
    }
}

export async function getProductsByWorkspace(workspaceId: string) {
    try {
        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("products.read")) {
            return { data: null, error: "No tienes permiso para ver productos" };
        }

        const products = await directusAdmin.request(
            readItems("products", {
                filter: {
                    workspace: { _eq: workspaceId }
                },
                fields: ["*"],
                sort: ["-date_created"]
            })
        );
        return { data: products as Product[], error: null };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { data: null, error: "Error al cargar los productos" };
    }
}

export async function createProduct(data: Partial<Product>) {
    try {
        if (!data.workspace) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(data.workspace);
        if (!permissions.includes("*") && !permissions.includes("products.create")) {
            return { data: null, error: "No tienes permiso para crear productos" };
        }

        const product = await directusAdmin.request(
            createItem("products", data)
        );
        revalidatePath(`/dashboard`);
        return { data: product as Product, error: null };
    } catch (error: any) {
        console.error("Error creating product:", error);
        const msg = error.errors?.[0]?.message || error.message || "Error al crear el producto";
        return { data: null, error: String(msg) };
    }
}

export async function updateProduct(id: string, data: Partial<Product>) {
    try {
        const workspaceId = data.workspace;
        if (!workspaceId) return { data: null, error: "Workspace no especificado" };

        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("products.update")) {
            return { data: null, error: "No tienes permiso para actualizar productos" };
        }

        const product = await directusAdmin.request(
            updateItem("products", id, data)
        );
        revalidatePath(`/dashboard`);
        return { data: product as Product, error: null };
    } catch (error) {
        console.error("Error updating product:", error);
        return { data: null, error: "Error al actualizar el producto" };
    }
}

export async function deleteProduct(id: string) {
    try {
        // Para eliminar, primero necesitamos saber a qué workspace pertenece el producto
        const product = await directusAdmin.request(readItem("products", id, { fields: ["workspace"] }));
        if (!product || !product.workspace) return { error: "Producto no encontrado" };

        const workspaceId = typeof product.workspace === 'object' ? product.workspace.id : product.workspace;

        // Verificar permisos
        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("products.delete")) {
            return { error: "No tienes permiso para eliminar productos" };
        }

        await directusAdmin.request(deleteItem("products", id));
        revalidatePath(`/dashboard`);
        return { error: null };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { error: "Error al eliminar el producto" };
    }
}
