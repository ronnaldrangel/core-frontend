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
import { PaymentMethod } from "@/lib/order-actions";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transaction: any) => void;
    workspaceId: string;
    paymentMethods: PaymentMethod[];
}

export function TransactionModal({ isOpen, onClose, onSuccess, workspaceId, paymentMethods }: TransactionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [tipo, setTipo] = useState<"ingreso" | "egreso">("ingreso");
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [metodoPago, setMetodoPago] = useState<string>(paymentMethods[0]?.id || "");

    const resetForm = () => {
        setTipo("ingreso");
        setMonto("");
        setDescripcion("");
        setMetodoPago(paymentMethods[0]?.id || "");
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
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-1 transition-colors duration-500",
                    tipo === "ingreso" ? "bg-emerald-500" : "bg-rose-500"
                )} />

                <form onSubmit={handleSubmit} className="space-y-8 py-4">
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
                            Completa la información del movimiento de caja.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tipo de Movimiento</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant={tipo === "ingreso" ? "default" : "outline"}
                                    className={cn(
                                        "h-11 flex items-center gap-2 transition-all",
                                        tipo === "ingreso"
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
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
                                        "h-11 flex items-center gap-2 transition-all",
                                        tipo === "egreso"
                                            ? "bg-rose-500 hover:bg-rose-600 text-white"
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
                            <Label htmlFor="monto">Monto</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none">S/</span>
                                <Input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder="0.00"
                                    className="pl-7"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metodo">Método de Pago</Label>
                            <Select value={metodoPago} onValueChange={(v: string) => setMetodoPago(v)}>
                                <SelectTrigger id="metodo">
                                    <SelectValue placeholder="Selecciona un método" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method.id} value={method.id}>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: method.color }} />
                                                {method.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                            <Input
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Ej: Pago de alquiler, Venta extra..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t gap-2 md:gap-0">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "px-8",
                                tipo === "ingreso" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
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
