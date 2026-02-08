"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronRight, Boxes, Mail, Check, X, Clock, Loader2 } from "lucide-react";
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
    role_name?: string;
    date_created: string;
    workspace_id: string | {
        id: string;
        name: string;
        slug: string;
        color: string;
        icon: string;
        logo: string | null;
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

import { useRealtimeInvitations } from "@/hooks/use-realtime-invitations";
import { type WorkspaceInvitation } from "@/lib/invitation-actions";

export function WorkspaceSelector({
    initialWorkspaces,
    pendingInvitations: serverPendingInvitations = [],
    userName,
    userEmail,
}: WorkspaceSelectorProps) {
    const { invitations: pendingInvitations } = useRealtimeInvitations(serverPendingInvitations as any);
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Tus Workspaces</h1>
                    <p className="text-muted-foreground mt-1">Selecciona un espacio de trabajo para continuar</p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar workspace..."
                            className="pl-9 bg-background/50 border-input text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="default"
                        className="w-full md:w-auto gap-2 font-medium"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Workspace
                    </Button>
                </div>
            </div>


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
                                    className="group relative flex flex-col sm:flex-row p-5 gap-5 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300"
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center">
                                        <div
                                            className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden relative shadow-inner ring-4 ring-background"
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

                                    <div className="flex-grow min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-foreground">
                                                {wsInfo.name || "Workspace"}
                                            </h3>
                                            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                                {invitation.role_name || roleLabels[invitation.role] || "Miembro"}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <span>Invitado por</span>
                                            <span className="font-semibold text-foreground">
                                                {inviterInfo.first_name} {inviterInfo.last_name}
                                            </span>
                                            <span className="hidden sm:inline text-muted-foreground/40 mx-1">•</span>
                                            <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(invitation.date_created)}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex flex-row items-center justify-end gap-3 sm:self-center ml-auto w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="w-36"
                                            onClick={() => handleRejectInvitation(invitation.id)}
                                            disabled={isPending && processingId === invitation.id}
                                        >
                                            {isPending && processingId === invitation.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <X className="h-4 w-4 mr-2" />
                                            )}
                                            {isPending && processingId === invitation.id ? "Procesando" : "Rechazar"}
                                        </Button>
                                        <Button
                                            variant="default"
                                            className="w-36"
                                            onClick={() => handleAcceptInvitation(invitation.id)}
                                            disabled={isPending && processingId === invitation.id}
                                        >
                                            {isPending && processingId === invitation.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Check className="h-4 w-4 mr-2" />
                                            )}
                                            {isPending && processingId === invitation.id ? "Espera..." : "Aceptar"}
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
                            {!searchTerm && (
                                <Button
                                    variant="default"
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
