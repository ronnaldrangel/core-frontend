"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Loader2, ArrowUpCircle, ArrowDownCircle, Banknote, CreditCard, Send } from "lucide-react";
import { toast } from "sonner";
import { createTransaction } from "@/lib/cashbox-actions";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transaction: any) => void;
    workspaceId: string;
}

export function TransactionModal({ isOpen, onClose, onSuccess, workspaceId }: TransactionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [tipo, setTipo] = useState<"ingreso" | "egreso">("ingreso");
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [metodoPago, setMetodoPago] = useState<"cash" | "card" | "transfer">("cash");

    const resetForm = () => {
        setTipo("ingreso");
        setMonto("");
        setDescripcion("");
        setMetodoPago("cash");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
            toast.error("Por favor ingresa un monto válido mayor a 0");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await createTransaction({
                workspace_id: workspaceId,
                tipo,
                monto: Number(monto),
                descripcion,
                metodo_pago: metodoPago
            });

            if (error) {
                toast.error(error);
            } else if (data) {
                toast.success(`Movimiento de ${tipo} registrado correctamente`);
                onSuccess(data);
                resetForm();
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) onClose();
        }}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
                <div className={cn(
                    "h-2 w-full transition-colors duration-500",
                    tipo === "ingreso" ? "bg-emerald-500" : "bg-rose-500"
                )} />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {tipo === "ingreso" ? (
                                <ArrowUpCircle className="h-6 w-6 text-emerald-500" />
                            ) : (
                                <ArrowDownCircle className="h-6 w-6 text-rose-500" />
                            )}
                            Registrar Movimiento
                        </DialogTitle>
                        <DialogDescription>
                            Ingresa los detalles del flujo de caja.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Tipo de Movimiento</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant={tipo === "ingreso" ? "default" : "outline"}
                                    className={cn(
                                        "h-12 flex items-center gap-2 border-2 transition-all",
                                        tipo === "ingreso"
                                            ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                            : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                                    )}
                                    onClick={() => setTipo("ingreso")}
                                >
                                    <ArrowUpCircle className="h-4 w-4" />
                                    Ingreso
                                </Button>
                                <Button
                                    type="button"
                                    variant={tipo === "egreso" ? "default" : "outline"}
                                    className={cn(
                                        "h-12 flex items-center gap-2 border-2 transition-all",
                                        tipo === "egreso"
                                            ? "bg-rose-500 hover:bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                                            : "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                    )}
                                    onClick={() => setTipo("egreso")}
                                >
                                    <ArrowDownCircle className="h-4 w-4" />
                                    Egreso
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="monto" className="text-xs font-bold uppercase text-muted-foreground">Monto</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">S/</span>
                                <Input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder="0.00"
                                    className="pl-12 h-14 text-xl font-bold bg-muted/30 border-none focus-visible:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metodo" className="text-xs font-bold uppercase text-muted-foreground">Método de Pago</Label>
                            <Select value={metodoPago} onValueChange={(v: any) => setMetodoPago(v)}>
                                <SelectTrigger id="metodo" className="h-12 bg-muted/30 border-none">
                                    <SelectValue placeholder="Selecciona un método" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4" />
                                            Efectivo
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="card">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Tarjeta
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="transfer">
                                        <div className="flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            Transferencia
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="text-xs font-bold uppercase text-muted-foreground">Descripción (Opcional)</Label>
                            <Input
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Ej: Pago de alquiler, Venta extra..."
                                className="h-12 bg-muted/30 border-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full h-12 text-lg font-bold transition-all active:scale-95",
                                tipo === "ingreso" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                `Registrar ${tipo}`
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
