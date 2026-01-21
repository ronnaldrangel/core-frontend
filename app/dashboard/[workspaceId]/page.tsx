import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Activity,
    Users,
    DollarSign,
    Box,
    ArrowRight,
    Clock,
    Settings
} from "lucide-react";
import Link from "next/link";

interface DashboardWorkspacePageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function DashboardWorkspacePage({ params }: DashboardWorkspacePageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId } = await params; // This is now the slug
    const { data: workspace } = await getWorkspaceBySlug(workspaceId);

    // Si no hay workspace, el layout ya manejó el notFound()
    if (!workspace) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm text-white text-xl"
                            style={{ backgroundColor: workspace.color || "#6366F1" }}
                        >
                            {workspace.icon === 'boxes' ? <Box className="h-5 w-5" /> : (workspace.name?.[0]?.toUpperCase() || "W")}
                        </div>
                        {workspace.name}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {workspace.description || "Vista general de tu espacio de trabajo."}
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/dashboard/${workspace.slug}/settings`}>
                        <Settings className="mr-2 h-4 w-4" /> Configuración
                    </Link>
                </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% respecto al mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Miembros</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{workspace.members?.length || 1}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 nuevos esta semana
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            3 por entregar pronto
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actividad</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 acciones esta semana
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Proyectos Recientes</CardTitle>
                        <CardDescription>
                            Tienes 3 proyectos cercanos a la fecha de entrega.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                            P{i}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Rediseño de Plataforma {i}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Actualizado hace 2h
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/dashboard/${workspace.slug}/projects`}>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Miembros del Equipo</CardTitle>
                        <CardDescription>
                            Gestiona el acceso a este workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {workspace.members && workspace.members.length > 0 ? (
                                workspace.members.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                                                {member.user_id?.first_name?.[0] || "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{member.user_id?.first_name} {member.user_id?.last_name}</p>
                                                <p className="text-xs text-muted-foreground">{member.user_id?.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                                            {member.role}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {session.user.first_name?.[0] || "Y"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Tú (Propietario)</p>
                                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                        Admin
                                    </div>
                                </div>
                            )}

                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link href={`/dashboard/${workspace.slug}/members`}>
                                    <Users className="mr-2 h-4 w-4" /> Invitar Miembros
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
