import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      setErro("E-mail ou senha inválidos. Tente novamente.");
    } else {
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">🌭</div>
          <h1 className="text-2xl font-black text-white">Dogão do Tigrão</h1>
          <p className="text-neutral-400 text-sm mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-6">Entrar</h2>

          {erro && (
            <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
              {erro}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-300 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-orange-500 transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-orange-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 py-3 font-bold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="mt-4 text-center text-sm text-neutral-500">
            Não tem conta?{" "}
            <Link to="/admin/cadastro" className="text-orange-400 hover:text-orange-300 font-semibold">
              Criar conta
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="text-neutral-500 hover:text-neutral-300 text-sm transition">
            ← Voltar ao cardápio
          </Link>
        </p>
      </div>
    </div>
  );
}
