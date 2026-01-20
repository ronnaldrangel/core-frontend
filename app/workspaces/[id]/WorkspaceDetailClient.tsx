"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Settings,
    Users,
    Plus,
    Trash2,
    Crown,
    Edit3,
    Eye,
    Pencil,
    MoreVertical,
    Folder,
    Calendar,
    Mail,
    UserPlus,
    X,
    Loader2,
    ChevronDown,
} from "lucide-react";
import {
    Workspace,
    WorkspaceMember,
    addWorkspaceMember,
    removeWorkspaceMember,
    updateMemberRole,
    deleteWorkspace,
} from "@/lib/workspace-actions";
import WorkspaceModal from "@/components/WorkspaceModal";

interface WorkspaceDetailClientProps {
    workspace: Workspace;
    currentUserId: string;
    currentUserEmail: string;
}

export default function WorkspaceDetailClient({
    workspace,
    currentUserId,
    currentUserEmail,
}: WorkspaceDetailClientProps) {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<"admin" | "editor" | "viewer">("viewer");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeRoleMenu, setActiveRoleMenu] = useState<string | null>(null);

    const isOwner =
        typeof workspace.owner === "object"
            ? workspace.owner.id === currentUserId
            : workspace.owner === currentUserId;

    const currentMember = workspace.members?.find((m) => {
        const userId = typeof m.user_id === "object" ? m.user_id.id : m.user_id;
        return userId === currentUserId;
    });

    const isAdmin = isOwner || currentMember?.role === "admin";

    const ownerData =
        typeof workspace.owner === "object"
            ? workspace.owner
            : { id: workspace.owner, first_name: "Unknown", last_name: "", email: "" };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Note: In a real app, you'd search for the user by email first
        // For now, we'll assume the email is the user ID (you'd need an API endpoint to search users)
        try {
            const result = await addWorkspaceMember(workspace.id, newMemberEmail, newMemberRole);
            if (result.error) {
                setError(result.error);
            } else {
                setNewMemberEmail("");
                setIsAddMemberOpen(false);
                router.refresh();
            }
        } catch (err) {
            setError("Error al añadir el miembro");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar a este miembro?")) return;

        setLoading(true);
        const result = await removeWorkspaceMember(memberId);
        if (result.error) {
            alert(result.error);
        } else {
            router.refresh();
        }
        setLoading(false);
    };

    const handleRoleChange = async (memberId: string, newRole: "admin" | "editor" | "viewer") => {
        setLoading(true);
        const result = await updateMemberRole(memberId, newRole);
        if (result.error) {
            alert(result.error);
        } else {
            router.refresh();
        }
        setLoading(false);
        setActiveRoleMenu(null);
    };

    const handleDeleteWorkspace = async () => {
        if (
            !confirm(
                "¿Estás seguro de que quieres eliminar este workspace? Esta acción no se puede deshacer."
            )
        )
            return;

        setLoading(true);
        const result = await deleteWorkspace(workspace.id);
        if (result.error) {
            alert(result.error);
            setLoading(false);
        } else {
            router.push("/workspaces");
        }
    };

    const getRoleInfo = (role: string) => {
        switch (role) {
            case "admin":
                return { label: "Admin", icon: Edit3, color: "text-blue-500", bg: "bg-blue-500/10" };
            case "editor":
                return { label: "Editor", icon: Pencil, color: "text-green-500", bg: "bg-green-500/10" };
            default:
                return { label: "Viewer", icon: Eye, color: "text-gray-400", bg: "bg-gray-500/10" };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            {/* Header */}
            <header className="border-b border-white/[0.05] bg-white/[0.02]">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/workspaces"
                                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </Link>
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${workspace.color}20` }}
                            >
                                <Folder className="w-6 h-6" style={{ color: workspace.color }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{workspace.name}</h1>
                                <p className="text-gray-500 text-sm">
                                    {workspace.description || "Sin descripción"}
                                </p>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span className="hidden sm:inline">Configurar</span>
                                </button>
                                {isOwner && (
                                    <button
                                        onClick={handleDeleteWorkspace}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Eliminar</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm text-gray-500">Creado</span>
                                </div>
                                <p className="font-medium">{formatDate(workspace.date_created)}</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm text-gray-500">Miembros</span>
                                </div>
                                <p className="font-medium">
                                    {(workspace.members?.length || 0) + 1} personas
                                </p>
                            </div>
                        </div>

                        {/* Placeholder for future content */}
                        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/[0.05] p-8 rounded-3xl">
                            <h3 className="text-xl font-semibold mb-3">Contenido del Workspace</h3>
                            <p className="text-gray-400">
                                Aquí podrás ver y gestionar el contenido específico de este workspace.
                                Esta sección se expandirá con más funcionalidades próximamente.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar - Members */}
                    <div className="space-y-6">
                        {/* Owner */}
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/[0.05]">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                    Propietario
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-500 font-medium">
                                            {ownerData.first_name?.[0] || "?"}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            {ownerData.first_name} {ownerData.last_name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{ownerData.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    Miembros
                                </h3>
                                {isAdmin && (
                                    <button
                                        onClick={() => setIsAddMemberOpen(true)}
                                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                                    >
                                        <UserPlus className="w-4 h-4 text-blue-400" />
                                    </button>
                                )}
                            </div>

                            <div className="divide-y divide-white/[0.05]">
                                {workspace.members && workspace.members.length > 0 ? (
                                    workspace.members.map((member) => {
                                        const userData =
                                            typeof member.user_id === "object"
                                                ? member.user_id
                                                : { id: member.user_id, first_name: "User", last_name: "", email: "" };
                                        const roleInfo = getRoleInfo(member.role);
                                        const RoleIcon = roleInfo.icon;

                                        return (
                                            <div key={member.id} className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 ${roleInfo.bg} rounded-full flex items-center justify-center`}
                                                    >
                                                        <span className={roleInfo.color}>
                                                            {userData.first_name?.[0] || "?"}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">
                                                            {userData.first_name} {userData.last_name}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <RoleIcon className={`w-3 h-3 ${roleInfo.color}`} />
                                                            <span className={`text-xs ${roleInfo.color}`}>
                                                                {roleInfo.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {isAdmin && (
                                                        <div className="relative">
                                                            <button
                                                                onClick={() =>
                                                                    setActiveRoleMenu(
                                                                        activeRoleMenu === member.id ? null : member.id
                                                                    )
                                                                }
                                                                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                                                            >
                                                                <MoreVertical className="w-4 h-4 text-gray-500" />
                                                            </button>

                                                            {activeRoleMenu === member.id && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-10"
                                                                        onClick={() => setActiveRoleMenu(null)}
                                                                    />
                                                                    <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-xl z-20 overflow-hidden">
                                                                        <div className="py-2">
                                                                            <p className="px-4 py-1 text-xs text-gray-500 uppercase">
                                                                                Cambiar rol
                                                                            </p>
                                                                            {(["admin", "editor", "viewer"] as const).map(
                                                                                (role) => (
                                                                                    <button
                                                                                        key={role}
                                                                                        onClick={() =>
                                                                                            handleRoleChange(member.id, role)
                                                                                        }
                                                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/[0.05] ${member.role === role
                                                                                                ? "text-blue-400"
                                                                                                : "text-gray-300"
                                                                                            }`}
                                                                                    >
                                                                                        {getRoleInfo(role).label}
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                        <div className="border-t border-white/[0.05] py-2">
                                                                            <button
                                                                                onClick={() => handleRemoveMember(member.id)}
                                                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                                                            >
                                                                                Eliminar
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-gray-500 text-sm">No hay miembros adicionales</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            <WorkspaceModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                workspace={workspace}
            />

            {/* Add Member Modal */}
            {isAddMemberOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsAddMemberOpen(false)}
                    />
                    <div className="relative bg-[#0a0a0a] border border-white/[0.1] rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
                            <h2 className="text-xl font-semibold">Añadir Miembro</h2>
                            <button
                                onClick={() => setIsAddMemberOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMember} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ID del Usuario *
                                </label>
                                <input
                                    type="text"
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    placeholder="UUID del usuario"
                                    required
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Introduce el ID (UUID) del usuario de Directus
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rol
                                </label>
                                <div className="flex gap-2">
                                    {(["viewer", "editor", "admin"] as const).map((role) => {
                                        const info = getRoleInfo(role);
                                        return (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setNewMemberRole(role)}
                                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${newMemberRole === role
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.1]"
                                                    }`}
                                            >
                                                {info.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddMemberOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !newMemberEmail.trim()}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Añadiendo...
                                        </>
                                    ) : (
                                        "Añadir Miembro"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
