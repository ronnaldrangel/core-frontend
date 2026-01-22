"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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
}
import { Logo } from "@/components/logo";

export function DashboardHeader({ user, workspaceLogo, workspaceName, workspaceColor }: DashboardHeaderProps) {
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
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-background"></span>
                </Button>
                <div className="hidden md:flex">
                    <ModeToggle />
                </div>
                <UserNav user={user} />
            </div>
        </header>
    );
}
