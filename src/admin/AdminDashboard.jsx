import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ produtos: 0, categorias: 0, ativos: 0, inativos: 0 });
  const [porCategoria, setPorCategoria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: produtos }, { data: categorias }] = await Promise.all([
        supabase.from("produtos").select("*, categorias(nome)"),
        supabase.from("categorias").select("*").order("ordem"),
      ]);

      const ativos = produtos?.filter((p) => p.ativo).length || 0;
      const inativos = (produtos?.length || 0) - ativos;

      const porCat = categorias?.map((cat) => ({
        nome: cat.nome,
        total: produtos?.filter((p) => p.categoria_id === cat.id).length || 0,
        ativos: produtos?.filter((p) => p.categoria_id === cat.id && p.ativo).length || 0,
      }));

      setStats({ produtos: produtos?.length || 0, categorias: categorias?.length || 0, ativos, inativos });
      setPorCategoria(porCat || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-black">Dashboard</h2>
        <p className="text-neutral-400 mt-1">Visão geral do cardápio</p>
      </div>

      {loading ? (
        <p className="text-neutral-400">Carregando...</p>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total de produtos", value: stats.produtos, icon: "🌭", color: "orange" },
              { label: "Categorias", value: stats.categorias, icon: "📂", color: "blue" },
              { label: "Ativos", value: stats.ativos, icon: "✅", color: "green" },
              { label: "Inativos", value: stats.inativos, icon: "⏸️", color: "red" },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-3xl font-black">{card.value}</div>
                <div className="text-neutral-400 text-sm mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Produtos por categoria */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Produtos por categoria</h3>
            <div className="space-y-3">
              {porCategoria.map((cat) => (
                <div key={cat.nome} className="flex items-center justify-between">
                  <span className="text-neutral-300 font-semibold">{cat.nome}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-green-400">{cat.ativos} ativos</span>
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                      {cat.total} produtos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atalhos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: "/admin/produtos", label: "Gerenciar produtos", icon: "🌭", desc: "Adicionar, editar ou excluir" },
              { to: "/admin/categorias", label: "Gerenciar categorias", icon: "📂", desc: "Criar e organizar categorias" },
              { to: "/", label: "Ver cardápio público", icon: "🔗", desc: "Como o cliente vê o site" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-orange-400/50 hover:bg-white/10 transition group"
              >
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="font-bold group-hover:text-orange-400 transition">{a.label}</div>
                <div className="text-neutral-400 text-sm mt-0.5">{a.desc}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
