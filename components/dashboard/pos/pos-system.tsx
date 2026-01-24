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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PhoneInput } from "@/components/ui/phone-input";
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
        <div className="flex flex-col lg:flex-row gap-4 h-full bg-muted/5 rounded-xl">
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
                            <Label htmlFor="outOfStock" className="text-xs font-medium cursor-pointer">SIN STOCK</Label>
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
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm text-foreground">
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

            {/* --- RIGHT: CHECKOUT SIDEBAR --- */}
            <div className="w-full lg:w-[420px] flex flex-col bg-background rounded-xl border shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-muted/5">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-sm tracking-widest uppercase">Detalles de Venta</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setCart([])}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {/* Fecha */}
                        <div className="flex items-center justify-between text-xs pb-4">
                            <Label className="text-muted-foreground font-medium uppercase tracking-tighter">Fecha de Venta</Label>
                            <Badge variant="secondary" className="flex items-center gap-1.5 font-bold py-1 px-2">
                                <Calendar className="h-3 w-3" />
                                {format(orderDate, "dd/MM/yyyy HH:mm", { locale: es })}
                            </Badge>
                        </div>

                        <Separator />

                        {/* Informacion Cliente */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Información del Cliente</Label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold uppercase text-muted-foreground/60">DNI / RUC</Label>
                                    <Input
                                        placeholder="00000000"
                                        className="h-10 text-sm font-medium"
                                        value={clientDoc}
                                        onChange={(e) => setClientDoc(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold uppercase text-muted-foreground/60">Nombre</Label>
                                    <Input
                                        placeholder="Nombre Completo"
                                        className="h-10 text-sm font-medium"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold uppercase text-muted-foreground/60">Teléfono</Label>
                                <PhoneInput
                                    placeholder="+51 987 654 321"
                                    defaultCountry="PE"
                                    className="h-10 text-sm font-medium"
                                    value={clientPhone}
                                    onChange={(value) => setClientPhone(value || "")}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Estados */}
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estado Pago</Label>
                                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                    <SelectTrigger className="h-10 font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="parcial">P. Parcial</SelectItem>
                                        <SelectItem value="pagado">P. Total</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estado Pedido</Label>
                                <Select value={orderStatus} onValueChange={setOrderStatus}>
                                    <SelectTrigger className="h-10 font-medium">
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
                        <Card className="bg-muted/30 border-none shadow-none">
                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-primary uppercase tracking-widest">Adelanto</Label>
                                    <Input
                                        type="number"
                                        className="h-11 font-bold text-lg bg-background"
                                        value={advancePayment}
                                        onChange={(e) => setAdvancePayment(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-destructive uppercase tracking-widest">Faltante</Label>
                                    <div className="h-11 flex items-center justify-center bg-background rounded-md font-bold text-lg border">
                                        S/ {balanceDue.toFixed(2)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Envio */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/5 capitalize">
                                <Checkbox
                                    id="shipping"
                                    checked={configureShipping}
                                    onCheckedChange={(val) => setConfigureShipping(!!val)}
                                />
                                <Label htmlFor="shipping" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Configurar Envío / Courier</Label>
                            </div>

                            {configureShipping && (
                                <Card className="bg-accent/5 overflow-hidden">
                                    <CardContent className="p-4 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black uppercase">Tipo de Cobro</Label>
                                            <div className="flex bg-muted p-1 rounded-md">
                                                <Button
                                                    variant={shippingType === "adicional" ? "default" : "ghost"}
                                                    size="sm"
                                                    className="h-7 text-[9px] font-black uppercase px-3"
                                                    onClick={() => setShippingType("adicional")}
                                                >Adicional</Button>
                                                <Button
                                                    variant={shippingType === "incluido" ? "secondary" : "ghost"}
                                                    size="sm"
                                                    className="h-7 text-[9px] font-black uppercase px-3 ml-1"
                                                    onClick={() => setShippingType("incluido")}
                                                >Incluido</Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Costo Envío</Label>
                                                <Input
                                                    type="number"
                                                    className="h-9 font-bold"
                                                    value={shippingCost}
                                                    onChange={(e) => setShippingCost(Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Courier</Label>
                                                <Select value={courier} onValueChange={setCourier}>
                                                    <SelectTrigger className="h-9 font-medium">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SHALOM">SHALOM</SelectItem>
                                                        <SelectItem value="OLVA">OLVA CURRIER</SelectItem>
                                                        <SelectItem value="MOTORIZADO">MOTORIZADO</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Provincia / Dpto</Label>
                                                <Input
                                                    className="h-9 text-xs"
                                                    value={province}
                                                    onChange={(e) => setProvince(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Destino / Agencia</Label>
                                                <Input
                                                    className="h-9 text-xs"
                                                    value={destination}
                                                    onChange={(e) => setDestination(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-primary" />
                                                <Label className="text-[10px] font-black uppercase">Datos de Seguimiento ({courier})</Label>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Input
                                                    placeholder="Nro. Orden"
                                                    className="h-9 text-xs"
                                                    value={courierOrder}
                                                    onChange={(e) => setCourierOrder(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Código"
                                                    className="h-9 text-xs"
                                                    value={courierCode}
                                                    onChange={(e) => setCourierCode(e.target.value)}
                                                />
                                            </div>
                                            <Input
                                                placeholder="Clave"
                                                type="password"
                                                className="h-9 text-xs"
                                                value={courierPass}
                                                onChange={(e) => setCourierPass(e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <Separator />

                        {/* Carrito List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carrito ({cart.length})</Label>
                            </div>
                            {cart.length === 0 ? (
                                <Card className="bg-muted/20 border-dashed border-2">
                                    <CardContent className="h-24 flex flex-col items-center justify-center text-muted-foreground/40 space-y-1 p-0">
                                        <ShoppingCart className="h-6 w-6" />
                                        <p className="text-[10px] uppercase font-bold">Venta vacía</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <Card key={item.id} className="bg-muted/10 border-none shadow-none group relative overflow-hidden">
                                            <CardContent className="p-3 flex gap-3">
                                                <div className="w-16 h-20 bg-muted/40 rounded flex-shrink-0 relative overflow-hidden">
                                                    {item.imagen ? (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.imagen}`}
                                                            alt={item.nombre}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : <Package className="h-5 w-5 m-auto absolute inset-0 opacity-20" />}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                                    <div className="space-y-1">
                                                        <h4 className="text-[11px] font-black uppercase truncate leading-tight">{item.nombre}</h4>
                                                        {item.variantes_producto && (
                                                            <div className="flex flex-wrap gap-1">
                                                                <Badge variant="outline" className="text-[8px] h-4 px-1 leading-none uppercase">Var: Seleccionada</Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center bg-background rounded border h-7">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-none p-0"
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                            ><Minus className="h-3 w-3" /></Button>
                                                            <span className="text-xs w-6 text-center font-bold px-1">{item.quantity}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-none p-0"
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                            ><Plus className="h-3 w-3" /></Button>
                                                        </div>
                                                        <div className="font-black text-xs text-primary">S/ {Number(item.precio_venta).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background border"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer Totals */}
                <div className="p-6 border-t bg-muted/5 space-y-6">
                    <Card className="bg-background/80 border-dashed border-muted shadow-none">
                        <CardContent className="p-3 flex items-center justify-between">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ajuste Total</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground">S/</span>
                                <Input
                                    type="number"
                                    className="h-8 w-20 font-bold text-center"
                                    value={adjustment}
                                    onChange={(e) => setAdjustment(Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-end justify-between px-1">
                        <div className="space-y-1">
                            <Label className="text-[11px] font-black text-muted-foreground uppercase opacity-50">Monto Total</Label>
                            <p className="text-[9px] font-medium text-muted-foreground italic leading-none">IGV Incluido</p>
                        </div>
                        <div className="text-4xl font-black text-primary tracking-tighter tabular-nums">
                            S/ {totalWithAdjustments.toFixed(2)}
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 text-sm font-black tracking-widest uppercase shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center justify-center gap-3"
                        disabled={cart.length === 0 || isProcessing}
                        onClick={handleCheckout}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                FINALIZAR VENTA
                                <CreditCard className="h-5 w-5" />
                            </>
                        )}
                    </Button>
                </div>
            </div>


        </div>
    );
}

