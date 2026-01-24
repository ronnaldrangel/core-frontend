import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getOrdersByWorkspace } from "@/lib/order-history-actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Receipt, Calendar, User, CreditCard, Banknote } from "lucide-react";

interface OrdersPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function OrdersPage({ params }: OrdersPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;
    const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        notFound();
    }

    const { data: orders, error: ordersError } = await getOrdersByWorkspace(workspace.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Historial de Ventas</h1>
                <p className="text-muted-foreground">
                    Revisa todas las transacciones realizadas en {workspace.name}
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Método</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!orders || orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No hay ventas registradas aún.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {format(new Date(order.fecha_venta), "PPP p", { locale: es })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            {order.cliente_id?.nombre_completo || "Cliente Mostrador"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {order.metodo_pago === "cash" ? (
                                                <Banknote className="h-3.5 w-3.5 text-green-500" />
                                            ) : (
                                                <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                                            )}
                                            <span className="capitalize">
                                                {order.metodo_pago === "cash" ? "Efectivo" : "Tarjeta"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                            Completado
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        ${Number(order.total).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
