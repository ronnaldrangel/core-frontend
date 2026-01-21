"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Plus, Check, Boxes } from "lucide-react";

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
    color?: string | null;
    icon?: string | null;
}

interface WorkspaceSwitcherProps {
    workspaces: Workspace[];
    currentWorkspaceId?: string;
}

export function WorkspaceSwitcher({ workspaces, currentWorkspaceId }: WorkspaceSwitcherProps) {
    const router = useRouter();
    const currentWorkspace = workspaces.find(ws => ws.id === currentWorkspaceId);

    const handleSwitch = (workspaceId: string) => {
        if (workspaceId === currentWorkspaceId) return;
        // Navegar al nuevo workspace con URL limpia
        router.push(`/dashboard/${workspaceId}`);
    };

    const handleGoToSelector = () => {
        router.push("/workspaces");
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
                        className="flex size-8 items-center justify-center rounded-lg text-white text-sm font-bold"
                        style={{ backgroundColor: currentWorkspace?.color || "#6366F1" }}
                    >
                        {currentWorkspace?.name?.[0]?.toUpperCase() || <Boxes className="size-4" />}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {currentWorkspace?.name || "Sin seleccionar"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            Workspace activo
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
                        onClick={() => handleSwitch(ws.id)}
                        className="gap-2 p-2 cursor-pointer"
                    >
                        <div
                            className="flex size-6 items-center justify-center rounded-md text-white text-xs font-bold"
                            style={{ backgroundColor: ws.color || "#6366F1" }}
                        >
                            {ws.name?.[0]?.toUpperCase() || "W"}
                        </div>
                        <span className="flex-1 truncate">{ws.name}</span>
                        {ws.id === currentWorkspaceId && (
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
