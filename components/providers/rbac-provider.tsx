"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyPermissions } from '@/lib/rbac-actions';

interface RBACContextType {
    permissions: string[];
    isLoading: boolean;
    hasPermission: (permission: string) => boolean;
    refreshPermissions: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children, workspaceId }: { children: React.ReactNode, workspaceId: string }) {
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const p = await getMyPermissions(workspaceId);
            setPermissions(p);
        } catch (error) {
            setPermissions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceId) {
            fetchPermissions();
        }
    }, [workspaceId]);

    const hasPermission = (permission: string) => {
        if (permissions.includes('*')) return true;
        return permissions.includes(permission);
    };

    return (
        <RBACContext.Provider value={{
            permissions,
            isLoading,
            hasPermission,
            refreshPermissions: fetchPermissions
        }}>
            {children}
        </RBACContext.Provider>
    );
}

export function useRBAC() {
    const context = useContext(RBACContext);
    if (context === undefined) {
        throw new Error('useRBAC must be used within a RBACProvider');
    }
    return context;
}
