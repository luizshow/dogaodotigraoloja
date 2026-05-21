import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import AdminLayout from "./AdminLayout";

const FORM_VAZIO = { nome: "", descricao: "", preco: "", categoria_id: "", imagem_url: "", badge: "" };

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState(null);
  const [uploadando, setUploadando] = useState(false);
  const fileInputRef = useRef(null);

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

  // Upload image to Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!tiposPermitidos.includes(file.type)) {
      mostrarMsg("Formato inválido. Use JPG, PNG ou WebP.", "erro");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      mostrarMsg("Imagem muito grande. Máximo 5MB.", "erro");
      return;
    }

    setUploadando(true);
    const ext = file.name.split(".").pop().toLowerCase();
    const fileName = `produto-${Date.now()}.${ext}`;

    // Tenta upload no Supabase Storage
    const { data, error } = await supabase.storage
      .from("produto-imagens")
      .upload(fileName, file, { upsert: true, contentType: file.type });

    if (error) {
      if (error.message.includes("Bucket not found")) {
        mostrarMsg('❌ Bucket não encontrado. Crie o bucket "produto-imagens" no Supabase → Storage.', "erro");
      } else if (error.message.includes("not authorized") || error.message.includes("policy")) {
        mostrarMsg("❌ Sem permissão. Adicione as políticas de storage no Supabase (veja instruções).", "erro");
      } else {
        mostrarMsg("❌ Erro no upload: " + error.message, "erro");
      }
      setUploadando(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const { data: urlData } = supabase.storage
      .from("produto-imagens")
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      mostrarMsg("❌ Erro ao gerar URL pública da imagem.", "erro");
      setUploadando(false);
      return;
    }

    setForm((f) => ({ ...f, imagem_url: urlData.publicUrl }));
    mostrarMsg("✅ Imagem enviada com sucesso!");
    setUploadando(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const dados = {
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      categoria_id: form.categoria_id,
      imagem_url: form.imagem_url,
      badge: form.badge,
    };

    if (modal === "novo") {
      const { error } = await supabase.from("produtos").insert({ ...dados, ativo: true });
      if (error) mostrarMsg("Erro ao criar produto: " + error.message, "erro");
      else mostrarMsg("Produto criado com sucesso! ✅");
    } else {
      const { error } = await supabase.from("produtos").update({ ...dados, atualizado_em: new Date() }).eq("id", produtoSelecionado.id);
      if (error) mostrarMsg("Erro ao salvar: " + error.message, "erro");
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
    if (error) mostrarMsg("Erro ao excluir: " + error.message, "erro");
    else mostrarMsg("Produto excluído.");
    await load();
    fecharModal();
    setSalvando(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black sm:text-3xl">Produtos</h2>
          <p className="text-neutral-400 mt-1 text-sm">{produtosFiltrados.length} produto(s) encontrado(s)</p>
        </div>
        <button
          onClick={abrirNovo}
          className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white hover:brightness-110 active:scale-95 transition w-full sm:w-auto"
        >
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
          className="flex-1 min-w-[160px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-orange-500">
          <option value="todas">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          className="flex-1 min-w-[140px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-orange-500">
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {/* Lista — cards no mobile, tabela no desktop */}
      {loading ? <p className="text-neutral-400">Carregando...</p> : (
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {produtosFiltrados.length === 0 && (
              <div className="py-12 text-center text-neutral-500">Nenhum produto encontrado.</div>
            )}
            {produtosFiltrados.map((p) => (
              <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3 mb-3">
                  {p.imagem_url
                    ? <img src={p.imagem_url} alt={p.nome} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    : <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">🌭</div>
                  }
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{p.nome}</div>
                    {p.badge && <div className="text-xs text-orange-400">{p.badge}</div>}
                    <div className="text-sm text-neutral-400">{p.categorias?.nome}</div>
                  </div>
                  <div className="ml-auto font-bold text-white text-sm whitespace-nowrap">R$ {Number(p.preco).toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.ativo ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {p.ativo ? "Ativo" : "Inativo"}
                  </span>
                  <div className="flex gap-2">
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
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden md:block rounded-3xl border border-white/10 overflow-hidden">
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
                        {p.imagem_url
                          ? <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          : <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">🌭</div>
                        }
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
        </>
      )}

      {/* Modal criar/editar */}
      {(modal === "novo" || modal === "editar") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <h3 className="text-xl font-black mb-6">{modal === "novo" ? "Novo produto" : "Editar produto"}</h3>
            <form onSubmit={handleSalvar} className="space-y-4">
              {[
                { label: "Nome", name: "nome", type: "text", required: true },
                { label: "Descrição", name: "descricao", type: "text" },
                { label: "Preço (R$)", name: "preco", type: "number", required: true, step: "0.01", min: "0" },
                { label: "Badge (ex: Especial, Novo)", name: "badge", type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-neutral-300 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    required={f.required}
                    step={f.step}
                    min={f.min}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
              ))}

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1">Categoria</label>
                <select
                  value={form.categoria_id}
                  onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-neutral-800 px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              {/* Upload de imagem */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Imagem do produto</label>

                {/* Preview */}
                {form.imagem_url && (
                  <div className="mb-3 relative">
                    <img
                      src={form.imagem_url}
                      alt="preview"
                      className="w-full h-40 object-cover rounded-2xl"
                      onError={(e) => e.target.style.display = "none"}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, imagem_url: "" }))}
                      className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-red-500 transition"
                    >
                      ✕ Remover
                    </button>
                  </div>
                )}

                {/* Botão de upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadando}
                  className="w-full rounded-2xl border-2 border-dashed border-white/20 py-4 text-sm text-neutral-400 hover:border-orange-500/50 hover:text-orange-400 transition disabled:opacity-50"
                >
                  {uploadando ? "⏳ Enviando imagem..." : "📁 Clique para enviar uma imagem (JPG, PNG, WebP · máx 5MB)"}
                </button>

                {/* Ou URL manual */}
                <div className="mt-2">
                  <label className="block text-xs text-neutral-500 mb-1">Ou cole uma URL de imagem:</label>
                  <input
                    type="text"
                    value={form.imagem_url}
                    onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharModal} className="flex-1 rounded-2xl border border-white/10 py-3 font-bold text-neutral-300 hover:bg-white/5 transition">Cancelar</button>
                <button type="submit" disabled={salvando || uploadando} className="flex-1 rounded-2xl bg-orange-500 py-3 font-bold text-white hover:brightness-110 transition disabled:opacity-50">
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
