import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getProductsByWorkspace } from "@/lib/product-actions";
import { getMyPermissions } from "@/lib/rbac-actions";
import { ProductList } from "@/components/dashboard/products/product-list";

interface ProductsPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;

    // Buscar workspace por slug para obtener el ID real
    const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        notFound();
    }

    // Verificar permisos
    const permissions = await getMyPermissions(workspace.id);
    if (!permissions.includes("*") && !permissions.includes("products.read")) {
        redirect(`/dashboard/${slug}`);
    }

    // Obtener productos usando el ID del workspace
    const { data: products, error: productsError } = await getProductsByWorkspace(workspace.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
                <p className="text-muted-foreground">
                    Gestiona el inventario de {workspace.name}
                </p>
            </div>

            <ProductList
                initialProducts={products || []}
                workspaceId={workspace.id}
                workspaceSlug={workspace.slug}
            />
        </div>
    );
}
