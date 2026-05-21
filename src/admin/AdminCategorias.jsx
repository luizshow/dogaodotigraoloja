import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import AdminLayout from "./AdminLayout";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [nomeForm, setNomeForm] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from("categorias").select("*, produtos(count)").order("ordem");
    setCategorias(cats || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const mostrarMsg = (texto, tipo = "sucesso") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg(null), 3000);
  };

  const abrirNova = () => { setNomeForm(""); setModal("nova"); };
  const abrirEditar = (c) => { setCategoriaSelecionada(c); setNomeForm(c.nome); setModal("editar"); };
  const abrirExcluir = (c) => { setCategoriaSelecionada(c); setModal("excluir"); };
  const fecharModal = () => { setModal(null); setCategoriaSelecionada(null); setNomeForm(""); };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);

    if (modal === "nova") {
      const maxOrdem = categorias.length ? Math.max(...categorias.map((c) => c.ordem)) : 0;
      const { error } = await supabase.from("categorias").insert({ nome: nomeForm, ordem: maxOrdem + 1, ativa: true });
      if (error) mostrarMsg("Erro ao criar categoria.", "erro");
      else mostrarMsg("Categoria criada! ✅");
    } else {
      const { error } = await supabase.from("categorias").update({ nome: nomeForm }).eq("id", categoriaSelecionada.id);
      if (error) mostrarMsg("Erro ao renomear.", "erro");
      else mostrarMsg("Categoria atualizada! ✅");
    }

    await load();
    fecharModal();
    setSalvando(false);
  };

  const handleExcluir = async () => {
    setSalvando(true);
    const totalProdutos = categoriaSelecionada.produtos?.[0]?.count || 0;
    if (totalProdutos > 0) {
      mostrarMsg(`Não é possível excluir: há ${totalProdutos} produto(s) nesta categoria.`, "erro");
      fecharModal();
      setSalvando(false);
      return;
    }
    const { error } = await supabase.from("categorias").delete().eq("id", categoriaSelecionada.id);
    if (error) mostrarMsg("Erro ao excluir.", "erro");
    else mostrarMsg("Categoria excluída.");
    await load();
    fecharModal();
    setSalvando(false);
  };

  const moverOrdem = async (id, direcao) => {
    const idx = categorias.findIndex((c) => c.id === id);
    const outro = categorias[idx + direcao];
    if (!outro) return;

    await Promise.all([
      supabase.from("categorias").update({ ordem: outro.ordem }).eq("id", id),
      supabase.from("categorias").update({ ordem: categorias[idx].ordem }).eq("id", outro.id),
    ]);
    await load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black">Categorias</h2>
          <p className="text-neutral-400 mt-1">{categorias.length} categoria(s) cadastrada(s)</p>
        </div>
        <button onClick={abrirNova} className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white hover:brightness-110 active:scale-95 transition">
          + Nova categoria
        </button>
      </div>

      {msg && (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${msg.tipo === "erro" ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30"}`}>
          {msg.texto}
        </div>
      )}

      {loading ? <p className="text-neutral-400">Carregando...</p> : (
        <div className="rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-neutral-400">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Ordem</th>
                <th className="text-left px-4 py-4 font-semibold">Nome</th>
                <th className="text-left px-4 py-4 font-semibold">Produtos</th>
                <th className="text-right px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c, i) => (
                <tr key={c.id} className={`border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => moverOrdem(c.id, -1)} disabled={i === 0} className="rounded-lg p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition">▲</button>
                      <span className="text-neutral-400 font-mono text-xs w-5 text-center">{c.ordem}</span>
                      <button onClick={() => moverOrdem(c.id, 1)} disabled={i === categorias.length - 1} className="rounded-lg p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition">▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-white">{c.nome}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                      {c.produtos?.[0]?.count || 0} produtos
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => abrirEditar(c)} className="rounded-xl bg-orange-500/20 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/30 transition">
                        Renomear
                      </button>
                      <button onClick={() => abrirExcluir(c)} className="rounded-xl bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30 transition">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal criar/renomear */}
      {(modal === "nova" || modal === "editar") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900 p-8">
            <h3 className="text-xl font-black mb-6">{modal === "nova" ? "Nova categoria" : "Renomear categoria"}</h3>
            <form onSubmit={handleSalvar}>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Nome da categoria</label>
              <input
                type="text" value={nomeForm} onChange={(e) => setNomeForm(e.target.value)} required
                placeholder="Ex: Especiais, Caldos..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500 transition mb-6"
              />
              <div className="flex gap-3">
                <button type="button" onClick={fecharModal} className="flex-1 rounded-2xl border border-white/10 py-3 font-bold text-neutral-300 hover:bg-white/5 transition">Cancelar</button>
                <button type="submit" disabled={salvando} className="flex-1 rounded-2xl bg-orange-500 py-3 font-bold text-white hover:brightness-110 transition disabled:opacity-50">
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal excluir */}
      {modal === "excluir" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900 p-8 text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-xl font-black mb-2">Excluir categoria</h3>
            <p className="text-neutral-400 mb-6">Tem certeza que deseja excluir <span className="font-bold text-white">"{categoriaSelecionada?.nome}"</span>? Categorias com produtos não podem ser excluídas.</p>
            <div className="flex gap-3">
              <button onClick={fecharModal} className="flex-1 rounded-2xl border border-white/10 py-3 font-bold text-neutral-300 hover:bg-white/5 transition">Cancelar</button>
              <button onClick={handleExcluir} disabled={salvando} className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white hover:brightness-110 transition disabled:opacity-50">
                {salvando ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
