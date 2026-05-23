import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const links = [
    { to: "/admin/dashboard",  label: "Dashboard",  icon: "📊" },
    { to: "/admin/produtos",   label: "Produtos",   icon: "🌭" },
    { to: "/admin/categorias", label: "Categorias", icon: "📂" },
  ];

  const ativo = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-950 text-white lg:flex">

      {/* ═══ OVERLAY mobile ═══ */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-white/10 bg-neutral-900
          transition-transform duration-300 ease-in-out
          ${menuAberto ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:w-64 lg:translate-x-0 lg:shrink-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <div className="text-2xl leading-none">🌭</div>
            <p className="mt-1 font-black text-sm leading-tight">Dogão do Tigrão</p>
            <p className="text-[11px] text-neutral-400">Painel Admin</p>
          </div>
          <button
            onClick={() => setMenuAberto(false)}
            className="rounded-xl p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto space-y-1 p-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuAberto(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                ativo(l.to)
                  ? "bg-orange-500 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Footer da sidebar */}
        <div className="border-t border-white/10 space-y-1 p-3">
          <Link
            to="/"
            onClick={() => setMenuAberto(false)}
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

      {/* ═══ ÁREA PRINCIPAL ═══ */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Top bar — só mobile */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-neutral-900/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMenuAberto(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-300 hover:bg-white/10 transition"
            aria-label="Abrir menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="text-sm font-black flex-1">
            {links.find((l) => ativo(l.to))?.icon}{" "}
            {links.find((l) => ativo(l.to))?.label ?? "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
          >
            Sair
          </button>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ═══ BOTTOM NAV — alternativa compacta para mobile ═══ */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex border-t border-white/10 bg-neutral-900 lg:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-semibold transition ${
              ativo(l.to) ? "text-orange-400" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span className="text-lg leading-none">{l.icon}</span>
            {l.label}
          </Link>
        ))}
        <Link
          to="/"
          className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-semibold text-neutral-500 hover:text-neutral-300 transition"
        >
          <span className="text-lg leading-none">🔗</span>
          Cardápio
        </Link>
      </nav>

      {/* Espaço para o bottom nav não cobrir conteúdo */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
