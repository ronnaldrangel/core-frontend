import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getWorkspacePendingInvitations } from "@/lib/invitation-actions";
import { getAllRoles, getMyPermissions } from "@/lib/rbac-actions";
import { MembersClient } from "./members-client";

interface MembersPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId } = await params; // This is the slug
    const { data: workspace, error } = await getWorkspaceBySlug(workspaceId);

    if (error || !workspace) {
        redirect("/workspaces");
    }

    // Check permissions
    const permissions = await getMyPermissions(workspace.id);
    const isOwner = permissions.includes("*");
    const canManageMembers = isOwner || permissions.includes("settings.manage");

    if (!canManageMembers) {
        redirect(`/dashboard/${workspaceId}`);
    }

    // Get pending invitations for this workspace
    const { data: pendingInvitations } = await getWorkspacePendingInvitations(workspace.id);

    // Get available RBAC roles
    const { data: rbacRoles } = await getAllRoles(workspace.id);

    // Determine if current user is admin for UI purposes
    const isAdmin = isOwner || permissions.includes("settings.manage");

    return (
        <MembersClient
            workspace={workspace}
            pendingInvitations={pendingInvitations || []}
            currentUserId={session.user.id}
            currentUserEmail={session.user.email || ""}
            isOwner={isOwner}
            isAdmin={isAdmin}
            rbacRoles={rbacRoles || []}
        />
    );
}
