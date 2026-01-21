"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    type?: "full" | "icon";
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ type = "full", className, width, height }: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className={cn("animate-pulse bg-muted rounded", className)}
                style={{ width: width || (type === "full" ? 120 : 32), height: height || 32 }}
            />
        );
    }

    const isDark = resolvedTheme === "dark";
    const src = type === "icon"
        ? (isDark ? "/logos/icon_white.png" : "/logos/icon_black.png")
        : (isDark ? "/logos/logo_white.png" : "/logos/logo_black.png");

    return (
        <img
            src={src}
            alt={type === "icon" ? "DirectOS Icon" : "DirectOS Logo"}
            width={width}
            height={height}
            className={cn("object-contain", className)}
            style={{
                width: width ? `${width}px` : (type === "full" ? "auto" : "32px"),
                height: height ? `${height}px` : "32px",
                display: "block"
            }}
        />
    );
}
