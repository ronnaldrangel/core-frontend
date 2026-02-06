"use client";

import type { OrderMessage } from "@/types/messages";
import { getOrderMessages } from "./message-actions";

/**
 * Suscribirse a nuevos mensajes usando polling (consultas periódicas)
 * Más simple y confiable que WebSockets para este caso de uso
 */
export function subscribeToOrderMessages(
    orderId: string,
    workspaceId: string,
    onNewMessages: (newMessages: OrderMessage[]) => void,
    onError?: (error: any) => void,
    intervalMs: number = 5000 // Consultar cada 5 segundos
) {
    let lastCheckTime = new Date().toISOString();
    let isActive = true;

    const poll = async () => {
        if (!isActive) return;

        try {
            const result = await getOrderMessages(orderId, workspaceId);

            if (result.error) {
                if (onError) onError(result.error);
                return;
            }

            if (result.data) {
                // Filtrar solo mensajes nuevos (posteriores al último check)
                const newMessages = result.data.filter(
                    (msg) => msg.date_created > lastCheckTime
                );

                if (newMessages.length > 0) {
                    lastCheckTime = new Date().toISOString();
                    onNewMessages(newMessages);
                }
            }
        } catch (error) {
            console.error("Polling error:", error);
            if (onError) onError(error);
        }

        // Programar siguiente consulta
        if (isActive) {
            setTimeout(poll, intervalMs);
        }
    };

    // Iniciar polling después de un pequeño delay
    const timeoutId = setTimeout(poll, intervalMs);

    // Retornar función para detener polling
    return () => {
        isActive = false;
        clearTimeout(timeoutId);
    };
}

/**
 * Reproducir sonido de notificación
 */
export function playNotificationSound() {
    try {
        const audioCtx = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Sonido tipo "ding" suave
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.3
        );

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.error("Audio not supported", e);
    }
}
