"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category, createCategory, updateCategory } from "@/lib/category-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
    workspaceId: string;
    category?: Category;
}

const PRESET_COLORS = [
    "#6366F1", // Indigo
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#EF4444", // Red
    "#F97316", // Orange
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#14B8A6", // Teal
    "#06B6D4", // Cyan
    "#3B82F6", // Blue
];

export function CategoryModal({ isOpen, onClose, onSuccess, workspaceId, category }: CategoryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [color, setColor] = useState("#6366F1");

    useEffect(() => {
        if (category) {
            setNombre(category.nombre);
            setDescripcion(category.descripcion || "");
            setColor(category.color);
        } else {
            resetForm();
        }
    }, [category, isOpen]);

    const resetForm = () => {
        setNombre("");
        setDescripcion("");
        setColor("#6366F1");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                nombre,
                descripcion,
                color,
                workspace: workspaceId,
                status: "published",
            };

            const { data: newOrUpdatedCategory, error } = category
                ? await updateCategory(category.id, data)
                : await createCategory(data);

            if (error) {
                toast.error(error);
            } else if (newOrUpdatedCategory) {
                toast.success(category ? "Categoría actualizada" : "Categoría creada");
                onSuccess(newOrUpdatedCategory);
            }
        } catch (err) {
            console.error("Error en handleSubmit:", err);
            toast.error("Ocurrió un error inesperado al guardar la categoría");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {category ? "Editar Categoría" : "Nueva Categoría"}
                    </DialogTitle>
                    <DialogDescription>
                        Completa la información para organizar tus productos.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Ropa, Electrónica, Alimentos"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describe esta categoría (opcional)"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Color</Label>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_COLORS.map((presetColor) => (
                                <button
                                    key={presetColor}
                                    type="button"
                                    onClick={() => setColor(presetColor)}
                                    className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${color === presetColor ? "ring-2 ring-offset-2 ring-primary" : "border-border"
                                        }`}
                                    style={{ backgroundColor: presetColor }}
                                    title={presetColor}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="#6366F1"
                                className="flex-1 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t gap-2 md:gap-0">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="px-8">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                category ? "Actualizar Categoría" : "Crear Categoría"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
