import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Mail, Shield } from "lucide-react";

export default function MembersPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        Miembros
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los miembros y permisos del equipo.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Invitar Miembro
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Equipo del Workspace</CardTitle>
                    <CardDescription>
                        Todos los miembros con acceso a este espacio de trabajo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: "Tú", email: "tu@email.com", role: "Admin", isOwner: true },
                            { name: "Juan Pérez", email: "juan@email.com", role: "Editor", isOwner: false },
                            { name: "María García", email: "maria@email.com", role: "Viewer", isOwner: false },
                        ].map((member, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground">{member.name}</p>
                                            {member.isOwner && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                                    Propietario
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> {member.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                                        <Shield className="h-3 w-3" /> {member.role}
                                    </span>
                                    {!member.isOwner && (
                                        <Button variant="ghost" size="sm">
                                            Editar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
