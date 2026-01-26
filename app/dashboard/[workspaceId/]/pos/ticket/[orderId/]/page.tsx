
import { getOrderById } from "@/lib/order-actions";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function TicketPage({
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
        <div className="bg-white min-h-screen text-black p-4 font-mono text-[12px] leading-tight flex flex-col items-center">
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
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                @media print {
                    body { background: white; }
                    .ticket-container {
                        width: 100%;
                        box-shadow: none;
                        padding: 0;
                    }
                }
            `}} />

            <div className="no-print mb-4 flex gap-2">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold shadow-md hover:bg-blue-700 transition-colors"
                >
                    IMPRIMIR BOLETA
                </button>
            </div>

            <div className="ticket-container">
                {/* Header */}
                <div className="text-center mb-4">
                    {workspace.logo && (
                        <div className="relative h-16 w-16 mx-auto mb-2">
                            <Image
                                src={`${directusUrl}/assets/${workspace.logo}`}
                                alt={workspace.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <h1 className="text-sm font-bold uppercase">{workspace.name}</h1>
                    <p className="text-[10px] text-gray-600">{workspace.description || "Comprobante de Venta"}</p>
                </div>

                <div className="border-b border-dashed border-gray-400 my-2"></div>

                {/* Order Info */}
                <div className="space-y-1">
                    <p><strong>FECHA:</strong> {format(new Date(order.fecha_venta), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                    <p><strong>ORDEN:</strong> #{order.id.slice(0, 8).toUpperCase()}</p>
                    {order.cliente_id && (
                        <>
                            <p><strong>CLIENTE:</strong> {(order.cliente_id as any).nombre_completo}</p>
                            <p><strong>DNI/RUC:</strong> {(order.cliente_id as any).documento_identificacion}</p>
                        </>
                    )}
                </div>

                <div className="border-b border-dashed border-gray-400 my-2"></div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-1">CANT.</th>
                            <th className="py-1">DESCRIPCIÓN</th>
                            <th className="py-1 text-right">SUB.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item: any, idx: number) => (
                            <tr key={idx} className="align-top">
                                <td className="py-1 border-b border-gray-50">{item.cantidad}</td>
                                <td className="py-1 border-b border-gray-50">
                                    {item.product_id?.nombre}
                                    {item.variante_seleccionada && (
                                        <span className="block text-[10px] text-gray-500 italic">[{item.variante_seleccionada}]</span>
                                    )}
                                </td>
                                <td className="py-1 border-b border-gray-50 text-right">S/ {item.subtotal.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>S/ {(order.total - (order.costo_envio || 0) - (order.ajuste_total || 0)).toFixed(2)}</span>
                    </div>
                    {order.costo_envio > 0 && (
                        <div className="flex justify-between">
                            <span>ENVÍO ({order.tipo_cobro_envio}):</span>
                            <span>S/ {order.costo_envio.toFixed(2)}</span>
                        </div>
                    )}
                    {order.ajuste_total !== 0 && (
                        <div className="flex justify-between">
                            <span>AJUSTE:</span>
                            <span>S/ {order.ajuste_total.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-400 mt-1">
                        <span>TOTAL:</span>
                        <span>S/ {order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mt-4 p-2 bg-gray-50 text-center rounded border border-gray-200">
                    <p className="font-bold uppercase text-[10px]">PAGO: {order.metodo_pago}</p>
                    <div className="flex justify-between text-[10px] mt-1">
                        <span>ADELANTO: S/ {order.monto_adelanto?.toFixed(2)}</span>
                        <span>FALTANTE: S/ {order.monto_faltante?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-[10px] text-gray-500 italic">
                    <p>¡Gracias por su compra!</p>
                    <p>Vuelva pronto</p>
                </div>
            </div>

            {/* Auto Print Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
                // window.onload = () => window.print();
            `}} />
        </div>
    );
}
