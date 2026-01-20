import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWorkspaces } from "@/lib/workspace-actions";
import WorkspacesClient from "./WorkspacesClient";

export default async function WorkspacesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const result = await getWorkspaces();
    const workspaces = result.data || [];

    return (
        <WorkspacesClient
            workspaces={workspaces}
            currentUserId={session.user.id}
        />
    );
}
