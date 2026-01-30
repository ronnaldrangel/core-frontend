import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getClientsByWorkspace } from "@/lib/client-actions";
import { getMyPermissions } from "@/lib/rbac-actions";
import { ClientList } from "@/components/dashboard/clients/client-list";
import { directus } from "@/lib/directus";
import { readItems, aggregate } from "@directus/sdk";

interface ClientsPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function ClientsPage({ params }: ClientsPageProps) {
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
    if (!permissions.includes("*") && !permissions.includes("clients.read")) {
        redirect(`/dashboard/${slug}`);
    }

    // Obtener clientes usando el ID del workspace
    const { data: clients, error: clientsError } = await getClientsByWorkspace(workspace.id);

    // Calcular totales gastados por cliente
    const clientTotals: Record<string, number> = {};

    if (clients && clients.length > 0) {
        try {
            // Obtener todas las órdenes del workspace con sus totales agrupados por cliente
            const orders = await directus.request(
                readItems("orders", {
                    filter: {
                        workspace_id: { _eq: workspace.id },
                        cliente_id: { _nnull: true }
                    },
                    fields: ["cliente_id", "total"],
                    limit: -1 // Sin límite para obtener todas
                })
            );

            // Sumar los totales por cliente
            orders.forEach((order: any) => {
                const clientId = order.cliente_id;
                if (clientId) {
                    clientTotals[clientId] = (clientTotals[clientId] || 0) + parseFloat(order.total || 0);
                }
            });
        } catch (error) {
            console.error("Error calculating client totals:", error);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <p className="text-muted-foreground">
                    Administra el directorio de clientes para {workspace.name}
                </p>
            </div>

            <ClientList
                initialClients={clients || []}
                workspaceId={workspace.id}
                clientTotals={clientTotals}
            />
        </div>
    );
}
