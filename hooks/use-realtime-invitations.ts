"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDirectusSubscription } from "./use-directus-subscription";
import { WorkspaceInvitation, getPendingInvitations } from "@/lib/invitation-actions";

export function useRealtimeInvitations(initialInvitations: WorkspaceInvitation[]) {
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
    const [invitations, setInvitations] = useState<WorkspaceInvitation[]>(initialInvitations);

    useEffect(() => {
        setInvitations(initialInvitations);
    }, [initialInvitations]);

    const refresh = useCallback(async () => {
        if (!userId) return;
        const result = await getPendingInvitations();
        if (result.data) setInvitations(result.data);
        router.refresh();
    }, [userId, router]);

    const subscriptionQuery = useMemo(() => ({ fields: ['id'] }), []);

    useDirectusSubscription({
        collection: 'workspace_invitations',
        query: subscriptionQuery,
        onMessage: refresh
    });

    return { invitations, setInvitations };
}
