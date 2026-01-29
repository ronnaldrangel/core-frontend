import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/workspace-actions";
import { getCategoriesByWorkspace } from "@/lib/category-actions";
import { CategoryList } from "@/components/dashboard/categories/category-list";

interface CategoriesPageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { workspaceId: slug } = await params;

    // Buscar workspace por slug para obtener el ID real
    const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(slug);

    if (workspaceError || !workspace) {
        notFound();
    }

    // Obtener categorías usando el ID del workspace
    const { data: categories, error: categoriesError } = await getCategoriesByWorkspace(workspace.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
                <p className="text-muted-foreground">
                    Gestiona las categorías de productos de {workspace.name}
                </p>
            </div>

            <CategoryList
                initialCategories={categories || []}
                workspaceId={workspace.id}
                workspaceSlug={workspace.slug}
            />
        </div>
    );
}
