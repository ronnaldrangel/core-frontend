import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navbar */}
            <header className="border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild className="gap-2">
                            <Link href="/workspaces">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Volver</span>
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <Logo height={32} width={130} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <UserNav
                            user={{
                                name: session.user.first_name || "Usuario",
                                email: session.user.email,
                                image: session.user.image,
                            }}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
