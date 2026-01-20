"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createWorkspace, updateWorkspace, CreateWorkspaceData, Workspace } from "@/lib/workspace-actions";
import { useRouter } from "next/navigation";

interface WorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspace?: Workspace | null;
}

const COLORS = [
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#8B5CF6", // Violet
    "#EF4444", // Red
    "#06B6D4", // Cyan
];

const ICONS = [
    { name: "folder", label: "Carpeta" },
    { name: "briefcase", label: "Trabajo" },
    { name: "code", label: "Código" },
    { name: "book", label: "Libro" },
    { name: "rocket", label: "Rocket" },
    { name: "star", label: "Estrella" },
    { name: "heart", label: "Corazón" },
    { name: "zap", label: "Rayo" },
];

export default function WorkspaceModal({ isOpen, onClose, workspace }: WorkspaceModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateWorkspaceData>({
        name: "",
        description: "",
        color: "#6366F1",
        icon: "folder",
    });

    const isEditing = !!workspace;

    useEffect(() => {
        if (workspace) {
            setFormData({
                name: workspace.name,
                description: workspace.description || "",
                color: workspace.color,
                icon: workspace.icon,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                color: "#6366F1",
                icon: "folder",
            });
        }
        setError(null);
    }, [workspace, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let result;
            if (isEditing) {
                result = await updateWorkspace(workspace.id, formData);
            } else {
                result = await createWorkspace(formData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                router.refresh();
                onClose();
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#0a0a0a] border border-white/[0.1] rounded-3xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
                    <h2 className="text-xl font-semibold text-white">
                        {isEditing ? "Editar Workspace" : "Nuevo Workspace"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre del Workspace *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Mi Proyecto"
                            required
                            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe tu workspace..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Color
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-xl transition-all duration-200 ${formData.color === color
                                            ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110"
                                            : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Icono
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {ICONS.map((icon) => (
                                <button
                                    key={icon.name}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: icon.name })}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${formData.icon === icon.name
                                            ? "bg-white/[0.15] text-white"
                                            : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white"
                                        }`}
                                >
                                    {icon.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isEditing ? "Guardando..." : "Creando..."}
                                </>
                            ) : (
                                isEditing ? "Guardar Cambios" : "Crear Workspace"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
