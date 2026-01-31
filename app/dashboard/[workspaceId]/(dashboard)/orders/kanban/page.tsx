import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getOrdersByWorkspace } from "@/lib/order-history-actions";
import { getOrderStatuses } from "@/lib/order-actions";
import { OrderKanban } from "@/components/dashboard/orders/order-kanban";

interface KanbanPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function KanbanPage({ params }: KanbanPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;

    // First get the workspace
    const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        console.error("Workspace error in KanbanPage:", workspaceError);
        notFound();
    }

    try {
        // Fetch data in parallel
        const [ordersResult, orderStatusesResult] = await Promise.all([
            getOrdersByWorkspace(workspace.id),
            getOrderStatuses(workspace.id)
        ]);

        const orders = ordersResult?.data || [];
        const orderStatuses = orderStatusesResult?.data || [];

        return (
            <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
                <div className="flex-shrink-0">
                    <h1 className="text-3xl font-bold tracking-tight">Kanban de Pedidos</h1>
                    <p className="text-muted-foreground">
                        Gestiona visualmente el flujo de pedidos de {workspace.name}
                    </p>
                </div>

                <div className="flex-1 min-h-0">
                    <OrderKanban
                        orders={orders}
                        orderStatuses={orderStatuses}
                        themeColor={workspace.color || undefined}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Runtime error in KanbanPage:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-semibold">Algo salió mal al cargar el tablero</h2>
                <p className="text-muted-foreground">Por favor, intenta recargar la página.</p>
            </div>
        );
    }
}
