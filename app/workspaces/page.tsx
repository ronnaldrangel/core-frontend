import { auth } from "@/auth";
import { getUserWorkspaces } from "@/lib/actions";
import { getPendingInvitations } from "@/lib/invitation-actions";
import { WorkspaceSelector } from "@/components/workspace-selector";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { NotificationBell } from "@/components/dashboard/notification-bell";

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
            {/* Navbar */}
            <header className="border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo height={32} />
                    <div className="flex items-center gap-3">
                        <NotificationBell initialInvitations={safeInvitations} />
                        <ModeToggle />
                        <UserNav
                            user={{
                                name: session.user.first_name || "Usuario",
                                email: session.user.email,
                                image: session.user.image,
                            }}
                        />
                    </div>
                </div>
            </header>

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
