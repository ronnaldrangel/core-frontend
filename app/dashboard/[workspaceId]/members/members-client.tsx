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
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
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

            {/* Owner Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        Propietario
                    </CardTitle>
                    <CardDescription>
                        El propietario tiene control total sobre el workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                {owner?.first_name?.[0]?.toUpperCase() || "O"}
                            </div>
                            <div>
                                <p className="font-medium">
                                    {owner ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() : 'Propietario'}
                                    {owner?.id === currentUserId && (
                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            Tú
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-muted-foreground">{owner?.email || 'Sin email'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600">Propietario</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-500" />
                            Invitaciones Pendientes ({pendingInvitations.length})
                        </CardTitle>
                        <CardDescription>
                            Estas invitaciones están esperando ser aceptadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {pendingInvitations.map((invitation) => {
                                const user = invitation.invited_user_id;
                                const roleInfo = roleLabels[invitation.role as keyof typeof roleLabels] || roleLabels.viewer;
                                const RoleIcon = roleInfo.icon;

                                return (
                                    <div
                                        key={invitation.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-background/80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                                                {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className={`flex items-center gap-1.5 ${roleInfo.color}`}>
                                                    <RoleIcon className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{roleInfo.label}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(invitation.date_created)}
                                                </p>
                                            </div>

                                            {isAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => setInvitationToCancel(invitation)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Members List */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Miembros ({members.length})
                    </CardTitle>
                    <CardDescription>
                        Usuarios con acceso a este workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {members.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No hay miembros adicionales en este workspace.</p>
                            {isAdmin && (
                                <Button
                                    variant="link"
                                    className="mt-2"
                                    onClick={() => setIsInviteOpen(true)}
                                >
                                    Invitar al primer miembro
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {members.map((member) => {
                                const info = getMemberInfo(member);
                                const roleInfo = roleLabels[member.role as keyof typeof roleLabels] || roleLabels.viewer;
                                const RoleIcon = roleInfo.icon;
                                const isCurrentUser = info.id === currentUserId;

                                return (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center font-medium">
                                                {info.initials}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {info.name}
                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                            Tú
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{info.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-1.5 ${roleInfo.color}`}>
                                                <RoleIcon className="h-4 w-4" />
                                                <span className="text-sm font-medium">{roleInfo.label}</span>
                                            </div>

                                            {isAdmin && !isCurrentUser && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setMemberToEdit(member);
                                                                setEditRole(member.role);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Cambiar rol
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => setMemberToDelete(member)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar del workspace
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
