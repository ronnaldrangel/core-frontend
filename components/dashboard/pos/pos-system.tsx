"use client";

import { useState, useMemo, useEffect } from "react";
import { Product } from "@/lib/product-actions";
import { Client } from "@/lib/client-actions";
import { createOrder, OrderItem } from "@/lib/order-actions";
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
    X
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CartesianItem extends Product {
    quantity: number;
    selectedVariant?: string;
}

interface POSSystemProps {
    products: Product[];
    clients: Client[];
    workspaceId: string;
}

export function POSSystem({ products, clients, workspaceId }: POSSystemProps) {
    // --- State ---
    const [cart, setCart] = useState<CartesianItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOutOfStock, setShowOutOfStock] = useState(true);
    const [sortBy, setSortBy] = useState("nombre-asc");

    // Client Info
    const [clientDoc, setClientDoc] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    // Order Info
    const [orderDate] = useState(new Date());
    const [paymentStatus, setPaymentStatus] = useState("pendiente");
    const [orderStatus, setOrderStatus] = useState("preparando");
    const [advancePayment, setAdvancePayment] = useState(0);
    const [adjustment, setAdjustment] = useState(0);

    // Shipping Info
    const [configureShipping, setConfigureShipping] = useState(false);
    const [shippingType, setShippingType] = useState("adicional"); // adicional | incluido
    const [shippingCost, setShippingCost] = useState(0);
    const [courier, setCourier] = useState("SHALOM");
    const [province, setProvince] = useState("");
    const [destination, setDestination] = useState("");
    const [courierOrder, setCourierOrder] = useState("");
    const [courierCode, setCourierCode] = useState("");
    const [courierPass, setCourierPass] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);

    // --- Logical Handling ---

    // Handle Client Auto-fill when Doc or Name matches
    useEffect(() => {
        if (clientDoc.length >= 8) {
            const client = clients.find(c => c.documento_identificacion === clientDoc);
            if (client) {
                setClientName(client.nombre_completo);
                setClientPhone(client.telefono || "");
                setSelectedClientId(client.id);
            }
        }
    }, [clientDoc, clients]);

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
        if (product.stock <= 0) {
            toast.error("Producto agotado");
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

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        try {
            setIsProcessing(true);
            const orderItems: OrderItem[] = cart.map(item => ({
                product_id: item.id,
                cantidad: item.quantity,
                precio_unitario: Number(item.precio_venta || 0),
                subtotal: Number(item.precio_venta || 0) * item.quantity,
                variante_seleccionada: item.selectedVariant
            }));

            const { error } = await createOrder({
                workspace_id: workspaceId,
                cliente_id: selectedClientId,
                total: totalWithAdjustments,
                metodo_pago: "pos", // Specialized POS payment workflow
                estado_pago: paymentStatus,
                estado_pedido: orderStatus,
                monto_adelanto: Number(advancePayment),
                monto_faltante: balanceDue,
                configurar_envio: configureShipping,
                tipo_cobro_envio: shippingType,
                costo_envio: Number(shippingCost),
                courier_nombre: courier,
                courier_provincia_dpto: province,
                courier_destino_agencia: destination,
                courier_nro_orden: courierOrder,
                courier_codigo: courierCode,
                courier_clave: courierPass,
                ajuste_total: Number(adjustment),
            }, orderItems);

            if (error) throw new Error(error);

            toast.success("Venta realizada con éxito");
            // Clear state
            setCart([]);
            setClientDoc("");
            setClientName("");
            setClientPhone("");
            setSelectedClientId(null);
            setAdvancePayment(0);
            setAdjustment(0);
            setConfigureShipping(false);
            setShippingCost(0);
        } catch (error: any) {
            toast.error(error.message || "Error al procesar la venta");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] bg-muted/5 p-4 rounded-xl">
            {/* --- LEFT: PRODUCT GRID --- */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-10 h-10 bg-background border-none shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-md shadow-sm border border-transparent">
                            <Checkbox
                                id="outOfStock"
                                checked={!showOutOfStock}
                                onCheckedChange={(val) => setShowOutOfStock(!val)}
                            />
                            <label htmlFor="outOfStock" className="text-xs font-medium cursor-pointer">SIN STOCK</label>
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px] h-10 bg-background border-none shadow-sm">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pr-4">
                        {filteredProducts.map((product) => {
                            const isOutOfStock = product.stock <= 0;
                            return (
                                <Card
                                    key={product.id}
                                    className={cn(
                                        "overflow-hidden cursor-pointer hover:shadow-md transition-all border-none shadow-sm flex flex-col group",
                                        isOutOfStock && "opacity-80"
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
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">
                                            {product.stock}
                                        </div>

                                        {/* PRICE Badge */}
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold shadow-md">
                                            S/ {Number(product.precio_venta).toFixed(2)}
                                        </div>

                                        {/* Out of stock overlay */}
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center p-2">
                                                <Badge variant="destructive" className="animate-pulse">AGOTADO</Badge>
                                            </div>
                                        )}

                                        {/* VARS Label if variants exist */}
                                        {product.variantes_producto && (product.variantes_producto as any[]).length > 0 && (
                                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-sm ring-1 ring-white/20">
                                                VARS
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold line-clamp-2 uppercase tracking-tight">{product.nombre}</h3>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1 italic mt-1">
                                                {product.descripcion_corta || "Efecto caída del cabello..."}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* --- RIGHT: CHECKOUT SIDEBAR --- */}
            <div className="w-full lg:w-[420px] flex flex-col bg-background rounded-xl border shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-muted/5 group">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-sm tracking-widest uppercase">Detalles de Venta</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => setCart([])}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {/* Fecha */}
                        <div className="flex items-center justify-between text-xs border-b pb-4">
                            <span className="text-muted-foreground font-medium uppercase tracking-tighter">Fecha de Venta</span>
                            <div className="flex items-center gap-2 font-bold p-1 px-2 rounded bg-muted/30">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(orderDate, "dd/MM/yyyy HH:mm", { locale: es })}
                            </div>
                        </div>

                        {/* Informacion Cliente */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <User className="h-3 w-3" /> Información del Cliente
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="DNI / RUC"
                                    className="bg-muted/10 border-none h-11 text-sm font-medium"
                                    value={clientDoc}
                                    onChange={(e) => setClientDoc(e.target.value)}
                                />
                                <div className="relative">
                                    <Input
                                        placeholder="Nombre del Cliente"
                                        className="bg-muted/10 border-none h-11 text-sm font-medium pl-10"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    placeholder="Celular"
                                    className="bg-muted/10 border-none h-11 text-sm font-medium pl-10"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                            </div>
                        </div>

                        {/* Estados */}
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-muted-foreground uppercase">Estado Pago</label>
                                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                    <SelectTrigger className="h-11 bg-muted/10 border-none text-xs font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="parcial">P. Parcial</SelectItem>
                                        <SelectItem value="pagado">P. Total</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-muted-foreground uppercase">Estado Pedido</label>
                                <Select value={orderStatus} onValueChange={setOrderStatus}>
                                    <SelectTrigger className="h-11 bg-muted/10 border-none text-xs font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="preparando">Preparando</SelectItem>
                                        <SelectItem value="enviado">Enviado</SelectItem>
                                        <SelectItem value="entregado">Entregado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Pagos */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-blue-600 uppercase">Adelanto</label>
                                <Input
                                    type="number"
                                    className="h-12 bg-blue-50 text-blue-800 border-none font-bold text-lg"
                                    value={advancePayment}
                                    onChange={(e) => setAdvancePayment(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-red-600 uppercase">Faltante</label>
                                <div className="h-12 flex items-center bg-red-50 text-red-800 rounded-md font-bold text-lg px-3">
                                    {balanceDue.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Envio */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3 bg-muted/10 p-4 rounded-xl">
                                <Checkbox
                                    id="shipping"
                                    className="h-5 w-5 rounded-md border-2 border-primary"
                                    checked={configureShipping}
                                    onCheckedChange={(val) => setConfigureShipping(!!val)}
                                />
                                <label htmlFor="shipping" className="text-xs font-black uppercase tracking-widest cursor-pointer select-none">Configurar Envío / Currier</label>
                            </div>

                            {configureShipping && (
                                <div className="space-y-6 p-5 rounded-2xl bg-blue-50/50 border border-blue-100 animate-in slide-in-from-top duration-300">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-black text-blue-700 uppercase">Tipo de Cobro</span>
                                        <div className="flex bg-white p-1 rounded-lg shadow-inner border border-blue-50">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-7 text-[9px] font-black uppercase rounded py-0 px-3",
                                                    shippingType === "adicional" ? "bg-blue-600 text-white shadow-sm" : "text-blue-400"
                                                )}
                                                onClick={() => setShippingType("adicional")}
                                            >Adicional</Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-7 text-[9px] font-black uppercase rounded py-0 px-3 ml-1",
                                                    shippingType === "incluido" ? "bg-green-600 text-white shadow-sm" : "text-blue-400"
                                                )}
                                                onClick={() => setShippingType("incluido")}
                                            >Incluido</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            placeholder="Costo Envío"
                                            className="bg-white border-blue-50 h-11 text-sm font-bold placeholder:font-normal placeholder:text-blue-300"
                                            value={shippingCost}
                                            onChange={(e) => setShippingCost(Number(e.target.value))}
                                        />
                                        <Select value={courier} onValueChange={setCourier}>
                                            <SelectTrigger className="h-11 bg-white border-blue-50 text-sm font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SHALOM">SHALOM</SelectItem>
                                                <SelectItem value="OLVA">OLVA CURRIER</SelectItem>
                                                <SelectItem value="MOTORIZADO">MOTORIZADO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <Input
                                                placeholder="Provincia/Dpto..."
                                                className="bg-white border-blue-50 h-11 text-xs font-bold"
                                                value={province}
                                                onChange={(e) => setProvince(e.target.value)}
                                            />
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-200" />
                                        </div>
                                        <Input
                                            placeholder="Destino/Agencia"
                                            className="bg-white border-blue-50 h-11 text-xs font-bold"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-blue-100 flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-blue-600" />
                                        <span className="text-[10px] font-black text-blue-600 uppercase">Datos {courier}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            placeholder="Nro. Orden"
                                            className="bg-white border-blue-50 h-11 text-xs"
                                            value={courierOrder}
                                            onChange={(e) => setCourierOrder(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Código"
                                            className="bg-white border-blue-50 h-11 text-xs"
                                            value={courierCode}
                                            onChange={(e) => setCourierCode(e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Clave"
                                        type="password"
                                        className="bg-white border-blue-50 h-11 text-xs"
                                        value={courierPass}
                                        onChange={(e) => setCourierPass(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Carrito List */}
                        <div className="pt-4 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                Carrito ({cart.length})
                            </div>
                            {cart.length === 0 ? (
                                <div className="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <ShoppingCart className="h-8 w-8 opacity-20" />
                                    <p className="text-[10px] uppercase font-bold opacity-30">Venta vacía</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-muted/10 border border-transparent hover:border-muted-foreground/10 transition-all group relative">
                                            <div className="w-20 h-24 bg-muted/20 rounded-lg relative overflow-hidden flex-shrink-0">
                                                {item.imagen ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.imagen}`}
                                                        alt={item.nombre}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : <Package className="h-6 w-6 m-auto absolute inset-0 opacity-10" />}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <h4 className="text-[11px] font-black uppercase tracking-tight line-clamp-2 leading-none">{item.nombre}</h4>
                                                    {item.variantes_producto && (
                                                        <div className="flex gap-1 mt-2">
                                                            {["AUTO", "REG", "X1", "X2", "X3"].map(v => (
                                                                <Button
                                                                    key={v}
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-5 text-[8px] font-black px-1.5 py-0 border-none",
                                                                        v === "AUTO" ? "bg-slate-700 text-white" : "bg-muted/40 text-muted-foreground"
                                                                    )}
                                                                >{v}</Button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center bg-background rounded-lg shadow-sm ring-1 ring-muted">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-none"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                        ><Minus className="h-3 w-3" /></Button>
                                                        <span className="text-xs w-6 text-center font-bold">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-none"
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                        ><Plus className="h-3 w-3" /></Button>
                                                    </div>
                                                    <div className="font-black text-xs text-primary">S/ {Number(item.precio_venta).toFixed(2)}</div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-white shadow-sm border border-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer Totals */}
                <div className="p-6 border-t bg-amber-50/10 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 group">
                        <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Ajuste Total</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-amber-700 p-1 px-2 rounded bg-amber-100">S/ Auto</span>
                            <Input
                                type="number"
                                className="h-9 w-24 bg-white border-amber-100 font-bold text-center"
                                value={adjustment}
                                onChange={(e) => setAdjustment(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex items-end justify-between px-2">
                        <div className="space-y-1">
                            <div className="text-[11px] font-black text-muted-foreground uppercase opacity-40">Monto Total</div>
                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Incluye Impuestos</div>
                        </div>
                        <div className="text-4xl font-black text-primary tracking-tighter">
                            S/ {totalWithAdjustments.toFixed(2)}
                        </div>
                    </div>

                    <Button
                        className="w-full h-16 text-lg font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95 flex items-center justify-center gap-3"
                        disabled={cart.length === 0 || isProcessing}
                        onClick={handleCheckout}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                FINALIZAR VENTA
                                <CreditCard className="h-6 w-6" />
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Helper Floating Label for variants or other info */}
            <div className="fixed bottom-10 left-10 p-4 bg-background border shadow-2xl rounded-2xl flex items-center gap-3 z-50 animate-bounce duration-[2000ms] hidden lg:flex">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Info className="h-5 w-5" />
                </div>
                <div className="max-w-[200px]">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest">Configuración Rápida</h5>
                    <p className="text-[9px] text-muted-foreground leading-tight mt-1">Sincronización Sunat lista para implementación futura.</p>
                </div>
            </div>
        </div>
    );
}

