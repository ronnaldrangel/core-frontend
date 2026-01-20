import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getWorkspace } from "@/lib/workspace-actions";
import WorkspaceDetailClient from "./WorkspaceDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function WorkspaceDetailPage({ params }: PageProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { id } = await params;
    const result = await getWorkspace(id);

    if (result.error || !result.data) {
        notFound();
    }

    return (
        <WorkspaceDetailClient
            workspace={result.data}
            currentUserId={session.user.id}
            currentUserEmail={session.user.email || ""}
        />
    );
}
