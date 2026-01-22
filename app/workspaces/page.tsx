import { auth } from "@/auth";
import { getUserWorkspaces } from "@/lib/actions";
import { getPendingInvitations } from "@/lib/invitation-actions";
import { WorkspaceSelector } from "@/components/workspace-selector";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";

export default async function WorkspacesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { workspaces, error } = await getUserWorkspaces();
    const { data: pendingInvitations } = await getPendingInvitations();

    // Si hay error, mostramos lista vacía
    const safeWorkspaces = workspaces || [];
    const safeInvitations = pendingInvitations || [];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            {/* Navbar */}
            <header className="border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo height={32} />
                    <div className="flex items-center gap-3">
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
                />
            </main>
        </div>
    );
}
