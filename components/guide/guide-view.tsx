"use client";

import { Order } from "@/lib/order-actions";
import { Workspace } from "@/lib/workspace-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Truck, MapPin, Package, User, Phone, Info } from "lucide-react";

interface GuideViewProps {
    order: Order;
    workspace: Workspace;
}

export function GuideView({ order, workspace }: GuideViewProps) {
    return (
        <div className="w-[80mm] bg-white p-4 shadow-lg print:shadow-none print:w-full print:p-0 text-black font-mono text-[11px] leading-tight border-2 border-black border-double">
            {/* HEADER - COURIER INFO */}
            <div className="text-center mb-4 border-b-2 border-black pb-2">
                <div className="flex justify-center items-center gap-2 mb-1">
                    <Truck className="h-5 w-5" />
                    <h1 className="font-black text-lg uppercase tracking-widest">{order.courier_nombre || "ENVÍO"}</h1>
                </div>
                {order.courier_nro_orden && (
                    <div className="bg-black text-white py-1 px-2 inline-block rounded">
                        <p className="font-bold text-sm">ORDEN: {order.courier_nro_orden}</p>
                    </div>
                )}
            </div>

            {/* DESTINATION */}
            <div className="mb-4 border-b border-black border-dashed pb-2">
                <div className="flex items-start gap-1 mb-1">
                    <MapPin className="h-3 w-3 mt-0.5" />
                    <span className="font-bold uppercase underline">DESTINO:</span>
                </div>
                <p className="text-sm font-black uppercase text-center py-1">
                    {order.courier_provincia_dpto || "S/N PROVINCIA"}
                </p>
                <p className="text-center italic">
                    {order.courier_destino_agencia || "Agencia Principal"}
                </p>
            </div>

            {/* RECEIVER INFO */}
            <div className="mb-4 border-b border-black border-dashed pb-2">
                <div className="flex items-center gap-1 mb-2">
                    <User className="h-3 w-3" />
                    <span className="font-bold uppercase underline">DESTINATARIO:</span>
                </div>
                <div className="pl-2 space-y-1">
                    <p className="text-xs font-bold uppercase">{(order.cliente_id as any)?.nombre_completo || "CLIENTE"}</p>
                    <p className="flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5" />
                        {(order.cliente_id as any)?.telefono || "S/N TELEFONO"}
                    </p>
                    <p className="flex items-center gap-1">
                        <span className="font-bold">ID/DNI:</span> {(order.cliente_id as any)?.documento_identificacion || "---"}
                    </p>
                </div>
            </div>

            {/* TRACKING CODES */}
            {(order.courier_codigo || order.courier_clave) && (
                <div className="mb-4 bg-gray-100 p-2 border border-black rounded text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Info className="h-3 w-3" />
                        <span className="font-bold uppercase text-[9px]">Dardos de Seguimiento</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {order.courier_codigo && (
                            <div>
                                <p className="text-[8px] uppercase">Código</p>
                                <p className="font-black text-sm">{order.courier_codigo}</p>
                            </div>
                        )}
                        {order.courier_clave && (
                            <div>
                                <p className="text-[8px] uppercase">Clave</p>
                                <p className="font-black text-sm">{order.courier_clave}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CONTENTS SUMMARY */}
            <div className="mb-4">
                <div className="flex items-center gap-1 mb-1">
                    <Package className="h-3 w-3" />
                    <span className="font-bold uppercase underline">CONTENIDO:</span>
                </div>
                <ul className="pl-4 list-disc space-y-0.5">
                    {order.items?.map((item, idx) => (
                        <li key={idx}>
                            {item.cantidad}x {(item as any).product_id?.nombre || "Producto"}
                        </li>
                    ))}
                </ul>
            </div>

            {/* FOOTER */}
            <div className="border-t-2 border-black pt-2 text-center mt-6">
                <p className="font-bold">{workspace.name}</p>
                <div className="text-[8px] uppercase">
                    {workspace.direccion_contacto && <p>{workspace.direccion_contacto}</p>}
                    <div className="flex justify-center gap-1">
                        {workspace.telefono_contacto && <p>Tel: {workspace.telefono_contacto}</p>}
                        {workspace.email_contacto && <p>{workspace.email_contacto}</p>}
                    </div>
                </div>
                <p className="text-[8px]">{format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                <p className="text-[7px] italic mt-2 opacity-50 font-sans">Guía de envío generada por {process.env.NEXT_PUBLIC_APP_NAME || "DirectOS"}</p>
            </div>

            {/* Print Button (Screen only) */}
            <div className="mt-6 text-center print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gray-800 transition-colors w-full"
                >
                    Imprimir Guía
                </button>
            </div>
        </div>
    );
}
