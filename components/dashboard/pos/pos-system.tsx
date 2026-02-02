"use client";

import { useState, useMemo, useEffect } from "react";
import { Product } from "@/lib/product-actions";
import { Client, lookupDni, createClient, getClientByDni } from "@/lib/client-actions";
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
    FileImage
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
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from "@/lib/peru-locations";
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

interface POSSystemProps {
    products: Product[];
    clients: Client[];
    workspaceId: string;
    orderStatuses: OrderStatus[];
    paymentStatuses: PaymentStatus[];
    courierTypes: CourierType[];
    paymentMethods: PaymentMethod[];
}

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
    const [clientAddress, setClientAddress] = useState("");
    const [clientLocation, setClientLocation] = useState("");
    const [clientType, setClientType] = useState("persona"); // Added client type
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isLookingUpClient, setIsLookingUpClient] = useState(false); // New loading state for lookup

    // Order Info
    const [orderDate] = useState(new Date());
    const [paymentStatus, setPaymentStatus] = useState(paymentStatuses[0]?.value || "pendiente");
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]?.value || "YAPE");
    const [orderStatus, setOrderStatus] = useState(orderStatuses[0]?.value || "preparando");
    const [advancePayment, setAdvancePayment] = useState(0);
    const [adjustment, setAdjustment] = useState(0);
    const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

    // Shipping Info
    const [configureShipping, setConfigureShipping] = useState(true);
    const [shippingType, setShippingType] = useState("adicional"); // adicional | incluido
    const [shippingCost, setShippingCost] = useState(0);
    const [selectedDept, setSelectedDept] = useState("LIMA");
    const [selectedProv, setSelectedProv] = useState("LIMA");
    const [selectedDist, setSelectedDist] = useState("LIMA");
    const [courier, setCourier] = useState(courierTypes[0]?.value || "SHALOM");
    const [destination, setDestination] = useState("");
    const [courierOrder, setCourierOrder] = useState("");
    const [courierCode, setCourierCode] = useState("");
    const [courierPass, setCourierPass] = useState("");
    const [voucherIds, setVoucherIds] = useState<string[]>([]);
    const [isUploadingVoucher, setIsUploadingVoucher] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);

    // --- Logical Handling ---

    // Handle Client Auto-fill from Local Data
    useEffect(() => {
        // Only run local lookup if we are NOT currently running an external lookup
        if (clientDoc.length >= 8 && !isLookingUpClient) {
            const client = clients.find(c => c.documento_identificacion === clientDoc);
            if (client) {
                setClientName(client.nombre_completo);
                setClientPhone(client.telefono || "");
                setClientType(client.tipo_cliente || "persona");
                setClientLocation(client.ubicacion || "");
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

    // Cascading Selects Data
    const availableProvincias = useMemo(() => {
        const dept = DEPARTAMENTOS.find(d => d.nombre === selectedDept);
        return dept ? PROVINCIAS.filter(p => p.departamento_id === dept.id) : [];
    }, [selectedDept]);

    const availableDistritos = useMemo(() => {
        const prov = PROVINCIAS.find(p => p.nombre === selectedProv && p.departamento_id === DEPARTAMENTOS.find(d => d.nombre === selectedDept)?.id);
        return prov ? DISTRITOS.filter(d => d.provincia_id === prov.id) : [];
    }, [selectedDept, selectedProv]);

    const cartQuantities = useMemo(() => {
        return cart.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
        }, {} as Record<string, number>);
    }, [cart]);

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

    const addToCart = (product: Product) => {
        const currentQty = cartQuantities[product.id] || 0;

        if (product.stock <= 0) {
            toast.error("Producto agotado");
            return;
        }

        if (currentQty >= product.stock) {
            toast.warning(`Solo hay ${product.stock} unidades en stock`);
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                // Optional: Check stock limit
                if (newQty > item.stock) {
                    toast.warning(`Solo hay ${item.stock} unidades en stock`);
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (Number(item.precio_venta || 0) * item.quantity), 0);
    }, [cart]);

    const totalShipping = configureShipping && shippingType === "adicional" ? Number(shippingCost) : 0;
    const totalWithAdjustments = subtotal + totalShipping + Number(adjustment);
    const balanceDue = Math.max(0, totalWithAdjustments - Number(advancePayment));

    const resetPOS = () => {
        setCart([]);
        setClientDoc("");
        setClientName("");
        setClientPhone("");
        setClientAddress("");
        setClientLocation("");
        setSelectedClientId(null);
        setPaymentStatus(paymentStatuses[0]?.value || "pendiente");
        setPaymentMethod(paymentMethods[0]?.value || "YAPE");
        setOrderStatus(orderStatuses[0]?.value || "preparando");
        setAdvancePayment(0);
        setAdjustment(0);
        setConfigureShipping(true);
        setShippingType("adicional");
        setShippingCost(0);
        setCourier(courierTypes[0]?.value || "SHALOM");
        setSelectedDept("LIMA");
        setSelectedProv("LIMA");
        setSelectedDist("LIMA");
        setDestination("");
        setCourierOrder("");
        setCourierCode("");
        setCourierPass("");
        setVoucherIds([]);
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

            // --- RESOLVE CLIENT ID (Find or Create) ---
            let finalClientId = selectedClientId;

            // Cases for Client Resolution:
            // 1. If we have a Client ID already (found locally or returned from create previously) -> We use it
            // 2. If no ID, but we HAVE a DNI -> Check DB. If exists, use it. If not, create it.
            // 3. If no ID AND no DNI, but we HAVE a Name -> Create a client without DNI.

            if (!finalClientId) {
                if (clientDoc && clientDoc.length >= 8) {
                    // Check if exists in DB by DNI
                    const existingClient = await getClientByDni(workspaceId, clientDoc);
                    if (existingClient) {
                        finalClientId = existingClient.id;
                        setClientName(existingClient.nombre_completo);
                        setClientLocation(existingClient.ubicacion || "");
                        setSelectedClientId(existingClient.id);
                    } else if (clientName) {
                        // Create from DNI + Name
                        const newClientData = {
                            workspace_id: workspaceId,
                            nombre_completo: clientName,
                            documento_identificacion: clientDoc,
                            tipo_cliente: clientType,
                            telefono: clientPhone,
                            departamento: selectedDept,
                            provincia: selectedProv,
                            distrito: selectedDist,
                            direccion: clientAddress,
                            ubicacion: clientLocation,
                            status: "active"
                        };
                        const { data: newClient, error } = await createClient(newClientData);
                        if (newClient) {
                            finalClientId = newClient.id;
                            setSelectedClientId(newClient.id);
                            toast.success("Cliente registrado con DNI");
                        } else {
                            toast.error("Error al registrar cliente con DNI: " + error);
                            setIsProcessing(false);
                            return;
                        }
                    }
                } else if (clientName) {
                    // Create from Name Only (No DNI)
                    const newClientData = {
                        workspace_id: workspaceId,
                        nombre_completo: clientName,
                        tipo_cliente: clientType,
                        telefono: clientPhone,
                        departamento: selectedDept,
                        provincia: selectedProv,
                        distrito: selectedDist,
                        direccion: clientAddress,
                        ubicacion: clientLocation,
                        status: "active"
                    };
                    const { data: newClient, error } = await createClient(newClientData);
                    if (newClient) {
                        finalClientId = newClient.id;
                        setSelectedClientId(newClient.id);
                        toast.success("Cliente registrado sin DNI");
                    } else {
                        toast.error("Error al registrar cliente sin DNI: " + error);
                        setIsProcessing(false);
                        return;
                    }
                }
            } else if (selectedClientId && clientName) {
                // Potential Update? (For now, just use the existing ID)
                // If the user modified the name/phone but kept the ID, we might want to updateClient here.
                // But for simplicity in POS, we just attach to the already selected/resolved ID.
            }

            // --- CREATE ORDER ---
            const orderItems: OrderItem[] = cart.map(item => ({
                product_id: item.id,
                cantidad: item.quantity,
                precio_unitario: Number(item.precio_venta || 0),
                subtotal: Number(item.precio_venta || 0) * item.quantity,
                variante_seleccionada: item.selectedVariant
            }));

            const { data: order, error } = await createOrder({
                workspace_id: workspaceId,
                cliente_id: finalClientId, // Use resolved ID
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
                courier_provincia_dpto: selectedDept,
                courier_destino_agencia: destination,
                courier_nro_orden: courierOrder,
                courier_codigo: courierCode,
                courier_clave: courierPass,
                ajuste_total: Number(adjustment),
                voucher: voucherIds.length > 0 ? voucherIds.map(id => ({ directus_files_id: id })) : undefined,
                fecha_entrega: deliveryDate,
                ubicacion: clientLocation,
            }, orderItems);

            if (error) throw new Error(error);

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
                            return (
                                <Card
                                    key={product.id}
                                    className={cn(
                                        "overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 border border-muted/20 bg-card flex flex-col group active:scale-[0.98] select-none relative",
                                        isOutOfStock && "opacity-60 grayscale-[0.5]",
                                        cartQuantities[product.id] > 0 && "ring-2 ring-primary ring-offset-1 ring-offset-background border-primary/20 shadow-lg shadow-primary/5"
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

                                        {/* CART QUANTITY Badge & Controls */}
                                        {cartQuantities[product.id] > 0 && (
                                            <>
                                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg animate-in zoom-in-50 duration-200 ring-2 ring-background z-20">
                                                    {cartQuantities[product.id]}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(product.id, -1);
                                                    }}
                                                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground h-7 w-7 rounded-full flex items-center justify-center shadow-lg hover:bg-destructive hover:scale-110 active:scale-90 transition-all z-20 animate-in slide-in-from-top-2 duration-200"
                                                    title="Quitar uno"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}

                                        {/* Out of stock overlay */}
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center p-2">
                                                <Badge variant="destructive" className="animate-pulse">AGOTADO</Badge>
                                            </div>
                                        )}

                                        {/* VARS Label if variants exist */}
                                        {product.variantes_producto && (product.variantes_producto as any[]).length > 0 && (
                                            <div className="absolute top-2 right-2">
                                                <Badge className="text-[9px] font-black h-4 px-1">VARS</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold line-clamp-2 uppercase tracking-tight">{product.nombre}</h3>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1 italic mt-1">
                                                {product.descripcion_corta || "Sin descripción corta"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* --- RIGHT: CHECKOUT SIDEBAR (1/3) --- */}
            <div className="w-full lg:flex-1 lg:max-w-md flex flex-col bg-background border-l relative overflow-hidden">
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

                            {/* Ubicación: Departamento, Provincia, Distrito */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">Departamento</Label>
                                    <Select value={selectedDept} onValueChange={(val) => {
                                        setSelectedDept(val);
                                        const firstProv = PROVINCIAS.find(p => p.departamento_id === DEPARTAMENTOS.find(d => d.nombre === val)?.id);
                                        if (firstProv) {
                                            setSelectedProv(firstProv.nombre);
                                            const firstDist = DISTRITOS.find(d => d.provincia_id === firstProv.id);
                                            if (firstDist) setSelectedDist(firstDist.nombre);
                                        }
                                    }}>
                                        <SelectTrigger className="h-10 text-sm w-full">
                                            <SelectValue placeholder="Seleccionar departamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEPARTAMENTOS.map((dep) => (
                                                <SelectItem key={dep.id} value={dep.nombre}>{dep.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium">Provincia</Label>
                                        <Select value={selectedProv} onValueChange={(val) => {
                                            setSelectedProv(val);
                                            const prov = PROVINCIAS.find(p => p.nombre === val && p.departamento_id === DEPARTAMENTOS.find(d => d.nombre === selectedDept)?.id);
                                            if (prov) {
                                                const firstDist = DISTRITOS.find(d => d.provincia_id === prov.id);
                                                if (firstDist) setSelectedDist(firstDist.nombre);
                                            }
                                        }}>
                                            <SelectTrigger className="h-10 text-sm w-full">
                                                <SelectValue placeholder="Provincia" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableProvincias.map((prov) => (
                                                    <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium">Distrito</Label>
                                        <Select value={selectedDist} onValueChange={setSelectedDist}>
                                            <SelectTrigger className="h-10 text-sm w-full">
                                                <SelectValue placeholder="Distrito" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableDistritos.map((dist) => (
                                                    <SelectItem key={dist.id} value={dist.nombre}>{dist.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Direccion */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">Dirección</Label>
                                    <Input
                                        placeholder="Av. Las Magnolias 123..."
                                        className="h-10 text-sm font-medium"
                                        value={clientAddress}
                                        onChange={(e) => setClientAddress(e.target.value)}
                                    />
                                </div>

                                {/* Ubicacion */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">Ubicación</Label>
                                    <Input
                                        placeholder="Link de Google Maps o referencia..."
                                        className="h-10 text-sm font-medium"
                                        value={clientLocation}
                                        onChange={(e) => setClientLocation(e.target.value)}
                                    />
                                </div>
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
                                            <SelectItem key={method.id} value={method.value}>
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
                                                <SelectItem key={status.id} value={status.value}>
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
                                                <SelectItem key={status.id} value={status.value}>
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
                                    {cart.map((item) => (
                                        <div key={item.id} className="p-4 group relative hover:bg-muted/30 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 bg-muted rounded flex-shrink-0 relative overflow-hidden border border-border/50 shadow-sm">
                                                    {item.imagen ? (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.imagen}`}
                                                            alt={item.nombre}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : <Package className="h-6 w-6 m-auto absolute inset-0 opacity-10" />}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h4 className="text-[11px] font-black uppercase truncate leading-tight flex-1 text-foreground/90">{item.nombre}</h4>
                                                        <div className="font-black text-xs text-primary tabular-nums">S/ {Number(item.precio_venta).toFixed(2)}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <div className="flex items-center bg-background rounded-md border border-border/60 h-7 overflow-hidden">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-full w-7 rounded-none hover:bg-muted"
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                            ><Minus className="h-3 w-3" /></Button>
                                                            <span className="text-[11px] w-8 text-center font-bold px-1 tabular-nums">{item.quantity}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-full w-7 rounded-none hover:bg-muted"
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                            ><Plus className="h-3 w-3" /></Button>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer Totals */}
                <div className="p-6 border-t bg-muted/5 space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-dashed border-border/70">
                        <Label className="text-sm font-medium">Ajuste de Venta</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">S/</span>
                            <Input
                                type="number"
                                className="h-10 w-24 text-sm font-medium text-right"
                                placeholder="0.00"
                                value={adjustment === 0 ? "" : adjustment}
                                onChange={(e) => setAdjustment(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex items-end justify-between px-1">
                        <div className="space-y-1">
                            <Label className="text-sm font-semibold text-muted-foreground">Monto Total</Label>
                            <p className="text-[10px] text-muted-foreground italic leading-none">IGV Incluido</p>
                        </div>
                        <div className="text-4xl font-black text-primary tracking-tighter tabular-nums">
                            S/ {totalWithAdjustments.toFixed(2)}
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 text-sm uppercase font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center justify-center gap-3"
                        disabled={cart.length === 0 || isProcessing}
                        onClick={handleCheckout}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Finalizar Venta
                                <CreditCard className="h-5 w-5" />
                            </>
                        )}
                    </Button>
                </div>
            </div>


        </div>
    );
}

