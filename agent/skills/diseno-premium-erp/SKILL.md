---
name: diseno-premium-erp
description: Especialista en la creación de interfaces premium para el ERP Rangel, enfocándose en estética visual de alto impacto, minimalismo moderno y micro-interacciones fluidas.
---

# Diseño Premium ERP

## Cuándo usar este skill
- Cuando se cree un nuevo componente de UI en el frontend.
- Cuando se necesite mejorar la estética de una página existente (ej. Dashboard, Tablas).
- Cuando el usuario pida un diseño que deba "asombrar" visualmente.

## Inputs necesarios
- Objetivo estético (ej. "Modo oscuro glassmorphism").
- Frameworks en uso (Next.js, Tailwind v4).
- Tokens de diseño actuales (Variables OKLCH en globals.css).

## Workflow
1) **Análisis de Jerarquía**: Definir qué elemento es el protagonista de la vista.
2) **Aplicación de Glassmorphism**: Uso de bordes sutiles (10-15% opacidad) y fondos con blur.
3) **Refinamieno de Color**: Utilizar exclusivamente la paleta OKLCH para gradientes armónicos.
4) **Micro-animaciones**: Añadir transiciones suaves en hover y entradas de componentes.

## Instrucciones
- **Fidelidad Visual**: No uses colores base (red-500). Usa variables semánticas `--primary`, `--accent`.
- **Efectos Premium**: Implementa `backdrop-filter: blur()` y sombras suaves con `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`.
- **Tipografía**: Mantener la jerarquía clara usando `font-medium` para títulos y `text-muted-foreground` para detalles secundarios.
- **Espaciado**: Ser generoso con el whitespace para evitar el ruido visual (clutter).

## Output (formato exacto)
- Código TSX del componente con clases de Tailwind v4.
- Archivo CSS adicional si es necesario para animaciones complejas.
- Explicación de las decisiones de diseño tomadas.
