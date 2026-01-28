import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getSalesData, getTopProducts, getSalesByUser } from "@/lib/sales-actions";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

interface DashboardWorkspacePageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function DashboardWorkspacePage({ params }: DashboardWorkspacePageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId } = await params; // This is now the slug
    const { data: workspace } = await getWorkspaceBySlug(workspaceId);

    // Si no hay workspace, el layout ya manejó el notFound()
    if (!workspace) return null;

    // Obtener datos en paralelo
    const [salesDataResult, topProductsResult, salesByUserResult] = await Promise.all([
        getSalesData(workspace.id, 90),
        getTopProducts(workspace.id, 5),
        getSalesByUser(workspace.id),
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Dashboard Content - Maneja el filtro de tiempo global y el header */}
            <DashboardContent
                workspace={workspace}
                initialSalesData={salesDataResult.data}
                topProducts={topProductsResult.data}
                salesByUser={salesByUserResult.data}
            />
        </div>
    );
}
