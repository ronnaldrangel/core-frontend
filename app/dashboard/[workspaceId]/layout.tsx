import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspace, getWorkspaces } from "@/lib/workspace-actions";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceLayout({ children, params }: LayoutProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId } = await params;

    // Verificar que el workspace existe
    const { data: workspace, error } = await getWorkspace(workspaceId);

    if (error || !workspace) {
        notFound();
    }

    const { data: allWorkspaces } = await getWorkspaces();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <DashboardHeader
                user={{
                    name: session.user.first_name || "Usuario",
                    email: session.user.email || "",
                    image: session.user.image,
                }}
            />
            <div className="flex h-screen pt-16">
                <Sidebar
                    workspaces={allWorkspaces || []}
                    currentWorkspaceId={workspaceId}
                />
                <main className="flex-1 overflow-y-auto md:ml-64 p-6 bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}
