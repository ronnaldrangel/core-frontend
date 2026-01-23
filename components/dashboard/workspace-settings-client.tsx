"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Palette, Bell, Trash2, Loader2, Upload, X, Globe } from "lucide-react";
import { Workspace, updateWorkspace, uploadWorkspaceLogo, deleteWorkspace } from "@/lib/workspace-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
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

interface WorkspaceSettingsClientProps {
    workspace: Workspace;
    role: "owner" | "admin" | "editor" | "viewer";
}

const PRESET_COLORS = [
    "#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6"
];

export function WorkspaceSettingsClient({ workspace, role }: WorkspaceSettingsClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");

    const canEdit = role === "owner" || role === "admin" || role === "editor";
    const canDelete = role === "owner" || role === "admin";

    const [formData, setFormData] = useState({
        name: workspace.name,
        description: workspace.description || "",
        color: workspace.color,
        logo: workspace.logo,
    });

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

            {/* Danger Zone - Only show if can delete */}
            {canDelete && (
                <Card className="border-red-500/20 bg-red-500/[0.02]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" /> Zona de Peligro
                        </CardTitle>
                        <CardDescription className="text-red-500/70">
                            Acciones irreversibles que afectan a todo el equipo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-red-500/20 rounded-xl bg-background/50 gap-4">
                            <div>
                                <p className="font-semibold text-foreground">Eliminar este Workspace</p>
                                <p className="text-sm text-muted-foreground max-w-md mt-1">
                                    Borrarás permanentemente todos los proyectos, miembros y datos asociados. No se puede deshacer.
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="font-semibold">
                                        Eliminar definitivamente
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el workspace{" "}
                                            <span className="font-bold text-foreground">"{workspace.name}"</span> y todos sus datos asociados (miembros, proyectos y archivos).
                                            <br /><br />
                                            Para confirmar, escribe el nombre del workspace a continuación:
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-2 py-4">
                                        <Label htmlFor="confirm-name">
                                            Escribe <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-red-500 font-bold">{workspace.name}</span>
                                        </Label>
                                        <Input
                                            id="confirm-name"
                                            value={deleteConfirmName}
                                            onChange={(e) => setDeleteConfirmName(e.target.value)}
                                            placeholder={workspace.name}
                                            className="border-red-500/50 focus-visible:ring-red-500"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && deleteConfirmName === workspace.name && !isDeleting) {
                                                    handleDelete();
                                                }
                                            }}
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteConfirmName("")}>
                                            Cancelar
                                        </AlertDialogCancel>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={deleteConfirmName !== workspace.name || isDeleting}
                                            className="font-semibold"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Eliminando...
                                                </>
                                            ) : (
                                                "Entiendo las consecuencias, eliminar este workspace"
                                            )}
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
