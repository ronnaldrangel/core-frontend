import { auth } from "@/auth";
import { getPendingInvitations } from "@/lib/invitation-actions";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import Link from "next/link";

export async function GlobalNav() {
    const session = await auth();
    if (!session?.user) return null;

    const { data: pendingInvitations } = await getPendingInvitations();
    const safeInvitations = pendingInvitations || [];

    return (
        <header className="border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/workspaces">
                        <Logo height={20} />
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <NotificationBell initialInvitations={safeInvitations} />
                    <ModeToggle />
                    <UserNav
                        user={{
                            name: session.user.first_name || "Usuario",
                            email: session.user.email || "",
                            image: session.user.image,
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
