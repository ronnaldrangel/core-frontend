---
name: diseno-premium-erp
description: Especialista en implementación técnica de componentes UI premium. Se enfoca en animaciones avanzadas, efectos visuales complejos y optimización de rendimiento.
---

# Diseño Premium ERP (Skill Especializada)

## Cuándo usar este skill
- Cuando se necesite implementar animaciones complejas (parallax, scroll-driven, keyframes).
- Cuando se requiera optimizar el rendimiento de componentes pesados (virtualization, lazy loading).
- Cuando se diseñen componentes críticos de alta visibilidad (Dashboard principal, Onboarding, Landing pages internas).

## Inputs necesarios
- Objetivo estético específico (ej. "Hero section con efecto parallax").
- Restricciones de rendimiento (ej. "Debe cargar en menos de 1.5s").
- Dispositivos objetivo (Desktop, Mobile, Tablet).

## Workflow
1. **Análisis de Jerarquía Visual**: Identificar el elemento protagonista de la vista.
2. **Diseño de Animaciones**: Definir keyframes, easing functions y triggers (scroll, hover, mount).
3. **Implementación Optimizada**: Usar `will-change`, `transform` y `opacity` para animaciones performantes.
4. **Testing Cross-Browser**: Verificar en Chrome, Firefox, Safari y Edge.

## Instrucciones Técnicas

### Animaciones Performantes:
```css
/* ✅ BIEN - GPU accelerated */
.elemento {
  transform: translateX(0);
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ❌ MAL - CPU bound */
.elemento {
  left: 0;
  transition: left 0.3s;
}
```

### Glassmorphism Avanzado:
```tsx
<div className="
  bg-background/80 
  backdrop-blur-xl 
  border border-border/10 
  shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]
  rounded-2xl
">
  {/* contenido */}
</div>
```

### Micro-interacciones:
- **Hover states**: `hover:scale-105 transition-transform duration-200`
- **Focus states**: `focus-visible:ring-2 ring-primary/50 ring-offset-2`
- **Loading states**: Usar skeleton loaders con shimmer effect

### Responsive Design:
- **Mobile First**: Empezar con diseño mobile, luego escalar a desktop.
- **Breakpoints**: `sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px`
- **Touch targets**: Botones mínimo 44x44px en mobile.

## Output
- Código TSX del componente con comentarios explicativos.
- Archivo CSS adicional si hay keyframes complejas.
- Checklist de performance (LCP, CLS, FID).

## Recursos
Ver carpeta `recursos/` para:
- Paletas de colores OKLCH pre-configuradas
- Biblioteca de animaciones reutilizables
- Ejemplos de componentes premium de referencia
