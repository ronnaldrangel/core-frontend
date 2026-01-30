import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getCashboxTransactions } from "@/lib/cashbox-actions";
import { getMyPermissions } from "@/lib/rbac-actions";
import { CashboxClient } from "@/components/dashboard/cashbox/cashbox-client";

interface CashboxPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function CashboxPage({ params }: CashboxPageProps) {
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
    if (!permissions.includes("*") && !permissions.includes("cashbox.read")) {
        redirect(`/dashboard/${slug}`);
    }

    // Obtener movimientos usando el ID del workspace
    const { data: transactions, error: transactionsError } = await getCashboxTransactions(workspace.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Caja</h1>
                <p className="text-muted-foreground">
                    Control de ingresos y egresos de {workspace.name}
                </p>
            </div>

            <CashboxClient
                initialTransactions={transactions || []}
                workspaceId={workspace.id}
            />
        </div>
    );
}
