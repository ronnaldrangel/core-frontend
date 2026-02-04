---
name: flujos-negocio-rangel
description: Gestor de la lógica de negocio específica del ERP Rangel. Especialista en flujos de pedidos, logística, numeración secuencial y generación de documentos.
---

# Flujos de Negocio Rangel

## Cuándo usar este skill
- Al implementar nuevas reglas de negocio (ej. descuentos por volumen en POS).
- Al modificar el proceso de creación/actualización de pedidos.
- Al configurar integraciones de logística (ej. Shalom, Guías de Envío).
- Al gestionar la lógica de "Correlativos" (numeración secuencial por workspace).

## Inputs necesarios
- Regla de negocio detallada (ej. "¿Cómo se calcula el Pack 2?").
- Contexto del WorkspaceId.
- Estado actual de las colecciones involucradas (`orders`, `products`, `settings`).

## Workflow
1) **Definición de Lógica**: Desglosar la regla en pasos lógicos atómicos.
2) **Implementación en Backend**: Crear los campos necesarios en Directus y configurar los Flows de incremento.
3) **Lógica de Frontend**: Adaptar los componentes (ej. POS, OrderTable) para reflejar las nuevas reglas.
4) **Validación**: Probar escenarios límite (ej. cantidades negativas, cambio de estatus masivo).

## Instrucciones
- **Consistencia**: Mantener el formato de numbering (ej. `N° 0001`) consistente en toda la app.
- **Trazabilidad**: Asegurar que cada cambio de estado quede registrado en el historial de Directus.
- **Precisión**: En cálculos financieros (precios, descuentos), usar redondeo estándar y validar totales.
- **Contexto**: SIEMPRE filtrar por `workspaceId` para evitar fuga de datos entre clientes.

## Output (formato exacto)
- Documentación del flujo lógico o diagrama de pasos.
- Código de implementación (Frontend + Backend).
- Checklist de validación para el usuario.
