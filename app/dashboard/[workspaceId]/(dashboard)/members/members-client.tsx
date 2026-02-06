"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    updateMemberRole,
    removeWorkspaceMemberWithSlug
} from "@/lib/workspace-actions";
import {
    sendInvitation,
    cancelInvitation
} from "@/lib/invitation-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
    UserPlus,
    MoreHorizontal,
    Edit,
    Trash2,
    Crown,
    Mail,
    Clock,
    X,
    CheckCircle2,
    Shield,
    Eye
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
    rbacRoles: any[];
}

const roleLabels: any = {
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
    isAdmin,
    rbacRoles = []
}: MembersClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<string>("");
    const [memberToDelete, setMemberToDelete] = useState<any>(null);
    const [memberToEdit, setMemberToEdit] = useState<any>(null);
    const [editRole, setEditRole] = useState<string>("");
    const [invitationToCancel, setInvitationToCancel] = useState<any>(null);

    // Initial role selection
    useState(() => {
        if (rbacRoles.length > 0) {
            setInviteRole(rbacRoles[rbacRoles.length - 1].id); // Usually viewer is last
        } else {
            setInviteRole("viewer");
        }
    });

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
                toast.success("Invitación enviada exitosamente.");
                setInviteEmail("");
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
            isOwner: false,
        };
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
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

    // --- Unified Data Preparation ---

    interface UnifiedRow {
        id: string;
        type: 'owner' | 'member' | 'invitation';
        user: {
            name: string;
            email: string;
            initials: string;
            id?: string;
        };
        roleName: string;
        status: 'active' | 'pending';
        date: string;
        raw: any;
        isCurrentUser: boolean;
        avatarColor?: string;
    }

    const allRows: UnifiedRow[] = [];

    // 1. Owner
    if (owner) {
        allRows.push({
            id: 'owner',
            type: 'owner',
            user: {
                name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim(),
                email: owner.email,
                initials: owner.first_name?.[0]?.toUpperCase() || 'O',
                id: owner.id
            },
            roleName: 'Propietario',
            status: 'active',
            date: '', // Owner doesn't typically show date or we don't have it easily
            raw: owner,
            isCurrentUser: owner.id === currentUserId
        });
    }

    // 2. Members (excluding owner if they happen to be in the members list, usually separate)
    members.forEach((member: any) => {
        const info = getMemberInfo(member);
        // Skip if this member record is somehow the owner (data integrity check, usually owner is separate)
        if (info.id === owner?.id) return;

        const roleName = member.role_id?.name || 'Visualizador';

        allRows.push({
            id: member.id,
            type: 'member',
            user: {
                name: info.name,
                email: info.email,
                initials: info.initials,
                id: info.id
            },
            roleName,
            status: 'active',
            date: member.date_created,
            raw: member,
            isCurrentUser: info.id === currentUserId
        });
    });

    // 3. Invitations
    pendingInvitations.forEach((invitation) => {
        const roleId = typeof invitation.role === 'object' ? (invitation.role as any).id : invitation.role;
        const roleName = rbacRoles.find(r => r.id === roleId)?.name || 'viewer';
        const email = typeof invitation.invited_user_id === 'object' ? invitation.invited_user_id?.email : invitation.invited_user_id;

        allRows.push({
            id: invitation.id,
            type: 'invitation',
            user: {
                name: email, // Use email as name for invited users
                email: email,
                initials: '?',
            },
            roleName,
            status: 'pending',
            date: invitation.date_created,
            raw: invitation,
            isCurrentUser: false
        });
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Miembros del equipo
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
                                    <Select value={inviteRole} onValueChange={(v) => setInviteRole(v)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rbacRoles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
                                <Button onClick={handleInvite} disabled={isPending}>Enviar Invitación</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Unified Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-4 py-3 min-w-[280px]">Usuario</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Rol</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {allRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border",
                                                    row.type === 'owner' ? "bg-yellow-500 text-white border-yellow-600" :
                                                        row.type === 'invitation' ? "bg-muted/50 border-dashed text-muted-foreground" :
                                                            "bg-muted text-muted-foreground"
                                                )}>
                                                    {row.type === 'invitation' ? '?' : row.user.initials}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("font-semibold", row.type === 'invitation' ? "text-muted-foreground" : "text-foreground")}>
                                                            {row.user.name}
                                                        </span>
                                                        {row.isCurrentUser && (
                                                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                                Tú
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{row.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.status === 'active' ? (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 w-fit">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Activo
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 border-dashed w-fit">
                                                    <Clock className="h-3 w-3" />
                                                    Pendiente
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.type === 'owner' ? (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-700/50">
                                                    <Crown className="h-3.5 w-3.5" />
                                                    Propietario
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                                                    {row.roleName}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {row.type === 'invitation' ? formatDate(row.date) : (row.date ? formatDate(row.date) : '-')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {isAdmin && !row.isCurrentUser && row.type !== 'owner' && (
                                                <>
                                                    {row.type === 'member' && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setMemberToEdit(row.raw);
                                                                        setEditRole(row.raw.role_id?.id || row.raw.role_id);
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Cambiar rol
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={() => setMemberToDelete(row.raw)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Eliminar del workspace
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}

                                                    {row.type === 'invitation' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 gap-1.5 text-destructive hover:bg-destructive/10"
                                                            onClick={() => setInvitationToCancel(row.raw)}
                                                            disabled={isPending}
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            Cancelar
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {allRows.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                                            No hay miembros ni invitaciones.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <Dialog open={!!memberToEdit} onOpenChange={(open) => !open && setMemberToEdit(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar rol</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={editRole} onValueChange={(v) => setEditRole(v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {rbacRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMemberToEdit(null)}>Cancelar</Button>
                        <Button onClick={handleRoleChange} disabled={isPending}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción eliminará al miembro del workspace.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive text-white">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!invitationToCancel} onOpenChange={(open) => !open && setInvitationToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar invitación?</AlertDialogTitle>
                        <AlertDialogDescription>Esta invitación será cancelada permanentemente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Mantener</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelInvitation} className="bg-destructive text-white">Cancelar invitación</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
