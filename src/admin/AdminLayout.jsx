import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/produtos", label: "Produtos", icon: "🌭" },
    { to: "/admin/categorias", label: "Categorias", icon: "📂" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 bg-neutral-900 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-3xl mb-1">🌭</div>
          <h1 className="font-black text-lg leading-tight">Dogão do Tigrão</h1>
          <p className="text-neutral-400 text-xs mt-0.5">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                location.pathname === link.to
                  ? "bg-orange-500 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-400 hover:bg-white/5 hover:text-white transition"
          >
            <span>🔗</span> Ver cardápio
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
