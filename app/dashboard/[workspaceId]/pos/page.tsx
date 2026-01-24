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
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Punto de Venta</h1>
                    <p className="text-muted-foreground">
                        Registra ventas rápidamente para {workspace.name}
                    </p>
                </div>
            </div>

            <POSSystem
                products={productsResult.data || []}
                clients={clientsResult.data || []}
                workspaceId={workspace.id}
            />
        </div>
    );
}
