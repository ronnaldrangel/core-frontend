"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "@/lib/actions";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Token de recuperación no encontrado. Por favor solicita un nuevo enlace.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError("Token inválido");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await resetPassword(token, password);

            if (result.error) {
                setError(result.error);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError("Error al restablecer la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    if (!token && !success) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-red-500 w-8 h-8" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Enlace Inválido</h3>
                    <p className="text-gray-400">{error}</p>
                </div>
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    return (
        <>
            {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Nueva Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Confirmar Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-2 px-4 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Restableciendo...
                            </>
                        ) : (
                            "Restablecer Contraseña"
                        )}
                    </button>
                </form>
            ) : (
                <div className="text-center space-y-6 py-4">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="text-green-500 w-8 h-8" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">¡Contraseña Cambiada!</h3>
                        <p className="text-gray-400">
                            Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en unos segundos.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md p-8 relative">
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
                            <Lock className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Nueva Contraseña</h1>
                        <p className="text-gray-400 mt-2 text-center text-balance">
                            Crea una nueva contraseña segura para tu cuenta
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
