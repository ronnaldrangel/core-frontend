"use client"

import { useState } from "react"
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { requestPasswordReset } from "@/lib/actions"
import AuthLayout from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await requestPasswordReset(email)

            if (result.error) {
                toast.error(result.error)
                return
            }

            setSuccess(true)
            toast.success("Email enviado. Revisa tu bandeja.")
        } catch (err: any) {
            toast.error("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Recuperar Acceso</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Ingresa tu correo para recibir un enlace de recuperación
                    </p>
                </div>

                {!success ? (
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando email...
                                </>
                            ) : (
                                "Enviar Enlace"
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            <Link href="/login" className="underline underline-offset-4 flex items-center justify-center gap-2">
                                <ArrowLeft className="h-3 w-3" /> Volver al login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="rounded-full bg-green-500/20 p-4 text-green-500">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold">Email Enviado</h3>
                        <p className="text-sm text-muted-foreground">
                            Hemos enviado las instrucciones a <span className="font-medium text-foreground">{email}</span>.
                            Por favor revisa tu bandeja de entrada.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login">
                                Volver al login
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </AuthLayout>
    )
}
