"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useState } from "react";

interface MobileSidebarProps {
    workspaces?: any[];
    currentWorkspaceId?: string;
    workspaceLogo?: string | null;
    workspaceName?: string;
    workspaceColor?: string;
}

export function MobileSidebar({
    workspaces = [],
    currentWorkspaceId,
    workspaceLogo,
    workspaceName,
    workspaceColor
}: MobileSidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2 -ml-2 text-muted-foreground"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-background w-72">
                <Sidebar
                    workspaces={workspaces}
                    currentWorkspaceId={currentWorkspaceId}
                    workspaceLogo={workspaceLogo}
                    workspaceName={workspaceName}
                    workspaceColor={workspaceColor}
                    isMobile={true}
                    onItemClick={() => setOpen(false)}
                />
            </SheetContent>
        </Sheet>
    );
}
