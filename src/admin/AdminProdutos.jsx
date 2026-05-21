import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import AdminLayout from "./AdminLayout";

const FORM_VAZIO = { nome: "", descricao: "", preco: "", categoria_id: "", imagem_url: "", badge: "" };

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'novo' | 'editar' | 'excluir'
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("produtos").select("*, categorias(nome)").order("nome"),
      supabase.from("categorias").select("*").order("ordem"),
    ]);
    setProdutos(p || []);
    setCategorias(c || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const produtosFiltrados = produtos.filter((p) => {
    const catOk = filtroCategoria === "todas" || p.categoria_id === filtroCategoria;
    const statusOk = filtroStatus === "todos" || (filtroStatus === "ativo" ? p.ativo : !p.ativo);
    return catOk && statusOk;
  });

  const abrirNovo = () => { setForm(FORM_VAZIO); setModal("novo"); };
  const abrirEditar = (p) => { setForm({ ...p, preco: String(p.preco) }); setProdutoSelecionado(p); setModal("editar"); };
  const abrirExcluir = (p) => { setProdutoSelecionado(p); setModal("excluir"); };
  const fecharModal = () => { setModal(null); setProdutoSelecionado(null); setForm(FORM_VAZIO); };

  const mostrarMsg = (texto, tipo = "sucesso") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const dados = { nome: form.nome, descricao: form.descricao, preco: parseFloat(form.preco), categoria_id: form.categoria_id, imagem_url: form.imagem_url, badge: form.badge };

    if (modal === "novo") {
      const { error } = await supabase.from("produtos").insert({ ...dados, ativo: true });
      if (error) mostrarMsg("Erro ao criar produto.", "erro");
      else mostrarMsg("Produto criado com sucesso! ✅");
    } else {
      const { error } = await supabase.from("produtos").update({ ...dados, atualizado_em: new Date() }).eq("id", produtoSelecionado.id);
      if (error) mostrarMsg("Erro ao salvar.", "erro");
      else mostrarMsg("Produto atualizado! ✅");
    }

    await load();
    fecharModal();
    setSalvando(false);
  };

  const handleToggleAtivo = async (produto) => {
    await supabase.from("produtos").update({ ativo: !produto.ativo, atualizado_em: new Date() }).eq("id", produto.id);
    mostrarMsg(produto.ativo ? "Produto desativado." : "Produto ativado! ✅");
    await load();
  };

  const handleExcluir = async () => {
    setSalvando(true);
    const { error } = await supabase.from("produtos").delete().eq("id", produtoSelecionado.id);
    if (error) mostrarMsg("Erro ao excluir.", "erro");
    else mostrarMsg("Produto excluído.");
    await load();
    fecharModal();
    setSalvando(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black">Produtos</h2>
          <p className="text-neutral-400 mt-1">{produtosFiltrados.length} produto(s) encontrado(s)</p>
        </div>
        <button onClick={abrirNovo} className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white hover:brightness-110 active:scale-95 transition">
          + Novo produto
        </button>
      </div>

      {msg && (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${msg.tipo === "erro" ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30"}`}>
          {msg.texto}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-orange-500">
          <option value="todas">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-orange-500">
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {/* Tabela */}
      {loading ? <p className="text-neutral-400">Carregando...</p> : (
        <div className="rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-neutral-400">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Produto</th>
                <th className="text-left px-4 py-4 font-semibold">Categoria</th>
                <th className="text-left px-4 py-4 font-semibold">Preço</th>
                <th className="text-left px-4 py-4 font-semibold">Status</th>
                <th className="text-right px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((p, i) => (
                <tr key={p.id} className={`border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imagem_url && <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 rounded-xl object-cover" />}
                      <div>
                        <div className="font-semibold text-white">{p.nome}</div>
                        {p.badge && <span className="text-xs text-orange-400">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-neutral-300">{p.categorias?.nome}</td>
                  <td className="px-4 py-4 font-bold text-white">R$ {Number(p.preco).toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.ativo ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleToggleAtivo(p)} className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-white/5 transition">
                        {p.ativo ? "Desativar" : "Ativar"}
                      </button>
                      <button onClick={() => abrirEditar(p)} className="rounded-xl bg-orange-500/20 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/30 transition">
                        Editar
                      </button>
                      <button onClick={() => abrirExcluir(p)} className="rounded-xl bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30 transition">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {produtosFiltrados.length === 0 && (
            <div className="py-12 text-center text-neutral-500">Nenhum produto encontrado.</div>
          )}
        </div>
      )}

      {/* Modal criar/editar */}
      {(modal === "novo" || modal === "editar") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-900 p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black mb-6">{modal === "novo" ? "Novo produto" : "Editar produto"}</h3>
            <form onSubmit={handleSalvar} className="space-y-4">
              {[
                { label: "Nome", name: "nome", type: "text", required: true },
                { label: "Descrição", name: "descricao", type: "text" },
                { label: "Preço (R$)", name: "preco", type: "number", required: true, step: "0.01" },
                { label: "URL da imagem", name: "imagem_url", type: "text" },
                { label: "Badge (ex: Especial, Novo)", name: "badge", type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-neutral-300 mb-1">{f.label}</label>
                  <input
                    type={f.type} name={f.name} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    required={f.required} step={f.step}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1">Categoria</label>
                <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} required
                  className="w-full rounded-2xl border border-white/10 bg-neutral-800 px-4 py-3 text-white outline-none focus:border-orange-500 transition">
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              {form.imagem_url && (
                <img src={form.imagem_url} alt="preview" className="w-full h-40 object-cover rounded-2xl" onError={(e) => e.target.style.display = "none"} />
              )}
              <div className="flex gap-3 pt-2">
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
            <h3 className="text-xl font-black mb-2">Excluir produto</h3>
            <p className="text-neutral-400 mb-6">Tem certeza que deseja excluir <span className="font-bold text-white">"{produtoSelecionado?.nome}"</span>? Esta ação é permanente.</p>
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
