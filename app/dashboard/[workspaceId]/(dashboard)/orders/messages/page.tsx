import { getOrderStatuses } from "@/lib/order-actions";
import { OrderStatusMessages } from "@/components/dashboard/orders/order-status-messages";
import { redirect } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";

interface OrderMessagesPageProps {
    params: {
        workspaceId: string;
    };
}

export default async function OrderMessagesPage({ params }: OrderMessagesPageProps) {
    const { workspaceId: slug } = params;

    const workspaceResult = await getWorkspaceBySlug(slug);
    if (!workspaceResult.data) {
        redirect("/dashboard");
    }

    const workspaceId = workspaceResult.data.id;
    const { data: statuses, error } = await getOrderStatuses(workspaceId);

    if (error) {
        return (
            <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <h3 className="mt-4 text-lg font-semibold">Error al cargar configuraciones</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        No pudimos obtener los estados de pedido del servidor. Por favor, intenta de nuevo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 max-w-[1600px] mx-auto w-full">
            <OrderStatusMessages
                initialStatuses={statuses || []}
                workspaceId={workspaceId}
            />
        </div>
    );
}
