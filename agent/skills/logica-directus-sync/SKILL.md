---
name: logica-directus-sync
description: Experto en sincronización de datos entre Directus CMS y el frontend de Next.js. Asegura integridad de tipos, manejo de errores y automatización de flujos de trabajo.
---

# Lógica Directus Sync

## Cuándo usar este skill
- Cuando se añadan nuevos campos o colecciones en Directus.
- Cuando se necesite crear o modificar Server Actions (`lib/actions.ts`).
- Cuando haya problemas de sincronización entre backend y frontend.
- Al configurar Directus Flows para automatización de lógica.

## Inputs necesarios
- Nombre de la colección en Directus.
- Estructura de campos (Schema).
- Relaciones (M2O, O2M, M2M).
- Requerimientos de automatización (ej. numbering secuencial).

## Workflow
1) **Validación de Schema**: Usar herramientas MCP para leer el estado actual de la base de datos.
2) **Mapeo de Tipos**: Definir interfaces TypeScript precisas para los items devueltos.
3) **Implementación de Actions**: Crear funciones de fetch/mutation con revalidatePath de Next.js.
4) **Pruebas de Flujo**: Verificar que los triggers en Directus (Flows) respondan correctamente a los eventos.

## Instrucciones
- **Seguridad**: Nunca expongas tokens de admin en el cliente; usa siempre variables de entorno.
- **Eficiencia**: Usa el parámetro `fields` en las queries para traer solo la data necesaria.
- **Relaciones**: Maneja correctamente las relaciones anidadas (ej. `author.*` o `sections.item:headings.title`).
- **Estados**: Implementar estados de carga y manejo de errores consistente en el frontend.

## Output (formato exacto)
- Código de Server Action (`actions.ts`).
- Definición de tipos/interfaces TS.
- Configuración sugerida para Directus Flows si aplica.
