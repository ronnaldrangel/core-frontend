---
description: Crear un nuevo componente UI premium desde cero
---

# Workflow: Nuevo Componente UI

Este workflow define los pasos exactos para crear un componente visual en el ERP siguiendo las reglas globales.

## Cuándo ejecutar este workflow
- Cuando el usuario pida "crear un nuevo componente X"
- Cuando necesites añadir una sección nueva al Dashboard
- Cuando diseñes un formulario, modal o card desde cero

---

## Paso 1: Planificación
**Objetivo**: Definir la estructura y el propósito del componente.

**Preguntas a responder**:
- ¿Qué datos mostrará?
- ¿Es interactivo (botones, inputs) o solo visual?
- ¿Necesita estado local o se conecta con Directus?
- ¿Es un Server Component o Client Component?

**Output**: Descripción en 2-3 líneas del componente y su ubicación en `components/`.

---

## Paso 2: Crear el archivo del componente
**Ubicación**: `components/[categoria]/[nombre-componente].tsx`

**Template inicial**:
```tsx
"use client"; // solo si necesita interactividad

import { cn } from "@/lib/utils";

interface NombreComponenteProps {
  // Define las props aquí
}

export function NombreComponente({ ...props }: NombreComponenteProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-xl border border-border/10 rounded-2xl p-6",
      "shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]",
      "transition-all duration-200 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.18)]"
    )}>
      {/* Tu contenido aquí */}
    </div>
  );
}
```

---

## Paso 3: Aplicar estilos premium
**Checklist de diseño**:
- [ ] Usar variables semánticas (`--primary`, `--accent`, `--muted`)
- [ ] Implementar glassmorphism (`backdrop-blur-xl`, `bg-card/80`)
- [ ] Añadir micro-animaciones (`hover:scale-105`, `transition-transform`)
- [ ] Verificar espaciado generoso (`gap-4`, `p-6`)
- [ ] Tipografía jerárquica clara (`text-base`, `text-muted-foreground`)

---

## Paso 4: Integrar datos (si aplica)
Si el componente necesita datos de Directus:

1. Crear/verificar Server Action en `lib/[nombre]-actions.ts`
2. Definir tipos en `types/[nombre].ts`
3. Asegurarse de filtrar por `workspaceId`

**Ejemplo**:
```tsx
// En el componente
import { getItems } from "@/lib/items-actions";

export async function NombreComponente({ workspaceId }: Props) {
  const items = await getItems(workspaceId);
  
  return (
    // renderizar items...
  );
}
```

---

## Paso 5: Testing básico
// turbo
```bash
npm run dev
```

**Verificar**:
- [ ] El componente se renderiza sin errores
- [ ] Las animaciones funcionan suavemente
- [ ] Los datos se cargan correctamente (si aplica)
- [ ] Responsive design funciona en mobile

---

## Paso 6: Exportar y documentar
1. Añadir export en `components/index.ts` (si existe)
2. Añadir comentario JSDoc al componente con descripción breve
3. Si es complejo, crear ejemplo de uso en el mismo archivo

**Ejemplo de JSDoc**:
```tsx
/**
 * Componente que muestra una tarjeta con efecto glassmorphism.
 * 
 * @example
 * <NombreComponente 
 *   titulo="Mi Tarjeta" 
 *   descripcion="Contenido aquí" 
 * />
 */
export function NombreComponente({ ...props }: Props) {
  // ...
}
```

---

## Notas
- Este workflow NO requiere confirmación en cada paso (usa // turbo-all implícito para comandos)
- Si el componente es crítico (POS, Pagos, Logística), pedir revisión antes del Paso 4
- Si el diseño no se ve "premium" al terminar, revisar GLOBAL.md y aplicar correcciones
