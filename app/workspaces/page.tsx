
import { auth } from "@/auth";
import { getUserWorkspaces } from "@/lib/actions";
import { WorkspaceSelector } from "@/components/workspace-selector";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";

export default async function WorkspacesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { workspaces, error } = await getUserWorkspaces();

    // Si hay error (probablemente config), mostramos lista vacía o manejamos error.
    // Por ahora, pasamos array vacío si falla.
    const safeWorkspaces = workspaces || [];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            {/* Navbar simple solo para esta vista */}
            <header className="border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white">D</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">DirectOS</span>
                    </div>
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
                {/* @ts-ignore */}
                <WorkspaceSelector
                    initialWorkspaces={safeWorkspaces}
                    userName={session.user.first_name || ""}
                    userEmail={session.user.email || ""}
                />
            </main>
        </div>
    );
}
