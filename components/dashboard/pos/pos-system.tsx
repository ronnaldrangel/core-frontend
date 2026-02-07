"use client";

import { useState, useMemo, useEffect } from "react";
import { Product } from "@/lib/product-actions";
import { Client, lookupDni, createClient, getClientByDni, updateClient } from "@/lib/client-actions";
import { createOrder, OrderItem, OrderStatus, PaymentStatus, CourierType, Order, PaymentMethod } from "@/lib/order-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    User,
    CreditCard,
    Banknote,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Package,
    Calendar,
    Phone,
    MapPin,
    Truck,
    Info,
    ChevronDown,
    X,
    Printer,
    FileText,
    Receipt,
    Camera,
    Upload,
    ImageIcon,
    FileImage,
    Layers
} from "lucide-react";
import { uploadFile } from "@/lib/product-actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PhoneInput } from "@/components/ui/phone-input";
import { es } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ShalomAgencySelect } from "@/components/dashboard/shalom/agency-select";

interface CartesianItem extends Product {
    quantity: number;
    selectedVariant?: string;
}

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface POSSystemProps {
    products: Product[];
    clients: Client[];
    workspaceId: string;
    orderStatuses: OrderStatus[];
    paymentStatuses: PaymentStatus[];
    courierTypes: CourierType[];
    paymentMethods: PaymentMethod[];
}

import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from "@/lib/peru-locations";

export function POSSystem({
    products,
    clients,
    workspaceId,
    orderStatuses,
    paymentStatuses,
    courierTypes,
    paymentMethods
}: POSSystemProps) {
    // --- State ---
    const [cart, setCart] = useState<CartesianItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOutOfStock, setShowOutOfStock] = useState(true);
    const [sortBy, setSortBy] = useState("nombre-asc");

    // Success Dialog State
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Client Info
    const [clientDoc, setClientDoc] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientType, setClientType] = useState("persona"); // Added client type
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isLookingUpClient, setIsLookingUpClient] = useState(false); // New loading state for lookup

    // Order Info
    const [orderDate] = useState(new Date());
    const [paymentStatus, setPaymentStatus] = useState(paymentStatuses[0]?.id || "");
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]?.id || "");
    const [orderStatus, setOrderStatus] = useState(orderStatuses[0]?.id || "");
    const [advancePayment, setAdvancePayment] = useState(0);
    const [adjustment, setAdjustment] = useState(0);
    const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

    // Shipping Info
    const [configureShipping, setConfigureShipping] = useState(true);
    const [shippingType, setShippingType] = useState("adicional"); // adicional | incluido
    const [shippingCost, setShippingCost] = useState(0);
    const [courier, setCourier] = useState(courierTypes[0]?.value || "SHALOM");
    const [destination, setDestination] = useState("");
    const [courierOrder, setCourierOrder] = useState("");
    const [courierCode, setCourierCode] = useState("");
    const [courierPass, setCourierPass] = useState("");
    const [voucherIds, setVoucherIds] = useState<string[]>([]);
    const [isUploadingVoucher, setIsUploadingVoucher] = useState(false);

    // Order Shipping Address (saved in orders collection)
    const [orderDept, setOrderDept] = useState("LIMA");
    const [orderProv, setOrderProv] = useState("LIMA");
    const [orderDist, setOrderDist] = useState("LIMA");
    const [orderAddress, setOrderAddress] = useState("");
    const [orderLocation, setOrderLocation] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);

    // --- Audio Feedback ---
    const playSound = (type: 'add' | 'remove' | 'success') => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'add') {
                // Sonido tipo "Scanner de Barcode" (Beep corto y seco)
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(2500, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.05);
            } else if (type === 'remove') {
                // Click mecánico simple
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.03);
            } else if (type === 'success') {
                // Sonido tipo "Ding!" de Caja Registradora clásica
                const bell = audioCtx.createOscillator();
                const bellGain = audioCtx.createGain();
                bell.connect(bellGain);
                bellGain.connect(audioCtx.destination);

                bell.type = 'sine';
                bell.frequency.setValueAtTime(2200, audioCtx.currentTime);
                bellGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                bellGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

                bell.start();
                bell.stop(audioCtx.currentTime + 0.5);

                // Nota secundaria para dar cuerpo al "Ding"
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1400, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.4);
            }
        } catch (e) {
            console.error("Audio no compatible", e);
        }
    };

    // --- Logical Handling ---

    const availableProvinces = useMemo(() => {
        const dept = DEPARTAMENTOS.find(d => d.nombre === orderDept);
        if (!dept) return [];
        return PROVINCIAS.filter(p => p.departamento_id === dept.id);
    }, [orderDept]);

    const availableDistricts = useMemo(() => {
        const prov = availableProvinces.find(p => p.nombre === orderProv);
        if (!prov) return [];
        return DISTRITOS.filter(d => d.provincia_id === prov.id);
    }, [orderProv, availableProvinces]);

    // Handle Client Auto-fill from Local Data
    useEffect(() => {
        // Only run local lookup if we are NOT currently running an external lookup
        if (clientDoc.length >= 8 && !isLookingUpClient) {
            const client = clients.find(c => c.documento_identificacion === clientDoc);
            if (client) {
                setClientName(client.nombre_completo);
                setClientPhone(client.telefono || "");
                setClientType(client.tipo_cliente || "persona");
                setSelectedClientId(client.id);
            } else {
                // Reset ID if doc changes and not found locally (will be handled by API check on blur)
                setSelectedClientId(null);
            }
        } else if (clientDoc.length < 8) {
            setSelectedClientId(null);
        }
    }, [clientDoc, clients, isLookingUpClient]);

    // External DNI Lookup & Auto-create
    const handleClientDniBlur = async () => {
        // Check if already found locally
        if (selectedClientId) return;

        // Basic Validation
        if (!clientDoc || clientDoc.length < 8) return;

        // Skip if enterprise/RUC for now unless requested, but user said "DNI"
        if (clientDoc.length === 8 && clientType === "persona") {
            try {
                setIsLookingUpClient(true);

                // 1. Lookup DNI via API

                // Static import used
                const dniData = await lookupDni(clientDoc);



                if (dniData && dniData.full_name) {
                    // Format Name
                    const formattedName = dniData.full_name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');

                    setClientName(formattedName);
                    // Just notify user, don't create yet
                    toast.success("Nombre encontrado en RENIEC");
                } else {
                    toast.info("DNI no encontrado en RENIEC, ingrese nombre manualmente.");
                }

            } catch (err) {
                console.error(err);
                toast.error("Error al consultar DNI");
            } finally {
                setIsLookingUpClient(false);
            }
        }
    };

    const filteredProducts = useMemo(() => {
        let result = products.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!showOutOfStock) {
            result = result.filter(p => p.stock > 0);
        }

        result.sort((a, b) => {
            if (sortBy === "nombre-asc") return a.nombre.localeCompare(b.nombre);
            if (sortBy === "nombre-desc") return b.nombre.localeCompare(a.nombre);
            if (sortBy === "precio-asc") return Number(a.precio_venta || 0) - Number(b.precio_venta || 0);
            if (sortBy === "precio-desc") return Number(b.precio_venta || 0) - Number(a.precio_venta || 0);
            return 0;
        });

        return result;
    }, [products, searchTerm, showOutOfStock, sortBy]);

    const cartQuantities = useMemo(() => {
        const quantities: Record<string, number> = {};
        cart.forEach(item => {
            quantities[item.id] = (quantities[item.id] || 0) + item.quantity;
        });
        return quantities;
    }, [cart]);


    const addToCart = (product: Product, variantName?: string) => {
        const vName = variantName || null;
        const variant = vName
            ? (product.variantes_producto as any[]).find(v => v.nombre === vName)
            : null;

        // ⚠️ STOCK INDIVIDUAL: Cada producto/variante tiene su propio stock
        const stockToCheck = variant ? variant.stock : product.stock;

        if (stockToCheck <= 0) {
            toast.error(variant ? "Variante agotada" : "Producto agotado");
            return;
        }

        // Cantidad ya en carrito de ESTE item específico (variante o base)
        const existingItemQty = cart.find(item =>
            item.id === product.id && (item.selectedVariant || null) === vName
        )?.quantity || 0;

        if (existingItemQty >= stockToCheck) {
            toast.warning(`Solo hay ${stockToCheck} unidades disponibles`);
            return;
        }

        playSound('add');
        setCart(prev => {
            const existingIndex = prev.findIndex(item =>
                item.id === product.id && (item.selectedVariant || null) === vName
            );

            if (existingIndex !== -1) {
                return prev.map((item, idx) =>
                    idx === existingIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, selectedVariant: vName || undefined }];
        });
    };

    const updateQuantity = (id: string, variantName: string | undefined | null, delta: number) => {
        const vName = variantName || null;
        if (delta > 0) playSound('add');
        else playSound('remove');

        setCart(prev => prev.map(item => {
            if (item.id === id && (item.selectedVariant || null) === vName) {
                const newQty = Math.max(0, item.quantity + delta);

                // ⚠️ STOCK INDIVIDUAL: Verificar el stock de este item específico
                let stockLimit = item.stock;
                if (item.selectedVariant && item.variantes_producto) {
                    const variant = (item.variantes_producto as any[]).find(v => v.nombre === item.selectedVariant);
                    if (variant) stockLimit = variant.stock;
                }

                if (newQty > stockLimit) {
                    toast.warning(`Solo hay ${stockLimit} unidades disponibles`);
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: string, variantName?: string | null) => {
        const vName = variantName || null;
        setCart(prev => prev.filter(item => !(item.id === id && (item.selectedVariant || null) === vName)));
    };

    const subtotal = useMemo(() => {
        let totalSum = 0;

        cart.forEach(item => {
            const qty = item.quantity;

            // Precios de pack definidos en el producto (aplican a cada variante por separado)
            const p2 = item.pack2 ? Number(item.pack2) : 0;
            const p3 = item.pack3 ? Number(item.pack3) : 0;

            // CASO: PACK 3 (Exactamente 3 unidades de ESTA variante/producto)
            if (qty === 3 && p3 > 0) {
                totalSum += p3;
            }
            // CASO: PACK 2 (Exactamente 2 unidades de ESTA variante/producto)
            else if (qty === 2 && p2 > 0) {
                totalSum += p2;
            }
            // CASO: PRECIO REGULAR (1 unidad o 4+ unidades, o sin packs definidos)
            else {
                let unitPrice = Number(item.precio_venta || 0);

                // Si es variante, buscar su precio específico si existe
                if (item.selectedVariant && item.variantes_producto) {
                    const variant = (item.variantes_producto as any[]).find(v => v.nombre === item.selectedVariant);
                    if (variant && (variant.precio !== undefined && variant.precio !== null)) {
                        unitPrice = Number(variant.precio);
                    }
                }
                totalSum += (unitPrice * qty);
            }
        });

        return totalSum;
    }, [cart]);

    const totalShipping = configureShipping && shippingType === "adicional" ? Number(shippingCost) : 0;
    const totalWithAdjustments = subtotal + totalShipping + Number(adjustment);
    const balanceDue = Math.max(0, totalWithAdjustments - Number(advancePayment));

    const resetPOS = () => {
        setCart([]);
        setClientDoc("");
        setClientName("");
        setClientPhone("");
        setSelectedClientId(null);
        setPaymentStatus(paymentStatuses[0]?.id || "");
        setPaymentMethod(paymentMethods[0]?.id || "");
        setOrderStatus(orderStatuses[0]?.id || "");
        setAdvancePayment(0);
        setAdjustment(0);
        setConfigureShipping(true);
        setShippingType("adicional");
        setShippingCost(0);
        setCourier(courierTypes[0]?.value || "SHALOM");
        setDestination("");
        setCourierOrder("");
        setCourierCode("");
        setCourierPass("");
        setVoucherIds([]);
        setOrderDept("LIMA");
        setOrderProv("LIMA");
        setOrderDist("LIMA");
        setOrderAddress("");
        setOrderLocation("");
        setSelectedClientId(null);
    };
    const handleVoucherUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setIsUploadingVoucher(true);
            const uploadedIds: string[] = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const result = await uploadFile(formData);
                if (result.error || !result.data) {
                    toast.error(`Error al subir ${file.name}: ${result.error}`);
                    continue;
                }

                uploadedIds.push((result.data as any).id);
            }

            setVoucherIds(prev => [...prev, ...uploadedIds]);
            if (uploadedIds.length > 0) {
                toast.success(`${uploadedIds.length} comprobante(s) subido(s) correctamente`);
            }
        } catch (error: any) {
            toast.error(error.message || "Error al subir los comprobantes");
        } finally {
            setIsUploadingVoucher(false);
            // Reset input so same files can be selected again
            if (e.target) e.target.value = "";
        }
    };

    const removeVoucher = (idToRemove: string) => {
        setVoucherIds(prev => prev.filter(id => id !== idToRemove));
    };

    const handlePrintTicket = (order: Order) => {
        const url = `/ticket/${order.id}`;
        window.open(url, "_blank", "width=400,height=600");
    };



    const handlePrintShippingGuide = (order: Order) => {
        const url = `/shipping-guide/${order.id}`;
        window.open(url, "_blank", "width=800,height=900");
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        try {
            setIsProcessing(true);

            // --- VALIDATIONS ---
            const todayStr = new Date().toISOString().split('T')[0];
            if (deliveryDate < todayStr) {
                toast.error("La fecha de entrega no puede ser anterior a hoy");
                setIsProcessing(false);
                return;
            }

            // --- RESOLVE CLIENT ID (Find, Create or Update) ---
            let finalClientId = selectedClientId;

            // 1. If not selected locally, check by DNI in DB
            if (!finalClientId && clientDoc && clientDoc.length >= 8) {
                const existingClient = await getClientByDni(workspaceId, clientDoc);
                if (existingClient) {
                    finalClientId = existingClient.id;
                }
            }

            // 2. Decide if we Update or Create
            if (finalClientId) {
                // UPDATE: User wants to overwrite existing data with what's in the form
                const { error: updateError } = await updateClient(finalClientId, {
                    workspace_id: workspaceId,
                    nombre_completo: clientName,
                    documento_identificacion: clientDoc || null,
                    tipo_cliente: clientType,
                    telefono: clientPhone,
                });
                if (updateError) {
                    console.error("Error updating client:", updateError);
                    // We continue anyway as the ID is valid for the order
                }
            } else if (clientName) {
                // CREATE: New client
                const newClientData = {
                    workspace_id: workspaceId,
                    nombre_completo: clientName,
                    documento_identificacion: clientDoc || null,
                    tipo_cliente: clientType,
                    telefono: clientPhone,
                    status: "active"
                };
                const { data: newClient, error: createError } = await createClient(newClientData);
                if (newClient) {
                    finalClientId = newClient.id;
                    setSelectedClientId(newClient.id);
                } else {
                    toast.error("Error al registrar nuevo cliente: " + createError);
                    setIsProcessing(false);
                    return;
                }
            }

            // --- CREATE ORDER ---
            const orderItems: OrderItem[] = cart.map(item => {
                const qty = item.quantity;
                const p2 = item.pack2 ? Number(item.pack2) : 0;
                const p3 = item.pack3 ? Number(item.pack3) : 0;

                let unitPrice = Number(item.precio_venta || 0);
                let lineSubtotal = unitPrice * qty;

                // Aplicar lógica de Packs exactamente como en el Subtotal
                if (qty === 3 && p3 > 0) {
                    unitPrice = p3 / 3;
                    lineSubtotal = p3;
                } else if (qty === 2 && p2 > 0) {
                    unitPrice = p2 / 2;
                    lineSubtotal = p2;
                } else if (item.selectedVariant && item.variantes_producto) {
                    const variant = (item.variantes_producto as any[]).find(v => v.nombre === item.selectedVariant);
                    if (variant && (variant.precio !== undefined && variant.precio !== null)) {
                        unitPrice = Number(variant.precio);
                        lineSubtotal = unitPrice * qty;
                    }
                }

                return {
                    product_id: item.id,
                    cantidad: qty,
                    precio_unitario: unitPrice,
                    subtotal: lineSubtotal,
                    variante_seleccionada: item.selectedVariant
                };
            });

            const { data: order, error } = await createOrder({
                workspace_id: workspaceId,
                cliente_id: finalClientId, // Use resolved ID
                fecha_venta: new Date().toISOString(),
                total: totalWithAdjustments,
                metodo_pago: paymentMethod,
                estado_pago: paymentStatus,
                estado_pedido: orderStatus,
                monto_adelanto: Number(advancePayment),
                monto_faltante: balanceDue,
                configurar_envio: configureShipping,
                tipo_cobro_envio: shippingType,
                costo_envio: Number(shippingCost),
                courier_nombre: courier,
                courier_provincia_dpto: "",
                courier_destino_agencia: destination,
                courier_nro_orden: courierOrder,
                courier_codigo: courierCode,
                courier_clave: courierPass,
                ajuste_total: Number(adjustment),
                voucher: voucherIds.length > 0 ? voucherIds.map(id => ({ directus_files_id: id })) : undefined,
                fecha_entrega: deliveryDate,
                departamento: orderDept,
                provincia: orderProv,
                distrito: orderDist,
                direccion: orderAddress,
                ubicacion: orderLocation,
                items: orderItems,
            });

            if (error) throw new Error(error);

            playSound('success');
            // Show Success Dialog instead of basic toast
            setLastOrder(order as Order);
            resetPOS();
            setShowSuccessDialog(true);
        } catch (error: any) {
            toast.error(error.message || "Error al procesar la venta");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full bg-background overflow-hidden relative">
            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-col items-center justify-center text-center pt-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">¡Venta Realizada!</DialogTitle>
                        <DialogDescription className="text-center">
                            La orden ha sido registrada y enviada al sistema correctamente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 py-6">
                        <Button
                            size="lg"
                            className="w-full flex items-center gap-2 h-12 font-medium"
                            onClick={() => lastOrder && handlePrintTicket(lastOrder)}
                        >
                            <Receipt className="h-4 w-4" />
                            Generar Boleta Térmica
                        </Button>



                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full flex items-center gap-2 h-12 font-medium"
                            onClick={() => lastOrder && handlePrintShippingGuide(lastOrder)}
                        >
                            <FileText className="h-4 w-4" />
                            Generar Guía de Envío (A4)
                        </Button>
                    </div>


                </DialogContent>
            </Dialog>

            {/* --- LEFT: PRODUCT GRID (2/3) --- */}
            <div className="lg:flex-[2] flex flex-col gap-4 p-4 md:p-6 overflow-hidden">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-10 h-10 bg-muted/20 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-muted/20 px-3 py-2 rounded-md border border-transparent">
                            <Checkbox
                                id="outOfStock"
                                checked={!showOutOfStock}
                                onCheckedChange={(val) => setShowOutOfStock(!val)}
                            />
                            <Label htmlFor="outOfStock" className="text-xs font-medium cursor-pointer">SIN STOCK</Label>
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px] h-10 bg-muted/20 border-none shadow-none">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nombre-asc">Nombre A-Z</SelectItem>
                                <SelectItem value="nombre-desc">Nombre Z-A</SelectItem>
                                <SelectItem value="precio-asc">Precio Menor</SelectItem>
                                <SelectItem value="precio-desc">Precio Mayor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Products Grid */}
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4 pb-10">
                        {filteredProducts.map((product) => {
                            const isOutOfStock = product.stock <= 0;
                            const hasVariants = product.variantes_producto && (product.variantes_producto as any[]).length > 0;

                            // Cantidad específica del producto base (sin variante)
                            const baseQty = cart.find(item => item.id === product.id && !item.selectedVariant)?.quantity || 0;
                            // Cantidad acumulada de todas las variantes + base
                            const totalAggregateQty = cartQuantities[product.id] || 0;

                            return (
                                <Card
                                    key={product.id}
                                    className={cn(
                                        "overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 border border-muted/20 bg-card flex flex-col group active:scale-[0.98] select-none relative h-full",
                                        isOutOfStock && "opacity-60 grayscale-[0.5]",
                                        totalAggregateQty > 0 && "ring-2 ring-primary ring-offset-1 ring-offset-background border-primary/20 shadow-lg shadow-primary/5"
                                    )}
                                    onClick={() => addToCart(product)}
                                >
                                    <div className="aspect-[4/5] relative bg-muted/30">
                                        {product.imagen ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${product.imagen}`}
                                                alt={product.nombre}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-10 w-10 text-muted-foreground/20" />
                                            </div>
                                        )}

                                        {/* STOCK Badge */}
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm text-foreground">
                                            {product.stock}
                                        </div>

                                        {/* PRICE Badge */}
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold shadow-md">
                                            S/ {Number(product.precio_venta).toFixed(2)}
                                        </div>

                                        {/* CART QUANTITY Badge (Aggregate) */}
                                        {totalAggregateQty > 0 && (
                                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg animate-in zoom-in-50 duration-200 ring-2 ring-background z-20">
                                                {totalAggregateQty}
                                            </div>
                                        )}

                                        {/* BOTONES DE ACCIÓN */}
                                        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end z-30">
                                            {/* Restar Producto Principal (Base) */}
                                            {baseQty > 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(product.id, undefined, -1);
                                                    }}
                                                    className="bg-destructive text-white h-7 w-7 rounded-full flex items-center justify-center shadow-lg hover:bg-destructive hover:scale-110 active:scale-90 transition-all animate-in slide-in-from-top-2 duration-200"
                                                    title="Quitar uno del principal"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* Botón de Variantes (VAR) */}
                                            {hasVariants && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg hover:bg-zinc-800 active:scale-95 transition-all group/var border border-white/10"
                                                        >
                                                            VAR
                                                            <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-[320px] p-0 overflow-hidden border-black/10 shadow-2xl rounded-2xl z-[100] backdrop-blur-xl bg-background/95"
                                                        side="right"
                                                        align="start"
                                                    >
                                                        <div className="bg-primary/5 p-4 border-b flex flex-col gap-1">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Gestionar Producto</p>
                                                                <Badge variant="outline" className="text-[9px] font-bold border-primary/20 text-primary">
                                                                    {1 + (product.variantes_producto as any[]).length} OPCIONES
                                                                </Badge>
                                                            </div>
                                                            <h3 className="text-xs font-black uppercase truncate leading-none mt-1">{product.nombre}</h3>
                                                        </div>

                                                        <div className="max-h-[420px] overflow-y-auto p-2 space-y-2">
                                                            {/* OPCIÓN PRINCIPAL (BASE) */}
                                                            <div className="flex items-center gap-4 p-2.5 hover:bg-muted/30 transition-all rounded-xl border border-transparent hover:border-black/5">
                                                                <div className="h-16 w-16 rounded-lg border bg-muted flex-shrink-0 relative overflow-hidden flex items-center justify-center border-black/5 shadow-sm">
                                                                    {product.imagen ? (
                                                                        <img
                                                                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${product.imagen}`}
                                                                            className="object-cover h-full w-full"
                                                                        />
                                                                    ) : (
                                                                        <Package className="h-6 w-6 text-muted-foreground/20" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground leading-none mb-1">Producto Base</p>
                                                                    <p className="text-[11px] font-bold truncate">Estándar</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <p className="text-xs font-black text-primary">S/ {Number(product.precio_venta).toFixed(2)}</p>
                                                                        <span className="text-[9px] font-bold text-muted-foreground">St: {product.stock}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-center gap-1.5 self-center">
                                                                    <div className="flex items-center gap-1 bg-background border border-black/10 rounded-lg p-0.5 shadow-sm">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
                                                                            disabled={baseQty === 0}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                updateQuantity(product.id, undefined, -1);
                                                                            }}
                                                                        >
                                                                            <Minus className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                        <span className="text-xs w-6 text-center font-black tabular-nums">{baseQty}</span>
                                                                        <Button
                                                                            variant="default"
                                                                            size="icon"
                                                                            className="h-8 w-8 bg-black text-white hover:bg-zinc-800 shadow-md rounded-md"
                                                                            disabled={product.stock <= 0 || baseQty >= product.stock}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                addToCart(product);
                                                                            }}
                                                                        >
                                                                            <Plus className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* VARIANTES */}
                                                            {(product.variantes_producto as any[]).map((v, idx) => {
                                                                const currentQtyVar = cart.find(item =>
                                                                    item.id === product.id && item.selectedVariant === v.nombre
                                                                )?.quantity || 0;
                                                                const isVarOutOfStock = v.stock <= 0;
                                                                const varPrice = v.precio ? Number(v.precio) : Number(product.precio_venta);

                                                                return (
                                                                    <div key={idx} className={cn(
                                                                        "flex items-center gap-4 p-2.5 hover:bg-muted/30 transition-all rounded-xl border border-transparent hover:border-black/5",
                                                                        isVarOutOfStock && "opacity-50 grayscale"
                                                                    )}>
                                                                        <div className="h-16 w-16 rounded-lg border bg-muted flex-shrink-0 relative overflow-hidden flex items-center justify-center border-black/5 shadow-sm">
                                                                            {v.imagen ? (
                                                                                <img
                                                                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${v.imagen}`}
                                                                                    className="object-cover h-full w-full"
                                                                                />
                                                                            ) : (
                                                                                <ImageIcon className="h-6 w-6 text-muted-foreground/20" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-[10px] font-black uppercase tracking-tight text-primary/70 leading-none mb-1">Variante</p>
                                                                            <p className="text-[11px] font-bold truncate leading-tight">{v.nombre}</p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <p className="text-xs font-black text-primary">S/ {varPrice.toFixed(2)}</p>
                                                                                <span className="text-[9px] font-bold text-muted-foreground">St: {v.stock}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-center gap-1.5 self-center">
                                                                            <div className="flex items-center gap-1 bg-background border border-black/10 rounded-lg p-1 shadow-sm">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
                                                                                    disabled={currentQtyVar === 0}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        updateQuantity(product.id, v.nombre, -1);
                                                                                    }}
                                                                                >
                                                                                    <Minus className="h-4 w-4" />
                                                                                </Button>
                                                                                <span className="text-xs w-6 text-center font-black tabular-nums">{currentQtyVar}</span>
                                                                                <Button
                                                                                    variant="default"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 bg-black text-white hover:bg-zinc-800 shadow-md rounded-md"
                                                                                    disabled={isVarOutOfStock || currentQtyVar >= v.stock}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        addToCart(product, v.nombre);
                                                                                    }}
                                                                                >
                                                                                    <Plus className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        </div>

                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center p-2">
                                                <Badge variant="destructive" className="animate-pulse">AGOTADO</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold line-clamp-2 uppercase tracking-tight">{product.nombre}</h3>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1 italic mt-1">
                                                {product.descripcion_corta || "Sin descripción corta"}
                                            </p>
                                            <div className="flex gap-1 mt-2">
                                                {product.pack2 && (
                                                    <div className="text-[8px] bg-green-500/10 text-green-600 px-1 border border-green-500/20 rounded font-bold">
                                                        P2: S/{product.pack2}
                                                    </div>
                                                )}
                                                {product.pack3 && (
                                                    <div className="text-[8px] bg-blue-500/10 text-blue-600 px-1 border border-blue-500/20 rounded font-bold">
                                                        P3: S/{product.pack3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card >
                            );
                        })}
                    </div >
                </ScrollArea >
            </div >

            {/* --- RIGHT: CHECKOUT SIDEBAR (1/3) --- */}
            < div className="w-full lg:flex-1 lg:max-w-md flex flex-col bg-background border-l relative overflow-hidden" >
                <div className="flex items-center justify-between p-4 border-b bg-muted/5 font-medium">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-sm tracking-widest uppercase text-foreground/80">Detalles de Venta</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={resetPOS}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {/* Fecha */}
                        <div className="flex items-center justify-between pb-4">
                            <Label className="text-sm font-medium">Fecha de Venta</Label>
                            <Badge variant="secondary" className="flex items-center gap-1.5 font-bold py-1 px-2">
                                <Calendar className="h-3 w-3" />
                                {format(orderDate, "dd/MM/yyyy HH:mm", { locale: es })}
                            </Badge>
                        </div>

                        <Separator />

                        {/* Informacion Cliente */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <Label className="text-sm font-semibold">Información del Cliente</Label>
                            </div>

                            {/* Documento de Identificación */}
                            <div className="space-y-1.5 relative">
                                <Label className="text-sm font-medium">DNI / RUC</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Número de documento"
                                        className="h-10 text-sm font-medium pr-8"
                                        value={clientDoc}
                                        onChange={(e) => setClientDoc(e.target.value)}
                                        onBlur={handleClientDniBlur}
                                        maxLength={11}
                                    />
                                    {isLookingUpClient && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tipo & Nombre */}
                            <div className="grid grid-cols-[1fr_3fr] gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">Tipo</Label>
                                    <Select value={clientType} onValueChange={setClientType}>
                                        <SelectTrigger className="h-10 text-sm font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="persona">Persona</SelectItem>
                                            <SelectItem value="empresa">Empresa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">Nombre Completo</Label>
                                    <Input
                                        placeholder="Nombre del Cliente"
                                        className="h-10 text-sm font-medium"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Telefono */}
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium">Teléfono</Label>
                                <PhoneInput
                                    placeholder="+51 987 654 321"
                                    defaultCountry="PE"
                                    className="h-10 text-sm font-medium"
                                    value={clientPhone}
                                    onChange={(value) => setClientPhone(value || "")}
                                />
                            </div>

                        </div>

                        {/* Dirección de Entrega (Order specific) */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <Label className="text-sm font-semibold">Dirección de Entrega</Label>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">Departamento</Label>
                                <Select value={orderDept} onValueChange={(val) => {
                                    setOrderDept(val);
                                    const deptId = DEPARTAMENTOS.find(d => d.nombre === val)?.id;
                                    const firstProv = PROVINCIAS.find(p => p.departamento_id === deptId);
                                    if (firstProv) {
                                        setOrderProv(firstProv.nombre);
                                        const firstDist = DISTRITOS.find(d => d.provincia_id === firstProv.id);
                                        if (firstDist) setOrderDist(firstDist.nombre);
                                    }
                                }}>
                                    <SelectTrigger className="h-9 text-xs w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTAMENTOS.map(d => (
                                            <SelectItem key={d.id} value={d.nombre}>{d.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">Provincia</Label>
                                    <Select value={orderProv} onValueChange={(val) => {
                                        setOrderProv(val);
                                        const provObj = availableProvinces.find(p => p.nombre === val);
                                        if (provObj) {
                                            const firstDist = DISTRITOS.find(d => d.provincia_id === provObj.id);
                                            if (firstDist) setOrderDist(firstDist.nombre);
                                        }
                                    }}>
                                        <SelectTrigger className="h-9 text-xs w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableProvinces.map(p => (
                                                <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">Distrito</Label>
                                    <Select value={orderDist} onValueChange={setOrderDist}>
                                        <SelectTrigger className="h-9 text-xs w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableDistricts.map(d => (
                                                <SelectItem key={d.id} value={d.nombre}>{d.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">Dirección Exacta</Label>
                                <Input
                                    placeholder="Calle, número, urbanización..."
                                    className="h-10 text-sm font-medium"
                                    value={orderAddress}
                                    onChange={(e) => setOrderAddress(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">Ubicación GPS / Referencia</Label>
                                <Input
                                    placeholder="Link de Google Maps o referencia..."
                                    className="h-10 text-sm font-medium"
                                    value={orderLocation}
                                    onChange={(e) => setOrderLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Pago y Estados */}
                        <div className="space-y-4 pb-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Método Pago</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger className="h-10 font-bold w-full bg-primary/5 border-primary/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom">
                                        {paymentMethods.map((method) => (
                                            <SelectItem key={method.id} value={method.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: method.color }} />
                                                    {method.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Estado Pago</Label>
                                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                        <SelectTrigger className="h-10 font-medium w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                            {paymentStatuses.map((status) => (
                                                <SelectItem key={status.id} value={status.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
                                                        {status.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Estado Pedido</Label>
                                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                                        <SelectTrigger className="h-10 font-medium w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                            {orderStatuses.map((status) => (
                                                <SelectItem key={status.id} value={status.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
                                                        {status.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Voucher Upload */}
                        <div className="space-y-3 pb-4 border-b border-dashed border-border/50">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    Vouchers de Adelanto
                                </Label>
                                {voucherIds.length > 0 && (
                                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20 py-0 h-5">
                                        {voucherIds.length} SUBIDO(S)
                                    </Badge>
                                )}
                            </div>

                            {/* Thumbnails Grid */}
                            {voucherIds.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {voucherIds.map((id) => (
                                        <div key={id} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${id}?width=100&height=100&fit=cover`}
                                                alt="Voucher"
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeVoucher(id)}
                                                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="relative group">
                                <Input
                                    type="file"
                                    id="voucher-upload"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleVoucherUpload}
                                    disabled={isUploadingVoucher}
                                />
                                <Label
                                    htmlFor="voucher-upload"
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                                        voucherIds.length > 0
                                            ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
                                            : "border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/30",
                                        isUploadingVoucher && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isUploadingVoucher ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="h-5 w-5 text-muted-foreground/40 mb-1 group-hover:text-primary transition-colors" />
                                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase group-hover:text-primary transition-colors">
                                                {voucherIds.length > 0 ? "Agregar más imágenes" : "Subir Comprobante(s)"}
                                            </span>
                                        </div>
                                    )}
                                </Label>
                            </div>
                        </div>

                        {/* Pagos */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 border-y border-dashed border-border/50">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Adelanto</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">S/</span>
                                    <Input
                                        type="number"
                                        className="h-10 pl-8 text-sm font-medium"
                                        placeholder="0.00"
                                        value={advancePayment === 0 ? "" : advancePayment}
                                        onChange={(e) => setAdvancePayment(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-destructive">Faltante</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-destructive">S/</span>
                                    <Input
                                        readOnly
                                        className="h-10 pl-8 text-sm font-medium text-right text-destructive bg-destructive/5"
                                        value={balanceDue.toFixed(2)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-sm font-medium">Fecha de Entrega</Label>
                                <Input
                                    type="date"
                                    className="h-10 text-sm font-medium w-full"
                                    value={deliveryDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Envio */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/5 capitalize">
                                <Checkbox
                                    id="shipping"
                                    checked={configureShipping}
                                    onCheckedChange={(val) => setConfigureShipping(!!val)}
                                />
                                <Label htmlFor="shipping" className="text-sm font-medium cursor-pointer">Configurar Envío / Courier</Label>
                            </div>

                            {configureShipping && (
                                <div className="space-y-6 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Tipo de Cobro</Label>
                                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50 w-fit">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-8 text-[10px] font-black uppercase px-4 transition-all duration-200 rounded-md",
                                                    shippingType === "adicional"
                                                        ? "bg-background text-primary shadow-sm hover:bg-background"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                                )}
                                                onClick={() => setShippingType("adicional")}
                                            >
                                                Adicional
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-8 text-[10px] font-black uppercase px-4 transition-all duration-200 rounded-md ml-1",
                                                    shippingType === "incluido"
                                                        ? "bg-background text-primary shadow-sm hover:bg-background"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                                )}
                                                onClick={() => setShippingType("incluido")}
                                            >
                                                Incluido
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium">Costo Envío</Label>
                                            <Input
                                                type="number"
                                                className="h-10 text-sm w-full"
                                                placeholder="0.00"
                                                value={shippingCost === 0 ? "" : shippingCost}
                                                onChange={(e) => setShippingCost(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium">Courier</Label>
                                            <Select value={courier} onValueChange={setCourier}>
                                                <SelectTrigger className="h-10 font-medium w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {courierTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.value}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: type.color }} />
                                                                {type.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium">Destino / Agencia (Referencia)</Label>
                                            {courier === "SHALOM" ? (
                                                <ShalomAgencySelect
                                                    value={destination}
                                                    onValueChange={setDestination}
                                                />
                                            ) : (
                                                <Input
                                                    className="h-10 text-sm"
                                                    placeholder="Ej: Agencia Shalom Av. Grau"
                                                    value={destination}
                                                    onChange={(e) => setDestination(e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2 border-t border-dashed">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-3.5 w-3.5" />
                                            <Label className="text-sm font-medium">Seguimiento ({courier})</Label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Nro. Orden"
                                                className="h-10 text-sm"
                                                value={courierOrder}
                                                onChange={(e) => setCourierOrder(e.target.value)}
                                            />
                                            <Input
                                                placeholder="Código de Envío"
                                                className="h-10 text-sm"
                                                value={courierCode}
                                                onChange={(e) => setCourierCode(e.target.value)}
                                            />
                                        </div>
                                        <Input
                                            placeholder="Clave"
                                            type="text"
                                            className="h-10 text-sm"
                                            value={courierPass}
                                            onChange={(e) => setCourierPass(e.target.value)}
                                        />
                                    </div>


                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Carrito List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">Carrito ({cart.length})</Label>
                            </div>
                            {cart.length === 0 ? (
                                <div className="h-24 flex flex-col items-center justify-center text-muted-foreground/30 border-2 border-dashed rounded-lg bg-muted/5">
                                    <ShoppingCart className="h-6 w-6 mb-2 opacity-20" />
                                    <p className="text-[10px] uppercase font-bold tracking-tighter">Sin productos en la venta</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50 -mx-4">
                                    {cart.map((item) => {
                                        const qty = item.quantity;
                                        const p2 = item.pack2 ? Number(item.pack2) : 0;
                                        const p3 = item.pack3 ? Number(item.pack3) : 0;

                                        // Un pack aplica si la cantidad de ESTA LÍNEA (variante) es exactamente 2 o 3
                                        const isPack = (qty === 2 && p2 > 0) || (qty === 3 && p3 > 0);
                                        const packPrice = qty === 2 ? p2 : p3;

                                        // El precio regular depende de si es variante o base
                                        const getRegularUnitPrice = () => {
                                            if (item.selectedVariant && item.variantes_producto) {
                                                const v = (item.variantes_producto as any[]).find(v => v.nombre === item.selectedVariant);
                                                if (v && v.precio) return Number(v.precio);
                                            }
                                            return Number(item.precio_venta || 0);
                                        };

                                        const regularUnitPrice = getRegularUnitPrice();
                                        // Puesto que ya es independiente, el precio unitario del pack es simplemente packPrice / qty
                                        const unitPackPrice = isPack ? (packPrice / qty) : regularUnitPrice;

                                        return (
                                            <div key={`${item.id}-${item.selectedVariant || 'default'}`} className="p-4 group relative hover:bg-muted/30 transition-colors">
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 bg-muted rounded flex-shrink-0 relative overflow-hidden border border-border/50 shadow-sm">
                                                        {/* ... imagen ... */}
                                                        {(() => {
                                                            // Si hay variante seleccionada y tiene imagen propia, usar esa.
                                                            if (item.selectedVariant && item.variantes_producto) {
                                                                const v = (item.variantes_producto as any[]).find(v => v.nombre === item.selectedVariant);
                                                                if (v && v.imagen) {
                                                                    return (
                                                                        <Image
                                                                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${v.imagen}`}
                                                                            alt={item.nombre}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    );
                                                                }
                                                            }
                                                            // Si no, usar la imagen del producto
                                                            return item.imagen ? (
                                                                <Image
                                                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.imagen}`}
                                                                    alt={item.nombre}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : <Package className="h-6 w-6 m-auto absolute inset-0 opacity-10" />;
                                                        })()}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div className="flex flex-col truncate">
                                                                <h4 className="text-[11px] font-black uppercase truncate leading-tight text-foreground/90">{item.nombre}</h4>
                                                                {item.selectedVariant && (
                                                                    <span className="text-[9px] font-bold text-primary uppercase mt-0.5 tracking-tighter">
                                                                        VAR: {item.selectedVariant}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                {isPack ? (
                                                                    <>
                                                                        <div className="text-[10px] text-muted-foreground line-through opacity-50">S/ {(regularUnitPrice * item.quantity).toFixed(2)}</div>
                                                                        <div className={cn(
                                                                            "font-black text-xs tabular-nums",
                                                                            qty === 2 ? "text-green-600" : "text-blue-600"
                                                                        )}>
                                                                            S/ {(unitPackPrice * item.quantity).toFixed(2)}
                                                                        </div>
                                                                        <Badge className={cn(
                                                                            "text-[8px] h-3 px-1 mt-0.5",
                                                                            qty === 2 ? "bg-green-600 hover:bg-green-600 border-none" : "bg-blue-600 hover:bg-blue-600 border-none"
                                                                        )}>
                                                                            PACK {qty}
                                                                        </Badge>
                                                                    </>
                                                                ) : (
                                                                    <div className="font-black text-xs text-primary tabular-nums">S/ {(regularUnitPrice * item.quantity).toFixed(2)}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className="flex items-center bg-background rounded-md border border-border/60 h-7 overflow-hidden">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-full w-7 hover:bg-muted transition-colors rounded-none"
                                                                    onClick={() => updateQuantity(item.id, item.selectedVariant, -1)}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <div className="w-8 text-center text-[11px] font-black tabular-nums border-x border-border/40">{item.quantity}</div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-full w-7 hover:bg-muted transition-colors rounded-none"
                                                                    onClick={() => updateQuantity(item.id, item.selectedVariant, 1)}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                                onClick={() => removeFromCart(item.id, item.selectedVariant)}
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer Totals */}
                <div className="p-4 border-t bg-muted/5 space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-dashed border-border/70">
                        <Label className="text-[11px] font-bold uppercase text-muted-foreground">Ajuste de Venta</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">S/</span>
                            <Input
                                type="number"
                                className="h-8 w-20 text-xs font-bold text-right py-1 px-2"
                                placeholder="0.00"
                                value={adjustment === 0 ? "" : adjustment}
                                onChange={(e) => setAdjustment(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-0.5">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total</Label>
                            <p className="text-[9px] text-muted-foreground italic leading-none opacity-60">IGV Incluido</p>
                        </div>
                        <div className="text-2xl font-black text-primary tracking-tighter tabular-nums drop-shadow-sm">
                            S/ {totalWithAdjustments.toFixed(2)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="h-11 text-[10px] uppercase font-black tracking-widest hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all"
                            onClick={resetPOS}
                            disabled={cart.length === 0 || isProcessing}
                        >
                            Limpiar
                        </Button>
                        <Button
                            className="h-11 text-[10px] uppercase font-black tracking-widest gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                            disabled={cart.length === 0 || isProcessing}
                            onClick={handleCheckout}
                        >
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                                <>
                                    Pagar
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div >

        </div >
    );
}
