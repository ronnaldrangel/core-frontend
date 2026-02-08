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
    Banknote,
    ChevronDown,
    ListChecks,
    FolderKanban,

} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { useState } from "react";
import { useRBAC } from "@/components/providers/rbac-provider";
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
    const { hasPermission, isLoading } = useRBAC();
    const [productosOpen, setProductosOpen] = useState(pathname.includes("/products") || pathname.includes("/categories"));
    const [settingsOpen, setSettingsOpen] = useState(pathname.includes("/settings") || pathname.includes("/messages"));

    const logoUrl = workspaceLogo
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspaceLogo}`
        : undefined;

    // Generar items del sidebar con rutas dinámicas usando slug
    const sidebarItemsBeforeProducts = [
        {
            title: "Vista General",
            href: `/dashboard/${currentWorkspaceId}`,
            icon: LayoutDashboard,
            permission: "dashboard.read",
        },

        {
            title: "Miembros",
            href: `/dashboard/${currentWorkspaceId}/members`,
            icon: Users,
            permission: "members.read",
        },
        {
            title: "Clientes",
            href: `/dashboard/${currentWorkspaceId}/clients`,
            icon: UserCircle,
            permission: "clients.read",
        },
    ];

    const sidebarItemsAfterProducts = [
        {
            title: "Punto de Venta",
            href: `/dashboard/${currentWorkspaceId}/pos`,
            icon: ShoppingCart,
            permission: "orders.create",
        },
        {
            title: "Pedidos",
            href: `/dashboard/${currentWorkspaceId}/orders`,
            icon: Receipt,
            permission: "orders.read",
        },
        {
            title: "Caja",
            href: `/dashboard/${currentWorkspaceId}/cashbox`,
            icon: Banknote,
            permission: "cashbox.read",
        },
    ];

    const productosSubItems = [
        {
            title: "Mi Lista",
            href: `/dashboard/${currentWorkspaceId}/products`,
            permission: "products.read",
        },
        {
            title: "Mis Categorías",
            href: `/dashboard/${currentWorkspaceId}/categories`,
            permission: "categories.manage",
        },
    ];



    const settingsSubItems = [
        {
            title: "General",
            href: `/dashboard/${currentWorkspaceId}/settings`,
            permission: "settings.manage",
        },
        {
            title: "Mensajes WhatsApp",
            href: `/dashboard/${currentWorkspaceId}/orders/messages`,
            permission: "settings.manage",
        },
    ];


    // Filter items based on permissions
    const visibleBeforeProducts = sidebarItemsBeforeProducts.filter(item =>
        !item.permission || hasPermission(item.permission)
    );

    const visibleAfterProducts = sidebarItemsAfterProducts.filter(item =>
        !item.permission || hasPermission(item.permission)
    );

    const visibleProductsSubItems = productosSubItems.filter(item =>
        !item.permission || hasPermission(item.permission)
    );

    const hasProductsAccess = visibleProductsSubItems.length > 0;



    const visibleSettingsSubItems = settingsSubItems.filter(item =>
        !item.permission || hasPermission(item.permission)
    );

    const hasSettingsAccess = visibleSettingsSubItems.length > 0;

    const content = (
        <div className="flex h-full max-h-screen flex-col gap-2">
            {/* Workspace Logo Only Area - Only shown in Mobile Sidebar */}
            {isMobile && (
                <div className="px-6 py-6 flex items-center justify-center border-b bg-muted/5 group cursor-pointer hover:bg-muted/10 transition-colors h-24">
                    <Link
                        href={hasPermission("dashboard.read") ? `/dashboard/${currentWorkspaceId}` : `/dashboard/${currentWorkspaceId}/orders`}
                        onClick={onItemClick}
                        className="flex items-center justify-center"
                    >
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
                    {/* Items antes de Productos */}
                    {visibleBeforeProducts.map((item) => {
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

                    {/* Productos Dropdown */}
                    {hasProductsAccess && (
                        <div className="space-y-1">
                            <button
                                onClick={() => setProductosOpen(!productosOpen)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary w-full",
                                    pathname.includes("/products") || pathname.includes("/categories")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Package className="h-4 w-4" />
                                <span className="flex-1 text-left">Productos</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        productosOpen ? "rotate-180" : ""
                                    )}
                                />
                            </button>

                            {/* Sub-items */}
                            {productosOpen && (
                                <div className="ml-4 space-y-1">
                                    {visibleProductsSubItems.map((subItem) => {
                                        const isActive = pathname === subItem.href;
                                        return (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                onClick={onItemClick}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    isActive
                                                        ? "bg-muted text-primary"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {subItem.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}



                    {/* Items después de Productos */}
                    {visibleAfterProducts.map((item) => {
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

                    {/* Configuración Dropdown */}
                    {hasSettingsAccess && (
                        <div className="space-y-1">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary w-full",
                                    pathname.includes("/settings") || pathname.includes("/messages")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Settings className="h-4 w-4" />
                                <span className="flex-1 text-left">Configuración</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        settingsOpen ? "rotate-180" : ""
                                    )}
                                />
                            </button>

                            {/* Sub-items de Configuración */}
                            {settingsOpen && (
                                <div className="ml-4 space-y-1">
                                    {visibleSettingsSubItems.map((subItem) => {
                                        const isActive = pathname === subItem.href;
                                        return (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                onClick={onItemClick}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    isActive
                                                        ? "bg-muted text-primary"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {subItem.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
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
