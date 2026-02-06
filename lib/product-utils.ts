/**
 * Utilidades del lado del cliente para productos
 * NO incluye "use server" porque son helpers sincrónicos
 */

import type { Product, ProductVariant } from "./product-actions";

/**
 * Helper para obtener variantes de un producto
 * Soporta tanto el nuevo sistema de relaciones como el JSON legacy
 */
export function getVariants(product: Product): ProductVariant[] {
    // ✅ Primero intentar usar la relación O2M (nuevo sistema)
    if (product.variantes && product.variantes.length > 0) {
        return product.variantes;
    }

    // ⚠️ Fallback al JSON viejo (temporal, para compatibilidad)
    if (product.variantes_producto && product.variantes_producto.length > 0) {
        return product.variantes_producto.map((v: any, idx: number) => ({
            id: `temp-${idx}`, // ID temporal
            workspace_id: product.workspace,
            product_id: product.id,
            nombre: v.nombre,
            sku: v.sku || null,
            precio: v.precio || null,
            stock: v.stock || 0,
            status: 'published' as const
        }));
    }

    return [];
}
