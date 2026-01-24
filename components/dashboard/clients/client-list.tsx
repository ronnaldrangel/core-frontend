"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MoreHorizontal,
    Plus,
    Search,
    User,
    Mail,
    Phone,
    CreditCard,
    Star
} from "lucide-react";
import { Client, deleteClient } from "@/lib/client-actions";
import { ClientModal } from "./client-modal";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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

interface ClientListProps {
    initialClients: Client[];
    workspaceId: string;
}

export function ClientList({ initialClients, workspaceId }: ClientListProps) {
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
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar cliente..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => {
                    setEditingClient(null);
                    setIsModalOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead className="hidden md:table-cell">Contacto</TableHead>
                            <TableHead className="hidden lg:table-cell">Identificación</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No se encontraron clientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="font-medium">
                                                {client.nombre_completo}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        <div className="flex flex-col gap-1 text-xs">
                                            {client.email && (
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {client.email}
                                                </div>
                                            )}
                                            {client.telefono && (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {client.telefono}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell font-mono text-xs">
                                        {client.documento_identificacion || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getBadgeColor(client.tipo_cliente)}>
                                            {client.tipo_cliente === "persona" ? "Persona" : "Empresa"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground uppercase">
                                        {client.distrito || client.departamento ? (
                                            <>
                                                {client.distrito && <span>{client.distrito}</span>}
                                                {client.distrito && client.departamento && <span>, </span>}
                                                {client.departamento && <span>{client.departamento}</span>}
                                            </>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingClient(client);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => setClientToDelete(client)}
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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
                            <span className="font-bold">{clientToDelete?.nombre_completo}</span> de tu base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
