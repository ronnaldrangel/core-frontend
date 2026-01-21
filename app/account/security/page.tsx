"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/lib/profile-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Shield,
    Eye,
    EyeOff,
    Lock,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function SecurityPage() {
    const [isPending, startTransition] = useTransition();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(passwordData.newPassword);
    const strengthLabels = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "La contraseña actual es requerida";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "La nueva contraseña es requerida";
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu nueva contraseña";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        startTransition(async () => {
            const result = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Contraseña actualizada exitosamente");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Seguridad
                </h1>
                <p className="text-muted-foreground mt-1">
                    Gestiona tu contraseña y la seguridad de tu cuenta
                </p>
            </div>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Cambiar Contraseña
                    </CardTitle>
                    <CardDescription>
                        Actualiza tu contraseña para mantener tu cuenta segura
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Contraseña actual</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Ingresa tu contraseña actual"
                                className="pl-10 pr-10"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-destructive">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nueva contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Ingresa tu nueva contraseña"
                                className="pl-10 pr-10"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-destructive">{errors.newPassword}</p>
                        )}

                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Fortaleza: {strengthLabels[passwordStrength - 1] || "Muy débil"}
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirma tu nueva contraseña"
                                className="pl-10 pr-10"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                        )}
                        {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Las contraseñas coinciden
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="gap-2"
                        >
                            <Shield className="h-4 w-4" />
                            {isPending ? "Actualizando..." : "Cambiar contraseña"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Tips Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Consejos de Seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Usa una contraseña única que no uses en otros sitios</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Incluye letras mayúsculas, minúsculas, números y símbolos</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Evita usar información personal como tu nombre o fecha de nacimiento</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Considera usar un gestor de contraseñas para mayor seguridad</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
