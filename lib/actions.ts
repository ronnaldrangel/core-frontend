"use server";

import { directus, directusPublic, directusAdmin } from "./directus";
import { registerUser as registerUserDirectus, passwordRequest, passwordReset, createDirectus, rest, staticToken, readUsers, readItems } from "@directus/sdk";
import { auth } from "@/auth";

export async function registerUser(data: any) {
    try {
        // Primero verificamos si el usuario ya existe para dar mejor feedback
        // Esto evita depender del error de "RECORD_NOT_UNIQUE" que puede variar
        const statusCheck = await checkUserStatus(data.email);

        if (statusCheck?.status && statusCheck.status !== 'not_found' && !statusCheck.error) {
            if (statusCheck.status === "active") {
                return { error: "Este correo ya está registrado. Por favor inicia sesión." };
            } else if (statusCheck.status === "unverified" || statusCheck.status === "draft") {
                // Opcionalmente, aquí podríamos reenviar el correo de verificación si Directus tuviera un endpoint fácil para ello
                return { error: "Esta cuenta ya existe pero aún no ha sido verificada. Por favor revisa tu correo." };
            } else {
                return { error: "Este correo ya está registrado." };
            }
        }

        // Usamos registerUser del SDK que apunta a /users/register
        // Este endpoint es el que usa la configuración de "Public Registration"
        // de Directus y asigna el rol por defecto automáticamente.
        const verification_url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email`;

        await directusPublic.request(
            registerUserDirectus(data.email, data.password, {
                first_name: data.first_name,
                last_name: data.last_name,
                verification_url: verification_url,
            })
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error in registerUser action:", error);

        // Fallback for race conditions or other errors
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

export async function verifyEmail(token: string) {
    try {
        const directusUrl = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
        if (!directusUrl) throw new Error("Directus URL no encontrada");



        // Seguimos la documentación exacta: GET /users/register/verify-email?token=<token>
        const response = await fetch(`${directusUrl}/users/register/verify-email?token=${token}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Error Directus API:", errorBody);
            throw new Error("Fallo en la verificación");
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error verifying email:", error);
        return { error: "El token de verificación es inválido o ha expirado." };
    }
}

export async function requestPasswordReset(email: string) {
    try {
        // Usamos una ruta personalizada que apunta a nuestra aplicación Next.js
        // IMPORTANTE: Debes configurar PASSWORD_RESET_URL_ALLOW_LIST en Directus
        // Codificamos el email en base64 para que no sea tan obvio en la URL, aunque sea público
        const encodedEmail = Buffer.from(email).toString('base64');
        const reset_url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?e=${encodedEmail}`;

        await directusAdmin.request(passwordRequest(email, reset_url));

        return { success: true };
    } catch (error: any) {
        console.error("Error requesting password reset:", error);
        return { error: "Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde." };
    }
}

export async function resetPassword(token: string, password: string, email?: string) {
    try {
        if (email) {
            try {
                const { authentication, createDirectus, rest } = await import("@directus/sdk");
                const tempClient = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!).with(rest()).with(authentication());
                await tempClient.login(email, password);
                return {
                    error: "Esta contraseña ya está en uso. Por favor, verifica bien tus datos al momento de iniciar sesión o elige una contraseña diferente."
                };
            } catch (loginError) {
                // Password is new, continue
            }
        }

        await directusAdmin.request(passwordReset(token, password));
        return { success: true };
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return { error: "El enlace es inválido o ha expirado. Por favor solicita uno nuevo." };
    }
}

export async function checkUserStatus(email: string) {
    try {
        const users = await directusAdmin.request(
            readUsers({
                filter: { email: { _eq: email } },
                fields: ['status'],
            })
        );

        if (users && users.length > 0) {
            return { status: users[0].status };
        }

        return { status: 'not_found' };
    } catch (error: any) {
        console.error("Error checking user status:", error);
        return { error: "Error al verificar estado del usuario" };
    }
}

// Nueva función para obtener workspaces
export async function getUserWorkspaces(): Promise<{ workspaces?: any[], error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "No autorizado" };

        const userId = session.user.id;

        // 1. Buscar workspaces donde el usuario es owner
        const ownedWorkspaces = await directusAdmin.request(
            readItems('workspaces', {
                filter: { owner: { _eq: userId } },
                fields: ['id', 'name', 'slug', 'color', 'icon', 'logo', 'description', 'status'],
            })
        );

        // 2. Buscar workspaces donde el usuario es miembro (via workspaces_members)
        const memberRelations = await directusAdmin.request(
            readItems('workspaces_members', {
                filter: { user_id: { _eq: userId } },
                fields: ['workspace_id.id', 'workspace_id.name', 'workspace_id.slug', 'workspace_id.color', 'workspace_id.icon', 'workspace_id.logo', 'workspace_id.description', 'workspace_id.status'],
            })
        );

        const memberWorkspaces = memberRelations.map((rel: any) => rel.workspace_id).filter(Boolean);

        // Combinar y eliminar duplicados
        const allWorkspaces = [...ownedWorkspaces, ...memberWorkspaces].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

        return { workspaces: allWorkspaces };

    } catch (error: any) {
        console.error("Error fetching workspaces:", error);
        return { error: "Error al cargar los espacios de trabajo" };
    }
}
