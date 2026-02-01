import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getOrdersByWorkspace } from "@/lib/order-history-actions";
import { getOrderStatuses } from "@/lib/order-actions";
import { getMyPermissions } from "@/lib/rbac-actions";
import { OrderAnalytics } from "@/components/dashboard/orders/order-analytics";

interface AnalyticsPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;
    const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        notFound();
    }

    // Verificar permisos
    const permissions = await getMyPermissions(workspace.id);
    if (!permissions.includes("*") && !permissions.includes("orders.read")) {
        redirect(`/dashboard/${slug}`);
    }

    // Fetch data
    const [ordersResult, orderStatusesResult] = await Promise.all([
        getOrdersByWorkspace(workspace.id),
        getOrderStatuses(workspace.id)
    ]);

    const orders = ordersResult.data || [];
    const orderStatuses = orderStatusesResult.data || [];

    return (
        <div className="space-y-6">
            <OrderAnalytics
                orders={orders}
                orderStatuses={orderStatuses}
                themeColor={workspace.color}
            />
        </div>
    );
}
