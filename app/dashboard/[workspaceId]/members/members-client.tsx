"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    updateMemberRole,
    removeWorkspaceMemberWithSlug
} from "@/lib/workspace-actions";
import {
    sendInvitation,
    getWorkspacePendingInvitations,
    cancelInvitation,
    WorkspaceInvitation
} from "@/lib/invitation-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Users,
    UserPlus,
    MoreHorizontal,
    Shield,
    Edit,
    Eye,
    Trash2,
    Crown,
    Mail,
    Clock,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    owner: any;
    members?: any[];
}

interface PendingInvitation {
    id: string;
    role: string;
    date_created: string;
    invited_user_id: any;
    invited_by: any;
}

interface MembersClientProps {
    workspace: Workspace;
    pendingInvitations: PendingInvitation[];
    currentUserId: string;
    currentUserEmail: string;
    isOwner: boolean;
    isAdmin: boolean;
}

const roleLabels = {
    admin: { label: "Administrador", icon: Shield, color: "text-blue-500" },
    editor: { label: "Editor", icon: Edit, color: "text-green-500" },
    viewer: { label: "Visualizador", icon: Eye, color: "text-gray-500" },
};

export function MembersClient({
    workspace,
    pendingInvitations,
    currentUserId,
    currentUserEmail,
    isOwner,
    isAdmin
}: MembersClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("viewer");
    const [memberToDelete, setMemberToDelete] = useState<any>(null);
    const [memberToEdit, setMemberToEdit] = useState<any>(null);
    const [editRole, setEditRole] = useState<"admin" | "editor" | "viewer">("viewer");
    const [invitationToCancel, setInvitationToCancel] = useState<any>(null);

    const owner = typeof workspace.owner === 'object' ? workspace.owner : null;
    const members = workspace.members || [];

    const handleInvite = async () => {
        if (!inviteEmail.trim()) {
            toast.error("Ingresa un email válido");
            return;
        }

        startTransition(async () => {
            const result = await sendInvitation(
                workspace.id,
                inviteEmail.trim(),
                inviteRole,
                workspace.slug
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Invitación enviada exitosamente. El usuario verá la invitación en su página de workspaces.");
                setInviteEmail("");
                setInviteRole("viewer");
                setIsInviteOpen(false);
                router.refresh();
            }
        });
    };

    const handleRoleChange = async () => {
        if (!memberToEdit) return;

        startTransition(async () => {
            const result = await updateMemberRole(memberToEdit.id, editRole, workspace.slug);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Rol actualizado exitosamente");
                setMemberToEdit(null);
                router.refresh();
            }
        });
    };

    const handleRemoveMember = async () => {
        if (!memberToDelete) return;

        startTransition(async () => {
            const result = await removeWorkspaceMemberWithSlug(memberToDelete.id, workspace.slug);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Miembro eliminado exitosamente");
                setMemberToDelete(null);
                router.refresh();
            }
        });
    };

    const handleCancelInvitation = async () => {
        if (!invitationToCancel) return;

        startTransition(async () => {
            const result = await cancelInvitation(invitationToCancel.id, workspace.slug);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Invitación cancelada");
                setInvitationToCancel(null);
                router.refresh();
            }
        });
    };

    const getMemberInfo = (member: any) => {
        const user = typeof member.user_id === 'object' ? member.user_id : null;
        return {
            id: user?.id || member.user_id,
            name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Sin nombre' : 'Usuario',
            email: user?.email || 'Sin email',
            initials: user?.first_name?.[0]?.toUpperCase() || 'U',
        };
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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Miembros del Equipo
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona quién tiene acceso a <span className="font-medium">{workspace.name}</span>
                    </p>
                </div>

                {isAdmin && (
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Invitar Miembro
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invitar nuevo miembro</DialogTitle>
                                <DialogDescription>
                                    Ingresa el email del usuario que deseas invitar.
                                    Recibirá una invitación que podrá aceptar o rechazar.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email del usuario</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="usuario@ejemplo.com"
                                            className="pl-10"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="viewer">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                    Visualizador - Solo puede ver
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="editor">
                                                <div className="flex items-center gap-2">
                                                    <Edit className="h-4 w-4 text-green-500" />
                                                    Editor - Puede editar contenido
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-blue-500" />
                                                    Administrador - Control total
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleInvite} disabled={isPending}>
                                    {isPending ? "Enviando..." : "Enviar Invitación"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Members List */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-4 py-3 min-w-[280px]">Usuario</th>
                                    <th className="px-4 py-3">Rol</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {/* Owner Row */}
                                <tr className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 text-white">
                                                {owner?.first_name?.[0]?.toUpperCase() || "O"}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground">
                                                        {owner ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() : 'Propietario'}
                                                    </span>
                                                    {owner?.id === currentUserId && (
                                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                            Tú
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{owner?.email || 'Sin email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-700/50">
                                            <Crown className="h-3.5 w-3.5" />
                                            Propietario
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {/* No actions for owner usually */}
                                    </td>
                                </tr>

                                {/* Other Members */}
                                {members.map((member) => {
                                    const info = getMemberInfo(member);
                                    const roleInfo = roleLabels[member.role as keyof typeof roleLabels] || roleLabels.viewer;
                                    const RoleIcon = roleInfo.icon;
                                    const isCurrentUser = info.id === currentUserId;

                                    return (
                                        <tr key={member.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 bg-muted rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 text-muted-foreground border">
                                                        {info.initials}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-foreground">{info.name}</span>
                                                            {isCurrentUser && (
                                                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                                    Tú
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{info.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border",
                                                    member.role === 'admin' ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" :
                                                        member.role === 'editor' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" :
                                                            "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800"
                                                )}>
                                                    <RoleIcon className="h-3.5 w-3.5" />
                                                    {roleInfo.label}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {isAdmin && !isCurrentUser && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setMemberToEdit(member);
                                                                    setEditRole(member.role);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Cambiar rol
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                                onClick={() => setMemberToDelete(member)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar del workspace
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Role Dialog */}
            <Dialog open={!!memberToEdit} onOpenChange={(open) => !open && setMemberToEdit(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar rol del miembro</DialogTitle>
                        <DialogDescription>
                            Selecciona el nuevo rol para {memberToEdit ? getMemberInfo(memberToEdit).name : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={editRole} onValueChange={(v: any) => setEditRole(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="viewer">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-gray-500" />
                                        Visualizador
                                    </div>
                                </SelectItem>
                                <SelectItem value="editor">
                                    <div className="flex items-center gap-2">
                                        <Edit className="h-4 w-4 text-green-500" />
                                        Editor
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-500" />
                                        Administrador
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMemberToEdit(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleRoleChange} disabled={isPending}>
                            {isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Member Confirmation */}
            <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará a {memberToDelete ? getMemberInfo(memberToDelete).name : ''} del workspace.
                            El usuario perderá todo acceso.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveMember}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Invitation Confirmation */}
            <AlertDialog open={!!invitationToCancel} onOpenChange={(open) => !open && setInvitationToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar invitación?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cancelará la invitación enviada a {invitationToCancel?.invited_user_id?.email}.
                            El usuario ya no podrá unirse al workspace con esta invitación.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Mantener</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelInvitation}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Cancelando..." : "Cancelar invitación"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
