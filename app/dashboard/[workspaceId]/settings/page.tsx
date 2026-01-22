import { getWorkspaceBySlug, getWorkspaceRole } from "@/lib/workspace-actions";
import { notFound, redirect } from "next/navigation";
import { WorkspaceSettingsClient } from "@/components/dashboard/workspace-settings-client";
import { auth } from "@/auth";

interface SettingsPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { workspaceId } = await params;
    const { data: workspace, error } = await getWorkspaceBySlug(workspaceId);

    if (error || !workspace) {
        notFound();
    }

    const role = await getWorkspaceRole(workspace.id, session.user.id);

    // Si por alguna razón no tiene rol (no es miembro ni dueño), fuera de aquí
    if (!role) {
        redirect("/workspaces");
    }

    return <WorkspaceSettingsClient workspace={workspace} role={role} />;
}
