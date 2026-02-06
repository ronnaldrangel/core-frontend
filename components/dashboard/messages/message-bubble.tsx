"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { OrderMessage } from "@/types/messages";

interface MessageBubbleProps {
    message: OrderMessage;
    isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    const initials = `${message.user_created.first_name?.[0] || ""}${message.user_created.last_name?.[0] || ""}`.toUpperCase();

    const avatarUrl = message.user_created.avatar
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${message.user_created.avatar}`
        : undefined;

    return (
        <div
            className={cn(
                "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
                isOwnMessage && "flex-row-reverse"
            )}
        >
            <Avatar className="h-8 w-8 flex-shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={initials} />}
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "flex flex-col gap-1 max-w-[70%]",
                    isOwnMessage && "items-end"
                )}
            >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">
                        {isOwnMessage
                            ? "Tú"
                            : `${message.user_created.first_name} ${message.user_created.last_name}`}
                    </span>
                    <span>•</span>
                    <span>
                        {formatDistanceToNow(new Date(message.date_created), {
                            addSuffix: true,
                            locale: es,
                        })}
                    </span>
                </div>

                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        isOwnMessage
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                    )}
                >
                    <p className="whitespace-pre-wrap break-words">
                        {message.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
