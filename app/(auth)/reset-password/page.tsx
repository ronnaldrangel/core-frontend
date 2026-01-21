"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { resetPassword } from "@/lib/actions"
import AuthLayout from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    // Obtener el email codificado de la URL si existe
    const encodedEmail = searchParams.get("e")
    let email = ""
    if (encodedEmail) {
        try {
            email = atob(encodedEmail)
        } catch (e) {
            console.error("Error decoding email")
        }
    }

    useEffect(() => {
        if (!token) {
            setError("Token de recuperación no encontrado. Por favor solicita un nuevo enlace.")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            toast.error("Token inválido")
            return
        }

        if (token && password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        if (password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres")
            return
        }

        setLoading(true)

        try {
            const result = await resetPassword(token, password, email)

            if (result.error) {
                toast.error(result.error)
                return
            }

            setSuccess(true)
            toast.success("Contraseña actualizada correctamente")
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        } catch (err: any) {
            toast.error("Error al restablecer contraseña")
        } finally {
            setLoading(false)
        }
    }

    if (!token && !success) {
        return (
            <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/20 p-4 text-destructive">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Enlace Inválido</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/forgot-password">
                        Solicitar nuevo enlace
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {!success ? (
                <>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Nueva Contraseña</h1>
                        <p className="text-balance text-sm text-muted-foreground">
                            Crea una nueva contraseña segura para tu cuenta
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <PasswordInput
                                id="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <PasswordInput
                                id="confirmPassword"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Restableciendo...
                                </>
                            ) : (
                                "Restablecer Contraseña"
                            )}
                        </Button>
                    </form>
                </>
            ) : (
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-500/20 p-4 text-green-500">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">¡Contraseña Cambiada!</h3>
                        <p className="text-sm text-muted-foreground">
                            Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en unos segundos.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <Suspense fallback={
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    )
}
