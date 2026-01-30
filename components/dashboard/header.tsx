"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { MobileSidebar } from "./mobile-sidebar";
import { Logo } from "@/components/logo";
import { NotificationBell } from "./notification-bell";
import { type WorkspaceInvitation } from "@/lib/invitation-actions";
import { useRBAC } from "@/components/providers/rbac-provider";

interface DashboardHeaderProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
    workspaces?: any[];
    currentWorkspaceId?: string; // This is the slug
    workspaceId?: string;
    workspaceLogo?: string | null;
    workspaceName?: string;
    workspaceColor?: string;
    initialInvitations?: WorkspaceInvitation[];
}

export function DashboardHeader({
    user,
    workspaces = [],
    currentWorkspaceId,
    workspaceLogo,
    workspaceName,
    workspaceColor,
    initialInvitations = []
}: DashboardHeaderProps) {
    const [mounted, setMounted] = useState(false);
    const { hasPermission } = useRBAC();

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoUrl = workspaceLogo
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspaceLogo}`
        : undefined;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {mounted ? (
                <MobileSidebar
                    workspaces={workspaces}
                    currentWorkspaceId={currentWorkspaceId}
                    workspaceLogo={workspaceLogo}
                    workspaceName={workspaceName}
                    workspaceColor={workspaceColor}
                />
            ) : (
                <div className="h-10 w-10 md:hidden" />
            )}

            <div className="flex items-center gap-2 font-semibold">
                <Link
                    href={hasPermission("dashboard.read") ? `/dashboard/${currentWorkspaceId}` : `/dashboard/${currentWorkspaceId}/orders`}
                    className="flex items-center gap-2"
                >
                    <Logo
                        height={32}
                        src={logoUrl}
                        initial={workspaceName}
                        color={workspaceColor}
                    />
                </Link>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
                {mounted && (
                    <NotificationBell
                        initialInvitations={initialInvitations}
                    />
                )}
                <ModeToggle />
                {mounted && <UserNav user={user} />}
            </div>
        </header>
    );
}
