"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    LayoutDashboard,
    Search,
    Bell,
    Settings,
    User,
    Boxes,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Workspace, deleteWorkspace } from "@/lib/workspace-actions";
import WorkspaceCard from "@/components/WorkspaceCard";
import WorkspaceModal from "@/components/WorkspaceModal";
import LogoutButton from "@/components/LogoutButton";
import { Logo } from "@/components/logo";

interface WorkspacesClientProps {
    workspaces: Workspace[];
    currentUserId: string;
}

export default function WorkspacesClient({ workspaces, currentUserId }: WorkspacesClientProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredWorkspaces = workspaces.filter(ws =>
        ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (workspace: Workspace) => {
        setEditingWorkspace(workspace);
        setIsModalOpen(true);
    };

    const handleDelete = async (workspaceId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este workspace? Esta acción no se puede deshacer.")) {
            return;
        }

        setDeletingId(workspaceId);
        const result = await deleteWorkspace(workspaceId);

        if (result.error) {
            alert(result.error);
        } else {
            router.refresh();
        }
        setDeletingId(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWorkspace(null);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white/[0.02] border-r border-white/[0.05] p-6 hidden md:block">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <Logo height={32} width={130} />
                </div>

                <nav className="space-y-2">
                    <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition-all">
                        <Boxes className="w-5 h-5" />
                        <span className="font-medium">Workspaces</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="font-medium">Notificaciones</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Ajustes</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href="/"
                                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors md:hidden"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </Link>
                            <h1 className="text-3xl font-bold">Workspaces</h1>
                        </div>
                        <p className="text-gray-500">Gestiona tus espacios de trabajo colaborativos</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 bg-white/[0.05] border border-white/[0.05] px-4 py-2 rounded-2xl">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </header>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar workspaces..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Workspace</span>
                    </button>
                </div>

                {/* Workspaces Grid */}
                {filteredWorkspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-white/[0.05] rounded-full flex items-center justify-center mb-6">
                            <Boxes className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            {searchQuery ? "No se encontraron workspaces" : "No tienes workspaces aún"}
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            {searchQuery
                                ? "Intenta con otro término de búsqueda"
                                : "Crea tu primer workspace para comenzar a colaborar con tu equipo"
                            }
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Crear Workspace
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                className={deletingId === workspace.id ? "opacity-50 pointer-events-none" : ""}
                            >
                                <WorkspaceCard
                                    workspace={workspace}
                                    currentUserId={currentUserId}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {workspaces.length > 0 && (
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-2xl">
                            <p className="text-3xl font-bold text-white mb-1">{workspaces.length}</p>
                            <p className="text-sm text-gray-500">Total Workspaces</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-2xl">
                            <p className="text-3xl font-bold text-white mb-1">
                                {workspaces.filter(w => {
                                    const ownerId = typeof w.owner === 'object' ? w.owner.id : w.owner;
                                    return ownerId === currentUserId;
                                }).length}
                            </p>
                            <p className="text-sm text-gray-500">Propios</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-2xl">
                            <p className="text-3xl font-bold text-white mb-1">
                                {workspaces.reduce((acc, w) => acc + (w.members?.length || 0) + 1, 0)}
                            </p>
                            <p className="text-sm text-gray-500">Total Miembros</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            <WorkspaceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                workspace={editingWorkspace}
            />
        </div>
    );
}
