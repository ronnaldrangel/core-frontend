"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Palette, Bell, Trash2, Loader2, Upload, X, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Workspace, updateWorkspace, uploadWorkspaceLogo, deleteWorkspace } from "@/lib/workspace-actions";
import { OrderStatus, createOrderStatus, deleteOrderStatus, PaymentStatus, createPaymentStatus, deletePaymentStatus, CourierType, createCourierType, deleteCourierType } from "@/lib/order-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn, generateSlug } from "@/lib/utils";
import Image from "next/image";
import { Plus, ClipboardList, CreditCard, Truck } from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


interface WorkspaceSettingsClientProps {
    workspace: Workspace;
    role: "owner" | "admin" | "editor" | "viewer";
    initialOrderStatuses: OrderStatus[];
    initialPaymentStatuses: PaymentStatus[];
    initialCourierTypes: CourierType[];
}


const PRESET_COLORS = [
    "#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6"
];

export function WorkspaceSettingsClient({ workspace, role, initialOrderStatuses, initialPaymentStatuses, initialCourierTypes }: WorkspaceSettingsClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");

    // Order Status State
    const [isAddingStatus, setIsAddingStatus] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>(initialOrderStatuses);

    const [newStatus, setNewStatus] = useState({
        name: "",
        value: "",
        color: PRESET_COLORS[0]
    });

    // Payment Status State
    const [isAddingPaymentStatus, setIsAddingPaymentStatus] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>(initialPaymentStatuses);

    const [newPaymentStatus, setNewPaymentStatus] = useState({
        name: "",
        value: "",
        color: PRESET_COLORS[0]
    });

    // Courier Type State
    const [isAddingCourierType, setIsAddingCourierType] = useState(false);
    const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
    const [courierTypes, setCourierTypes] = useState<CourierType[]>(initialCourierTypes);

    const [newCourierType, setNewCourierType] = useState({
        name: "",
        value: "",
        color: PRESET_COLORS[0]
    });



    const canEdit = role === "owner" || role === "admin" || role === "editor";
    const canDelete = role === "owner" || role === "admin";

    const [formData, setFormData] = useState({
        name: workspace.name,
        description: workspace.description || "",
        color: workspace.color,
        logo: workspace.logo,
        email_contacto: workspace.email_contacto || "",
        telefono_contacto: workspace.telefono_contacto || "",
        direccion_contacto: workspace.direccion_contacto || "",
    });

    const handleAddStatus = async () => {
        if (!newStatus.name || !newStatus.value) {
            toast.error("Nombre y valor son obligatorios");
            return;
        }

        // Check if status value already exists in this workspace
        const exists = orderStatuses.some(status => status.value === newStatus.value);
        if (exists) {
            toast.error("Este estado ya existe en este workspace");
            return;
        }

        setIsAddingStatus(true);
        try {
            const result = await createOrderStatus({
                ...newStatus,
                workspace_id: workspace.id,
                sort: orderStatuses.length + 1
            });

            if (result.error) {
                toast.error(result.error);
            } else if (result.data) {
                setOrderStatuses(prev => [...prev, result.data as OrderStatus]);
                setNewStatus({ name: "", value: "", color: PRESET_COLORS[0] });
                toast.success("Estado de pedido creado");
                setIsModalOpen(false);
            }

        } catch (error) {
            toast.error("Error al crear el estado");
        } finally {
            setIsAddingStatus(false);
        }
    };


    const handleDeleteStatus = async (id: string) => {
        try {
            const result = await deleteOrderStatus(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                setOrderStatuses(prev => prev.filter(s => s.id !== id));
                toast.success("Estado de pedido eliminado");
            }
        } catch (error) {
            toast.error("Error al eliminar el estado");
        }
    };

    const handleAddPaymentStatus = async () => {
        if (!newPaymentStatus.name || !newPaymentStatus.value) {
            toast.error("Nombre y valor son obligatorios");
            return;
        }

        const exists = paymentStatuses.some(status => status.value === newPaymentStatus.value);
        if (exists) {
            toast.error("Este estado de pago ya existe");
            return;
        }

        setIsAddingPaymentStatus(true);
        try {
            const result = await createPaymentStatus({
                ...newPaymentStatus,
                workspace_id: workspace.id,
                sort: paymentStatuses.length + 1
            });

            if (result.error) {
                toast.error(result.error);
            } else if (result.data) {
                setPaymentStatuses(prev => [...prev, result.data as PaymentStatus]);
                setNewPaymentStatus({ name: "", value: "", color: PRESET_COLORS[0] });
                toast.success("Estado de pago creado");
                setIsPaymentModalOpen(false);
            }
        } catch (error) {
            toast.error("Error al crear el estado de pago");
        } finally {
            setIsAddingPaymentStatus(false);
        }
    };

    const handleDeletePaymentStatus = async (id: string) => {
        try {
            const result = await deletePaymentStatus(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                setPaymentStatuses(prev => prev.filter(s => s.id !== id));
                toast.success("Estado de pago eliminado");
            }
        } catch (error) {
            toast.error("Error al eliminar el estado de pago");
        }
    };

    const handleAddCourierType = async () => {
        if (!newCourierType.name || !newCourierType.value) {
            toast.error("Nombre y valor son obligatorios");
            return;
        }

        const exists = courierTypes.some(type => type.value === newCourierType.value);
        if (exists) {
            toast.error("Este tipo de courier ya existe");
            return;
        }

        setIsAddingCourierType(true);
        try {
            const result = await createCourierType({
                ...newCourierType,
                workspace_id: workspace.id,
                sort: courierTypes.length + 1
            });

            if (result.error) {
                toast.error(result.error);
            } else if (result.data) {
                setCourierTypes(prev => [...prev, result.data as CourierType]);
                setNewCourierType({ name: "", value: "", color: PRESET_COLORS[0] });
                toast.success("Tipo de courier creado");
                setIsCourierModalOpen(false);
            }
        } catch (error) {
            toast.error("Error al crear el tipo de courier");
        } finally {
            setIsAddingCourierType(false);
        }
    };

    const handleDeleteCourierType = async (id: string) => {
        try {
            const result = await deleteCourierType(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                setCourierTypes(prev => prev.filter(t => t.id !== id));
                toast.success("Tipo de courier eliminado");
            }
        } catch (error) {
            toast.error("Error al eliminar el tipo de courier");
        }
    };



    const handleDelete = async () => {

        if (deleteConfirmName !== workspace.name) {
            toast.error("El nombre del workspace no coincide");
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteWorkspace(workspace.id);
            if (result.error) {
                toast.error(result.error);
                setIsDeleting(false);
            } else {
                toast.success("Workspace eliminado correctamente");
                router.push("/workspaces");
            }
        } catch (error) {
            toast.error("Error al eliminar el workspace");
            setIsDeleting(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("logo", file);

        try {
            const result = await uploadWorkspaceLogo(uploadData);
            if (result.error) {
                toast.error(result.error);
            } else if (result.id) {
                setFormData(prev => ({ ...prev, logo: result.id }));
                toast.success("Logo subido correctamente (recuerda guardar los cambios)");
            }
        } catch (error) {
            toast.error("Error al subir el logo");
        } finally {
            setIsUploading(false);
        }
    };

    const removeLogo = () => {
        setFormData(prev => ({ ...prev, logo: null }));
    };

    const handleSave = async () => {
        startTransition(async () => {
            const result = await updateWorkspace(workspace.id, {
                name: formData.name,
                description: formData.description,
                color: formData.color,
                logo: formData.logo,
                email_contacto: formData.email_contacto,
                telefono_contacto: formData.telefono_contacto,
                direccion_contacto: formData.direccion_contacto,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Configuración actualizada");
                router.refresh();
            }
        });
    };

    const getLogoUrl = (id: string) => {
        return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${id}`;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Settings className="h-8 w-8 text-primary" />
                        Configuración del Workspace
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los detalles y la apariencia de <strong>{workspace.name}</strong>.
                    </p>
                </div>
            </div>

            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-muted-foreground" /> General
                    </CardTitle>
                    <CardDescription>
                        Información básica para identificar tu espacio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre del Workspace</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Mi Workspace"
                            disabled={!canEdit}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descripción opcional..."
                            disabled={!canEdit}
                        />
                    </div>
                    <div className="grid gap-2 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            URL del Workspace
                        </div>
                        <div className="flex items-center gap-1 font-mono text-sm font-semibold">
                            <span>/dashboard/</span>
                            <span className="text-primary">{workspace.slug}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            El slug se genera automáticamente y no se puede cambiar para evitar romper enlaces.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Información de Contacto</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Estos datos aparecerán en el encabezado de tus boletas y guías de envío.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email_contacto">Correo de Contacto</Label>
                                <Input
                                    id="email_contacto"
                                    type="email"
                                    value={formData.email_contacto}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email_contacto: e.target.value }))}
                                    placeholder="contacto@empresa.com"
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
                                <Input
                                    id="telefono_contacto"
                                    type="text"
                                    value={formData.telefono_contacto}
                                    onChange={(e) => setFormData(prev => ({ ...prev, telefono_contacto: e.target.value }))}
                                    placeholder="+51 999 999 999"
                                    disabled={!canEdit}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="direccion_contacto">Dirección de Contacto / Local</Label>
                            <Input
                                id="direccion_contacto"
                                value={formData.direccion_contacto}
                                onChange={(e) => setFormData(prev => ({ ...prev, direccion_contacto: e.target.value }))}
                                placeholder="Av. Principal 123, Miraflores, Lima"
                                disabled={!canEdit}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance & Branding */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-muted-foreground" /> Branding y Apariencia
                    </CardTitle>
                    <CardDescription>
                        Personaliza cómo se ve tu espacio para todos los miembros.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Logo Section */}
                    <div className="space-y-4">
                        <Label>Logo del Workspace</Label>
                        <div className="flex items-start gap-6">
                            <div className="relative group">
                                <div
                                    className={cn(
                                        "h-16 w-64 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-background transition-all",
                                        !formData.logo && "group-hover:border-primary/50"
                                    )}
                                    style={!formData.logo ? { backgroundColor: formData.color } : {}}
                                >
                                    {formData.logo ? (
                                        <Image
                                            src={getLogoUrl(formData.logo)}
                                            alt="Workspace Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">
                                            {formData.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {formData.logo && (
                                    <button
                                        onClick={removeLogo}
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                {canEdit && (
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isUploading}
                                            onClick={() => document.getElementById("logo-upload")?.click()}
                                        >
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                            Subir nueva imagen
                                        </Button>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Recomendado: <strong>1200x300px (4:1)</strong>.
                                    <br />
                                    Usa <strong>SVG o PNG transparente</strong> para mejores resultados. Máx. 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Color Section */}
                    <div className="space-y-4">
                        <Label>Color de Identidad</Label>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => canEdit && setFormData(prev => ({ ...prev, color }))}
                                    disabled={!canEdit}
                                    className={cn(
                                        "h-10 w-10 rounded-full border-4 transition-all",
                                        formData.color === color
                                            ? "border-primary scale-110 shadow-md"
                                            : "border-transparent",
                                        canEdit ? "hover:scale-105" : "cursor-default border-border/10 opacity-70"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Management Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Order Statuses Settings */}
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-muted-foreground" /> Estados de Pedido
                            </CardTitle>
                            <CardDescription>
                                Seguimiento del progreso de tus ventas.
                            </CardDescription>
                        </div>
                        {canEdit && (
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Nuevo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Nuevo Estado</DialogTitle>
                                        <DialogDescription>
                                            Define un nombre y un color para el nuevo estado de pedido.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Nombre del Estado</Label>
                                            <Input
                                                placeholder="Ej: En camino"
                                                value={newStatus.name}
                                                onChange={(e) => {
                                                    const name = e.target.value;
                                                    setNewStatus(prev => ({
                                                        ...prev,
                                                        name,
                                                        value: generateSlug(name)
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Color del Indicador</Label>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-10 w-10 rounded-md border shadow-sm"
                                                    style={{ backgroundColor: newStatus.color }}
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    {PRESET_COLORS.map(c => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            className={cn(
                                                                "h-7 w-7 rounded-full border transition-transform hover:scale-110",
                                                                newStatus.color === c ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-80"
                                                            )}
                                                            style={{ backgroundColor: c }}
                                                            onClick={() => setNewStatus(prev => ({ ...prev, color: c }))}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                        <Button onClick={handleAddStatus} disabled={isAddingStatus}>
                                            {isAddingStatus ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                            Crear Estado
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderStatuses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground italic">
                                                Sin estados configurados.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orderStatuses.map((status) => (
                                            <TableRow key={status.id} className="group transition-colors">
                                                <TableCell className="font-medium p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: status.color }}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{status.name}</span>
                                                            <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">
                                                                {status.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {canEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteStatus(status.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Statuses Settings */}
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-muted-foreground" /> Estados de Pago
                            </CardTitle>
                            <CardDescription>
                                Define cobros (Acuenta, Cancelado, etc.)
                            </CardDescription>
                        </div>
                        {canEdit && (
                            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Nuevo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Nuevo Estado de Pago</DialogTitle>
                                        <DialogDescription>
                                            Define un nombre y un color para el nuevo estado de pago.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Nombre del Estado</Label>
                                            <Input
                                                placeholder="Ej: Acuenta"
                                                value={newPaymentStatus.name}
                                                onChange={(e) => {
                                                    const name = e.target.value;
                                                    setNewPaymentStatus(prev => ({
                                                        ...prev,
                                                        name,
                                                        value: generateSlug(name)
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Color de Referencia</Label>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-10 w-10 rounded-md border shadow-sm"
                                                    style={{ backgroundColor: newPaymentStatus.color }}
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    {PRESET_COLORS.map(c => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            className={cn(
                                                                "h-7 w-7 rounded-full border transition-transform hover:scale-110",
                                                                newPaymentStatus.color === c ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-80"
                                                            )}
                                                            style={{ backgroundColor: c }}
                                                            onClick={() => setNewPaymentStatus(prev => ({ ...prev, color: c }))}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
                                        <Button onClick={handleAddPaymentStatus} disabled={isAddingPaymentStatus}>
                                            {isAddingPaymentStatus ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                            Crear Pago
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentStatuses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground italic">
                                                Sin estados configurados.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paymentStatuses.map((status) => (
                                            <TableRow key={status.id} className="group transition-colors">
                                                <TableCell className="font-medium p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: status.color }}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{status.name}</span>
                                                            <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">
                                                                {status.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {canEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeletePaymentStatus(status.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Courier Types Settings */}
            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-muted-foreground" /> Tipos de Courier
                        </CardTitle>
                        <CardDescription>
                            Define las agencias de transporte que utilizas.
                        </CardDescription>
                    </div>
                    {canEdit && (
                        <Dialog open={isCourierModalOpen} onOpenChange={setIsCourierModalOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nuevo Courier
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Tipo de Courier</DialogTitle>
                                    <DialogDescription>
                                        Define un nombre para la agencia de transporte.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Nombre del Courier / Agencia</Label>
                                        <Input
                                            placeholder="Ej: Olva Courier"
                                            value={newCourierType.name}
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                setNewCourierType(prev => ({
                                                    ...prev,
                                                    name,
                                                    value: generateSlug(name)
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Color de Referencia</Label>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-md border shadow-sm"
                                                style={{ backgroundColor: newCourierType.color }}
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {PRESET_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        className={cn(
                                                            "h-7 w-7 rounded-full border transition-transform hover:scale-110",
                                                            newCourierType.color === c ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-80"
                                                        )}
                                                        style={{ backgroundColor: c }}
                                                        onClick={() => setNewCourierType(prev => ({ ...prev, color: c }))}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCourierModalOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleAddCourierType} disabled={isAddingCourierType}>
                                        {isAddingCourierType ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                        Crear Courier
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Agencia / Courier</TableHead>
                                    <TableHead className="text-right">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courierTypes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center text-muted-foreground italic">
                                            No hay tipos de courier configurados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    courierTypes.map((type) => (
                                        <TableRow key={type.id} className="group transition-colors">
                                            <TableCell className="font-medium p-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-3 w-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: type.color }}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{type.name}</span>
                                                        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">
                                                            {type.value}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {canEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDeleteCourierType(type.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>






            {/* Bottom Actions - Only show if can edit */}
            {canEdit && (
                <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl shadow-sm sticky bottom-6 z-10">
                    <p className="text-sm text-muted-foreground hidden md:block">
                        Asegúrate de guardar todos los cambios antes de salir.
                    </p>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="w-full md:w-auto px-12"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </div>
            )}

            {/* Danger Zone - Red Box */}
            {canDelete && (
                <div className="mt-12 p-6 border border-destructive/30 rounded-xl bg-destructive/[0.03]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                                <Trash2 className="h-5 w-5" /> Zona de Peligro
                            </h3>
                            <p className="text-sm text-destructive/80 mt-1">
                                Aquí puedes borrar tu workspace definitivamente
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="font-semibold px-8 shadow-lg shadow-destructive/20">
                                    Eliminar Workspace
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Borrar este workspace?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción borrará permanentemente <span className="font-bold text-foreground">"{workspace.name}"</span> y todos sus datos.
                                        Para confirmar, escribe el nombre del workspace:
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                    <Input
                                        value={deleteConfirmName}
                                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                                        placeholder={workspace.name}
                                        className="border-red-500/50"
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteConfirmName("")}>Cancelar</AlertDialogCancel>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={deleteConfirmName !== workspace.id && deleteConfirmName !== workspace.name || isDeleting}
                                    >
                                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Confirmar Eliminación
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}


        </div>
    );
}
