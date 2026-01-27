"use client";

import { Order } from "@/lib/order-actions";
import { Workspace } from "@/lib/workspace-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Phone, User, Package, FileText, Globe, Building2, Mail } from "lucide-react";

interface ShippingGuideViewProps {
    order: Order;
    workspace: Workspace;
}

export function ShippingGuideView({ order, workspace }: ShippingGuideViewProps) {
    return (
        <div className="w-[297mm] min-h-[210mm] bg-white text-black font-sans p-[5mm] flex flex-col items-center justify-between">
            {/* TOP HEADER - WIDER */}
            <div className="w-full max-w-[280mm] flex justify-between items-center border-b-2 border-black pb-4 mb-4">
                <div className="flex items-center gap-6">
                    {workspace.logo && (
                        <img
                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspace.logo}`}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    )}
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black uppercase tracking-tighter">{workspace.name}</h1>
                        <div className="flex gap-4 text-xs font-bold text-zinc-600">
                            <p>{workspace.direccion_contacto || "---"}</p>
                            <p>Telf: {workspace.telefono_contacto || "---"}</p>
                            <p>{workspace.email_contacto || "---"}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Fecha de Emisión</p>
                    <p className="text-lg font-bold">
                        {format(new Date(order.fecha_venta), "dd/MM/yyyy, hh:mm a", { locale: es })}
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="w-full max-w-[280mm] flex flex-col gap-6">
                {/* GUIA TITLE & NUMBER - PROMINENT */}
                <div className="w-full border-4 border-black bg-zinc-100 py-6 px-12 flex justify-between items-center">
                    <h2 className="text-5xl font-black uppercase tracking-[0.2em]">Guía de Envío</h2>
                    <div className="text-right">
                        <p className="text-sm font-bold text-zinc-500 uppercase">Número correlativo</p>
                        <p className="text-4xl font-black">N° {order.id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                {/* DATA GRID - EXPANDED */}
                <div className="w-full space-y-4 mb-auto">
                    {/* CLIENTE - FULL WIDTH BIG */}
                    <div className="w-full border-b-2 border-black pb-2">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Datos del Destinatario</p>
                        <p className="text-sm uppercase font-bold text-zinc-400 mt-1">Nombre Completo:</p>
                        <p className="text-5xl font-black uppercase leading-none mt-2">
                            {(order.cliente_id as any)?.nombre_completo || "Cliente General"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-xs font-black uppercase text-zinc-500">Documento (DNI/RUC):</p>
                            <p className="text-3xl font-black mt-1">{(order.cliente_id as any)?.documento_identificacion || "---"}</p>
                        </div>
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-xs font-black uppercase text-zinc-500">Teléfono / Celular:</p>
                            <p className="text-3xl font-black mt-1">{(order.cliente_id as any)?.telefono || "---"}</p>
                        </div>
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-xs font-black uppercase text-zinc-500">Agencia / Courier:</p>
                            <p className="text-3xl font-black uppercase mt-1">{order.courier_nombre || "LOGÍSTICA INTERNA"}</p>
                        </div>
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-xs font-black uppercase text-zinc-500">Destino (Provincia/Dpto):</p>
                            <p className="text-3xl font-black uppercase mt-1">{order.courier_provincia_dpto || "LIMA"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SIGNATURE / SELLER SECTION - BOTTOM WIDE */}
            <div className="w-full max-w-[280mm] flex justify-between items-end border-t-4 border-black border-double pt-6 mb-4">
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-zinc-500">Atendido por:</p>
                    <p className="text-xl font-bold italic">
                        {(order.user_created as any)?.first_name && (order.user_created as any)?.last_name
                            ? `${(order.user_created as any).first_name} ${(order.user_created as any).last_name}`
                            : (order.user_created as any)?.email || "Vendedor General"
                        }
                    </p>
                </div>
                <div className="w-[100mm] border-t-2 border-black pt-2 text-center">
                    <p className="text-xs font-black uppercase">Firma del Vendedor (U)</p>
                    <p className="text-[10px] text-zinc-400 mt-1">{(order.user_created as any)?.email}</p>
                </div>
            </div>

            {/* PRINT BUTTON - SCREEN ONLY */}
            <div className="fixed bottom-8 right-8 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white h-14 px-8 rounded-full shadow-2xl font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                    <FileText className="h-5 w-5" />
                    Imprimir Guía
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div >
    );
}
