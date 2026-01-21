"use server";

import { directus } from "./directus";
import { updateUser, uploadFiles, readMe } from "@directus/sdk";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    title: string | null;
    description: string | null;
    location: string | null;
}

export interface UpdateProfileData {
    first_name?: string;
    last_name?: string;
    title?: string;
    description?: string;
    location?: string;
}

// Get current user profile
export async function getCurrentUser() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const user = await directus.request(
            readMe({
                fields: ["id", "email", "first_name", "last_name", "avatar", "title", "description", "location"]
            })
        );

        return { data: user as UserProfile };
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return { error: "Error al obtener el perfil" };
    }
}

// Update user profile
export async function updateProfile(data: UpdateProfileData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const updatedUser = await directus.request(
            updateUser(session.user.id, data)
        );

        revalidatePath("/account");
        revalidatePath("/workspaces");
        return { success: true, data: updatedUser };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al actualizar el perfil: ${detail}` };
    }
}

// Update user avatar
export async function updateAvatar(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const file = formData.get("avatar") as File;
        if (!file || file.size === 0) {
            return { error: "No se seleccionó ningún archivo" };
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return { error: "Tipo de archivo no válido. Usa JPG, PNG, GIF o WebP." };
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { error: "El archivo es demasiado grande. Máximo 5MB." };
        }

        // Upload file to Directus
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadedFile = await directus.request(
            uploadFiles(uploadFormData)
        );

        // Update user avatar
        await directus.request(
            updateUser(session.user.id, {
                avatar: uploadedFile.id
            })
        );

        revalidatePath("/account");
        revalidatePath("/workspaces");
        return { success: true, data: uploadedFile };
    } catch (error: any) {
        console.error("Error updating avatar:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al actualizar el avatar: ${detail}` };
    }
}

// Remove user avatar
export async function removeAvatar() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        await directus.request(
            updateUser(session.user.id, {
                avatar: null
            })
        );

        revalidatePath("/account");
        revalidatePath("/workspaces");
        return { success: true };
    } catch (error: any) {
        console.error("Error removing avatar:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al eliminar el avatar: ${detail}` };
    }
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

// Change user password
export async function changePassword(data: ChangePasswordData) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session?.user?.email) {
            return { error: "No estás autenticado" };
        }

        // Validate new password length
        if (data.newPassword.length < 8) {
            return { error: "La nueva contraseña debe tener al menos 8 caracteres" };
        }

        // Validate that new password is different from current password
        if (data.currentPassword === data.newPassword) {
            return { error: "La nueva contraseña no puede ser igual a la contraseña actual" };
        }

        // Verify current password by attempting to login
        const { authentication, createDirectus, rest } = await import("@directus/sdk");
        const tempClient = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!).with(rest()).with(authentication());

        try {
            await tempClient.login(session.user.email, data.currentPassword);
        } catch (loginError) {
            return { error: "La contraseña actual es incorrecta" };
        }

        // Update password
        await directus.request(
            updateUser(session.user.id, {
                password: data.newPassword
            })
        );

        return { success: true };
    } catch (error: any) {
        console.error("Error changing password:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al cambiar la contraseña: ${detail}` };
    }
}
