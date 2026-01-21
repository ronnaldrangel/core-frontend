"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { verifyEmail } from "@/lib/actions"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import AuthLayout from "@/components/auth-layout"
import { Button } from "@/components/ui/button"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const hasCalled = useRef(false)

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Verificando tu cuenta...")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Falta el token de verificación.")
            return
        }

        if (hasCalled.current) return
        hasCalled.current = true

        const verify = async () => {
            const result = await verifyEmail(token)
            if (result.success) {
                setStatus("success")
                setMessage("¡Cuenta verificada con éxito!")
            } else {
                setStatus("error")
                setMessage(result.error || "Ocurrió un error al verificar tu cuenta.")
            }
        }

        verify()
    }, [token])

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h1 className="text-2xl font-bold mt-4">{message}</h1>
                <p className="text-sm text-muted-foreground">Esto tomará solo un momento.</p>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-500/20 p-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mt-4">{message}</h1>
                <p className="text-sm text-muted-foreground mb-8">Ahora puedes iniciar sesión con tu cuenta.</p>

                <Button className="w-full" asChild>
                    <Link href="/login">
                        Ir al Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="rounded-full bg-destructive/20 p-4">
                <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mt-4">Error de verificación</h1>
            <p className="text-sm text-muted-foreground mb-8">{message}</p>

            <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">
                    Volver al registro
                </Link>
            </Button>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <AuthLayout>
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <h1 className="text-2xl font-bold mt-4">Iniciando verificación...</h1>
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </AuthLayout>
    )
}
