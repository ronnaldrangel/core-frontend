"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Settings,
} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
    icon?: string | null;
    logo?: string | null;
}

interface SidebarProps {
    workspaces?: Workspace[];
    currentWorkspaceId?: string; // This is now the slug
}

export function Sidebar({ workspaces = [], currentWorkspaceId }: SidebarProps) {
    const pathname = usePathname();

    // Generar items del sidebar con rutas dinámicas usando slug
    const sidebarItems = [
        {
            title: "Vista General",
            href: `/dashboard/${currentWorkspaceId}`,
            icon: LayoutDashboard,
        },
        {
            title: "Miembros",
            href: `/dashboard/${currentWorkspaceId}/members`,
            icon: Users,
        },
        {
            title: "Configuración",
            href: `/dashboard/${currentWorkspaceId}/settings`,
            icon: Settings,
        },
    ];

    return (
        <aside className="hidden border-r bg-muted/40 md:block w-64 h-full fixed top-0 left-0 pt-16 z-30">
            <div className="flex h-full max-h-screen flex-col gap-2">
                {/* Workspace Switcher */}
                <div className="px-2 pt-2 border-b pb-2">
                    <WorkspaceSwitcher
                        workspaces={workspaces}
                        currentWorkspaceId={currentWorkspaceId}
                    />
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        isActive
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
