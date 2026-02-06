// Tipos para el sistema de mensajería de pedidos

export interface OrderMessage {
    id: string;
    message: string;
    order_id: string;
    workspace_id: string;
    user_created: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar?: string;
    };
    date_created: string;
}

export interface OrderWithMessages {
    id: string;
    correlativo: string;
    cliente_id: {
        nombre_completo: string;
    };
    total: number;
    estado_pedido: string;
    messages?: OrderMessage[];
    unread_count?: number;
}
