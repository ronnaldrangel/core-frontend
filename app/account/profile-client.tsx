"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, updateAvatar, removeAvatar, UserProfile } from "@/lib/profile-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
    User,
    Camera,
    Mail,
    MapPin,
    Briefcase,
    Save,
    Trash2,
    Upload
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProfileClientProps {
    profile: UserProfile;
    directusUrl: string;
}

export function ProfileClient({ profile, directusUrl }: ProfileClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    const [formData, setFormData] = useState({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        title: profile.title || "",
        description: profile.description || "",
        location: profile.location || "",
    });

    const avatarUrl = profile.avatar
        ? `${directusUrl}/assets/${profile.avatar}?width=200&height=200&fit=cover`
        : null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSaveProfile = async () => {
        startTransition(async () => {
            const result = await updateProfile(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Perfil actualizado exitosamente");
                router.refresh();
            }
        });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        startTransition(async () => {
            const result = await updateAvatar(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Foto de perfil actualizada");
                router.refresh();
            }
        });
    };

    const handleRemoveAvatar = async () => {
        startTransition(async () => {
            const result = await removeAvatar();
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Foto de perfil eliminada");
                setShowRemoveDialog(false);
                router.refresh();
            }
        });
    };

    const getInitials = () => {
        const first = formData.first_name?.[0] || "";
        const last = formData.last_name?.[0] || "";
        return (first + last).toUpperCase() || profile.email?.[0]?.toUpperCase() || "U";
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Mi Perfil
                </h1>
                <p className="text-muted-foreground mt-1">
                    Administra tu información personal y preferencias
                </p>
            </div>

            {/* Avatar Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Foto de Perfil</CardTitle>
                    <CardDescription>
                        Tu foto se mostrará en tu perfil y en los espacios de trabajo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div
                                className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer ring-4 ring-background shadow-lg"
                                onClick={handleAvatarClick}
                            >
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt="Avatar"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-white">
                                        {getInitials()}
                                    </span>
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={handleAvatarClick}
                                disabled={isPending}
                            >
                                <Upload className="h-4 w-4" />
                                Subir foto
                            </Button>
                            {avatarUrl && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-destructive hover:text-destructive"
                                    onClick={() => setShowRemoveDialog(true)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar
                                </Button>
                            )}
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, GIF o WebP. Máximo 5MB.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Información Personal</CardTitle>
                    <CardDescription>
                        Esta información será visible para otros miembros de tus espacios de trabajo
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                placeholder="Tu nombre"
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                placeholder="Tu apellido"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Email (Read only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                className="pl-10 bg-muted/50"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            El email no se puede cambiar
                        </p>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título / Rol</Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="title"
                                name="title"
                                placeholder="ej. Desarrollador Full Stack"
                                className="pl-10"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                name="location"
                                placeholder="ej. Ciudad de México, MX"
                                className="pl-10"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Acerca de mí</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Cuéntanos un poco sobre ti..."
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isPending}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Información de la Cuenta</CardTitle>
                    <CardDescription>
                        Detalles técnicos de tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">ID de usuario:</span>
                            <p className="font-mono text-xs mt-1 bg-muted p-2 rounded">{profile.id}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Email verificado:</span>
                            <p className="mt-1">{profile.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Remove Avatar Dialog */}
            <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tu foto de perfil será eliminada y se mostrará tus iniciales en su lugar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveAvatar}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
