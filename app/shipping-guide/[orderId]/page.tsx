import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/lib/order-actions";
import { getWorkspace } from "@/lib/workspace-actions";
import { ShippingGuideView } from "@/components/shipping-guide/shipping-guide-view";

interface ShippingGuidePageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function ShippingGuidePage({ params }: ShippingGuidePageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { orderId } = await params;

    const { data: order, error: orderError } = await getOrderById(orderId);
    if (orderError || !order) notFound();

    const { data: workspace, error: workspaceError } = await getWorkspace(order.workspace_id);
    if (workspaceError || !workspace) notFound();

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 print:p-0 print:bg-white overflow-x-hidden">
            <ShippingGuideView order={order} workspace={workspace} />
        </div>
    );
}
