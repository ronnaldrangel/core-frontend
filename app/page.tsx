import { auth } from "@/auth";
import { LogOut, User, LayoutDashboard, Settings, Bell, Search } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Sidebar Placeholder */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/[0.02] border-r border-white/[0.05] p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">DirectOS</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all">
            <Search className="w-5 h-5" />
            <span className="font-medium">Explorar</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notificaciones</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Ajustes</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hola, {user?.first_name || "Usuario"} 👋</h1>
            <p className="text-gray-500">Bienvenido de nuevo a tu panel de control.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.05] px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-gray-500">Conectado</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-3xl">
            <h3 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Estado del Backend</h3>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xl font-semibold">Directus Online</p>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-3xl">
            <h3 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Tu Rol</h3>
            <p className="text-xl font-semibold capitalize">{user?.role?.name || "Administrador"}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-3xl">
            <h3 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Instancia</h3>
            <p className="text-xl font-semibold truncate">Prueba Directus</p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/[0.05] p-8 rounded-[2rem] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">¡Todo listo!</h2>
            <p className="text-gray-300 max-w-xl mb-6">
              Tu frontend de Next.js ahora está completamente integrado con el backend de Directus mediante Auth.js y el SDK oficial.
            </p>
            <a
              href="https://prueba-directus.jgr9ya.easypanel.host/admin"
              target="_blank"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all font-sans"
            >
              Abrir Admin Directus
            </a>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -mr-20 -mt-20" />
        </div>
      </main>
    </div>
  );
}
