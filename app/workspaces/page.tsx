import { auth } from "@/auth";
import { getUserWorkspaces } from "@/lib/actions";
import { getPendingInvitations } from "@/lib/invitation-actions";
import { redirect } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { WorkspaceSelector } from "@/components/workspace-selector";
import { directusAdmin } from "@/lib/directus";
import { readUser } from "@directus/sdk";

export default async function WorkspacesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }


    const { workspaces, error } = await getUserWorkspaces();
    const { data: pendingInvitations } = await getPendingInvitations();

    const safeWorkspaces = workspaces || [];
    const safeInvitations = pendingInvitations || [];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <GlobalNav />

            <main className="flex-1 py-12">
                <WorkspaceSelector
                    initialWorkspaces={safeWorkspaces}
                    pendingInvitations={safeInvitations}
                    userName={session.user.first_name || ""}
                    userEmail={session.user.email || ""}
                />
            </main>
        </div>
    );
}
