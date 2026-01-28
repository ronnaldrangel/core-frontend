"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Settings,
    Package,
    UserCircle,
    ShoppingCart,
    Receipt,
} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";

import { Logo } from "@/components/logo";

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
    isMobile?: boolean;
    onItemClick?: () => void;
    workspaceLogo?: string | null;
    workspaceName?: string;
    workspaceColor?: string;
}

export function Sidebar({
    workspaces = [],
    currentWorkspaceId,
    isMobile = false,
    onItemClick,
    workspaceLogo,
    workspaceName,
    workspaceColor,
}: SidebarProps) {
    const pathname = usePathname();

    const logoUrl = workspaceLogo
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspaceLogo}`
        : undefined;

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
            title: "Clientes",
            href: `/dashboard/${currentWorkspaceId}/clients`,
            icon: UserCircle,
        },
        {
            title: "Productos",
            href: `/dashboard/${currentWorkspaceId}/products`,
            icon: Package,
        },
        {
            title: "Punto de Venta",
            href: `/dashboard/${currentWorkspaceId}/pos`,
            icon: ShoppingCart,
        },
        {
            title: "Historial de Ventas",
            href: `/dashboard/${currentWorkspaceId}/orders`,
            icon: Receipt,
        },
        {
            title: "Configuración",
            href: `/dashboard/${currentWorkspaceId}/settings`,
            icon: Settings,
        },
    ];

    const content = (
        <div className="flex h-full max-h-screen flex-col gap-2">
            {/* Workspace Logo Only Area - Only shown in Mobile Sidebar */}
            {isMobile && (
                <div className="px-6 py-6 flex items-center justify-center border-b bg-muted/5 group cursor-pointer hover:bg-muted/10 transition-colors h-24">
                    <Link href="/workspaces" onClick={onItemClick} className="flex items-center justify-center">
                        <div
                            className="size-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden border-2 bg-background shadow-md group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: !workspaceLogo ? (workspaceColor || "#6366F1") : undefined }}
                        >
                            {workspaceLogo ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspaceLogo}?width=60&height=60&fit=cover`}
                                    alt={workspaceName || ""}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span>{workspaceName?.[0].toUpperCase() || "W"}</span>
                            )}
                        </div>
                    </Link>
                </div>
            )}

            {/* Workspace Switcher */}
            <div className="px-2 pt-2 border-b pb-2">
                <WorkspaceSwitcher
                    workspaces={workspaces}
                    currentWorkspaceId={currentWorkspaceId}
                    onItemClick={onItemClick}
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
                                onClick={onItemClick}
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
    );

    if (isMobile) {
        return <div className="flex flex-col h-full bg-background">{content}</div>;
    }

    return (
        <aside className="hidden border-r bg-muted/40 md:block w-64 h-full fixed top-0 left-0 pt-16 z-30">
            {content}
        </aside>
    );
}
