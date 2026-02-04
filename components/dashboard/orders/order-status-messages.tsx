"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { OrderStatus, updateOrderStatus } from "@/lib/order-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, MessageSquare, Save, Info, Copy, Check, Clock, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface OrderStatusMessagesProps {
    initialStatuses: OrderStatus[];
    workspaceId: string;
}

export function OrderStatusMessages({ initialStatuses, workspaceId }: OrderStatusMessagesProps) {
    const [statuses, setStatuses] = useState<OrderStatus[]>(initialStatuses);
    const [activeId, setActiveId] = useState<string>(initialStatuses[0]?.id || "");
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const activeStatus = statuses.find(s => s.id === activeId);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleMessageChange = (id: string, message: string) => {
        setStatuses(prev => prev.map(s => s.id === id ? { ...s, default_message: message } : s));
    };

    const handleSave = async (status: OrderStatus) => {
        setIsSaving(status.id);
        try {
            const result = await updateOrderStatus(status.id, {
                default_message: status.default_message
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                setLastSaved(status.id);
                setTimeout(() => setLastSaved(null), 3000);
                toast.success(`Cambios guardados`, {
                    duration: 2000,
                });
            }
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setIsSaving(null);
        }
    };

    const injectVariable = (variable: string) => {
        if (!textareaRef.current || !activeStatus) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = activeStatus.default_message || "";
        const before = text.substring(0, start);
        const after = text.substring(end);

        const newMessage = before + variable + after;
        handleMessageChange(activeStatus.id, newMessage);

        // Mantener el foco y mover el cursor después de la variable
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = start + variable.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const variables = [
        { key: "{{cliente}}", label: "Cliente" },
        { key: "{{pedido_id}}", label: "N° Pedido" },
        { key: "{{total}}", label: "Total" },
        { key: "{{estado}}", label: "Estado" },
        { key: "{{tienda}}", label: "Negocio" },
    ];

    const formatPreview = (text: string) => {
        if (!text) return "Escribe un mensaje para ver la vista previa...";
        return text
            .replace(/{{cliente}}/g, "Juan Pérez")
            .replace(/{{pedido_id}}/g, "0045")
            .replace(/{{total}}/g, "150.00")
            .replace(/{{estado}}/g, activeStatus?.name || "")
            .replace(/{{tienda}}/g, "Mi Tienda ERP");
    };

    const suggestMessage = () => {
        if (!activeStatus) return;

        const templates: Record<string, string> = {
            "pendiente": "Hola {{cliente}}, tu pedido #{{pedido_id}} ha sido recibido y está pendiente de confirmación. ¡Gracias por elegirnos!",
            "confirmado": "¡Buenas noticias {{cliente}}! Tu pedido #{{pedido_id}} por un total de {{total}} ha sido confirmado. Pronto empezaremos a prepararlo.",
            "preparando": "Hola {{cliente}}, estamos preparando tu pedido #{{pedido_id}} con mucho cuidado. Te avisaremos cuando esté listo para ser enviado.",
            "enviado": "¡Tu pedido está en camino! {{cliente}}, el pedido #{{pedido_id}} ha sido enviado. ¡Prepárate para recibirlo pronto!",
            "entregado": "¡Entregado! {{cliente}}, esperamos que disfrutes de tu compra. El pedido #{{pedido_id}} ha sido marcado como entregado con éxito.",
            "cancelado": "Hola {{cliente}}, lamentamos informarte que tu pedido #{{pedido_id}} ha sido cancelado. Si tienes dudas, contáctanos.",
        };

        const statusKey = activeStatus.value.toLowerCase();
        const defaultTemplate = templates[statusKey] || templates[activeStatus.name.toLowerCase()] || "Hola {{cliente}}, te informamos que tu pedido #{{pedido_id}} ha cambiado de estado a {{estado}}.";

        handleMessageChange(activeStatus.id, defaultTemplate);
        toast.info("Mensaje predeterminado cargado");
    };

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <header className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Configuración de Mensajes
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Personaliza los mensajes automáticos que reciben tus clientes vía WhatsApp
                    </p>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
                {/* Sidebar: Status List */}
                <Card className="w-full lg:w-80 flex flex-col overflow-hidden border-muted/40 shadow-sm shrink-0">
                    <CardHeader className="p-4 border-b bg-muted/20">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estados de Pedido</CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {statuses.map((status) => (
                            <button
                                key={status.id}
                                onClick={() => setActiveId(status.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left",
                                    activeId === status.id
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 scale-[1.02]"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                <div
                                    className={cn(
                                        "h-3 w-3 rounded-full border-2",
                                        activeId === status.id ? "border-white bg-white" : ""
                                    )}
                                    style={{ backgroundColor: activeId === status.id ? undefined : status.color, borderColor: activeId === status.id ? "#fff" : status.color }}
                                />
                                <span className="flex-1 font-medium text-sm">{status.name}</span>
                                {activeId === status.id && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Main Content: Editor & WhatsApp Preview */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0 overflow-y-auto lg:overflow-visible lg:min-h-0">
                    {/* Editor Section */}
                    <Card className="flex flex-col border-muted/40 shadow-sm min-h-[500px] lg:min-h-0">
                        <CardHeader className="p-6 border-b bg-muted/5 flex flex-row items-center justify-between flex-wrap gap-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: activeStatus?.color }} />
                                    {activeStatus?.name}
                                </CardTitle>
                                <CardDescription>Edita el contenido dinámico del mensaje</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={suggestMessage}
                                    className="rounded-full px-4 border-primary/20 hover:bg-primary/5 text-primary gap-2"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Sugerir
                                </Button>
                                <Button
                                    onClick={() => activeStatus && handleSave(activeStatus)}
                                    disabled={isSaving === activeId}
                                    className="shadow-md rounded-full px-6 transition-all active:scale-95"
                                >
                                    {isSaving === activeId ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : lastSaved === activeId ? (
                                        <Check className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    {lastSaved === activeId ? "Guardado" : "Guardar Cambios"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50 ml-1">
                                        Variables inteligentes
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {variables.map((v) => (
                                            <button
                                                key={v.key}
                                                onClick={() => injectVariable(v.key)}
                                                className="group relative flex items-center gap-2 px-3 py-1.5 bg-background border border-muted-foreground/20 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-xs"
                                            >
                                                <code className="text-primary font-bold group-hover:scale-110 transition-transform">{v.key}</code>
                                                <span className="text-muted-foreground opacity-60 text-[9px] uppercase font-bold">{v.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50 ml-1">
                                            Contenido del mensaje
                                        </Label>
                                        <span className={cn(
                                            "text-[9px] font-bold rounded-full px-2 py-0.5",
                                            (activeStatus?.default_message?.length || 0) > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {activeStatus?.default_message?.length || 0} Caracteres
                                        </span>
                                    </div>
                                    <Textarea
                                        ref={textareaRef}
                                        value={activeStatus?.default_message || ""}
                                        onChange={(e) => activeId && handleMessageChange(activeId, e.target.value)}
                                        placeholder="Escribe el mensaje que recibirá el cliente..."
                                        className="w-full min-h-[300px] resize-none border-2 border-muted/40 focus:border-primary/50 focus:ring-0 text-base p-4 rounded-2xl bg-muted/10 transition-all font-medium leading-relaxed"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Simulator Section */}
                    <div className="flex flex-col gap-6 min-h-[600px] xl:min-h-0">
                        <div className="flex-1 relative bg-[#e5ddd5] rounded-3xl overflow-hidden border-8 border-background shadow-xl pattern-wa flex flex-col">
                            {/* WhatsApp Header */}
                            <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 shrink-0 z-10 shadow-md">
                                <div className="size-10 rounded-full bg-[#128c7e] flex items-center justify-center font-bold text-lg border border-white/20">
                                    JP
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">Juan Pérez</h4>
                                    <p className="text-[10px] opacity-80">en línea</p>
                                </div>
                            </div>

                            {/* Conversation */}
                            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-20">
                                <div className="mx-auto bg-[#dcf8c6] text-[#4a4a4a] text-[10px] px-3 py-1 rounded-full uppercase font-bold shadow-sm mb-4">
                                    Hoy
                                </div>

                                {/* Message Bubble */}
                                <div className="max-w-[85%] self-start bg-white rounded-2xl rounded-tl-none p-3 pb-2 shadow-sm relative group animate-in slide-in-from-left-4 duration-500 text-zinc-800">
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {formatPreview(activeStatus?.default_message || "")}
                                    </p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[9px] text-zinc-400">7:45 PM</span>
                                    </div>
                                    <div className="absolute top-0 -left-2 w-0 h-0 border-t-[0px] border-t-transparent border-r-[12px] border-r-white border-b-[15px] border-b-transparent" />
                                </div>

                                <div className="max-w-[85%] self-end bg-[#dcf8ce] rounded-2xl rounded-tr-none p-3 pb-2 shadow-sm relative group text-zinc-800">
                                    <p className="text-sm">¡Muchas gracias por la información! Estaré atento.</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[9px] text-[#4ea073]">7:50 PM</span>
                                        <Check className="h-3 w-3 text-[#4ea073]" />
                                        <Check className="h-3 w-3 text-[#4ea073] -ml-2" />
                                    </div>
                                    <div className="absolute top-0 -right-2 w-0 h-0 border-t-[0px] border-t-transparent border-l-[12px] border-l-[#dcf8ce] border-b-[15px] border-b-transparent" />
                                </div>
                            </div>

                            {/* WhatsApp Footer */}
                            <div className="absolute bottom-0 w-full bg-[#f0f0f0] p-3 flex items-center gap-2 z-10 border-t border-black/5">
                                <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-muted-foreground flex items-center justify-between border">
                                    Escribe un mensaje
                                    <Clock className="h-4 w-4 opacity-30" />
                                </div>
                                <div className="bg-[#128c7e] size-9 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-default">
                                    <Send className="h-4 w-4 text-white fill-current translate-x-0.5" />
                                </div>
                            </div>
                        </div>

                        <Card className="bg-primary/5 border-primary/10 overflow-hidden shrink-0">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <Info className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Dato útil</p>
                                    <p className="text-xs text-muted-foreground leading-tight">
                                        Tus mensajes se guardan cifrados y solo se envían bajo tu acción manual desde el panel de pedidos.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                .pattern-wa {
                    background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
                    background-repeat: repeat;
                    background-size: 400px;
                }
            `}</style>
        </div>
    );
}
