"use server";

import { directus } from "./directus";
import { createItem, readItems, updateItem, deleteItem, readUsers } from "@directus/sdk";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { addWorkspaceMember } from "./workspace-actions";

export interface WorkspaceInvitation {
    id: string;
    status: "pending" | "accepted" | "rejected";
    role: string;
    workspace_id: string | {
        id: string;
        name: string;
        slug: string;
        color: string;
        icon: string;
        logo: string | null;
    };
    invited_user_id: string | {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    invited_by: string | {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    date_created: string;
}

// Send invitation to a user by email
export async function sendInvitation(
    workspaceId: string,
    email: string,
    role: string = "viewer",
    workspaceSlug?: string
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // Find user by email
        const users = await directus.request(
            readUsers({
                filter: { email: { _eq: email } },
                fields: ["id", "email"],
                limit: 1,
            })
        );

        if (!users || users.length === 0) {
            return { error: "No se encontró ningún usuario con ese email. El usuario debe estar registrado en la plataforma." };
        }

        const invitedUserId = users[0].id;

        // Check if user is the same as the inviter
        if (invitedUserId === session.user.id) {
            return { error: "No puedes invitarte a ti mismo" };
        }

        // Check if user is already a member
        const existingMembers = await directus.request(
            readItems("workspaces_members", {
                filter: {
                    _and: [
                        { workspace_id: { _eq: workspaceId } },
                        { user_id: { _eq: invitedUserId } }
                    ]
                },
                limit: 1,
            })
        );

        if (existingMembers && existingMembers.length > 0) {
            return { error: "Este usuario ya es miembro del workspace" };
        }

        // Check if there's already a pending invitation
        const existingInvitations = await directus.request(
            readItems("workspace_invitations", {
                filter: {
                    _and: [
                        { workspace_id: { _eq: workspaceId } },
                        { invited_user_id: { _eq: invitedUserId } },
                        { status: { _eq: "pending" } }
                    ]
                },
                limit: 1,
            })
        );

        if (existingInvitations && existingInvitations.length > 0) {
            return { error: "Ya existe una invitación pendiente para este usuario" };
        }

        // Create the invitation
        const invitation = await directus.request(
            createItem("workspace_invitations", {
                workspace_id: workspaceId,
                invited_user_id: invitedUserId,
                invited_by: session.user.id,
                role: role,
                status: "pending",
            })
        );

        revalidatePath("/workspaces");
        if (workspaceSlug) {
            revalidatePath(`/dashboard/${workspaceSlug}/members`);
        }

        return { success: true, data: invitation };
    } catch (error: any) {
        console.error("Error sending invitation:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al enviar la invitación: ${detail}` };
    }
}

// Get pending invitations for the current user
export async function getPendingInvitations() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const invitations = await directus.request(
            readItems("workspace_invitations", {
                filter: {
                    _and: [
                        { invited_user_id: { _eq: session.user.id } },
                        { status: { _eq: "pending" } }
                    ]
                },
                fields: [
                    "id",
                    "status",
                    "role",
                    "date_created",
                    "workspace_id.id",
                    "workspace_id.name",
                    "workspace_id.slug",
                    "workspace_id.color",
                    "workspace_id.icon",
                    "workspace_id.logo",
                    "invited_by.id",
                    "invited_by.email",
                    "invited_by.first_name",
                    "invited_by.last_name",
                ],
                sort: ["-date_created"],
            })
        );

        return { data: invitations as WorkspaceInvitation[] };
    } catch (error: any) {
        console.error("Error fetching invitations:", error);
        return { error: "Error al obtener las invitaciones" };
    }
}

// Accept an invitation
export async function acceptInvitation(invitationId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // Get the invitation
        const invitations = await directus.request(
            readItems("workspace_invitations", {
                filter: {
                    _and: [
                        { id: { _eq: invitationId } },
                        { invited_user_id: { _eq: session.user.id } },
                        { status: { _eq: "pending" } }
                    ]
                },
                fields: ["id", "workspace_id", "role"],
                limit: 1,
            })
        );

        if (!invitations || invitations.length === 0) {
            return { error: "Invitación no encontrada o ya procesada" };
        }

        const invitation = invitations[0];
        const workspaceId = typeof invitation.workspace_id === 'object'
            ? invitation.workspace_id.id
            : invitation.workspace_id;

        // Add user as member
        const memberResult = await addWorkspaceMember(
            workspaceId as string,
            session.user.id,
            invitation.role as "admin" | "editor" | "viewer"
        );

        if (memberResult.error) {
            return { error: memberResult.error };
        }

        // Update invitation status
        await directus.request(
            updateItem("workspace_invitations", invitationId, {
                status: "accepted"
            })
        );

        revalidatePath("/workspaces");
        return { success: true };
    } catch (error: any) {
        console.error("Error accepting invitation:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al aceptar la invitación: ${detail}` };
    }
}

// Reject an invitation
export async function rejectInvitation(invitationId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        // Verify the invitation belongs to the current user
        const invitations = await directus.request(
            readItems("workspace_invitations", {
                filter: {
                    _and: [
                        { id: { _eq: invitationId } },
                        { invited_user_id: { _eq: session.user.id } },
                        { status: { _eq: "pending" } }
                    ]
                },
                limit: 1,
            })
        );

        if (!invitations || invitations.length === 0) {
            return { error: "Invitación no encontrada o ya procesada" };
        }

        // Update invitation status
        await directus.request(
            updateItem("workspace_invitations", invitationId, {
                status: "rejected"
            })
        );

        revalidatePath("/workspaces");
        return { success: true };
    } catch (error: any) {
        console.error("Error rejecting invitation:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al rechazar la invitación: ${detail}` };
    }
}

// Get pending invitations for a workspace (sent by admins)
export async function getWorkspacePendingInvitations(workspaceId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        const invitations = await directus.request(
            readItems("workspace_invitations", {
                filter: {
                    _and: [
                        { workspace_id: { _eq: workspaceId } },
                        { status: { _eq: "pending" } }
                    ]
                },
                fields: [
                    "id",
                    "status",
                    "role",
                    "date_created",
                    "invited_user_id.id",
                    "invited_user_id.email",
                    "invited_user_id.first_name",
                    "invited_user_id.last_name",
                    "invited_by.first_name",
                    "invited_by.last_name",
                ],
                sort: ["-date_created"],
            })
        );

        return { data: invitations as WorkspaceInvitation[] };
    } catch (error: any) {
        console.error("Error fetching workspace invitations:", error);
        return { error: "Error al obtener las invitaciones" };
    }
}

// Cancel a sent invitation (for admins)
export async function cancelInvitation(invitationId: string, workspaceSlug?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "No estás autenticado" };
        }

        await directus.request(
            deleteItem("workspace_invitations", invitationId)
        );

        revalidatePath("/workspaces");
        if (workspaceSlug) {
            revalidatePath(`/dashboard/${workspaceSlug}/members`);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error canceling invitation:", error);
        const detail = error.errors?.[0]?.message || error.message || "Error desconocido";
        return { error: `Error al cancelar la invitación: ${detail}` };
    }
}
