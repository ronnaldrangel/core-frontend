import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Palette, Bell, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Settings className="h-8 w-8 text-primary" />
                        Configuración
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Configura las opciones de tu workspace.
                    </p>
                </div>
            </div>

            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" /> General
                    </CardTitle>
                    <CardDescription>
                        Información básica del workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre del Workspace</Label>
                        <Input id="name" placeholder="Mi Workspace" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input id="description" placeholder="Descripción opcional..." />
                    </div>
                    <Button>Guardar Cambios</Button>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" /> Apariencia
                    </CardTitle>
                    <CardDescription>
                        Personaliza el aspecto visual del workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Color del Workspace</Label>
                        <div className="flex gap-2">
                            {["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map((color) => (
                                <button
                                    key={color}
                                    className="h-8 w-8 rounded-lg border-2 border-transparent hover:border-foreground/50 transition-colors"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" /> Notificaciones
                    </CardTitle>
                    <CardDescription>
                        Configura cómo recibir notificaciones.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Las opciones de notificación estarán disponibles próximamente.
                    </p>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                        <Trash2 className="h-5 w-5" /> Zona de Peligro
                    </CardTitle>
                    <CardDescription>
                        Acciones irreversibles para este workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                        <div>
                            <p className="font-medium text-foreground">Eliminar Workspace</p>
                            <p className="text-sm text-muted-foreground">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <Button variant="destructive">
                            Eliminar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
