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
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient, updateClient, Client } from "@/lib/client-actions";
import { Loader2 } from "lucide-react";

const clientSchema = z.object({
    nombre_completo: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    documento_identificacion: z.string().optional(),
    tipo_cliente: z.enum(["standard", "vip", "wholesale"]).default("standard"),
    puntos_lealtad: z.coerce.number().default(0),
    fecha_nacimiento: z.string().optional().nullable(),
    notas_preferencias: z.string().optional(),
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

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            nombre_completo: "",
            email: "",
            telefono: "",
            direccion: "",
            documento_identificacion: "",
            tipo_cliente: "standard",
            puntos_lealtad: 0,
            fecha_nacimiento: "",
            notas_preferencias: "",
        },
    });

    useEffect(() => {
        if (client) {
            form.reset({
                nombre_completo: client.nombre_completo || "",
                email: client.email || "",
                telefono: client.telefono || "",
                direccion: client.direccion || "",
                documento_identificacion: client.documento_identificacion || "",
                tipo_cliente: (client.tipo_cliente as any) || "standard",
                puntos_lealtad: client.puntos_lealtad || 0,
                fecha_nacimiento: client.fecha_nacimiento || "",
                notas_preferencias: client.notas_preferencias || "",
            });
        } else {
            form.reset({
                nombre_completo: "",
                email: "",
                telefono: "",
                direccion: "",
                documento_identificacion: "",
                tipo_cliente: "standard",
                puntos_lealtad: 0,
                fecha_nacimiento: "",
                notas_preferencias: "",
            });
        }
    }, [client, form, isOpen]);

    const onSubmit = async (values: ClientFormValues) => {
        try {
            setIsLoading(true);
            const data = {
                ...values,
                workspace_id: workspaceId,
            };

            if (client) {
                const { data: updated, error } = await updateClient(client.id, data);
                if (error) throw new Error(error);
                toast.success("Cliente actualizado con éxito");
                onSuccess(updated!);
            } else {
                const { data: created, error } = await createClient(data);
                if (error) throw new Error(error);
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
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <FormField
                                control={form.control}
                                name="documento_identificacion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RFC / DNI / ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                            <Input placeholder="+52 123 456 7890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tipo_cliente"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Cliente</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="standard">Estándar</SelectItem>
                                                <SelectItem value="vip">VIP</SelectItem>
                                                <SelectItem value="wholesale">Mayorista</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fecha_nacimiento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Nacimiento</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="puntos_lealtad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Puntos de Lealtad</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>Puntos acumulados</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Calle, Número, Ciudad..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notas_preferencias"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas y Preferencias</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detalles sobre gustos o atención especial..."
                                            {...field}
                                        />
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
