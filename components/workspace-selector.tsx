"use client";

import { useState } from "react";
import { Search, Plus, Building2, ChevronRight, Boxes } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Workspace {
    id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    members?: any[];
    // Campos simulados para UI por ahora
    plan?: string;
    projectCount?: number;
}

interface WorkspaceSelectorProps {
    initialWorkspaces: Workspace[];
    userName?: string;
    userEmail?: string;
}

export function WorkspaceSelector({ initialWorkspaces, userName, userEmail }: WorkspaceSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar workspaces
    const filteredWorkspaces = initialWorkspaces.filter(ws =>
        ws.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Tus Espacios de Trabajo</h1>
                    <p className="text-muted-foreground mt-1">Selecciona una organización para continuar</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar organización..."
                            className="pl-9 bg-background/50 border-input text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 font-medium">
                        <Plus className="h-4 w-4" />
                        Nueva organización
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredWorkspaces.length > 0 ? (
                    filteredWorkspaces.map((workspace) => (
                        <Link key={workspace.id} href={`/dashboard?workspace=${workspace.id}`}>
                            <div className="group relative flex items-center p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer">
                                <div className="flex-shrink-0 mr-4">
                                    <div
                                        className={cn(
                                            "h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg",
                                            !workspace.color && "bg-gradient-to-br from-blue-600 to-purple-600"
                                        )}
                                        style={workspace.color ? { backgroundColor: workspace.color } : {}}
                                    >
                                        {workspace.icon ? (
                                            // Aquí idealmente renderizarías un icono dinámico, pero por ahora usamos iniciales
                                            workspace.name.charAt(0).toUpperCase()
                                        ) : (
                                            workspace.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-semibold text-foreground truncate group-hover:text-blue-500 transition-colors">
                                            {workspace.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                        <span>{workspace.plan || "Free Plan"}</span>
                                        <span className="w-1 h-1 rounded-full bg-foreground/20" />
                                        <span>{workspace.projectCount || 0} proyectos</span>
                                        {workspace.description && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-foreground/20" />
                                                <span className="truncate max-w-[200px]">{workspace.description}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-shrink-0 ml-4 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Boxes className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron organizaciones</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                            {searchTerm ? "Intenta con otro término de búsqueda." : "Aún no eres miembro de ninguna organización."}
                        </p>
                        {!searchTerm && (
                            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
                                Crear mi primera organización
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
