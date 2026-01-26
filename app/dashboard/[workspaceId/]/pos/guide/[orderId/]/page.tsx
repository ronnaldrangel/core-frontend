
import { getOrderById } from "@/lib/order-actions";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function GuidePage({
    params
}: {
    params: { workspaceId: string; orderId: string }
}) {
    const workspaceRes = await getWorkspaceBySlug(params.workspaceId);
    const orderRes = await getOrderById(params.orderId);

    if (!workspaceRes.data || !orderRes.data) {
        return notFound();
    }

    const workspace = workspaceRes.data;
    const order = orderRes.data;
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    return (
        <div className="bg-white min-h-screen text-black p-4 font-sans text-[12px] leading-tight flex flex-col items-center">
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm auto;
                    }
                    body {
                        margin: 0;
                        padding: 10mm;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
                body {
                    background-color: #f3f4f6;
                }
                .ticket-container {
                    width: 300px;
                    background: white;
                    padding: 20px;
                    border: 2px solid black;
                }
                @media print {
                    body { background: white; }
                    .ticket-container {
                        width: 100%;
                        border: none;
                        padding: 0;
                    }
                }
            `}} />

            <div className="no-print mb-4 flex gap-2">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white px-4 py-2 rounded-md font-bold shadow-md hover:bg-gray-800 transition-colors"
                >
                    IMPRIMIR GUÍA
                </button>
            </div>

            <div className="ticket-container">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-lg font-black uppercase text-white bg-black px-2 py-1 inline-block">GUÍA DE DESPACHO</h1>
                    <p className="text-[10px] mt-2 font-bold uppercase">{workspace.name}</p>
                </div>

                <div className="border-b-2 border-black my-4"></div>

                {/* Logistics Info */}
                <div className="space-y-3">
                    <div className="p-2 border border-black rounded">
                        <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">AGENCIA DE TRANSPORTE</p>
                        <p className="text-lg font-black">{order.courier_nombre || "---"}</p>
                    </div>

                    <div className="p-2 border border-black rounded">
                        <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">DESTINO / AGENCIA</p>
                        <p className="text-sm font-bold">{order.courier_provincia_dpto || "---"}</p>
                        <p className="text-sm">{order.courier_destino_agencia || "---"}</p>
                    </div>

                    <div className="p-2 border border-black rounded space-y-2 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold uppercase text-gray-500">SEGUIMIENTO</p>
                            <small className="bg-black text-white px-1 text-[8px] rounded uppercase font-bold">{order.estado_pedido}</small>
                        </div>
                        <p className="text-xs"><strong>NRO. ORDEN:</strong> {order.courier_nro_orden || "N/A"}</p>
                        <p className="text-xs"><strong>CÓDIGO:</strong> {order.courier_codigo || "N/A"}</p>
                        <p className="text-xs"><strong>CLAVE:</strong> {order.courier_clave || "N/A"}</p>
                    </div>
                </div>

                <div className="border-b-2 border-black my-4 border-dashed"></div>

                {/* Client Info */}
                <div className="p-2 border border-gray-300 rounded">
                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">DESTINATARIO</p>
                    {order.cliente_id ? (
                        <>
                            <p className="text-sm font-bold italic uppercase">{(order.cliente_id as any).nombre_completo}</p>
                            <p className="text-xs">📞 {(order.cliente_id as any).telefono || "S/N"}</p>
                            <p className="text-xs">📍 {(order.cliente_id as any).direccion || "S/D"}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{(order.cliente_id as any).distrito}, {(order.cliente_id as any).departamento}</p>
                        </>
                    ) : (
                        <p className="italic text-gray-400">Cliente no registrado</p>
                    )}
                </div>

                {/* QR Placeholder / Barcode Area */}
                <div className="mt-6 flex flex-col items-center justify-center p-4 border-2 border-black border-dotted">
                    <p className="text-[8px] font-black uppercase mb-1">ID INTERNO DE DESPACHO</p>
                    <p className="text-xs font-mono font-bold tracking-widest">{order.id.toUpperCase()}</p>
                </div>

                {/* Date Footer */}
                <div className="mt-4 text-center text-[9px] text-gray-400">
                    <p>GENERADO EL {format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: es })}</p>
                    <p className="mt-1 font-bold">POS SYSTEM v2.0</p>
                </div>
            </div>
        </div>
    );
}
