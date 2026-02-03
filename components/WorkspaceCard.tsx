"use client";

import { useState } from "react";
import { Workspace } from "@/lib/workspace-actions";
import {
    Folder,
    Users,
    MoreVertical,
    Pencil,
    Trash2,
    Crown,
    Eye,
    Edit3
} from "lucide-react";
import Link from "next/link";

interface WorkspaceCardProps {
    workspace: Workspace;
    currentUserId: string;
    onEdit?: (workspace: Workspace) => void;
    onDelete?: (workspaceId: string) => void;
}

export default function WorkspaceCard({ workspace, currentUserId, onEdit, onDelete }: WorkspaceCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const isOwner = typeof workspace.owner === 'object'
        ? workspace.owner.id === currentUserId
        : workspace.owner === currentUserId;

    const ownerName = typeof workspace.owner === 'object'
        ? `${workspace.owner.first_name} ${workspace.owner.last_name}`
        : 'Unknown';

    const memberCount = (workspace.members?.length || 0) + 1; // +1 for owner

    const getUserRole = () => {
        if (isOwner) return { label: "Propietario", icon: Crown, color: "text-yellow-500" };
        const member = workspace.members?.find(m => {
            const userId = typeof m.user_id === 'object' ? m.user_id.id : m.user_id;
            return userId === currentUserId;
        });
        const roleName = typeof member?.role_id === 'object' ? member.role_id.name.toLowerCase() : '';
        if (roleName.includes("admin")) return { label: "Admin", icon: Edit3, color: "text-blue-500" };
        if (roleName.includes("editor")) return { label: "Editor", icon: Pencil, color: "text-green-500" };
        return { label: "Visualizador", icon: Eye, color: "text-gray-500" };
    };

    const role = getUserRole();
    const RoleIcon = role.icon;

    return (
        <div
            className="group relative bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-black/20"
            style={{ borderLeftColor: workspace.color, borderLeftWidth: '4px' }}
        >
            {/* Menu Button */}
            {(isOwner || role.label === "Admin") && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowMenu(!showMenu);
                        }}
                        className="p-2 rounded-lg hover:bg-white/[0.1] transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-xl z-10 overflow-hidden">
                            <button
                                onClick={() => {
                                    onEdit?.(workspace);
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.05] transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                                Editar
                            </button>
                            {isOwner && (
                                <button
                                    onClick={() => {
                                        onDelete?.(workspace.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <Link href={`/workspaces/${workspace.id}`} className="block">
                {/* Icon & Color */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${workspace.color}20` }}
                >
                    <Folder className="w-6 h-6" style={{ color: workspace.color }} />
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-white mb-2 truncate">{workspace.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                    {workspace.description || "Sin descripción"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{memberCount} miembro{memberCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${role.color}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{role.label}</span>
                    </div>
                </div>
            </Link>

            {/* Click outside to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-[5]"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}
