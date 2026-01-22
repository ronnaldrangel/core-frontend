"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Static imports are more robust for Next.js Image component
import logoBlack from "@/public/logos/logo_black.png";
import logoWhite from "@/public/logos/logo_white.png";
import iconBlack from "@/public/logos/icon_black.png";
import iconWhite from "@/public/logos/icon_white.png";

interface LogoProps {
    type?: "full" | "icon";
    className?: string;
    width?: number;
    height?: number;
    src?: string;
    initial?: string;
    color?: string;
    priority?: boolean;
}

export function Logo({
    type = "full",
    className,
    width,
    height,
    src,
    initial,
    color,
    priority = true
}: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Placeholder dimensions while mounting
    const defaultWidth = type === "full" ? 140 : 40;
    const defaultHeight = 40;

    if (!mounted) {
        return (
            <div
                className={cn("animate-pulse bg-muted/10 rounded-md", className)}
                style={{
                    width: width || defaultWidth,
                    height: height || defaultHeight
                }}
            />
        );
    }

    const isDark = resolvedTheme === "dark";

    // Select the correct image source
    const logoBlack = (require("@/public/logos/logo_black.png")).default;
    const logoWhite = (require("@/public/logos/logo_white.png")).default;
    const iconBlack = (require("@/public/logos/icon_black.png")).default;
    const iconWhite = (require("@/public/logos/icon_white.png")).default;

    const systemLogoSrc = isDark ? logoWhite : logoBlack;
    const systemIconSrc = isDark ? iconWhite : iconBlack;

    // If we have an initial but no src, we "generate" a default logo identity
    if (!src && initial) {
        return (
            <div className="flex items-center gap-3">
                <div
                    className="flex size-8 items-center justify-center rounded-lg text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: color || "#6366F1" }}
                >
                    {initial[0].toUpperCase()}
                </div>
                {type === "full" && (
                    <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
                        {initial}
                    </span>
                )}
            </div>
        );
    }

    const finalSrc = src || (type === "icon" ? systemIconSrc : systemLogoSrc);

    // Final dimensions for the Image component
    // Next.js requires width/height for external strings
    const finalWidth = width || defaultWidth;
    const finalHeight = height || defaultHeight;

    return (
        <div
            className={cn("relative flex items-center justify-start", className)}
            style={{
                height: finalHeight,
                width: type === "full" ? "auto" : finalWidth
            }}
        >
            <Image
                src={finalSrc}
                alt={type === "icon" ? "DirectOS Icon" : "DirectOS Logo"}
                width={finalWidth}
                height={finalHeight}
                priority={priority}
                className={cn("object-contain transition-all duration-300", className)}
                style={{
                    height: "100%",
                    width: "auto",
                    maxWidth: type === "full" ? "180px" : "40px"
                }}
            />
        </div>
    );
}
