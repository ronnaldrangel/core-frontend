# Paleta de Colores OKLCH (Premium)

Utilizar estas variables para mantener la consistencia estética del ERP Rangel.

## Base Tokens
- **Background**: `oklch(1 0 0)` (Light) / `oklch(0.145 0 0)` (Dark)
- **Foreground**: `oklch(0.145 0 0)` (Light) / `oklch(0.985 0 0)` (Dark)

## Brand Colors
- **Primary**: `oklch(0.205 0 0)` -> Negro profundo/Elegancia.
- **Secondary**: `oklch(0.97 0 0)` -> Gris ultra-claro para contraste suave.
- **Accent**: `oklch(0.97 0 0)` -> Utilizado en hover y estados activos.
- **Destructive**: `oklch(0.577 0.245 27.325)` -> Rojo vibrante para errores/peligros.

## Glassmorphism Formula
- **Border**: `oklch(0.922 0 0)` con ~10% opacidad.
- **Background**: `bg-background/60` con `@apply backdrop-blur-md`.
- **Shadow**: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`.
