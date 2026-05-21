import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminCadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");

    if (form.senha !== form.confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: { data: { nome: form.nome, telefone: form.telefone } },
    });

    if (error) {
      setErro(error.message === "User already registered"
        ? "Este e-mail já está cadastrado."
        : "Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    // Salvar dados extras na tabela admins
    await supabase.from("admins").insert({
      id: data.user.id,
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      senha_hash: "managed_by_supabase_auth",
    });

    navigate("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">🌭</div>
          <h1 className="text-2xl font-black text-white">Dogão do Tigrão</h1>
          <p className="text-neutral-400 text-sm mt-1">Criar conta de administrador</p>
        </div>

        <form onSubmit={handleCadastro} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-6">Cadastro</h2>

          {erro && (
            <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
              {erro}
            </div>
          )}

          {[
            { label: "Nome completo", name: "nome", type: "text", placeholder: "Seu nome" },
            { label: "E-mail", name: "email", type: "email", placeholder: "seu@email.com" },
            { label: "Telefone", name: "telefone", type: "tel", placeholder: "(34) 99999-9999" },
            { label: "Senha", name: "senha", type: "password", placeholder: "Mínimo 6 caracteres" },
            { label: "Confirmar senha", name: "confirmar", type: "password", placeholder: "Repita a senha" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-semibold text-neutral-300 mb-2">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                placeholder={field.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-orange-500 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl bg-orange-500 py-3 font-bold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          <p className="mt-4 text-center text-sm text-neutral-500">
            Já tem conta?{" "}
            <Link to="/admin" className="text-orange-400 hover:text-orange-300 font-semibold">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
