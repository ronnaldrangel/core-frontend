import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/profile-actions";
import { ProfileClient } from "./profile-client";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { data: profile, error } = await getCurrentUser();

    if (error || !profile) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navbar */}
            <header className="border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/workspaces">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-white">D</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">DirectOS</span>
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
                <div className="max-w-3xl mx-auto px-6">
                    <ProfileClient profile={profile} directusUrl={process.env.NEXT_PUBLIC_DIRECTUS_URL || ""} />
                </div>
            </main>
        </div>
    );
}
