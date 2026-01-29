"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, createProduct, updateProduct, uploadFile } from "@/lib/product-actions";
import { getCategoriesByWorkspace, Category, createCategory } from "@/lib/category-actions";
import { Loader2, Plus, Trash2, Package, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Componente interno para creación rápida de categoría
function QuickCategoryForm({
    workspaceId,
    onSuccess,
    onCancel
}: {
    workspaceId: string;
    onSuccess: (category: Category) => void;
    onCancel: () => void;
}) {
    const [nombre, setNombre] = useState("");
    const [color, setColor] = useState("#6366F1");
    const [isLoading, setIsLoading] = useState(false);

    const presetColors = [
        "#6366F1", "#8B5CF6", "#EC4899", "#EF4444",
        "#F59E0B", "#10B981", "#3B82F6", "#14B8A6"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await createCategory({
                nombre: nombre.trim(),
                color,
                workspace: workspaceId,
            });

            if (error) {
                toast.error(error);
            } else if (data) {
                onSuccess(data);
            }
        } catch (error) {
            toast.error("Error al crear la categoría");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="quick-category-name">Nombre *</Label>
                <Input
                    id="quick-category-name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Electrónica"
                    required
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                    {presetColors.map((presetColor) => (
                        <button
                            key={presetColor}
                            type="button"
                            onClick={() => setColor(presetColor)}
                            className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                            style={{
                                backgroundColor: presetColor,
                                borderColor: color === presetColor ? "#000" : "transparent"
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        "Crear Categoría"
                    )}
                </Button>
            </div>
        </form>
    );
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (product: Product) => void;
    workspaceId: string;
    product?: Product;
}

export function ProductModal({ isOpen, onClose, onSuccess, workspaceId, product }: ProductModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [nombre, setNombre] = useState("");
    const [sku, setSku] = useState("");
    const [precioVenta, setPrecioVenta] = useState("");
    const [precioCompra, setPrecioCompra] = useState("");
    const [pack2, setPack2] = useState("");
    const [pack3, setPack3] = useState("");
    const [descripcionCorta, setDescripcionCorta] = useState("");
    const [descripcionNormal, setDescripcionNormal] = useState("");
    const [stock, setStock] = useState(0);
    const [variantes, setVariantes] = useState<{ nombre: string; sku: string; precio: string; stock: number }[]>([]);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageId, setExistingImageId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("none");
    const [isQuickCategoryModalOpen, setIsQuickCategoryModalOpen] = useState(false);

    // Load categories when modal opens
    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        const { data } = await getCategoriesByWorkspace(workspaceId);
        if (data) {
            setCategories(data);
        }
    };

    useEffect(() => {
        if (product) {
            // Extract category ID properly
            const categoryId = typeof product.category === 'object' && product.category ? product.category.id : product.category;
            setSelectedCategory(categoryId || "none");
            setNombre(product.nombre);
            setSku(product.sku);
            setPrecioVenta(product.precio_venta ? Number(product.precio_venta).toFixed(2) : "");
            setPrecioCompra(product.precio_compra ? Number(product.precio_compra).toFixed(2) : "");
            setPack2(product.pack2 ? Number(product.pack2).toFixed(2) : "");
            setPack3(product.pack3 ? Number(product.pack3).toFixed(2) : "");
            setDescripcionCorta(product.descripcion_corta || "");
            setDescripcionNormal(product.descripcion_normal || "");
            setStock(product.stock);

            // Formatear precios de variantes si existen
            const formattedVariantes = (product.variantes_producto || []).map((v: any) => ({
                ...v,
                precio: v.precio ? Number(v.precio).toFixed(2) : ""
            }));
            setVariantes(formattedVariantes);

            if (product.imagen) {
                const imgId = typeof product.imagen === 'object' ? product.imagen.id : product.imagen;
                setExistingImageId(imgId);
                setImagePreview(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imgId}`);
            } else {
                setExistingImageId(null);
                setImagePreview(null);
            }
        } else {
            resetForm();
        }
    }, [product, isOpen]);

    const resetForm = () => {
        setNombre("");
        setSku("");
        setPrecioVenta("");
        setPrecioCompra("");
        setPack2("");
        setPack3("");
        setDescripcionCorta("");
        setDescripcionNormal("");
        setStock(0);
        setVariantes([]);
        setImageFile(null);
        setImagePreview(null);
        setExistingImageId(null);
        setSelectedCategory("");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addVariante = () => {
        setVariantes([...variantes, { nombre: "", sku: "", precio: "", stock: 0 }]);
    };

    const removeVariante = (index: number) => {
        setVariantes(variantes.filter((_, i) => i !== index));
    };

    const updateVariante = (index: number, field: string, value: any) => {
        const newVariantes = [...variantes];
        newVariantes[index] = { ...newVariantes[index], [field]: value };
        setVariantes(newVariantes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let currentImageId = existingImageId;

            // Si hay un nuevo archivo, subirlo primero
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const { data: uploadedFile, error: uploadError } = await uploadFile(formData);
                if (uploadError || !uploadedFile) {
                    toast.error(uploadError || "Error al subir la imagen");
                    setIsLoading(false);
                    return;
                }
                currentImageId = uploadedFile.id;
            }

            const data = {
                nombre,
                sku,
                precio_venta: parseFloat(Number(precioVenta).toFixed(2)) || 0,
                precio_compra: parseFloat(Number(precioCompra).toFixed(2)) || 0,
                pack2: parseFloat(Number(pack2).toFixed(2)) || 0,
                pack3: parseFloat(Number(pack3).toFixed(2)) || 0,
                descripcion_corta: descripcionCorta,
                descripcion_normal: descripcionNormal,
                stock: stock,
                variantes_producto: variantes.map(v => ({
                    ...v,
                    precio: parseFloat(Number(v.precio).toFixed(2)) || 0,
                    stock: parseInt(v.stock as any) || 0
                })),
                workspace: workspaceId,
                status: "published",
                imagen: currentImageId,
                category: selectedCategory === "none" ? null : selectedCategory
            };

            const { data: newOrUpdatedProduct, error } = product
                ? await updateProduct(product.id, data)
                : await createProduct(data);

            if (error) {
                toast.error(error);
            } else if (newOrUpdatedProduct) {
                toast.success(product ? "Producto actualizado" : "Producto creado");
                onSuccess(newOrUpdatedProduct);
            }
        } catch (err) {
            console.error("Error completo en handleSubmit:", err);
            toast.error("Ocurrió un error inesperado al guardar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {product ? "Editar Producto" : "Nuevo Producto"}
                        </DialogTitle>
                        <DialogDescription>
                            Completa la información para gestionar tu inventario.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-8 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Columna de Imagen */}
                            <div className="space-y-2 flex flex-col items-center md:items-start">
                                <Label>Imagen del Producto</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-[120px] md:aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden relative group"
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="h-8 w-8 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
                                            <span className="text-xs text-muted-foreground">Click para subir</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-full max-w-[100px] md:max-w-none text-xs text-destructive"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            setExistingImageId(null);
                                        }}
                                    >
                                        <X className="h-3 w-3 mr-1" /> Remover imagen
                                    </Button>
                                )}
                            </div>

                            {/* Columna de Datos principales */}
                            <div className="md:col-span-2 space-y-4">
                                {/* Nombre - Full Width */}
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ej: Camiseta de Algodón"
                                        required
                                    />
                                </div>

                                {/* SKU y Stock - Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU / Código</Label>
                                        <Input
                                            id="sku"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                            placeholder="REF-001 (Opcional)"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock Global</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={isNaN(stock) ? "" : stock}
                                            onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Precio Venta y Precio Compra - Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 font-bold">
                                        <Label htmlFor="precio_venta">Precio Venta</Label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-muted-foreground select-none">S/</span>
                                            <Input
                                                id="precio_venta"
                                                type="number"
                                                step="0.01"
                                                value={precioVenta}
                                                onChange={(e) => setPrecioVenta(e.target.value)}
                                                onBlur={() => {
                                                    if (precioVenta) setPrecioVenta(Number(precioVenta).toFixed(2));
                                                }}
                                                className="pl-7"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="precio_compra">Precio Compra</Label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-muted-foreground select-none">S/</span>
                                            <Input
                                                id="precio_compra"
                                                type="number"
                                                step="0.01"
                                                value={precioCompra}
                                                onChange={(e) => setPrecioCompra(e.target.value)}
                                                onBlur={() => {
                                                    if (precioCompra) setPrecioCompra(Number(precioCompra).toFixed(2));
                                                }}
                                                className="pl-7"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Precio Pack 2 y Pack 3 - Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pack2">Precio Pack 2</Label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-muted-foreground select-none">S/</span>
                                            <Input
                                                id="pack2"
                                                type="number"
                                                step="0.01"
                                                value={pack2}
                                                onChange={(e) => setPack2(e.target.value)}
                                                onBlur={() => {
                                                    if (pack2) setPack2(Number(pack2).toFixed(2));
                                                }}
                                                className="pl-7"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pack3">Precio Pack 3</Label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-muted-foreground select-none">S/</span>
                                            <Input
                                                id="pack3"
                                                type="number"
                                                step="0.01"
                                                value={pack3}
                                                onChange={(e) => setPack3(e.target.value)}
                                                onBlur={() => {
                                                    if (pack3) setPack3(Number(pack3).toFixed(2));
                                                }}
                                                className="pl-7"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Categoría (80%) y Botón + (20%) - Row */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <div className="flex gap-2">
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Sin categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setIsQuickCategoryModalOpen(true)}
                                            className="h-10 w-10 flex-shrink-0"
                                            title="Crear nueva categoría"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="descripcion_corta">Descripción Corta (Resumen)</Label>
                            <Input
                                id="descripcion_corta"
                                value={descripcionCorta}
                                onChange={(e) => setDescripcionCorta(e.target.value)}
                                placeholder="Aparecerá en los listados y tickets"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion_normal">Cuerpo del Producto (Detalles)</Label>
                            <Textarea
                                id="descripcion_normal"
                                value={descripcionNormal}
                                onChange={(e) => setDescripcionNormal(e.target.value)}
                                placeholder="Describe tu producto de forma detallada..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="space-y-4 pt-6 border-t">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Variantes de Producto</h4>
                                    <p className="text-xs text-muted-foreground">Gestiona combinaciones como Talla, Color, etc.</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addVariante} className="h-8">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nueva Variante
                                </Button>
                            </div>

                            {variantes.length > 0 && (
                                <div className="grid gap-3">
                                    {variantes.map((v, i) => (
                                        <div key={i} className="flex gap-2 items-end border p-4 rounded-xl bg-muted/20 border-border/50 group">
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-[10px] uppercase font-bold">Identificador (Talla/Color)</Label>
                                                <Input
                                                    value={v.nombre}
                                                    onChange={(e) => updateVariante(i, "nombre", e.target.value)}
                                                    placeholder="Azul / L"
                                                    className="h-9 bg-background"
                                                />
                                            </div>
                                            <div className="w-24 space-y-1">
                                                <Label className="text-[10px] uppercase font-bold">SKU</Label>
                                                <Input
                                                    value={v.sku}
                                                    onChange={(e) => updateVariante(i, "sku", e.target.value)}
                                                    placeholder="V-001"
                                                    className="h-9 bg-background font-mono"
                                                />
                                            </div>
                                            <div className="w-24 space-y-1">
                                                <Label className="text-[10px] uppercase font-bold">Precio</Label>
                                                <div className="relative flex items-center">
                                                    <span className="absolute left-3 text-muted-foreground select-none text-xs">S/</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={v.precio}
                                                        onChange={(e) => updateVariante(i, "precio", e.target.value)}
                                                        onBlur={() => {
                                                            if (v.precio) updateVariante(i, "precio", Number(v.precio).toFixed(2));
                                                        }}
                                                        placeholder="0.00"
                                                        className="h-9 bg-background pl-6"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-20 space-y-1">
                                                <Label className="text-[10px] uppercase font-bold">Stock</Label>
                                                <Input
                                                    type="number"
                                                    value={v.stock}
                                                    onChange={(e) => updateVariante(i, "stock", parseInt(e.target.value) || 0)}
                                                    className="h-9 bg-background"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-destructive opacity-40 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeVariante(i)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                    product ? "Actualizar Producto" : "Finalizar y Crear"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Quick Category Creation Modal */}
            <Dialog open={isQuickCategoryModalOpen} onOpenChange={setIsQuickCategoryModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Crear Categoría Rápida</DialogTitle>
                        <DialogDescription>
                            Crea una nueva categoría sin salir del formulario
                        </DialogDescription>
                    </DialogHeader>
                    <QuickCategoryForm
                        workspaceId={workspaceId}
                        onSuccess={(newCategory) => {
                            setCategories([...categories, newCategory]);
                            setSelectedCategory(newCategory.id);
                            setIsQuickCategoryModalOpen(false);
                            toast.success("Categoría creada exitosamente");
                        }}
                        onCancel={() => setIsQuickCategoryModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
