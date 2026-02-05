---
description: Sincronizar cambios del schema de Directus con el frontend
---

# Workflow: Sincronizar Directus Schema

Este workflow se ejecuta cuando se añaden campos, colecciones o relaciones en Directus y necesitas reflejarlos en el frontend.

## Cuándo ejecutar
- Después de crear/modificar colecciones en Directus
- Cuando añades campos nuevos a una colección existente
- Cuando cambias relaciones (M2O, O2M, M2M)
- Cuando el usuario reporte que "los datos no se ven en el frontend"

---

## Paso 1: Verificar el schema en Directus
**Herramienta**: Usar las tools MCP de Directus.

**Acción**:
```typescript
// Leer el schema de la colección
mcp_remote-directus_schema({ keys: ["nombre_coleccion"] })
```

**Output esperado**: Estructura completa de campos, tipos y relaciones.

---

## Paso 2: Actualizar interfaces TypeScript
**Ubicación**: `types/[nombre-coleccion].ts`

**Mapeo de tipos Directus → TypeScript**:
- `uuid` → `string`
- `string` → `string`
- `text` → `string`
- `integer` → `number`
- `float`/`decimal` → `number`
- `boolean` → `boolean`
- `timestamp`/`datetime` → `string` (ISO 8601)
- `json` → `any` o tipo específico si conoces la estructura

**Ejemplo**:
```typescript
export interface Order {
  id: string;
  order_number: string;
  client_name: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  workspace_id: string;
  
  // Relaciones
  items?: OrderItem[];
  courier?: Courier;
}
```

---

## Paso 3: Crear/actualizar Server Actions
**Ubicación**: `lib/[nombre]-actions.ts`

**Template de Server Action**:
```typescript
"use server";

import { mcp_remote_directus_items } from "@/lib/mcp-tools";
import { revalidatePath } from "next/cache";

export async function getItems(workspaceId: string) {
  const result = await mcp_remote_directus_items({
    action: "read",
    collection: "nombre_coleccion",
    query: {
      fields: ["id", "campo1", "campo2", "relacion.*"],
      filter: {
        workspace_id: { _eq: workspaceId }
      }
    }
  });
  
  return result.data || [];
}

export async function createItem(data: Partial<TuTipo>) {
  const result = await mcp_remote_directus_items({
    action: "create",
    collection: "nombre_coleccion",
    data: [data]
  });
  
  revalidatePath("/dashboard/[workspaceId]/ruta");
  return result.data?.[0];
}

export async function updateItem(id: string, data: Partial<TuTipo>) {
  const result = await mcp_remote_directus_items({
    action: "update",
    collection: "nombre_coleccion",
    keys: [id],
    data: [data]
  });
  
  revalidatePath("/dashboard/[workspaceId]/ruta");
  return result.data?.[0];
}
```

---

## Paso 4: Actualizar componentes afectados
**Identificar componentes**: Buscar referencias a la colección en el código.

// turbo
```bash
rg "nombre_coleccion" --type ts --type tsx
```

**Acciones**:
1. Verificar que usen las nuevas interfaces TypeScript
2. Añadir los nuevos campos en los renders
3. Actualizar formularios si hay campos nuevos

---

## Paso 5: Testing de sincronización
// turbo
```bash
npm run dev
```

**Verificar**:
- [ ] Los datos nuevos se muestran correctamente
- [ ] No hay errores de tipos en la consola
- [ ] Las mutaciones (crear/editar/eliminar) funcionan
- [ ] Los filtros por `workspaceId` están activos

---

## Paso 6: Validar build
// turbo
```bash
npm run build
```

**Si hay errores de tipos**:
- Revisar que todas las interfaces estén actualizadas
- Verificar que los Server Actions retornen tipos correctos
- Comprobar que los componentes no usen propiedades inexistentes

---

## Notas
- **SIEMPRE** filtrar por `workspaceId` en las queries (regla global)
- Si añades relaciones complejas (M2M, M2A), consultar el skill `logica-directus-sync`
- Si el schema tiene lógica de negocio crítica (correlativos, descuentos), consultar el skill `flujos-negocio-rangel`
