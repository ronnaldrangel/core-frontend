"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronRight, Boxes, Mail, Check, X, Clock } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateWorkspaceModal } from "@/components/create-workspace-modal";
import { acceptInvitation, rejectInvitation } from "@/lib/invitation-actions";
import { toast } from "sonner";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    logo?: string | null; // Added logo
    members?: any[];
    plan?: string;
    projectCount?: number;
}

interface Invitation {
    id: string;
    status: string;
    role: string;
    date_created: string;
    workspace_id: string | {
        id: string;
        name: string;
        slug: string;
        color: string;
        icon: string;
        logo: string | null; // Added logo
    };
    invited_by: string | {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
}

interface WorkspaceSelectorProps {
    initialWorkspaces: Workspace[];
    pendingInvitations?: Invitation[];
    userName?: string;
    userEmail?: string;
    hasPaid: boolean;
}

const roleLabels: Record<string, string> = {
    admin: "Administrador",
    editor: "Editor",
    viewer: "Visualizador",
};

// Helper functions for type unions
const getWorkspaceInfo = (workspace_id: Invitation["workspace_id"]) => {
    if (typeof workspace_id === 'string') {
        return { name: 'Workspace', color: '#6366F1', slug: '', icon: '', logo: null };
    }
    return workspace_id;
};

const getInviterInfo = (invited_by: Invitation["invited_by"]) => {
    if (typeof invited_by === 'string') {
        return { first_name: 'Usuario', last_name: '', email: '' };
    }
    return invited_by;
};

export function WorkspaceSelector({
    initialWorkspaces,
    pendingInvitations = [],
    userName,
    userEmail,
    hasPaid
}: WorkspaceSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    // Filtrar workspaces
    const filteredWorkspaces = initialWorkspaces.filter(ws =>
        ws.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleWorkspaceSelect = (workspaceSlug: string) => {
        router.push(`/dashboard/${workspaceSlug}`);
    };

    const handleAcceptInvitation = async (invitationId: string) => {
        setProcessingId(invitationId);
        startTransition(async () => {
            const result = await acceptInvitation(invitationId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("¡Invitación aceptada! Ahora eres miembro del workspace.");
                router.refresh();
            }
            setProcessingId(null);
        });
    };

    const handleRejectInvitation = async (invitationId: string) => {
        setProcessingId(invitationId);
        startTransition(async () => {
            const result = await rejectInvitation(invitationId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Invitación rechazada");
                router.refresh();
            }
            setProcessingId(null);
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `hace ${diffMins} min`;
        if (diffHours < 24) return `hace ${diffHours}h`;
        if (diffDays < 7) return `hace ${diffDays}d`;
        return date.toLocaleDateString();
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Tus Workspaces</h1>
                    <p className="text-muted-foreground mt-1">Selecciona un espacio de trabajo para continuar</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar workspace..."
                            className="pl-9 bg-background/50 border-input text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        className={cn(
                            "gap-2 font-medium transition-all shadow-sm active:scale-95",
                            hasPaid
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-muted-foreground/10 text-muted-foreground cursor-not-allowed hover:bg-muted-foreground/20"
                        )}
                        onClick={() => {
                            if (!hasPaid) {
                                toast.error("Función Premium", {
                                    description: "Debes activar un plan para crear este workspace."
                                });
                                return;
                            }
                            setIsCreateModalOpen(true);
                        }}
                    >
                        {hasPaid ? <Plus className="h-4 w-4" /> : <Boxes className="h-4 w-4" />}
                        {hasPaid ? "Nuevo Workspace" : "Mejorar Plan"}
                    </Button>
                </div>
            </div>

            {/* Premium trial reminder if not paid */}
            {!hasPaid && (
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Boxes className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Modo Visualizador</p>
                            <p className="text-sm text-muted-foreground">Adquiere un plan para poder crear tus propios espacios de trabajo.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10 shrink-0">
                        Ver Planes
                    </Button>
                </div>
            )}

            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-semibold">
                            Invitaciones Pendientes
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({pendingInvitations.length})
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {pendingInvitations.map((invitation) => {
                            const wsInfo = getWorkspaceInfo(invitation.workspace_id);
                            const inviterInfo = getInviterInfo(invitation.invited_by);

                            return (
                                <div
                                    key={invitation.id}
                                    className="flex flex-row p-4 gap-4 rounded-xl border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20"
                                >
                                    <div className="flex-shrink-0">
                                        <div
                                            className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg overflow-hidden relative shadow-sm"
                                            style={{ backgroundColor: wsInfo.color || "#6366F1" }}
                                        >
                                            {wsInfo.logo ? (
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${wsInfo.logo}`}
                                                    alt={wsInfo.name}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                wsInfo.name?.charAt(0).toUpperCase() || "W"
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-grow min-w-0 ml-2 sm:ml-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <h3 className="text-sm sm:text-base font-bold sm:font-semibold text-foreground truncate">
                                                {wsInfo.name || "Workspace"}
                                            </h3>
                                            <span className="inline-block self-start text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                                                {roleLabels[invitation.role] || invitation.role}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                                            <span className="hidden sm:inline">Invitado por </span><span className="font-medium text-foreground">{inviterInfo.first_name} {inviterInfo.last_name}</span>
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                                            onClick={() => handleRejectInvitation(invitation.id)}
                                            disabled={isPending && processingId === invitation.id}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Rechazar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleAcceptInvitation(invitation.id)}
                                            disabled={isPending && processingId === invitation.id}
                                        >
                                            <Check className="h-4 w-4 mr-1" />
                                            {isPending && processingId === invitation.id ? "Procesando..." : "Aceptar"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Workspaces List */}
            <div className="space-y-4">
                {pendingInvitations.length > 0 && (
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        Mis Workspaces
                    </h2>
                )}

                <div className="grid gap-3">
                    {filteredWorkspaces.length > 0 ? (
                        filteredWorkspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                onClick={() => handleWorkspaceSelect(workspace.slug)}
                                className="group relative flex items-center p-3 sm:p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer overflow-hidden"
                            >
                                <div className="flex-shrink-0">
                                    <div
                                        className={cn(
                                            "h-12 w-12 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg overflow-hidden relative shadow-sm transition-transform group-hover:scale-110",
                                            !workspace.color && !workspace.logo && "bg-gradient-to-br from-blue-600 to-purple-600"
                                        )}
                                        style={workspace.color && !workspace.logo ? { backgroundColor: workspace.color } : {}}
                                    >
                                        {workspace.logo ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspace.logo}`}
                                                alt={workspace.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            workspace.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>

                                <div className="flex-grow min-w-0 ml-4 sm:ml-6">
                                    <h3 className="text-base sm:text-lg font-bold sm:font-semibold text-foreground truncate group-hover:text-blue-600 transition-colors">
                                        {workspace.name}
                                    </h3>
                                    {workspace.description && (
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 opacity-80 truncate max-w-[200px] sm:max-w-[400px]">
                                            {workspace.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-shrink-0 ml-4 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Boxes className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron workspaces</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                {searchTerm ? "Intenta con otro término de búsqueda." : "Aún no eres miembro de ningún workspace."}
                            </p>
                            {!searchTerm && hasPaid && (
                                <Button
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-accent"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    Crear mi primer workspace
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <CreateWorkspaceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div >
    );
}
