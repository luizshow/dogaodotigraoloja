import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import AdminLayout from "./AdminLayout";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [nomeForm, setNomeForm] = useState("");
  const [ordemForm, setOrdemForm] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("categorias").select("*, produtos(count)").order("ordem");
    setCategorias(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toast = (texto, tipo = "sucesso") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg(null), 3500);
  };

  const abrirNova    = () => { setNomeForm(""); setOrdemForm(""); setModal("form"); setSelecionada(null); };
  const abrirEditar  = (c) => { setSelecionada(c); setNomeForm(c.nome); setOrdemForm(String(c.ordem)); setModal("form"); };
  const abrirExcluir = (c) => { setSelecionada(c); setModal("excluir"); };
  const fechar       = () => { setModal(null); setSelecionada(null); setNomeForm(""); setOrdemForm(""); };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    if (!selecionada) {
      const maxOrdem = categorias.length ? Math.max(...categorias.map((c) => c.ordem)) : 0;
      const { error } = await supabase.from("categorias").insert({ nome: nomeForm, ordem: Number(ordemForm) || maxOrdem + 1, ativa: true });
      if (error) toast("Erro: " + error.message, "erro");
      else toast("Categoria criada! ✅");
    } else {
      const { error } = await supabase.from("categorias").update({ nome: nomeForm, ordem: Number(ordemForm) || selecionada.ordem }).eq("id", selecionada.id);
      if (error) toast("Erro: " + error.message, "erro");
      else toast("Categoria atualizada! ✅");
    }
    await load(); fechar(); setSalvando(false);
  };

  const handleExcluir = async () => {
    setSalvando(true);
    const total = selecionada.produtos?.[0]?.count || 0;
    if (total > 0) { toast(`Há ${total} produto(s) nesta categoria. Remova-os primeiro.`, "erro"); fechar(); setSalvando(false); return; }
    const { error } = await supabase.from("categorias").delete().eq("id", selecionada.id);
    if (error) toast("Erro: " + error.message, "erro");
    else toast("Categoria excluída.");
    await load(); fechar(); setSalvando(false);
  };

  const mover = async (id, dir) => {
    const idx = categorias.findIndex((c) => c.id === id);
    const outro = categorias[idx + dir];
    if (!outro) return;
    await Promise.all([
      supabase.from("categorias").update({ ordem: outro.ordem }).eq("id", id),
      supabase.from("categorias").update({ ordem: categorias[idx].ordem }).eq("id", outro.id),
    ]);
    await load();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black sm:text-3xl">Categorias</h2>
          <p className="mt-1 text-sm text-neutral-400">{categorias.length} categoria(s)</p>
        </div>
        <button
          onClick={abrirNova}
          className="w-full rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:brightness-110 active:scale-95 sm:w-auto"
        >
          + Nova categoria
        </button>
      </div>

      {msg && (
        <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
          msg.tipo === "erro"
            ? "border-red-500/30 bg-red-500/10 text-red-400"
            : "border-green-500/30 bg-green-500/10 text-green-400"
        }`}>
          {msg.texto}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-400">Carregando...</p>
      ) : categorias.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-neutral-500">
          Nenhuma categoria ainda. Crie a primeira!
        </div>
      ) : (
        <>
          {/* ── MOBILE: cards ── */}
          <div className="space-y-3 md:hidden">
            {categorias.map((c, i) => (
              <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{c.nome}</p>
                    <span className="mt-1 inline-block rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-400">
                      {c.produtos?.[0]?.count || 0} produtos
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => mover(c.id, -1)} disabled={i === 0}
                      className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-neutral-400 hover:text-white disabled:opacity-20 transition"
                    >▲</button>
                    <button
                      onClick={() => mover(c.id, 1)} disabled={i === categorias.length - 1}
                      className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-neutral-400 hover:text-white disabled:opacity-20 transition"
                    >▼</button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirEditar(c)}
                    className="flex-1 rounded-xl bg-orange-500/20 py-2 text-xs font-semibold text-orange-400 hover:bg-orange-500/30 transition">
                    Editar
                  </button>
                  <button onClick={() => abrirExcluir(c)}
                    className="flex-1 rounded-xl bg-red-500/20 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/30 transition">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP: tabela ── */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-neutral-400">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Ordem</th>
                  <th className="px-4 py-4 text-left font-semibold">Nome</th>
                  <th className="px-4 py-4 text-left font-semibold">Produtos</th>
                  <th className="px-6 py-4 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c, i) => (
                  <tr key={c.id} className={`border-t border-white/5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => mover(c.id, -1)} disabled={i === 0}
                          className="rounded-lg p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition">▲</button>
                        <span className="w-5 text-center font-mono text-xs text-neutral-400">{c.ordem}</span>
                        <button onClick={() => mover(c.id, 1)} disabled={i === categorias.length - 1}
                          className="rounded-lg p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition">▼</button>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">{c.nome}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                        {c.produtos?.[0]?.count || 0} produtos
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => abrirEditar(c)}
                          className="rounded-xl bg-orange-500/20 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/30 transition">
                          Editar
                        </button>
                        <button onClick={() => abrirExcluir(c)}
                          className="rounded-xl bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30 transition">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Modal form (criar/editar) ── */}
      {modal === "form" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-4 sm:items-center sm:pb-0">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <h3 className="mb-6 text-xl font-black">{selecionada ? "Editar categoria" : "Nova categoria"}</h3>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-300">Nome</label>
                <input
                  type="text" value={nomeForm} onChange={(e) => setNomeForm(e.target.value)} required
                  placeholder="Ex: Especiais, Caldos..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-300">Ordem de exibição</label>
                <input
                  type="number" value={ordemForm} onChange={(e) => setOrdemForm(e.target.value)} min="1"
                  placeholder="1, 2, 3..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-orange-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fechar}
                  className="flex-1 rounded-2xl border border-white/10 py-3 font-bold text-neutral-300 transition hover:bg-white/5">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 rounded-2xl bg-orange-500 py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-50">
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal excluir ── */}
      {modal === "excluir" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-4 sm:items-center sm:pb-0">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8 text-center">
            <div className="mb-4 text-4xl">🗑️</div>
            <h3 className="mb-2 text-xl font-black">Excluir categoria</h3>
            <p className="mb-6 text-sm text-neutral-400">
              Tem certeza que deseja excluir{" "}
              <span className="font-bold text-white">"{selecionada?.nome}"</span>?
              Categorias com produtos não podem ser excluídas.
            </p>
            <div className="flex gap-3">
              <button onClick={fechar}
                className="flex-1 rounded-2xl border border-white/10 py-3 font-bold text-neutral-300 transition hover:bg-white/5">
                Cancelar
              </button>
              <button onClick={handleExcluir} disabled={salvando}
                className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-50">
                {salvando ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
