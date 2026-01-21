"use server";

import { directus } from "./directus";
import { createItem, readItems, readItem, updateItem, deleteItem } from "@directus/sdk";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    icon: string;
    status: string;
    owner: string | { id: string; first_name: string; last_name: string; email: string };
    members?: WorkspaceMember[];
    date_created: string;
    date_updated: string | null;
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export interface WorkspaceMember {
    id: string;
    user_id: string | { id: string; first_name: string; last_name: string; email: string };
    role: "admin" | "editor" | "viewer";
}

export interface CreateWorkspaceData {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
}

export interface UpdateWorkspaceData {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    status?: string;
}

// Get all workspaces for the current user (owned or member of)
export async function getWorkspaces() {
    try {
        const session = await auth();
        console.log("getWorkspaces - Session:", JSON.stringify(session, null, 2));

        if (!session?.user?.id) {
            console.log("getWorkspaces - No user ID in session");
            return { error: "No estás autenticado" };
        }

        const userId = session.user.id;
        console.log("getWorkspaces - User ID:", userId);

        // Get workspaces where user is owner OR member
        const workspaces = await directus.request(
            readItems("workspaces", {
                fields: [
                    "id",
                    "name",
                    "slug",
                    "description",
                    "color",
                    "icon",
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

        console.log("getWorkspaces - Result:", JSON.stringify(workspaces, null, 2));
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

        const workspace = await directus.request(
            readItem("workspaces", id, {
                fields: [
                    "id",
                    "name",
                    "slug",
                    "description",
                    "color",
                    "icon",
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

        const workspaces = await directus.request(
            readItems("workspaces", {
                fields: [
                    "id",
                    "name",
                    "slug",
                    "description",
                    "color",
                    "icon",
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
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // Generate base slug from name
        let baseSlug = generateSlug(data.name);
        let slug = baseSlug;
        let counter = 1;

        // Check if slug already exists and generate unique one
        while (true) {
            const existingWorkspaces = await directus.request(
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

        const workspace = await directus.request(
            createItem("workspaces", {
                name: data.name,
                slug: slug,
                description: data.description || null,
                color: data.color || "#6366F1",
                icon: data.icon || "folder",
                owner: session.user.id,
                status: "published",
            })
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

        const workspace = await directus.request(
            updateItem("workspaces", id, data)
        );

        revalidatePath("/workspaces");
        revalidatePath(`/workspaces/${id}`);
        return { success: true, data: workspace };
    } catch (error: any) {
        console.error("Error updating workspace:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al actualizar el workspace: ${detail}` };
    }
}

// Delete a workspace
export async function deleteWorkspace(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        await directus.request(deleteItem("workspaces", id));

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

        const member = await directus.request(
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

        await directus.request(deleteItem("workspaces_members", memberId));

        revalidatePath("/workspaces");
        return { success: true };
    } catch (error: any) {
        console.error("Error removing member:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al eliminar el miembro: ${detail}` };
    }
}

// Update a member's role
export async function updateMemberRole(memberId: string, role: "admin" | "editor" | "viewer", workspaceSlug?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const member = await directus.request(
            updateItem("workspaces_members", memberId, { role })
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

        const users = await directus.request(
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
    role: "admin" | "editor" | "viewer" = "viewer",
    workspaceSlug?: string
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // First, find the user by email
        const users = await directus.request(
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
        const existingMembers = await directus.request(
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

        // Add the member
        const member = await directus.request(
            createItem("workspaces_members", {
                workspace_id: workspaceId,
                user_id: userId,
                role: role,
            })
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

        await directus.request(deleteItem("workspaces_members", memberId));

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
