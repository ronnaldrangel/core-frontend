"use server";

import { directus, directusAdmin } from "./directus";
import { createItem, createItems, readItems, readItem, updateItem, deleteItem } from "@directus/sdk";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { generateSlug } from "./utils";
import { getMyPermissions } from "./rbac-actions";

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    icon: string;
    logo: string | null; // Added logo field
    status: string;
    owner: string | { id: string; first_name: string; last_name: string; email: string };
    members?: WorkspaceMember[];
    date_created: string;
    date_updated: string | null;
    email_contacto?: string;
    telefono_contacto?: string;
    direccion_contacto?: string;
    whatsapp_name?: string;
    whatsapp_url?: string;
    whatsapp_api_key?: string;
}


export interface WorkspaceMember {
    id: string;
    user_id: string | { id: string; first_name: string; last_name: string; email: string };
    role: "admin" | "editor" | "viewer";
}

// Helper to check user role in workspace (Now exported for use in components)
export async function getWorkspaceRole(workspaceId: string, userId: string): Promise<"owner" | "admin" | "editor" | "viewer" | null> {
    try {
        const workspace = await directusAdmin.request(
            readItem("workspaces", workspaceId, {
                fields: ["owner"],
            })
        );

        const ownerId = typeof workspace.owner === 'object' ? workspace.owner.id : workspace.owner;
        if (ownerId === userId) return "owner";

        const members = await directusAdmin.request(
            readItems("workspaces_members", {
                filter: {
                    _and: [
                        { workspace_id: { _eq: workspaceId } },
                        { user_id: { _eq: userId } }
                    ]
                },
                limit: 1
            })
        );

        if (members && members.length > 0) {
            return members[0].role as "admin" | "editor" | "viewer";
        }

        return null;
    } catch (error) {
        return null;
    }
}

export interface CreateWorkspaceData {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    logo?: string;
    email_contacto?: string;
    telefono_contacto?: string;
    direccion_contacto?: string;
    whatsapp_name?: string;
    whatsapp_url?: string;
    whatsapp_api_key?: string;
}

export interface UpdateWorkspaceData {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    logo?: string | null;
    status?: string;
    email_contacto?: string;
    telefono_contacto?: string;
    direccion_contacto?: string;
    whatsapp_name?: string;
    whatsapp_url?: string;
    whatsapp_api_key?: string;
}

// Get all workspaces for the current user (owned or member of)
export async function getWorkspaces() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const userId = session.user.id;

        // Get workspaces where user is owner OR member
        const workspaces = await directusAdmin.request(
            readItems("workspaces", {
                fields: [
                    "id",
                    "name",
                    "slug",
                    "description",
                    "color",
                    "icon",
                    "logo",
                    "status",
                    "date_created",
                    "date_updated",
                    "owner.id",
                    "owner.first_name",
                    "owner.last_name",
                    "owner.email",
                    "members.id",
                    "members.user_id.id",
                    "members.user_id.first_name",
                    "members.user_id.last_name",
                    "members.user_id.email",
                    "members.role",
                    "email_contacto",
                    "telefono_contacto",
                    "direccion_contacto",
                    "whatsapp_name",
                    "whatsapp_url",
                    "whatsapp_api_key",
                ],
                filter: {
                    _or: [
                        { owner: { _eq: userId } },
                        { members: { user_id: { _eq: userId } } },
                    ],
                },
                sort: ["-date_created"],
            })
        );

        return { data: workspaces as Workspace[] };
    } catch (error: any) {
        console.error("Error fetching workspaces:", error);
        return { error: "Error al obtener los workspaces" };
    }
}

// Get a single workspace by ID
export async function getWorkspace(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const workspace = await directusAdmin.request(
            readItem("workspaces", id, {
                fields: [
                    "id",
                    "name",
                    "slug",
                    "description",
                    "color",
                    "icon",
                    "logo",
                    "status",
                    "date_created",
                    "date_updated",
                    "owner.id",
                    "owner.first_name",
                    "owner.last_name",
                    "owner.email",
                    "members.id",
                    "members.user_id.id",
                    "members.user_id.first_name",
                    "members.user_id.last_name",
                    "members.user_id.email",
                    "members.role",
                    "email_contacto",
                    "telefono_contacto",
                    "direccion_contacto",
                    "whatsapp_name",
                    "whatsapp_url",
                    "whatsapp_api_key",
                ],
            })
        );

        return { data: workspace as Workspace };
    } catch (error: any) {
        console.error("Error fetching workspace:", error);
        return { error: "Error al obtener el workspace" };
    }
}

// Get a single workspace by slug
export async function getWorkspaceBySlug(slug: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const workspaces = await directusAdmin.request(
            readItems("workspaces", {
                fields: [
                    "id",
                    "name",
                    "slug",
                    "description",
                    "color",
                    "icon",
                    "logo",
                    "status",
                    "date_created",
                    "date_updated",
                    "owner.id",
                    "owner.first_name",
                    "owner.last_name",
                    "owner.email",
                    "members.id",
                    "members.user_id.id",
                    "members.user_id.first_name",
                    "members.user_id.last_name",
                    "members.user_id.email",
                    "members.role",
                    "members.role_id.id",
                    "members.role_id.name",
                    "email_contacto",
                    "telefono_contacto",
                    "direccion_contacto",
                    "whatsapp_name",
                    "whatsapp_url",
                    "whatsapp_api_key",
                ],
                filter: {
                    slug: { _eq: slug }
                },
                limit: 1,
            })
        );

        if (!workspaces || workspaces.length === 0) {
            return { error: "Workspace no encontrado" };
        }

        return { data: workspaces[0] as Workspace };
    } catch (error: any) {
        console.error("Error fetching workspace by slug:", error);
        return { error: "Error al obtener el workspace" };
    }
}

// Create a new workspace
export async function createWorkspace(data: CreateWorkspaceData) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session.access_token) {
            return { error: "No estás autenticado" };
        }

        // Check if user has paid (Real-time premium check)
        const directusUrl = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
        let hasPaid = false;

        try {
            const userRes = await fetch(`${directusUrl}/users/me?fields=has_paid`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` },
                cache: 'no-store'
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                hasPaid = !!userData.data.has_paid;
            }
        } catch (error) {
            // Fallback to session if fetch fails
            hasPaid = !!session.user.has_paid;
        }

        if (!hasPaid) {
            return { error: "Debes tener una suscripción activa para crear un workspace" };
        }

        // Generate base slug from name
        const baseSlug = generateSlug(data.name);
        let slug = baseSlug;
        let counter = 1;

        // Check if slug already exists and generate unique one
        while (true) {
            const existingWorkspaces = await directusAdmin.request(
                readItems("workspaces", {
                    filter: { slug: { _eq: slug } },
                    limit: 1,
                })
            );

            if (!existingWorkspaces || existingWorkspaces.length === 0) {
                break; // Slug is unique
            }

            counter++;
            slug = `${baseSlug}-${counter}`;
        }

        const workspace = await directusAdmin.request(
            createItem("workspaces", {
                name: data.name,
                slug: slug,
                description: data.description || null,
                color: data.color || "#6366F1",
                icon: data.icon || "folder",
                logo: data.logo || null,
                owner: session.user.id,
                status: "published",
                email_contacto: data.email_contacto || null,
                telefono_contacto: data.telefono_contacto || null,
                direccion_contacto: data.direccion_contacto || null,
                whatsapp_name: data.whatsapp_name || null,
                whatsapp_url: data.whatsapp_url || null,
                whatsapp_api_key: data.whatsapp_api_key || null,
            })
        );

        const workspaceId = workspace.id;

        // Create Default Order Statuses
        await directusAdmin.request(
            createItems("order_statuses", [
                { workspace_id: workspaceId, name: "Pendiente", value: "pendiente", color: "#64748B", sort: 1 },
                { workspace_id: workspaceId, name: "Confirmado", value: "confirmado", color: "#3B82F6", sort: 2 },
                { workspace_id: workspaceId, name: "Preparando", value: "preparando", color: "#F59E0B", sort: 3 },
                { workspace_id: workspaceId, name: "Enviado", value: "enviado", color: "#8B5CF6", sort: 4 },
                { workspace_id: workspaceId, name: "Entregado", value: "entregado", color: "#10B981", sort: 5 },
            ])
        );

        // Create Default Payment Statuses
        await directusAdmin.request(
            createItems("payment_statuses", [
                { workspace_id: workspaceId, name: "Pendiente", value: "pendiente", color: "#64748B", sort: 1 },
                { workspace_id: workspaceId, name: "Pagado", value: "pagado", color: "#10B981", sort: 2 },
            ])
        );

        // Create Default Courier Types
        await directusAdmin.request(
            createItems("courier_types", [
                { workspace_id: workspaceId, name: "Shalom", value: "SHALOM", color: "#F59E0B", sort: 1 },
                { workspace_id: workspaceId, name: "Olva Courier", value: "OLVA", color: "#EF4444", sort: 2 },
                { workspace_id: workspaceId, name: "Marvisur", value: "MARVISUR", color: "#3B82F6", sort: 3 },
                { workspace_id: workspaceId, name: "Motorizado", value: "MOTORIZADO", color: "#10B981", sort: 4 },
                { workspace_id: workspaceId, name: "Courier Propio", value: "PROPIO", color: "#6366F1", sort: 5 },
            ])
        );

        // Create Default Payment Methods
        await directusAdmin.request(
            createItems("payment_methods", [
                { workspace_id: workspaceId, name: "Yape", value: "YAPE", color: "#830E9B", sort: 1 },
                { workspace_id: workspaceId, name: "Plin", value: "PLIN", color: "#00CED1", sort: 2 },
                { workspace_id: workspaceId, name: "Transferencia Bancaria", value: "TRANSFERENCIA", color: "#3B82F6", sort: 3 },
                { workspace_id: workspaceId, name: "Efectivo", value: "EFECTIVO", color: "#10B981", sort: 4 },
            ])
        );

        revalidatePath("/workspaces");

        return { success: true, data: workspace };
    } catch (error: any) {
        console.error("Error creating workspace:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al crear el workspace: ${detail}` };
    }
}

// Update a workspace
export async function updateWorkspace(id: string, data: UpdateWorkspaceData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const userId = session.user.id;
        const permissions = await getMyPermissions(id);

        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permisos para editar este workspace" };
        }

        const workspace = await directusAdmin.request(
            updateItem("workspaces", id, data)
        );

        revalidatePath("/workspaces");
        revalidatePath(`/dashboard/${workspace.slug}`);
        revalidatePath(`/dashboard/${workspace.slug}/settings`);
        return { success: true, data: workspace };
    } catch (error: any) {
        console.error("Error updating workspace:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al actualizar el workspace: ${detail}` };
    }
}

// Upload workspace logo
export async function uploadWorkspaceLogo(formData: FormData) {
    try {
        const { uploadFiles } = await import("@directus/sdk");
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const file = formData.get("logo") as File;
        if (!file || file.size === 0) {
            return { error: "No se seleccionó ningún archivo" };
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
        if (!validTypes.includes(file.type)) {
            return { error: "Tipo de archivo no válido. Usa JPG, PNG, GIF, WebP o SVG." };
        }

        // Validate file size (max 2MB for logos)
        if (file.size > 2 * 1024 * 1024) {
            return { error: "El archivo es demasiado grande. Máximo 2MB." };
        }

        // Upload file to Directus
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadedFile = await directusAdmin.request(
            uploadFiles(uploadFormData)
        );

        return { success: true, id: uploadedFile.id };
    } catch (error: any) {
        console.error("Error uploading workspace logo:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al subir el logo: ${detail}` };
    }
}

// Delete a workspace
export async function deleteWorkspace(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const permissions = await getMyPermissions(id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "Solo el propietario o administradores pueden eliminar el workspace" };
        }

        await directusAdmin.request(deleteItem("workspaces", id));

        revalidatePath("/workspaces");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting workspace:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al eliminar el workspace: ${detail}` };
    }
}

// Add a member to a workspace
export async function addWorkspaceMember(workspaceId: string, userId: string, role: "admin" | "editor" | "viewer" = "viewer") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permiso para gestionar miembros" };
        }

        const member = await directusAdmin.request(
            createItem("workspaces_members", {
                workspace_id: workspaceId,
                user_id: userId,
                role: role,
            })
        );

        revalidatePath(`/workspaces/${workspaceId}`);
        return { success: true, data: member };
    } catch (error: any) {
        console.error("Error adding member:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al añadir el miembro: ${detail}` };
    }
}

// Remove a member from a workspace
export async function removeWorkspaceMember(memberId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // Get workspaceId for permission check
        const memberRecord = await directusAdmin.request(readItem("workspaces_members", memberId, { fields: ["workspace_id"] }));
        if (!memberRecord) return { error: "Miembro no encontrado" };

        const permissions = await getMyPermissions((memberRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permiso para gestionar miembros" };
        }

        await directusAdmin.request(deleteItem("workspaces_members", memberId));

        revalidatePath("/workspaces");
        return { success: true };
    } catch (error: any) {
        console.error("Error removing member:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al eliminar el miembro: ${detail}` };
    }
}

// Update a member's role
export async function updateMemberRole(memberId: string, role: string, workspaceSlug?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // Get workspaceId for permission check
        const memberRecord = await directusAdmin.request(readItem("workspaces_members", memberId, { fields: ["workspace_id"] }));
        if (!memberRecord) return { error: "Miembro no encontrado" };

        const permissions = await getMyPermissions((memberRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permiso para gestionar miembros" };
        }

        const data: any = {};
        // Si el rol es un UUID (nuevo sistema), lo asignamos a role_id
        if (role && role.length === 36) {
            data.role_id = role;
        } else {
            // Si es un string normal (viejo sistema), lo mantenemos en role
            data.role = role;
            // Limpiar role_id si se cambia a un rol del sistema
            data.role_id = null;
        }

        const member = await directusAdmin.request(
            updateItem("workspaces_members", memberId, data)
        );

        revalidatePath("/workspaces");
        if (workspaceSlug) {
            revalidatePath(`/dashboard/${workspaceSlug}/members`);
        }
        return { success: true, data: member };
    } catch (error: any) {
        console.error("Error updating member role:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al actualizar el rol: ${detail}` };
    }
}

// Search user by email
export async function searchUserByEmail(email: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const users = await directusAdmin.request(
            readItems("directus_users", {
                filter: {
                    email: { _eq: email }
                },
                fields: ["id", "email", "first_name", "last_name", "avatar"],
                limit: 1,
            })
        );

        if (!users || users.length === 0) {
            return { error: "Usuario no encontrado" };
        }

        return { data: users[0] };
    } catch (error: any) {
        console.error("Error searching user:", error);
        return { error: "Error al buscar el usuario" };
    }
}

// Add a member to a workspace by email
export async function addWorkspaceMemberByEmail(
    workspaceId: string,
    email: string,
    role: string = "viewer", // Cambiado a string para soportar roles dinámicos
    workspaceSlug?: string
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const permissions = await getMyPermissions(workspaceId);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permiso para gestionar miembros" };
        }

        // First, find the user by email
        const users = await directusAdmin.request(
            readItems("directus_users", {
                filter: {
                    email: { _eq: email }
                },
                fields: ["id", "email", "first_name", "last_name"],
                limit: 1,
            })
        );

        if (!users || users.length === 0) {
            return { error: "No se encontró ningún usuario con ese email" };
        }

        const userId = users[0].id;

        // Check if user is already a member
        const existingMembers = await directusAdmin.request(
            readItems("workspaces_members", {
                filter: {
                    _and: [
                        { workspace_id: { _eq: workspaceId } },
                        { user_id: { _eq: userId } }
                    ]
                },
                limit: 1,
            })
        );

        if (existingMembers && existingMembers.length > 0) {
            return { error: "Este usuario ya es miembro del workspace" };
        }

        const data: any = {
            workspace_id: workspaceId,
            user_id: userId,
        };

        if (role && role.length === 36) {
            data.role_id = role;
        } else {
            data.role = role;
        }

        // Add the member
        const member = await directusAdmin.request(
            createItem("workspaces_members", data)
        );

        revalidatePath("/workspaces");
        if (workspaceSlug) {
            revalidatePath(`/dashboard/${workspaceSlug}/members`);
        }
        return { success: true, data: member };
    } catch (error: any) {
        console.error("Error adding member by email:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al añadir el miembro: ${detail}` };
    }
}

// Remove a member from a workspace (updated with revalidation)
export async function removeWorkspaceMemberWithSlug(memberId: string, workspaceSlug?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const memberRecord = await directusAdmin.request(readItem("workspaces_members", memberId, { fields: ["workspace_id"] }));
        if (!memberRecord) return { error: "Miembro no encontrado" };

        const permissions = await getMyPermissions((memberRecord as any).workspace_id);
        if (!permissions.includes("*") && !permissions.includes("settings.manage")) {
            return { error: "No tienes permiso para gestionar miembros" };
        }

        await directusAdmin.request(deleteItem("workspaces_members", memberId));

        revalidatePath("/workspaces");
        if (workspaceSlug) {
            revalidatePath(`/dashboard/${workspaceSlug}/members`);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error removing member:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al eliminar el miembro: ${detail}` };
    }
}
