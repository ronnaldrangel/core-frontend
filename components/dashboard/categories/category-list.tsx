"use client";

import { useState } from "react";
import { Category, deleteCategory } from "@/lib/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderKanban, Plus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { CategoryModal } from "./category-modal";
import { cn } from "@/lib/utils";
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

interface CategoryListProps {
    initialCategories: Category[];
    workspaceId: string;
    workspaceSlug: string;
}

export function CategoryList({ initialCategories, workspaceId, workspaceSlug }: CategoryListProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    // Deletion states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, nombre: string } | null>(null);

    const filteredCategories = categories.filter(c =>
        c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        const { error } = await deleteCategory(categoryToDelete.id);
        if (error) {
            toast.error(error);
        } else {
            setCategories(categories.filter(c => c.id !== categoryToDelete.id));
            toast.success("Categoría eliminada correctamente");
        }
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const handleSuccess = (category: Category) => {
        if (editingCategory) {
            setCategories(categories.map(c => c.id === category.id ? category : c));
        } else {
            setCategories([category, ...categories]);
        }
        setIsModalOpen(false);
        setEditingCategory(undefined);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="relative flex-1 w-full md:max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => {
                    setEditingCategory(undefined);
                    setIsModalOpen(true);
                }} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Categoría
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-4 py-3 min-w-[300px]">Nombre</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Color</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <FolderKanban className="h-8 w-8 opacity-20" />
                                            <p>{searchQuery ? "No se encontraron resultados" : "No hay categorías registradas"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-10 w-10 rounded border flex-shrink-0 flex items-center justify-center"
                                                    style={{ backgroundColor: category.color }}
                                                >
                                                    <FolderKanban className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground line-clamp-1">{category.nombre}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-muted-foreground line-clamp-2">
                                                {category.descripcion || "Sin descripción"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-6 w-6 rounded border"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono border text-muted-foreground">
                                                    {category.color}
                                                </code>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setCategoryToDelete({ id: category.id, nombre: category.nombre });
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Categoría */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                workspaceId={workspaceId}
                category={editingCategory}
            />

            {/* Dialogo de Confirmación de Eliminación */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la categoría <span className="font-bold text-foreground">"{categoryToDelete?.nombre}"</span>.
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar Categoría
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
