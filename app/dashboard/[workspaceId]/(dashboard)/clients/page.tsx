import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getClientsByWorkspace } from "@/lib/client-actions";
import { ClientList } from "@/components/dashboard/clients/client-list";

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

    // Obtener clientes usando el ID del workspace
    const { data: clients, error: clientsError } = await getClientsByWorkspace(workspace.id);

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
            />
        </div>
    );
}
