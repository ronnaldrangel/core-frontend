"use server";

import { directus } from "./directus";
import { registerUser as registerUserDirectus, passwordRequest, passwordReset } from "@directus/sdk";

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

export async function requestPasswordReset(email: string) {
    try {
        // Usamos una ruta personalizada que apunta a nuestra aplicación Next.js
        // IMPORTANTE: Debes configurar PASSWORD_RESET_URL_ALLOW_LIST en Directus
        const reset_url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`;

        await directus.request(passwordRequest(email, reset_url));

        return { success: true };
    } catch (error: any) {
        console.error("Error requesting password reset:", error);
        // Por seguridad, muchas veces es mejor no revelar si el email existe o no
        // Pero aquí daremos un mensaje general si falla la conexión
        return { error: "Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde." };
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        await directus.request(passwordReset(token, password));
        return { success: true };
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return { error: "El enlace es inválido o ha expirado. Por favor solicita uno nuevo." };
    }
}
