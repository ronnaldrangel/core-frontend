import { auth } from "@/auth";
import { getUserWorkspaces } from "@/lib/actions";
import { getPendingInvitations } from "@/lib/invitation-actions";
import { redirect } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { WorkspaceSelector } from "@/components/workspace-selector";

export default async function WorkspacesPage() {
    const session = await auth();

    if (!session?.user?.id || !session.access_token) {
        redirect("/login");
    }

    // Default to strict false
    let hasPaid = false;
    const isAdmin = session.user.role?.name?.toLowerCase().includes("admin") || false;
    const directusUrl = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;

    try {
        const userRes = await fetch(`${directusUrl}/users/me?fields=has_paid`, {
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
            next: { revalidate: 0 }
        });

        if (userRes.ok) {
            const userData = await userRes.json();
            // Strictly check for boolean true. Null or undefined will fail.
            hasPaid = userData.data.has_paid === true;
        }
    } catch (error) {
        console.error("Error fetching latest user status:", error);
        hasPaid = false;
    }

    // Admins bypass the paid check
    const finalHasPaid = isAdmin || hasPaid;

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
                    hasPaid={finalHasPaid}
                />
            </main>
        </div>
    );
}
