import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <GlobalNav />

            <main className="flex-1 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
