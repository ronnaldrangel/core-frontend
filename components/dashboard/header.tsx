"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { MobileSidebar } from "./mobile-sidebar";
import { Logo } from "@/components/logo";
import { NotificationBell } from "./notification-bell";
import { type WorkspaceInvitation } from "@/lib/invitation-actions";

interface DashboardHeaderProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
    workspaceId?: string;
    workspaceLogo?: string | null;
    workspaceName?: string;
    workspaceColor?: string;
    initialInvitations?: WorkspaceInvitation[];
}

export function DashboardHeader({
    user,
    workspaceLogo,
    workspaceName,
    workspaceColor,
    initialInvitations = []
}: DashboardHeaderProps) {
    const logoUrl = workspaceLogo
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspaceLogo}`
        : undefined;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <MobileSidebar />
            <div className="flex items-center gap-2 font-semibold">
                <Link href="/workspaces" className="flex items-center gap-2">
                    <Logo
                        height={32}
                        src={logoUrl}
                        initial={workspaceName}
                        color={workspaceColor}
                    />
                </Link>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
                <NotificationBell initialInvitations={initialInvitations} />
                <div className="hidden md:flex">
                    <ModeToggle />
                </div>
                <UserNav user={user} />
            </div>
        </header>
    );
}
