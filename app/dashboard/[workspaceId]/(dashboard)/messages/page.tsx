import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getOrdersWithMessages } from "@/lib/message-actions";
import { getMyPermissions } from "@/lib/rbac-actions";
import { MessagesClient } from "./messages-client";
import type { OrderWithMessages } from "@/types/messages";

interface MessagesPageProps {
    params: Promise<{ workspaceId: string }>;
    searchParams: Promise<{ order?: string }>;
}

export default async function MessagesPage({
    params,
    searchParams,
}: MessagesPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;
    const { order: initialOrderId } = await searchParams;

    const { data: workspace, error: workspaceError } =
        await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        notFound();
    }

    // Verificar permisos
    const permissions = await getMyPermissions(workspace.id);
    if (!permissions.includes("*") && !permissions.includes("orders.read")) {
        redirect(`/dashboard/${slug}`);
    }

    // Obtener pedidos con mensajes
    const { data: orders, error: ordersError } = await getOrdersWithMessages(
        workspace.id
    );

    if (ordersError) {
        console.error("Error loading orders:", ordersError);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    💬 Mensajería de Pedidos
                </h1>
                <p className="text-muted-foreground">
                    Comunicación en tiempo real sobre los pedidos de{" "}
                    {workspace.name}
                </p>
            </div>

            <MessagesClient
                initialOrders={(orders || []) as OrderWithMessages[]}
                workspaceId={workspace.id}
                currentUserId={session.user.id!}
                initialSelectedOrderId={initialOrderId}
            />
        </div>
    );
}
