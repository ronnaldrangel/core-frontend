import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, Clock, ArrowRight } from "lucide-react";

export default function ProjectsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <FolderKanban className="h-8 w-8 text-primary" />
                        Proyectos
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Gestiona todos los proyectos de tu workspace.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                        P{i}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Proyecto de Ejemplo {i}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Actualizado hace {i}h
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                        Activo
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
