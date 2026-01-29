import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getOrdersByWorkspace } from "@/lib/order-history-actions";
import { getOrderStatuses, getPaymentStatuses } from "@/lib/order-actions";
import { OrderTable } from "@/components/dashboard/orders/order-table";

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

    // Fetch data in parallel
    const [ordersResult, orderStatusesResult, paymentStatusesResult] = await Promise.all([
        getOrdersByWorkspace(workspace.id),
        getOrderStatuses(workspace.id),
        getPaymentStatuses(workspace.id)
    ]);

    const orders = ordersResult.data || [];
    const orderStatuses = orderStatusesResult.data || [];
    const paymentStatuses = paymentStatusesResult.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                <p className="text-muted-foreground">
                    Gestión y seguimiento de todas las transacciones realizadas en {workspace.name}
                </p>
            </div>

            <OrderTable
                orders={orders}
                orderStatuses={orderStatuses}
                paymentStatuses={paymentStatuses}
                themeColor={workspace.color}
            />
        </div>
    );
}
