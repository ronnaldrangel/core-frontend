import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWorkspaces } from "@/lib/workspace-actions";

// Este archivo redirige a /dashboard/[slug] o a /workspaces
export default async function DashboardIndexPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Obtener los workspaces del usuario
    const { data: workspaces } = await getWorkspaces();

    // Si hay workspaces, redirigir al primero usando su slug
    if (workspaces && workspaces.length > 0) {
        redirect(`/dashboard/${workspaces[0].slug}`);
    }

    // Si no hay workspaces, ir a la página de selección/creación
    redirect("/workspaces");
}
