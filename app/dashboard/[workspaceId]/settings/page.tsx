import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { notFound } from "next/navigation";
import { WorkspaceSettingsClient } from "@/components/dashboard/workspace-settings-client";

interface SettingsPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { workspaceId } = await params;
    const { data: workspace, error } = await getWorkspaceBySlug(workspaceId);

    if (error || !workspace) {
        notFound();
    }

    return <WorkspaceSettingsClient workspace={workspace} />;
}
