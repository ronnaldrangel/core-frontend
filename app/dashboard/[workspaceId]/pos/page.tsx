import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getProductsByWorkspace } from "@/lib/product-actions";
import { getClientsByWorkspace } from "@/lib/client-actions";
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

    // Obtener productos y clientes en paralelo
    const [productsResult, clientsResult] = await Promise.all([
        getProductsByWorkspace(workspace.id),
        getClientsByWorkspace(workspace.id)
    ]);

    return (
        <div className="h-full p-2 md:p-4">
            <POSSystem
                products={productsResult.data || []}
                clients={clientsResult.data || []}
                workspaceId={workspace.id}
            />
        </div>
    );
}
