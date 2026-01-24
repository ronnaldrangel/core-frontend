import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import Link from "next/link";
import { ChevronLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface POSLayoutProps {
    children: React.ReactNode;
    params: Promise<{ workspaceId: string }>;
}

export default async function POSLayout({ children, params }: POSLayoutProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId } = await params;

    const { data: workspace, error } = await getWorkspaceBySlug(workspaceId);

    if (error || !workspace) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
            {/* Minimal Header for Tablet POS */}
            <header className="h-14 border-b bg-card px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/${workspace.slug}`}>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-widest">Panel</span>
                        </Button>
                    </Link>
                    <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                            style={{ backgroundColor: workspace.color || "var(--primary)" }}
                        />
                        <span className="font-black uppercase text-xs tracking-tighter">{workspace.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase ml-2 tracking-widest hidden xs:inline">Punto de Venta</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black uppercase text-foreground leading-none">{session.user.first_name} {session.user.last_name}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">{session.user.email}</span>
                    </div>
                    <Link href={`/dashboard/${workspace.slug}`}>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-none bg-muted/20">
                            <LayoutDashboard className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
