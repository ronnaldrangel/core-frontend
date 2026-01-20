"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/actions";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const hasCalled = useRef(false);

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verificando tu cuenta...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Falta el token de verificación.");
            return;
        }

        if (hasCalled.current) return;
        hasCalled.current = true;

        const verify = async () => {
            const result = await verifyEmail(token);
            if (result.success) {
                setStatus("success");
                setMessage("¡Cuenta verificada con éxito!");
            } else {
                setStatus("error");
                setMessage(result.error || "Ocurrió un error al verificar tu cuenta.");
            }
        };

        verify();
    }, [token]);

    return (status === "loading" ? (
        <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
            <h1 className="text-2xl font-bold text-white mt-4">{message}</h1>
            <p className="text-slate-400">Esto tomará solo un momento.</p>
        </div>
    ) : status === "success" ? (
        <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">{message}</h1>
            <p className="text-slate-400 mb-8">Ahora puedes iniciar sesión con tu cuenta.</p>

            <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
                Ir al Login <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    ) : (
        <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-red-500/20 p-4 rounded-full">
                <XCircle className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">Error de verificación</h1>
            <p className="text-slate-400 mb-8">{message}</p>

            <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/10 transition-all active:scale-95"
            >
                Volver al registro
            </Link>
        </div>
    ));
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                    <Suspense fallback={
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
                            <h1 className="text-2xl font-bold text-white mt-4">Iniciando verificación...</h1>
                        </div>
                    }>
                        <VerifyEmailContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
