"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Plus,
    Search,
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    Calendar,
    CreditCard,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionModal } from "./transaction-modal";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Transaction {
    id: string;
    tipo: "ingreso" | "egreso";
    monto: number;
    descripcion: string;
    metodo_pago: "cash" | "card" | "transfer";
    date_created: string;
}

interface CashboxClientProps {
    initialTransactions: Transaction[];
    workspaceId: string;
}

export function CashboxClient({ initialTransactions, workspaceId }: CashboxClientProps) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTransactions = transactions.filter(t =>
        t.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.metodo_pago.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalIngresos = transactions
        .filter(t => t.tipo === "ingreso")
        .reduce((acc, t) => acc + Number(t.monto), 0);

    const totalEgresos = transactions
        .filter(t => t.tipo === "egreso")
        .reduce((acc, t) => acc + Math.abs(Number(t.monto)), 0);

    const balanceTotal = totalIngresos - totalEgresos;

    const handleSuccess = (transaction: Transaction) => {
        setTransactions([transaction, ...transactions]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Ingresos</CardTitle>
                        <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
                            S/ {totalIngresos.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Entradas registradas
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Egresos</CardTitle>
                        <ArrowDownCircle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-500">
                            S/ {totalEgresos.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Salidas registradas
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Balance Total</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn(
                            "text-2xl font-bold tracking-tight",
                            balanceTotal >= 0 ? "text-primary" : "text-rose-600"
                        )}>
                            S/ {balanceTotal.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium opacity-60">
                            Saldo en caja
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros y Buscador */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                        placeholder="Buscar movimientos..."
                        className="pl-10 h-10 bg-muted/10 border-border/40 focus:bg-background/50 transition-all rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Movimiento
                </Button>
            </div>

            <div className="border rounded-lg border-border/50 overflow-hidden bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50 text-muted-foreground border-b border-border/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-4 py-4 font-medium text-sm">Fecha</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Descripción</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Tipo</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm">Método</TableHead>
                            <TableHead className="px-4 py-4 font-medium text-sm text-right">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/50">
                        {filteredTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <Filter className="h-8 w-8" />
                                        <p className="font-medium">No se encontraron movimientos registrados.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTransactions.map((t) => (
                                <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                            {format(new Date(t.date_created), "dd/MM/yyyy HH:mm", { locale: es })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="font-medium text-sm tracking-tight capitalize italic text-muted-foreground">
                                            {t.descripcion || "Sin descripción"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                                            t.tipo === "ingreso"
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                                        )}>
                                            {t.tipo === "ingreso" ? <ArrowUpCircle className="h-3 w-3" /> : <ArrowDownCircle className="h-3 w-3" />}
                                            {t.tipo}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                                            <CreditCard className="h-3.5 w-3.5 opacity-60" />
                                            {t.metodo_pago === 'cash' ? 'Efectivo' : t.metodo_pago === 'card' ? 'Tarjeta' : 'Transferencia'}
                                        </div>
                                    </TableCell>
                                    <TableCell className={cn(
                                        "px-4 py-4 text-right font-bold text-sm tabular-nums",
                                        t.tipo === "ingreso" ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
                                    )}>
                                        {t.tipo === "ingreso" ? "+" : ""}
                                        S/ {Number(t.monto).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                workspaceId={workspaceId}
            />
        </div>
    );
}
