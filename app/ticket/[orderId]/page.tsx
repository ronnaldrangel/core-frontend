import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/lib/order-actions";
import { getWorkspace } from "@/lib/workspace-actions";
import { TicketView } from "@/components/ticket/ticket-view";

interface TicketPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { orderId } = await params;

    // 1. Get Order
    const { data: order, error: orderError } = await getOrderById(orderId);

    if (orderError || !order) {
        notFound();
    }

    // 2. Get Workspace for branding
    const { data: workspace, error: workspaceError } = await getWorkspace(order.workspace_id);

    if (workspaceError || !workspace) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 print:p-0 print:bg-white">
            <TicketView order={order} workspace={workspace} />
        </div>
    );
}
