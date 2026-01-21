import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default async function Home() {
  const session = await auth();

  // Si el usuario está autenticado, redirigir a workspaces
  if (session?.user) {
    redirect("/workspaces");
  }

  // Página de Landing para usuarios no autenticados
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <Logo width={200} height={60} className="mb-6 h-auto w-48 md:w-64" />
      <p className="text-xl text-muted-foreground max-w-lg mb-8">
        Gestiona tus proyectos y equipos de forma eficiente.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/login">
            Iniciar Sesión <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
