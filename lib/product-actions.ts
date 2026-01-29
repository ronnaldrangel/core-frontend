"use server";

import { directus } from "./directus";
import { readItems, createItem, updateItem, deleteItem, readItem, uploadFiles } from "@directus/sdk";
import { revalidatePath } from "next/cache";

export interface Product {
    id: string;
    status: string;
    workspace: string;
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
        const response = await directus.request(uploadFiles(formData));

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
        const products = await directus.request(
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
        const product = await directus.request(
            createItem("products", data)
        );
        revalidatePath(`/dashboard`);
        return { data: product as Product, error: null };
    } catch (error) {
        console.error("Error creating product:", error);
        return { data: null, error: "Error al crear el producto" };
    }
}

export async function updateProduct(id: string, data: Partial<Product>) {
    try {
        const product = await directus.request(
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
        await directus.request(deleteItem("products", id));
        revalidatePath(`/dashboard`);
        return { error: null };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { error: "Error al eliminar el producto" };
    }
}
