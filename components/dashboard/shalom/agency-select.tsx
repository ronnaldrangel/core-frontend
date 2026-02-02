"use client";

import * as React from "react";
import { Check, Loader2, MapPin, Search, X, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ShalomAgency } from "@/lib/shalom-actions";

interface ShalomAgencySelectProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    // External filters from client info
    externalDept?: string;
    externalProv?: string;
    externalDist?: string;
}

export function ShalomAgencySelect({
    value,
    onValueChange,
    className,
    externalDept,
    externalProv,
    externalDist,
}: ShalomAgencySelectProps) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [allAgencies, setAllAgencies] = React.useState<ShalomAgency[]>([]);
    const [agencies, setAgencies] = React.useState<ShalomAgency[]>([]);
    const [search, setSearch] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);

    const fetchAgencies = React.useCallback(async (query: string) => {
        try {
            setLoading(true);
            setError(null);
            // We fetch the full list if query is empty or just generic results
            const response = await fetch(`/api/shalom/agencias?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                const results = Array.isArray(data) ? data : [];

                if (query === "") {
                    setAllAgencies(results);
                }

                setAgencies(results);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Error al cargar agencias");
            }
        } catch (error) {
            console.error("Error fetching agencies:", error);
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    }, []);

    // Load agencies when opening the dialog
    React.useEffect(() => {
        if (open && allAgencies.length === 0) {
            fetchAgencies("");
        }
    }, [open, fetchAgencies, allAgencies.length]);

    // Apply external filters and search
    React.useEffect(() => {
        if (allAgencies.length === 0) return;

        let filtered = [...allAgencies];

        // Aplicar búsqueda local en el modal (incluye nombre, dirección, departamento, provincia y distrito)
        if (search) {
            const lowSearch = search.toLowerCase();
            filtered = filtered.filter(a =>
                a.nombre.toLowerCase().includes(lowSearch) ||
                a.direccion.toLowerCase().includes(lowSearch) ||
                (a.departamento && a.departamento.toLowerCase().includes(lowSearch)) ||
                (a.provincia && a.provincia.toLowerCase().includes(lowSearch)) ||
                (a.distrito && a.distrito.toLowerCase().includes(lowSearch))
            );
        }

        setAgencies(filtered);
    }, [externalDept, externalProv, externalDist, search, allAgencies]);

    const handleSelect = (agency: ShalomAgency) => {
        onValueChange(agency.nombre);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-background border rounded-md cursor-pointer hover:bg-accent/50 transition-all text-left group",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 truncate">
                        <MapPin className={cn("h-4 w-4 shrink-0 transition-colors", value ? "text-primary" : "opacity-40")} />
                        <span className="truncate font-medium">
                            {value || "Seleccionar agencia Shalom..."}
                        </span>
                    </div>
                    <Search className="h-4 w-4 shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] p-0 gap-0 overflow-hidden shadow-2xl border-primary/10">
                <DialogHeader className="p-5 border-b bg-gradient-to-r from-primary/5 to-transparent">
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            Agencias Shalom
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 bg-muted/20 border-b space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrar por nombre o dirección..."
                            className="pl-9 bg-background h-10 shadow-sm border-primary/20 focus-visible:ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-primary/10">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg m-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-xs font-bold">{error}</p>
                        </div>
                    )}

                    {loading && agencies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                                Cargando agencias...
                            </p>
                        </div>
                    ) : agencies.length > 0 ? (
                        <div className="space-y-2 pb-4">
                            <div className="px-3 py-1 text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                Mostrando {agencies.length} agencias sugeridas
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-1">
                                {agencies.map((agency) => {
                                    const toTitleCase = (str: string) => {
                                        if (!str) return "";
                                        return str.toLowerCase().split(' ').map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ');
                                    };

                                    return (
                                        <button
                                            key={agency.id || agency.nombre + agency.direccion}
                                            onClick={() => handleSelect(agency)}
                                            className={cn(
                                                "flex flex-col items-start gap-1 p-3 text-left rounded-xl transition-all hover:bg-primary/5 group relative border border-muted/50 hover:border-primary/20 bg-background/50",
                                                value === agency.nombre && "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                                            )}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <MapPin className={cn(
                                                        "h-3 w-3 shrink-0 transition-colors",
                                                        value === agency.nombre ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60"
                                                    )} />
                                                    <span className="font-bold text-[11px] uppercase tracking-tight group-hover:text-primary transition-colors leading-tight truncate">
                                                        {agency.lugar_over || agency.nombre}
                                                    </span>
                                                </div>
                                                {value === agency.nombre && (
                                                    <div className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-[7px] font-bold uppercase tracking-widest shrink-0">
                                                        OK
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                                <span className="text-[10px] text-muted-foreground font-medium line-clamp-2 leading-snug">
                                                    {toTitleCase(agency.direccion)}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-muted/30">
                                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black tracking-tighter">
                                                        {toTitleCase(agency.departamento || "")}
                                                    </span>
                                                    <span className="text-[8px] text-muted-foreground/60 font-medium tracking-tighter truncate">
                                                        {toTitleCase(agency.distrito || "")}, {toTitleCase(agency.provincia || "")}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-muted-foreground/20" />
                            </div>
                            <p className="text-sm font-bold text-muted-foreground">
                                No hay agencias en esta zona
                            </p>
                            <p className="text-[10px] text-muted-foreground/50 mt-2">
                                Intenta buscando por nombre en el cuadro de arriba.
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
                        Búsqueda global habilitada: busca por nombre de agencia o ciudad
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
