import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug, getWorkspaces } from "@/lib/workspace-actions";
import { getPendingInvitations } from "@/lib/invitation-actions";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { RBACProvider } from "@/components/providers/rbac-provider";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceLayout({ children, params }: LayoutProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId } = await params;

    // Buscar workspace por slug
    const { data: workspace, error } = await getWorkspaceBySlug(workspaceId);

    if (error || !workspace) {
        notFound();
    }

    const { data: allWorkspaces } = await getWorkspaces();
    const { data: pendingInvitations } = await getPendingInvitations();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <RBACProvider workspaceId={workspace.id}>
                <DashboardHeader
                    user={{
                        name: session.user.first_name || "Usuario",
                        email: session.user.email || "",
                        image: session.user.image,
                    }}
                    workspaces={allWorkspaces || []}
                    currentWorkspaceId={workspace.slug}
                    workspaceId={workspace.id}
                    workspaceLogo={workspace.logo}
                    workspaceName={workspace.name}
                    workspaceColor={workspace.color}
                    initialInvitations={pendingInvitations || []}
                />
                <div className="flex h-screen pt-16">
                    <Sidebar
                        workspaces={allWorkspaces || []}
                        currentWorkspaceId={workspace.slug}
                        workspaceLogo={workspace.logo}
                        workspaceName={workspace.name}
                        workspaceColor={workspace.color}
                    />
                    <main className="flex-1 overflow-y-auto md:ml-64 p-6 bg-muted/10">
                        {children}
                    </main>
                </div>
            </RBACProvider>
        </div>
    );
}
