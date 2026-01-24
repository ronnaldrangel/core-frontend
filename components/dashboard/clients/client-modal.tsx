"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient, updateClient, Client, checkDniExists, lookupDni } from "@/lib/client-actions";
import {
    DEPARTAMENTOS,
    getProvinciasByDepartamento,
    getDistritosByProvincia,
    Provincia,
    Distrito
} from "@/lib/peru-locations";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import type { E164Number } from "libphonenumber-js/core";
import { cn } from "@/lib/utils";

const clientSchema = z.object({
    nombre_completo: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    telefono: z.string().optional().or(z.literal("")),
    direccion: z.string().optional().or(z.literal("")),
    documento_identificacion: z.string().min(1, "El DNI/RUC es obligatorio"),
    tipo_cliente: z.enum(["persona", "empresa"]),
    departamento: z.string().optional().or(z.literal("")),
    provincia: z.string().optional().or(z.literal("")),
    distrito: z.string().optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client?: Client | null;
    workspaceId: string;
    onSuccess: (client: Client) => void;
}

export function ClientModal({
    isOpen,
    onClose,
    client,
    workspaceId,
    onSuccess,
}: ClientModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLookingUpDni, setIsLookingUpDni] = useState(false);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    const [openDepartamento, setOpenDepartamento] = useState(false);

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            nombre_completo: "",
            email: "",
            telefono: "",
            direccion: "",
            documento_identificacion: "",
            tipo_cliente: "persona",
            departamento: "",
            provincia: "",
            distrito: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (client) {
                form.reset({
                    nombre_completo: client.nombre_completo || "",
                    email: client.email || "",
                    telefono: client.telefono || "",
                    direccion: client.direccion || "",
                    documento_identificacion: client.documento_identificacion || "",
                    tipo_cliente: (client.tipo_cliente as "persona" | "empresa") || "persona",
                    departamento: client.departamento || "",
                    provincia: client.provincia || "",
                    distrito: client.distrito || "",
                });

                // Cargar provincias y distritos si el cliente ya tiene esos datos
                if (client.departamento) {
                    setProvincias(getProvinciasByDepartamento(client.departamento));
                }
                if (client.provincia) {
                    setDistritos(getDistritosByProvincia(client.provincia));
                }
            } else {
                form.reset({
                    nombre_completo: "",
                    email: "",
                    telefono: "",
                    direccion: "",
                    documento_identificacion: "",
                    tipo_cliente: "persona",
                    departamento: "",
                    provincia: "",
                    distrito: "",
                });
                setProvincias([]);
                setDistritos([]);
            }
        }
    }, [client, form, isOpen]);

    // Manejar cambio de departamento
    const handleDepartamentoChange = (departamentoId: string) => {
        if (!departamentoId) {
            setProvincias([]);
            setDistritos([]);
            return;
        }

        const provs = getProvinciasByDepartamento(departamentoId);
        setProvincias(provs);
        setDistritos([]);
    };

    // Manejar cambio de provincia
    const handleProvinciaChange = (provinciaId: string) => {
        if (!provinciaId) {
            setDistritos([]);
            return;
        }

        const dists = getDistritosByProvincia(provinciaId);
        setDistritos(dists);
    };

    // Manejar búsqueda automática de DNI
    const handleDniLookup = async (dni: string) => {
        // Solo buscar si tiene exactamente 8 dígitos y es tipo persona
        if (dni.length !== 8 || !/^\d{8}$/.test(dni)) {
            return;
        }

        // Solo autocompletar para personas, no para empresas (RUC tiene 11 dígitos)
        const tipoCliente = form.getValues("tipo_cliente");
        if (tipoCliente !== "persona") {
            return;
        }

        try {
            setIsLookingUpDni(true);
            const data = await lookupDni(dni);

            if (data && data.full_name) {
                // Formatear el nombre: convertir de "APELLIDO1 APELLIDO2 NOMBRES" a formato legible
                const nombreFormateado = data.full_name
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');

                form.setValue("nombre_completo", nombreFormateado);
                toast.success("Datos encontrados y completados automáticamente");
            }
        } catch (error) {
            // Si hay error, simplemente no hacemos nada (silencioso)
            console.error("Error en búsqueda de DNI:", error);
        } finally {
            setIsLookingUpDni(false);
        }
    };

    const onSubmit = async (values: ClientFormValues) => {
        try {
            setIsLoading(true);

            // Verificar si el DNI ya existe en este workspace
            const dniExists = await checkDniExists(
                workspaceId,
                values.documento_identificacion,
                client?.id // Excluir el cliente actual si estamos editando
            );

            if (dniExists) {
                toast.error("Ya existe un cliente con este DNI/RUC en este workspace");
                setIsLoading(false);
                return;
            }

            const data = {
                ...values,
                workspace_id: workspaceId,
            };

            if (client) {
                const { data: updated, error } = await updateClient(client.id, data);
                if (error) {
                    throw new Error(error);
                }
                toast.success("Cliente actualizado con éxito");
                onSuccess(updated!);
            } else {
                const { data: created, error } = await createClient(data);
                if (error) {
                    throw new Error(error);
                }
                toast.success("Cliente creado con éxito");
                onSuccess(created!);
            }
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {client ? "Editar Cliente" : "Nuevo Cliente"}
                    </DialogTitle>
                    <DialogDescription>
                        Ingresa los datos básicos para gestionar la información de tu cliente.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* 1. DNI/RUC - Ancho completo */}
                        <FormField
                            control={form.control}
                            name="documento_identificacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>DNI / RUC</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="12345678"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleDniLookup(e.target.value);
                                                }}
                                            />
                                            {isLookingUpDni && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 2. Tipo de Cliente (25%) + Nombre Completo (75%) */}
                        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 3fr' }}>
                            <FormField
                                control={form.control}
                                name="tipo_cliente"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Cliente</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="persona">Persona</SelectItem>
                                                <SelectItem value="empresa">Empresa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nombre_completo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan Pérez" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 3. Email (izquierda) + Teléfono (derecha) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="juan@ejemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                placeholder="+51 987 654 321"
                                                defaultCountry="PE"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 4. Departamento - Ancho completo con buscador */}
                        <FormField
                            control={form.control}
                            name="departamento"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Departamento</FormLabel>
                                    <Popover open={openDepartamento} onOpenChange={setOpenDepartamento}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openDepartamento}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? DEPARTAMENTOS.find(
                                                            (dep) => dep.id === field.value
                                                        )?.nombre
                                                        : "Selecciona departamento"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Buscar departamento..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontró departamento.</CommandEmpty>
                                                    <CommandGroup>
                                                        {DEPARTAMENTOS.map((dep) => (
                                                            <CommandItem
                                                                value={dep.nombre}
                                                                key={dep.id}
                                                                onSelect={() => {
                                                                    field.onChange(dep.id);
                                                                    handleDepartamentoChange(dep.id);
                                                                    form.setValue("provincia", "");
                                                                    form.setValue("distrito", "");
                                                                    setOpenDepartamento(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        dep.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {dep.nombre}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 5. Provincia (izquierda) + Distrito (derecha) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="provincia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provincia</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleProvinciaChange(value);
                                                form.setValue("distrito", "");
                                            }}
                                            value={field.value}
                                            disabled={!form.watch("departamento")}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            !form.watch("departamento")
                                                                ? "Selecciona departamento primero"
                                                                : "Selecciona provincia"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {provincias.map((prov) => (
                                                    <SelectItem key={prov.id} value={prov.id}>
                                                        {prov.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="distrito"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Distrito</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={!form.watch("provincia")}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            !form.watch("provincia")
                                                                ? "Selecciona provincia primero"
                                                                : "Selecciona distrito"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {distritos.map((dist) => (
                                                    <SelectItem key={dist.id} value={dist.id}>
                                                        {dist.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 6. Dirección - Al final */}
                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Calle, Número, Referencia..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {client ? "Actualizar" : "Crear"} Cliente
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
