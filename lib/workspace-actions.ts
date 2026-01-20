"use server";

import { directus } from "./directus";
import { createItem, readItems, readItem, updateItem, deleteItem } from "@directus/sdk";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface Workspace {
    id: string;
    name: string;
    description: string | null;
    color: string;
    icon: string;
    status: string;
    owner: string | { id: string; first_name: string; last_name: string; email: string };
    members?: WorkspaceMember[];
    date_created: string;
    date_updated: string | null;
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
                    "*",
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
                    "*",
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

// Create a new workspace
export async function createWorkspace(data: CreateWorkspaceData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const workspace = await directus.request(
            createItem("workspaces", {
                name: data.name,
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
export async function updateMemberRole(memberId: string, role: "admin" | "editor" | "viewer") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const member = await directus.request(
            updateItem("workspaces_members", memberId, { role })
        );

        revalidatePath("/workspaces");
        return { success: true, data: member };
    } catch (error: any) {
        console.error("Error updating member role:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al actualizar el rol: ${detail}` };
    }
}
