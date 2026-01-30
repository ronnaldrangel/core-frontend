import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getProductsByWorkspace } from "@/lib/product-actions";
import { getClientsByWorkspace } from "@/lib/client-actions";
import { getMyPermissions } from "@/lib/rbac-actions";
import { POSSystem } from "@/components/dashboard/pos/pos-system";

interface POSPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function POSPage({ params }: POSPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;

    // Buscar workspace por slug para obtener el ID real
    const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        notFound();
    }

    // Verificar permisos
    const permissions = await getMyPermissions(workspace.id);
    if (!permissions.includes("*") && !permissions.includes("orders.create")) {
        redirect(`/dashboard/${slug}`);
    }

    const { getOrderStatuses, getPaymentStatuses, getCourierTypes, getPaymentMethods } = await import("@/lib/order-actions");

    // Obtener productos, clientes y estados en paralelo
    const [productsResult, clientsResult, orderStatusesRes, paymentStatusesRes, courierTypesRes, paymentMethodsRes] = await Promise.all([
        getProductsByWorkspace(workspace.id),
        getClientsByWorkspace(workspace.id),
        getOrderStatuses(workspace.id),
        getPaymentStatuses(workspace.id),
        getCourierTypes(workspace.id),
        getPaymentMethods(workspace.id)
    ]);

    return (
        <div className="h-full">
            <POSSystem
                products={productsResult.data || []}
                clients={clientsResult.data || []}
                workspaceId={workspace.id}
                orderStatuses={orderStatusesRes.data || []}
                paymentStatuses={paymentStatusesRes.data || []}
                courierTypes={courierTypesRes.data || []}
                paymentMethods={paymentMethodsRes.data || []}
            />
        </div>
    );
}

