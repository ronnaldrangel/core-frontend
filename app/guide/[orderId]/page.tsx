import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/lib/order-actions";
import { getWorkspace } from "@/lib/workspace-actions";
import { GuideView } from "@/components/guide/guide-view";

interface GuidePageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { orderId } = await params;

    // 1. Get Order
    const { data: order, error: orderError } = await getOrderById(orderId);

    if (orderError || !order) {
        notFound();
    }

    // 2. Get Workspace
    const { data: workspace, error: workspaceError } = await getWorkspace(order.workspace_id);

    if (workspaceError || !workspace) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 print:p-0 print:bg-white">
            <GuideView order={order} workspace={workspace} />
        </div>
    );
}
