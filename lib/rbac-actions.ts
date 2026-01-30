"use server";

import { directusAdmin } from "./directus";
import { readItems } from "@directus/sdk";
import { auth } from "@/auth";

export interface Permission {
    key: string;
    description: string;
}

/**
 * Obtiene los permisos del usuario actual en un workspace específico.
 * Utiliza el nuevo sistema RBAC granular.
 */
export async function getMyPermissions(workspaceId: string): Promise<string[]> {
    try {
        const session = await auth();
        if (!session?.user?.id) return [];

        const userId = session.user.id;

        // 1. Obtener el miembro del workspace y su rol asociado (con permisos)
        const members = await directusAdmin.request(
            readItems("workspaces_members", {
                filter: {
                    _and: [
                        { workspace_id: { _eq: workspaceId } },
                        { user_id: { _eq: userId } }
                    ]
                },
                fields: [
                    "role_id.permissions.permission_key"
                ],
                limit: 1
            })
        );

        if (!members || members.length === 0) {
            // Si es el owner (y no está en la tabla members), por defecto tiene todo.
            // Pero lo ideal es que el owner también esté en members o manejarlo aparte.
            const workspace = await directusAdmin.request(
                readItems("workspaces", {
                    filter: {
                        _and: [
                            { id: { _eq: workspaceId } },
                            { owner: { _eq: userId } }
                        ]
                    },
                    fields: ["id"]
                })
            );

            if (workspace && workspace.length > 0) {
                // El owner tiene permisos totales (podemos devolver un flag o lista completa)
                return ["*"];
            }
            return [];
        }

        const member = members[0] as any;

        // Si no tiene un rol asignado (todavía usa el sistema viejo de string), devolvemos vacío
        // para forzar la migración o podemos mapear los viejos.
        if (!member.role_id) return [];

        const permissions = member.role_id.permissions?.map((p: any) => p.permission_key) || [];
        return permissions;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return [];
    }
}

/**
 * Obtiene todos los roles RBAC globales y los específicos de un workspace.
 */
export async function getAllRoles(workspaceId?: string) {
    try {
        const roles = await directusAdmin.request(
            readItems("rbac_roles", {
                filter: {
                    _or: [
                        { workspace_id: { _null: true } },
                        ...(workspaceId ? [{ workspace_id: { _eq: workspaceId } }] : [])
                    ]
                },
                fields: ["id", "name", "workspace_id"]
            })
        );

        return { data: roles };
    } catch (error) {
        console.error("Error fetching roles:", error);
        return { error: "Error al obtener los roles" };
    }
}
