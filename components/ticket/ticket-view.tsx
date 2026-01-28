"use client";

import { Order } from "@/lib/order-actions";
import { Workspace } from "@/lib/workspace-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";
import Image from "next/image";

interface TicketViewProps {
    order: Order;
    workspace: Workspace;
}

export function TicketView({ order, workspace }: TicketViewProps) {
    useEffect(() => {
        // Auto-print when loaded, if desired. 
        // For better UX, maybe a button is better, or print immediately.
        // setTimeout(() => window.print(), 500);
    }, []);

    // Calcular subtotal real sumando items
    const subtotal = order.items?.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0) || 0;

    // Totals
    const discount = 0; // Si hubiera descuentos globales
    const shipping = Number(order.costo_envio || 0);
    const adjustment = Number(order.ajuste_total || 0);
    const total = Number(order.total || 0);

    return (
        <div className="w-full max-w-[80mm] mx-auto bg-white p-3 md:p-4 shadow-lg print:shadow-none print:w-full print:p-0 text-black font-mono text-[10px] md:text-xs leading-tight">
            {/* HEADER */}
            <div className="text-center mb-4">
                {workspace.logo && (
                    <div className="flex justify-center mb-2">
                        {/* Use remote image but need to configure domains in next.config or use unoptimized if issues arise */}
                        <div className="relative w-16 h-16">
                            <img
                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspace.logo}`}
                                alt="Logo"
                                className="object-contain w-full h-full grayscale"
                            />
                        </div>
                    </div>
                )}
                <h1 className="font-bold text-sm uppercase">{workspace.name}</h1>
                <div className="text-[9px] mb-2">
                    {workspace.direccion_contacto && <p>{workspace.direccion_contacto}</p>}
                    <div className="flex justify-center gap-2">
                        {workspace.telefono_contacto && <p>Tel: {workspace.telefono_contacto}</p>}
                        {workspace.email_contacto && <p>{workspace.email_contacto}</p>}
                    </div>
                </div>
                <p>Fecha: {format(new Date(order.fecha_venta), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                <p>Orden #: {order.id.slice(-6).toUpperCase()}</p>
            </div>

            {/* CUSTOMER */}
            <div className="border-t border-b border-black border-dashed py-2 mb-2">
                <p><span className="font-bold">Cliente:</span> {(order.cliente_id as any)?.nombre_completo || "Cliente General"}</p>
                {(order.cliente_id as any)?.documento_identificacion && (
                    <p><span className="font-bold">DNI/RUC:</span> {(order.cliente_id as any)?.documento_identificacion}</p>
                )}
                {(order.cliente_id as any)?.telefono && (
                    <p><span className="font-bold">Tel:</span> {(order.cliente_id as any)?.telefono}</p>
                )}
                {/* Direccion de envio si existe */}
                {order.courier_provincia_dpto && (
                    <p><span className="font-bold">Destino:</span> {order.courier_provincia_dpto} - {order.courier_destino_agencia}</p>
                )}
            </div>

            {/* ITEMS */}
            <div className="mb-2">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="py-1">Cant.</th>
                            <th className="py-1">Desc.</th>
                            <th className="text-right py-1">P.Unit</th>
                            <th className="text-right py-1">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item, index) => (
                            <tr key={index}>
                                <td className="align-top py-1">{item.cantidad}</td>
                                <td className="align-top py-1">
                                    <div className="line-clamp-2">
                                        {(item as any).product_id?.nombre || "Producto"}
                                    </div>
                                    {item.variante_seleccionada && (
                                        <div className="text-[9px] italic">({item.variante_seleccionada})</div>
                                    )}
                                </td>
                                <td className="align-top text-right py-1">{Number(item.precio_unitario).toFixed(2)}</td>
                                <td className="align-top text-right py-1 font-bold">{Number(item.subtotal).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TOTALS */}
            <div className="border-t border-black border-dashed py-2 mb-4 space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                    <div className="flex justify-between">
                        <span>Envío ({order.tipo_cobro_envio}):</span>
                        <span>S/ {shipping.toFixed(2)}</span>
                    </div>
                )}

                {adjustment !== 0 && (
                    <div className="flex justify-between">
                        <span>Ajustes:</span>
                        <span>S/ {adjustment.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between font-bold text-sm pt-1 border-t border-black border-dotted mt-1">
                    <span>TOTAL:</span>
                    <span>S/ {total.toFixed(2)}</span>
                </div>

                {order.monto_adelanto && order.monto_adelanto > 0 ? (
                    <>
                        <div className="flex justify-between text-xs pt-1">
                            <span>A cuenta:</span>
                            <span>S/ {Number(order.monto_adelanto).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                            <span>Saldo:</span>
                            <span>S/ {Number(order.monto_faltante).toFixed(2)}</span>
                        </div>
                    </>
                ) : null}
            </div>

            {/* FOOTER */}
            <div className="text-center space-y-2">
                <p>Método de Pago: {(order.metodo_pago || "").toUpperCase()}</p>
                <p className="italic">¡Gracias por su preferencia!</p>
                <p className="text-[8px] text-gray-500 mt-4">Generado por {process.env.NEXT_PUBLIC_APP_NAME || "DirectOS"}</p>
            </div>

            {/* Print Button (Screen only) */}
            <div className="mt-6 text-center print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gray-800 transition-colors"
                >
                    Imprimir Ticket
                </button>
            </div>
        </div>
    );
}
