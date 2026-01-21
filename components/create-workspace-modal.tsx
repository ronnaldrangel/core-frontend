"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { createWorkspace } from "@/lib/workspace-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRESET_COLORS = [
    "#6366F1", // Indigo
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#EC4899", // Pink
    "#8B5CF6", // Violet
    "#14B8A6", // Teal
];

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: PRESET_COLORS[0],
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("El nombre es obligatorio");
            return;
        }

        setIsLoading(true);

        try {
            const result = await createWorkspace({
                name: formData.name,
                description: formData.description,
                color: formData.color,
                icon: "boxes", // Default icon
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Espacio de trabajo creado exitosamente");
                router.refresh(); // Refresh server components
                onClose();
                setFormData({ name: "", description: "", color: PRESET_COLORS[0] });
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md mx-4 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <Card className="p-6 shadow-xl border-border bg-card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold tracking-tight">Crear Espacio de Trabajo</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nombre del Espacio
                            </label>
                            <Input
                                id="name"
                                placeholder="Ej. Mi Empresa, Proyecto X..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Descripción (Opcional)
                            </label>
                            <Input
                                id="description"
                                placeholder="Breve descripción..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Color del Espacio
                            </label>
                            <div className="flex flex-wrap gap-3 mt-1.5">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={cn(
                                            "w-8 h-8 rounded-full transition-all border-2",
                                            formData.color === color
                                                ? "border-foreground scale-110 shadow-sm"
                                                : "border-transparent hover:scale-105"
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData({ ...formData, color })}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    "Crear Espacio"
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
