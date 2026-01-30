"use client";

import { useState, useEffect } from "react";
import { Product, deleteProduct } from "@/lib/product-actions";
import { Category, getCategoriesByWorkspace } from "@/lib/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, Trash2, Edit, Layers, Image as ImageIcon, Filter } from "lucide-react";
import { toast } from "sonner";
import { ProductModal } from "./product-modal";
import { cn } from "@/lib/utils";
import { useRBAC } from "@/components/providers/rbac-provider";
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

interface ProductListProps {
    initialProducts: Product[];
    workspaceId: string;
    workspaceSlug: string;
}

export function ProductList({ initialProducts, workspaceId, workspaceSlug }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const { hasPermission } = useRBAC();

    // Deletion states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string, nombre: string } | null>(null);

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await getCategoriesByWorkspace(workspaceId);
            if (data) setCategories(data);
        };
        loadCategories();
    }, [workspaceId]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === "all" ||
            (selectedCategory === "none" && !p.category) ||
            (typeof p.category === 'object' && p.category?.id === selectedCategory) ||
            p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        const { error } = await deleteProduct(productToDelete.id);
        if (error) {
            toast.error(error);
        } else {
            setProducts(products.filter(p => p.id !== productToDelete.id));
            toast.success("Producto eliminado correctamente");
        }
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleSuccess = (product: Product) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([product, ...products]);
        }
        setIsModalOpen(false);
        setEditingProduct(undefined);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-1 gap-2 w-full">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o SKU..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent position="popper" align="start" sideOffset={4}>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="none">Sin categoría</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: cat.color || '#6366F1' }}
                                        />
                                        {cat.nombre}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {hasPermission("products.create") && (
                    <Button onClick={() => {
                        setEditingProduct(undefined);
                        setIsModalOpen(true);
                    }} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                )}
            </div>

            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-4 py-3 min-w-[300px]">Producto</th>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">Variantes</th>
                                <th className="px-4 py-3">Precio Venta</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-8 w-8 opacity-20" />
                                            <p>{searchQuery ? "No se encontraron resultados" : "No hay productos registrados"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded border bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {product.imagen ? (
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${typeof product.imagen === 'object' ? product.imagen.id : product.imagen}`}
                                                            alt={product.nombre}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground line-clamp-1">{product.nombre}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1.5">
                                                        {(() => {
                                                            const category = typeof product.category === 'object' && product.category
                                                                ? product.category
                                                                : categories.find(c => c.id === product.category);

                                                            if (category) {
                                                                return (
                                                                    <>
                                                                        <div
                                                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                                                            style={{ backgroundColor: category.color || '#6366F1' }}
                                                                        />
                                                                        {category.nombre}
                                                                    </>
                                                                );
                                                            }
                                                            return "Sin categoría";
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono border text-muted-foreground whitespace-nowrap">
                                                {product.sku || "S/N"}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Layers className="h-3.5 w-3.5" />
                                                <span className="text-xs">
                                                    {product.variantes_producto?.length || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-primary/90">
                                            S/ {Number(product.precio_venta || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                                {product.stock} disp.
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                {hasPermission("products.update") && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingProduct(product);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {hasPermission("products.delete") && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setProductToDelete({ id: product.id, nombre: product.nombre });
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Producto */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                workspaceId={workspaceId}
                product={editingProduct}
            />

            {/* Dialogo de Confirmación de Eliminación */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el producto <span className="font-bold text-foreground">"{productToDelete?.nombre}"</span>.
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar Producto
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function Badge({ variant = "default", children }: { variant?: "default" | "destructive", children: React.ReactNode }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center whitespace-nowrap",
            variant === "default"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50"
        )}>
            {children}
        </span>
    );
}
