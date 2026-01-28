"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Plus, Check, Boxes } from "lucide-react";
import Image from "next/image";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
    icon?: string | null;
    logo?: string | null; // Added logo
}

interface WorkspaceSwitcherProps {
    workspaces: Workspace[];
    currentWorkspaceId?: string; // This is now the slug
    onItemClick?: () => void;
}

export function WorkspaceSwitcher({ workspaces, currentWorkspaceId, onItemClick }: WorkspaceSwitcherProps) {
    const router = useRouter();
    const currentWorkspace = workspaces.find(ws => ws.slug === currentWorkspaceId);

    const handleSwitch = (workspaceSlug: string) => {
        if (workspaceSlug === currentWorkspaceId) return;
        // Navegar al nuevo workspace con slug
        router.push(`/dashboard/${workspaceSlug}`);
        onItemClick?.();
    };

    const handleGoToSelector = () => {
        router.push("/workspaces");
        onItemClick?.();
    };

    if (!currentWorkspace && workspaces.length === 0) {
        return (
            <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2"
                onClick={handleGoToSelector}
            >
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Plus className="size-4" />
                </div>
                <span className="text-sm text-muted-foreground">Crear workspace</span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start gap-2 px-2 py-2 h-auto data-[state=open]:bg-accent"
                >
                    <div
                        className="flex size-8 items-center justify-center rounded-lg text-white text-sm font-bold overflow-hidden relative border bg-background"
                        style={{ backgroundColor: !currentWorkspace?.logo ? (currentWorkspace?.color || "#6366F1") : undefined }}
                    >
                        {currentWorkspace?.logo ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${currentWorkspace.logo}?width=32&height=32&fit=cover`}
                                alt={currentWorkspace.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span>{currentWorkspace?.name?.[0].toUpperCase() || <Boxes className="size-5" />}</span>
                        )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-xs text-muted-foreground uppercase tracking-widest leading-none">
                            {currentWorkspace?.name || "Sin seleccionar"}
                        </span>
                        <span className="truncate text-[10px] font-bold text-muted-foreground/50 uppercase mt-1 tracking-tight">
                            Espacio de Trabajo
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="right"
                sideOffset={4}
            >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Tus Workspaces
                </DropdownMenuLabel>
                {workspaces.map((ws) => (
                    <DropdownMenuItem
                        key={ws.id}
                        onClick={() => handleSwitch(ws.slug)}
                        className="gap-2 p-2 cursor-pointer"
                    >
                        <div
                            className="flex size-6 items-center justify-center rounded-md text-white text-[10px] font-bold overflow-hidden relative border"
                            style={{ backgroundColor: !ws.logo ? (ws.color || "#6366F1") : undefined }}
                        >
                            {ws.logo ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${ws.logo}?width=24&height=24&fit=cover`}
                                    alt={ws.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span>{ws.name[0].toUpperCase()}</span>
                            )}
                        </div>
                        <span className="flex-1 truncate font-medium text-xs">{ws.name}</span>
                        {ws.slug === currentWorkspaceId && (
                            <Check className="size-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleGoToSelector}
                    className="gap-2 p-2 cursor-pointer"
                >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <Plus className="size-4" />
                    </div>
                    <span className="text-muted-foreground font-medium">Ver todos / Crear nuevo</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
