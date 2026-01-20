"use server";

import { directus } from "./directus";
import { registerUser as registerUserDirectus } from "@directus/sdk";

export async function registerUser(data: any) {
    try {
        // Usamos registerUser del SDK que apunta a /users/register
        // Este endpoint es el que usa la configuración de "Public Registration"
        // de Directus y asigna el rol por defecto automáticamente.
        await directus.request(
            registerUserDirectus(data.email, data.password, {
                first_name: data.first_name,
                last_name: data.last_name,
            })
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error in registerUser action:", error);

        // Handle common Directus errors
        if (error.errors && error.errors[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
            return { error: "Este correo ya está registrado." };
        }

        if (error.status === 403 || error.status === 401) {
            return { error: "Error de permisos (403/401). El rol 'Public' en Directus debe tener permisos para crear usuarios o se requiere un Token de Admin." };
        }

        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error del servidor: ${detail}` };
    }
}
