import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getWorkspacePendingInvitations } from "@/lib/invitation-actions";
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

    // Get pending invitations for this workspace
    const { data: pendingInvitations } = await getWorkspacePendingInvitations(workspace.id);

    // Determine if current user is owner
    const isOwner = typeof workspace.owner === 'object'
        ? workspace.owner.id === session.user.id
        : workspace.owner === session.user.id;

    // Determine if current user is admin (owner or admin role)
    const currentUserMember = workspace.members?.find((m: any) => {
        const memberId = typeof m.user_id === 'object' ? m.user_id.id : m.user_id;
        return memberId === session.user.id;
    });
    const isAdmin = isOwner || currentUserMember?.role === 'admin';

    return (
        <MembersClient
            workspace={workspace}
            pendingInvitations={pendingInvitations || []}
            currentUserId={session.user.id}
            currentUserEmail={session.user.email || ""}
            isOwner={isOwner}
            isAdmin={isAdmin}
        />
    );
}
