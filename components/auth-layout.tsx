import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface AuthLayoutProps {
    children: React.ReactNode
    imageSrc?: string
    imageAlt?: string
}

export default function AuthLayout({
    children,
    imageSrc = "/login-bg.png",
    imageAlt = "Background Image",
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo height={32} width={130} />
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 1024px) 0vw, 50vw"
                    className="object-cover dark:brightness-[0.4] dark:grayscale-0"
                    priority
                />
            </div>
        </div>
    )
}
