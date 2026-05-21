
import { useMemo, useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const base = import.meta.env.BASE_URL;
  const logoImage = `${base}images/logo-dogao.png`;
  const hotdogImage = `${base}images/fallback-hotdog.jpg`;
  const whatsappNumber = "5534999783791";
  const pixKey = "067.094.116-64";
  const pixName = "Eduardo Luiz Xavier Fontes";
  const pixBank = "Nubank";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { data } = await supabase
        .from("produtos")
        .select("*, categorias(nome, ordem)")
        .eq("ativo", true)
        .order("nome");

      if (data) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.nome,
          description: p.descricao,
          price: Number(p.preco),
          image: p.imagem_url || "",
          badge: p.badge || "",
          category: p.categorias?.nome || "Outros",
          ordem: p.categorias?.ordem ?? 99,
        }));
        setProducts(mapped);

        // Build unique ordered categories
        const catMap = {};
        mapped.forEach((p) => { if (!catMap[p.category]) catMap[p.category] = p.ordem; });
        const cats = Object.keys(catMap).sort((a, b) => catMap[a] - catMap[b]);
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0]);
      }
      setLoadingProducts(false);
    };
    fetchProducts();
  }, []);
  const [cart, setCart] = useState([]);
  const [categoryKey, setCategoryKey] = useState(0);
  const [cartBump, setCartBump] = useState(false);
  const [shakeCheckout, setShakeCheckout] = useState(false);
  const [fallingDogs, setFallingDogs] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNeighborhood, setCustomerNeighborhood] = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [changeFor, setChangeFor] = useState("");
  const checkoutBtnRef = useRef(null);

  const featured = products.find((product) => product.name === "O Brabo") || products[0] || null;

  const filteredProducts = products.filter((product) => product.category === activeCategory);

  const addToCart = (product) => {
    const extras = [];
    if (window.confirm(`Deseja adicionar bacon ao ${product.name} por R$ 3,00?`)) {
      extras.push({ name: "Bacon", price: 3 });
    }
    if (window.confirm(`Deseja adicionar cheddar ao ${product.name} por R$ 5,00?`)) {
      extras.push({ name: "Cheddar", price: 5 });
    }
    const extrasKey = extras.length ? extras.map((extra) => extra.name).join(", ") : "Sem adicionais";

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id && item.extrasKey === extrasKey
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id && item.extrasKey === extrasKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1, extras, extrasKey }];
    });

    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);

    const dogs = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 92 + 2}%`,
      delay: `${(Math.random() * 0.5).toFixed(2)}s`,
      dur: `${(Math.random() * 0.8 + 0.9).toFixed(2)}s`,
      size: `${Math.floor(Math.random() * 16 + 22)}px`,
    }));
    setFallingDogs(dogs);
    setTimeout(() => setFallingDogs([]), 2200);
  };

  const decreaseQuantity = (productId, extrasKey) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId && item.extrasKey === extrasKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (productId, extrasKey) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId && item.extrasKey === extrasKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const removeFromCart = (productId, extrasKey) => {
    setCart((currentCart) =>
      currentCart.filter((item) => !(item.id === productId && item.extrasKey === extrasKey))
    );
  };

  const rebuildExtrasKey = (extras) =>
    extras.length ? extras.map((extra) => extra.name).join(", ") : "Sem adicionais";

  const removeExtraFromItem = (productId, extrasKey, extraName) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (!(item.id === productId && item.extrasKey === extrasKey)) return item;
        const updatedExtras = (item.extras || []).filter((extra) => extra.name !== extraName);
        return { ...item, extras: updatedExtras, extrasKey: rebuildExtrasKey(updatedExtras) };
      })
    );
  };

  const addExtraToItem = (productId, extrasKey, extraName, extraPrice) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (!(item.id === productId && item.extrasKey === extrasKey)) return item;
        const alreadyHas = (item.extras || []).some((extra) => extra.name === extraName);
        if (alreadyHas) return item;
        const updatedExtras = [...(item.extras || []), { name: extraName, price: extraPrice }];
        return { ...item, extras: updatedExtras, extrasKey: rebuildExtrasKey(updatedExtras) };
      })
    );
  };

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  const subtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const extrasTotal = (item.extras || []).reduce((sum, extra) => sum + extra.price, 0);
        return total + (item.price + extrasTotal) * item.quantity;
      }, 0),
    [cart]
  );

  const deliveryFee = cart.length > 0 ? 4 : 0;
  const total = subtotal + deliveryFee;
  const paymentLabel =
    paymentMethod === "pix" ? "Pix" : paymentMethod === "dinheiro" ? "Dinheiro" : "Cartão";

  const buildWhatsAppMessage = () => {
    const orderLines = cart
      .map((item) => {
        const extras = item.extras || [];
        const extrasText = extras.length
          ? ` | Adicionais: ${extras
              .map((extra) => `${extra.name} (+R$ ${extra.price.toFixed(2).replace(".", ",")})`)
              .join(", ")}`
          : "";
        const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
        const lineTotal = (item.price + extrasTotal) * item.quantity;

        return `• ${item.name} x${item.quantity}${extrasText} - R$ ${lineTotal
          .toFixed(2)
          .replace(".", ",")}`;
      })
      .join("\n");

    const moneyLine =
      paymentMethod === "dinheiro"
        ? `\nTroco para: ${changeFor ? `R$ ${changeFor}` : "Não informado"}`
        : "";

    const pixLine =
      paymentMethod === "pix"
        ? `\nPagamento por Pix. Chave: ${pixKey} | Nome: ${pixName} | Banco: ${pixBank}. Envie o comprovante para este mesmo número.`
        : "";

    return (
      `Olá, Dogão do Tigrão! Quero fazer este pedido:\n\n` +
      `Nome: ${customerName || "Não informado"}\n` +
      `Endereço: ${customerAddress || "Não informado"}\n` +
      `Bairro: ${customerNeighborhood || "Não informado"}\n` +
      `Referência: ${customerReference || "Não informado"}\n\n` +
      `Itens do pedido:\n${orderLines}\n\n` +
      `Forma de pagamento: ${paymentLabel}${moneyLine}${pixLine}\n` +
      `Observações: ${customerNotes || "Nenhuma"}\n\n` +
      `Taxa de entrega: R$ ${deliveryFee.toFixed(2).replace(".", ",")}\n\n` +
      `Total: R$ ${total.toFixed(2).replace(".", ",")}`
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Adicione pelo menos um item no carrinho.");
      setShakeCheckout(true);
      setTimeout(() => setShakeCheckout(false), 400);
      return;
    }

    if (!customerName || !customerAddress || !customerNeighborhood) {
      alert("Preencha nome, endereço e bairro para finalizar o pedido.");
      return;
    }

    if (paymentMethod === "dinheiro" && !changeFor) {
      alert("Informe o valor para troco no pagamento em dinheiro.");
      return;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      buildWhatsAppMessage()
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const imageFallback = (e) => {
    e.currentTarget.src = hotdogImage;
  };

  const categoryLabel = (category) => {
    if (category === "Tradicionais") return "Cachorro-quente Tradicional";
    if (category === "Especiais") return "Cachorro-quente Especial";
    if (category === "Calabresa") return "Cachorro-quente de Calabresa";
    if (category === "Frango") return "Catálogo de Frango";
    if (category === "Lombo") return "Catálogo de Lombo";
    if (category === "Filé") return "Catálogo de Filé";
    if (category === "Hambúrguer") return "Catálogo de Hambúrguer";
    return "Catálogo Diversos";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-6 pt-6 md:px-10">
          <div className="mb-6 flex items-center justify-between rounded-[28px] border border-white/15 bg-neutral-950/35 px-5 py-4 shadow-xl backdrop-blur md:px-7">
            <div className="flex items-center gap-4">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 md:h-36 md:w-36">
                <img
                  src={logoImage}
                  alt="Logo Dogão do Tigrão"
                  className="h-full w-full object-contain scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="h-full w-full items-center justify-center bg-orange-500 text-2xl font-black text-white"
                >
                  DT
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white md:text-3xl">Dogão do Tigrão</h2>
              </div>
            </div>
            <a
              href="#cart-panel"
              className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Ver carrinho
            </a>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-10 md:grid-cols-2 md:px-10 md:pb-16">
          <div className="flex flex-col justify-center animate-hero" style={{ animationDelay: "0ms" }}>
            <div className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur animate-hero" style={{ animationDelay: "100ms" }}>
              🌭 Dogão do Tigrão • Delivery Profissional
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl animate-hero" style={{ animationDelay: "200ms" }}>
              O melhor cachorro quente de costela da cidade.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg animate-hero" style={{ animationDelay: "300ms" }}>
              Agora com categorias organizadas de dogões, lanches e opções diversas.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#cardapio"
                className="rounded-2xl bg-neutral-950 px-6 py-3 font-semibold text-white shadow-2xl transition hover:scale-[1.02]"
              >
                Ver cardápio
              </a>
              <a
                href="#cart-panel"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Ver carrinho
              </a>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">67</div>
                <div className="text-sm text-white/80">Opções no cardápio</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">8</div>
                <div className="text-sm text-white/80">Categorias</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">{cartCount}</div>
                <div className="text-sm text-white/80">Itens no carrinho</div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-hero" style={{ animationDelay: "250ms" }}>
            <div className="w-full max-w-md rounded-[32px] border border-white/15 bg-neutral-950/80 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[28px] bg-neutral-900 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/60">Destaque da casa</p>
                    <h3 className="text-lg font-bold">{featured.name}</h3>
                  </div>
                  <div className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold">
                    R$ {featured.price}
                  </div>
                </div>

                {featured ? (
                <>
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="h-64 w-full rounded-[24px] object-cover"
                  onError={imageFallback}
                />
                <div className="mt-4 rounded-[24px] bg-neutral-800 p-4">
                  <p className="text-sm text-white/75">{featured.description}</p>
                  <button
                    onClick={() => addToCart(featured)}
                    className="mt-4 block w-full rounded-2xl bg-orange-500 py-3 text-center font-bold transition hover:brightness-110"
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
                </>) : (
                  <div className="flex h-64 items-center justify-center rounded-[24px] bg-neutral-800 text-neutral-500">
                    Carregando cardápio...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur animate-fade-slide-up card-delay-0">
            <h3 className="text-lg font-bold">WhatsApp oficial</h3>
            <p className="mt-2 text-sm text-white/70">(34) 99978-3791</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur animate-fade-slide-up card-delay-2">
            <h3 className="text-lg font-bold">Seg a Qui</h3>
            <p className="mt-2 text-sm text-white/70">19h às 23h</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur animate-fade-slide-up card-delay-4">
            <h3 className="text-lg font-bold">Sex a Dom</h3>
            <p className="mt-2 text-sm text-white/70">19h às 00:00</p>
          </div>
        </div>
      </section>

      <section id="cardapio" className="mx-auto max-w-7xl px-6 py-6 md:px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black">Nosso cardápio</h2>
          <p className="mt-2 text-white/60">Escolha a categoria do seu lanche.</p>
          <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-white/80">
            Adicionais disponíveis em qualquer item: <strong>Bacon +R$ 3,00</strong> e{" "}
            <strong>Cheddar +R$ 5,00</strong>.
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => { setActiveCategory(category); setCategoryKey((k) => k + 1); }}
              className={`rounded-2xl px-5 py-3 font-bold transition-all duration-200 ${
                activeCategory === category
                  ? "bg-orange-500 text-white scale-105 shadow-lg shadow-orange-500/30"
                  : "border border-white/10 bg-white/5 text-white/80 hover:border-orange-400/40 hover:bg-white/10 hover:scale-[1.03]"
              }`}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <h3 className="text-2xl font-black">{categoryLabel(activeCategory)}</h3>
          </div>

          {loadingProducts ? (
            <div className="py-16 text-center text-neutral-400">Carregando produtos...</div>
          ) : (
          <div key={categoryKey} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`animate-fade-slide-up card-delay-${Math.min(index, 13)} group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/50 hover:shadow-orange-500/10 hover:shadow-2xl`}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={imageFallback}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
                    {product.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
                        {product.category}
                      </p>
                      <h3 className="mt-1 text-xl font-black">{product.name}</h3>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 px-3 py-2 text-sm font-bold">
                      R$ {Number(product.price).toFixed(2)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/65">{product.description}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-5 block w-full rounded-2xl bg-orange-500 py-3 text-center font-bold transition-all duration-150 hover:brightness-110 active:scale-95"
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      <section id="checkout" className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-3xl font-black">Finalizar pedido</h2>
            <p className="mt-2 text-white/65">
              Preencha seus dados e envie o pedido pronto pelo WhatsApp.
            </p>
            <p className="mt-2 text-sm text-orange-300">
              No carrinho, você pode adicionar ou remover bacon e cheddar antes de finalizar.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Seu nome"
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35"
              />
              <input
                value={customerNeighborhood}
                onChange={(e) => setCustomerNeighborhood(e.target.value)}
                placeholder="Bairro"
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35"
              />
              <input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Endereço completo"
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35 md:col-span-2"
              />
              <input
                value={customerReference}
                onChange={(e) => setCustomerReference(e.target.value)}
                placeholder="Ponto de referência"
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35 md:col-span-2"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold">Forma de pagamento</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[
                  { value: "pix", label: "Pix" },
                  { value: "dinheiro", label: "Dinheiro" },
                  { value: "cartao", label: "Cartão" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPaymentMethod(option.value)}
                    className={`rounded-2xl border px-4 py-3 font-bold transition ${
                      paymentMethod === option.value
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-white/10 bg-neutral-900 text-white/75 hover:border-white/20"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "dinheiro" && (
                <div className="mt-4">
                  <input
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    placeholder="Troco para quanto? Ex: 50,00"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35"
                  />
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-white/80">
                  <p className="font-bold text-white">Pagamento via Pix</p>
                  <p className="mt-2">
                    Chave Pix: <span className="font-bold text-white">{pixKey}</span>
                  </p>
                  <p>
                    Nome: <span className="font-bold text-white">{pixName}</span>
                  </p>
                  <p>
                    Banco: <span className="font-bold text-white">{pixBank}</span>
                  </p>
                  <p className="mt-2">
                    Após o pagamento, envie o comprovante para o WhatsApp{" "}
                    <span className="font-bold text-white">(34) 99978-3791</span>.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Observações do pedido"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <aside
            id="cart-panel"
            className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/8 to-white/5 p-6 shadow-2xl backdrop-blur h-fit lg:sticky lg:top-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-black">Seu carrinho</h3>
                <p className="text-sm text-white/60">Confira antes de enviar</p>
              </div>
              <div className="rounded-2xl bg-orange-500 px-3 py-2 text-sm font-bold">
                <span className={cartBump ? "animate-pop-in inline-block" : "inline-block"}>
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {cart.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-neutral-900/50 p-5 text-sm text-white/55">
                  Seu carrinho está vazio.
                </div>
              ) : (
                cart.map((item) => {
                  const extrasTotal = (item.extras || []).reduce((sum, extra) => sum + extra.price, 0);
                  const itemTotal = (item.price + extrasTotal) * item.quantity;

                  return (
                    <div
                      key={`${item.id}-${item.extrasKey}`}
                      className="animate-scale-in rounded-2xl bg-neutral-900/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <div className="text-sm text-white/60">
                            <p>R$ {item.price.toFixed(2).replace(".", ",")} cada</p>
                            {!!item.extras?.length && (
                              <div className="mt-2 space-y-2">
                                <p>
                                  Adicionais:{" "}
                                  {item.extras
                                    .map(
                                      (extra) =>
                                        `${extra.name} (+R$ ${extra.price.toFixed(2).replace(".", ",")})`
                                    )
                                    .join(", ")}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {item.extras.map((extra) => (
                                    <button
                                      key={extra.name}
                                      onClick={() =>
                                        removeExtraFromItem(item.id, item.extrasKey, extra.name)
                                      }
                                      className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300"
                                    >
                                      Remover {extra.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                              {!(item.extras || []).some((extra) => extra.name === "Bacon") && (
                                <button
                                  onClick={() => addExtraToItem(item.id, item.extrasKey, "Bacon", 3)}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/80"
                                >
                                  + Bacon
                                </button>
                              )}
                              {!(item.extras || []).some((extra) => extra.name === "Cheddar") && (
                                <button
                                  onClick={() =>
                                    addExtraToItem(item.id, item.extrasKey, "Cheddar", 5)
                                  }
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/80"
                                >
                                  + Cheddar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.extrasKey)}
                          className="text-sm font-bold text-red-400"
                        >
                          Remover
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQuantity(item.id, item.extrasKey)}
                            className="h-9 w-9 rounded-full bg-white/10 text-lg font-bold"
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id, item.extrasKey)}
                            className="h-9 w-9 rounded-full bg-white/10 text-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="font-black">R$ {itemTotal.toFixed(2).replace(".", ",")}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Taxa de entrega</span>
                <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs leading-relaxed text-white/75">
                Taxa de entrega inicial de R$ 4,00. Esse valor pode alterar dependendo do endereço, e
                nós te avisaremos no WhatsApp caso a taxa fique maior que R$ 4,00.
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Pagamento</span>
                <span>{paymentLabel}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-black">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              ref={checkoutBtnRef}
              className={`mt-6 w-full rounded-2xl bg-green-500 py-4 text-base font-black text-white transition-all duration-150 hover:scale-[1.02] hover:brightness-110 active:scale-95 ${shakeCheckout ? "animate-shake" : ""}`}
            >
              Finalizar pedido no WhatsApp
            </button>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10">
        <div className="rounded-[36px] border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                Dogão do Tigrão
              </p>
              <h2 className="text-3xl font-black md:text-4xl">Pedido rápido e direto no WhatsApp.</h2>
              <p className="mt-4 max-w-xl text-white/70">
                Agora com categorias organizadas para o cliente escolher melhor entre dogões, lanches
                e opções diversas.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-black/20 p-5">
                <div className="text-sm text-white/60">WhatsApp</div>
                <div className="mt-2 text-lg font-bold">(34) 99978-3791</div>
              </div>
              <div className="rounded-3xl bg-black/20 p-5">
                <div className="text-sm text-white/60">Funcionamento</div>
                <div className="mt-2 text-lg font-bold">Seg a Qui: 19h às 23h</div>
              </div>
              <div className="rounded-3xl bg-black/20 p-5 sm:col-span-2">
                <div className="text-sm text-white/60">Fim de semana</div>
                <div className="mt-2 text-lg font-bold">Sex a Dom: 19h às 00:00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={() =>
          document.getElementById("cart-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="fixed bottom-6 right-6 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-2xl transition-all duration-150 hover:scale-110 active:scale-95 animate-pulse-glow"
      >
        🛒 Carrinho ({cartCount})
      </button>

      {fallingDogs.map((dog) => (
        <span
          key={dog.id}
          className="hotdog-falling"
          style={{
            left: dog.left,
            fontSize: dog.size,
            animationDelay: dog.delay,
            animationDuration: dog.dur,
          }}
        >
          🌭
        </span>
      ))}

    </div>
  );
}
