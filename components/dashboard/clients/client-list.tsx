"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Edit,
    Trash2,
    Plus,
    Search,
    User,
    Mail,
    Phone
} from "lucide-react";
import { Client, deleteClient } from "@/lib/client-actions";
import { ClientModal } from "./client-modal";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRBAC } from "@/components/providers/rbac-provider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ClientListProps {
    initialClients: Client[];
    workspaceId: string;
    clientTotals?: Record<string, number>;
}

export function ClientList({ initialClients, workspaceId, clientTotals = {} }: ClientListProps) {
    const { hasPermission } = useRBAC();
    const canCreate = hasPermission("clients.create");
    const canUpdate = hasPermission("clients.update");
    const canDelete = hasPermission("clients.delete");

    const [clients, setClients] = useState<Client[]>(initialClients);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const filteredClients = clients.filter(
        (client) =>
            client.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.documento_identificacion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSuccess = (client: Client) => {
        if (editingClient) {
            setClients(clients.map((c) => (c.id === client.id ? client : c)));
        } else {
            setClients([client, ...clients]);
        }
    };

    const handleDelete = async () => {
        if (!clientToDelete) return;

        try {
            const { error } = await deleteClient(clientToDelete.id);
            if (error) throw new Error(error);

            setClients(clients.filter((c) => c.id !== clientToDelete.id));
            toast.success("Cliente eliminado correctamente");
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar");
        } finally {
            setClientToDelete(null);
        }
    };

    const getBadgeColor = (tipo: string) => {
        switch (tipo) {
            case "persona":
                return "bg-slate-500 hover:bg-slate-600";
            case "empresa":
                return "bg-blue-600 hover:bg-blue-700 font-bold";
            default:
                return "bg-slate-500 hover:bg-slate-600";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="relative flex-1 w-full md:max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar cliente..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {canCreate && (
                    <Button
                        onClick={() => {
                            setEditingClient(null);
                            setIsModalOpen(true);
                        }}
                        className="w-full md:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                )}
            </div>

            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-4 py-3 min-w-[250px]">Cliente</th>
                                <th className="px-4 py-3 hidden md:table-cell">Contacto</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3 text-right">Total Gastado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <User className="h-8 w-8 opacity-20" />
                                            <p>{searchTerm ? "No se encontraron resultados" : "No hay clientes registrados"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground line-clamp-1">
                                                        {client.nombre_completo}
                                                    </span>
                                                    {client.documento_identificacion && (
                                                        <span className="text-xs text-muted-foreground mt-0.5">
                                                            {client.documento_identificacion}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                                            <div className="flex flex-col gap-1 text-xs">
                                                {client.email && (
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <Mail className="h-3.5 w-3.5 shrink-0" />
                                                        {client.email}
                                                    </div>
                                                )}
                                                {client.telefono && (
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <Phone className="h-3.5 w-3.5 shrink-0" />
                                                        {client.telefono}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge className={getBadgeColor(client.tipo_cliente)}>
                                                {client.tipo_cliente === "persona" ? "Persona" : "Empresa"}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-semibold text-foreground">
                                                    S/ {(clientTotals[client.id] || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                {canUpdate && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingClient(client);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setClientToDelete(client)}
                                                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingClient(null);
                }}
                client={editingClient}
                workspaceId={workspaceId}
                onSuccess={handleSuccess}
            />

            <AlertDialog
                open={!!clientToDelete}
                onOpenChange={(open) => !open && setClientToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente al cliente{" "}
                            <span className="font-bold text-foreground">"{clientToDelete?.nombre_completo}"</span> de tu base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar Cliente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
