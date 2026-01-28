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
        <div className="w-full max-w-[297mm] min-h-screen md:min-h-[210mm] bg-white text-black font-sans p-3 md:p-[5mm] flex flex-col">
            {/* TOP HEADER - WIDER */}
            <div className="w-full max-w-[280mm] flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-4 mb-6 md:mb-8 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6 w-full md:w-auto">
                    {workspace.logo && (
                        <img
                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${workspace.logo}`}
                            alt="Logo"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                    )}
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">{workspace.name}</h1>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-[10px] md:text-xs font-bold text-zinc-600">
                            <p>{workspace.direccion_contacto || "---"}</p>
                            <p>Telf: {workspace.telefono_contacto || "---"}</p>
                            <p>{workspace.email_contacto || "---"}</p>
                        </div>
                    </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                    <p className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest">Fecha de Emisión</p>
                    <p className="text-base md:text-lg font-bold">
                        {format(new Date(order.fecha_venta), "dd/MM/yyyy, hh:mm a", { locale: es })}
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="w-full max-w-[280mm] flex flex-col gap-4 md:gap-6">
                {/* GUIA TITLE & NUMBER - PROMINENT */}
                <div className="w-full border-4 border-black bg-zinc-100 py-4 px-4 md:py-8 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">Guía de Envío</h2>
                    <div className="text-left sm:text-right">
                        <p className="text-[10px] md:text-sm font-bold text-zinc-500 uppercase">Número correlativo</p>
                        <p className="text-2xl md:text-4xl font-black">
                            N° {order.numero_correlativo
                                ? String(order.numero_correlativo).padStart(4, '0')
                                : order.id.slice(-8).toUpperCase()
                            }
                        </p>
                    </div>
                </div>

                {/* DATA GRID - EXPANDED */}
                <div className="w-full space-y-4 md:space-y-6">
                    {/* CLIENTE - FULL WIDTH BIG */}
                    <div className="w-full border-b-2 border-black pb-2">
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500">Datos del Destinatario</p>
                        <p className="text-xs md:text-sm uppercase font-bold text-zinc-400 mt-1">Nombre Completo:</p>
                        <p className="text-2xl sm:text-3xl md:text-5xl font-black uppercase leading-none mt-2 break-words">
                            {(order.cliente_id as any)?.nombre_completo || "Cliente General"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-4 md:gap-y-6">
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-[10px] md:text-xs font-black uppercase text-zinc-500">Documento (DNI/RUC):</p>
                            <p className="text-xl md:text-3xl font-black mt-1">{(order.cliente_id as any)?.documento_identificacion || "---"}</p>
                        </div>
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-[10px] md:text-xs font-black uppercase text-zinc-500">Teléfono / Celular:</p>
                            <p className="text-xl md:text-3xl font-black mt-1">{(order.cliente_id as any)?.telefono || "---"}</p>
                        </div>
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-[10px] md:text-xs font-black uppercase text-zinc-500">Agencia / Courier:</p>
                            <p className="text-xl md:text-3xl font-black uppercase mt-1 break-words">{order.courier_nombre || "LOGÍSTICA INTERNA"}</p>
                        </div>
                        <div className="border-b-2 border-zinc-200 pb-2">
                            <p className="text-[10px] md:text-xs font-black uppercase text-zinc-500">Destino (Provincia/Dpto):</p>
                            <p className="text-xl md:text-3xl font-black uppercase mt-1 break-words">{order.courier_provincia_dpto || "LIMA"}</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* PRINT BUTTON - SCREEN ONLY */}
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 print:hidden z-50">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white h-12 md:h-14 px-6 md:px-8 rounded-full shadow-2xl font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                    <FileText className="h-4 w-4 md:h-5 md:w-5" />
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
