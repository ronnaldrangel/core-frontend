import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  // Si el usuario está autenticado, redirigir a workspaces
  if (session?.user) {
    redirect("/workspaces");
  }

  // Página de Landing para usuarios no autenticados
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
        <LayoutDashboard className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
        DirectOS
      </h1>
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
