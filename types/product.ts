export interface Product {
    id: string;
    nombre: string;
    sku: string;
    precio_venta: number | null;
    precio_compra: number | null;
    imagen: string | null;
    descripcion_corta: string | null;
    descripcion_normal: string | null;
    stock: number;
    variantes_producto: any[] | null;
}
