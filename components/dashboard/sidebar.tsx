"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Settings,
    BarChart3,
    Layers,
    MessageSquare,
    Home
} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";

interface Workspace {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
}

interface SidebarProps {
    workspaces?: Workspace[];
    currentWorkspaceId?: string;
}

const sidebarItems = [
    {
        title: "Vista General",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Proyectos",
        href: "/dashboard/projects",
        icon: FolderKanban,
    },
    {
        title: "Miembros",
        href: "/dashboard/members",
        icon: Users,
    },
    {
        title: "Analíticas",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Configuración",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar({ workspaces = [], currentWorkspaceId }: SidebarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const workspaceId = currentWorkspaceId || searchParams.get("workspace") || undefined;

    return (
        <aside className="hidden border-r bg-muted/40 md:block w-64 h-full fixed top-0 left-0 pt-16 z-30">
            <div className="flex h-full max-h-screen flex-col gap-2">
                {/* Workspace Switcher */}
                <div className="px-2 pt-2 border-b pb-2">
                    <WorkspaceSwitcher
                        workspaces={workspaces}
                        currentWorkspaceId={workspaceId}
                    />
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
                        {sidebarItems.map((item) => {
                            // Construct href with workspace param preservation
                            const href = workspaceId
                                ? `${item.href}?workspace=${workspaceId}`
                                : item.href;

                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={href}
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

