
import { useMemo, useState } from "react";

export default function App() {
  const base = import.meta.env.BASE_URL;
  const logoImage = `${base}images/logo-dogao.png`;
  const hotdogImage = `${base}images/fallback-hotdog.jpg`;
  const whatsappNumber = "5534999783791";
  const pixKey = "067.094.116-64";
  const pixName = "Eduardo Luiz Xavier Fontes";
  const pixBank = "Nubank";

  const categories = ["Tradicionais", "Especiais", "Calabresa"];
  const [activeCategory, setActiveCategory] = useState("Tradicionais");

  const products = [
    { id: 1, name: "Tradicional", category: "Tradicionais", price: 13, image: `${base}images/tradicional.jpg`, description: "Pão, 2x salsicha, batata palha, maionese da casa, milho, ketchup e mostarda.", badge: "Mais pedido" },
    { id: 2, name: "Carne", category: "Tradicionais", price: 16, image: `${base}images/carne.jpg`, description: "Pão, salsicha, milho, carne, batata palha, maionese da casa, ketchup e mostarda.", badge: "Popular" },
    { id: 3, name: "Frango", category: "Tradicionais", price: 16, image: `${base}images/frango.jpg`, description: "Pão, salsicha, milho, frango, batata palha, maionese da casa, ketchup e mostarda.", badge: "Saboroso" },
    { id: 4, name: "Misto", category: "Tradicionais", price: 18, image: `${base}images/misto.jpg`, description: "Pão, salsicha, milho, carne, frango, batata palha, maionese da casa, ketchup e mostarda.", badge: "Recheado" },
    { id: 5, name: "Costela", category: "Tradicionais", price: 20, image: `${base}images/costela.jpg`, description: "Pão, salsicha, milho, costela desfiada, batata palha, maionese da casa e molho barbecue.", badge: "Defumado" },
    { id: 6, name: "Misto Caladim", category: "Tradicionais", price: 20, image: `${base}images/misto-caladim.jpg`, description: "Pão, salsicha, frango, costela, barbecue, batata palha, maionese da casa, ketchup e mostarda.", badge: "Destaque" },
    { id: 7, name: "Misto Luizshow", category: "Tradicionais", price: 20, image: `${base}images/misto-luizshow.jpg`, description: "Pão, salsicha, carne, costela, barbecue, batata palha e maionese da casa.", badge: "Especial da casa" },
    { id: 8, name: "O Brabo", category: "Tradicionais", price: 25, image: `${base}images/o-brabo.jpg`, description: "Pão, frango, carne, costela, 2x salsicha, bacon, batata palha, maionese da casa, barbecue, ketchup e mostarda.", badge: "O mais bruto" },

    { id: 9, name: "Tradicional Especial", category: "Especiais", price: 16, image: `${base}images/tradicional-especial.jpg`, description: "Pão, 2x salsicha, batata palha, maionese da casa, milho, ketchup, mostarda, presunto e mussarela.", badge: "Especial" },
    { id: 10, name: "Carne Especial", category: "Especiais", price: 19, image: `${base}images/carne-especial.jpg`, description: "Pão, salsicha, milho, carne, batata palha, maionese da casa, ketchup, mostarda, presunto e mussarela.", badge: "Especial" },
    { id: 11, name: "Frango Especial", category: "Especiais", price: 19, image: `${base}images/frango-especial.jpg`, description: "Pão, salsicha, milho, frango, batata palha, maionese da casa, ketchup, mostarda, presunto e mussarela.", badge: "Especial" },
    { id: 12, name: "Misto Especial", category: "Especiais", price: 21, image: `${base}images/misto-especial.jpg`, description: "Pão, salsicha, milho, frango, batata palha, maionese da casa, ketchup, mostarda, presunto e mussarela.", badge: "Especial" },
    { id: 13, name: "Costela Especial", category: "Especiais", price: 23, image: `${base}images/costela-especial.jpg`, description: "Pão, salsicha, milho, costela desfiada, batata palha, maionese da casa, molho barbecue, presunto e mussarela.", badge: "Especial" },
    { id: 14, name: "Misto Caladim Especial", category: "Especiais", price: 23, image: `${base}images/misto-caladim-especial.jpg`, description: "Pão, salsicha, frango, costela, barbecue, batata palha, maionese da casa, ketchup, mostarda, presunto e mussarela.", badge: "Especial" },
    { id: 15, name: "Misto Luizshow Especial", category: "Especiais", price: 23, image: `${base}images/misto-luizshow-especial.jpg`, description: "Pão, salsicha, carne, costela, barbecue, batata palha, maionese da casa, presunto e mussarela.", badge: "Especial" },
    { id: 16, name: "O Brabo Especial", category: "Especiais", price: 28, image: `${base}images/o-brabo-especial.jpg`, description: "Pão, frango, carne, costela, 2x salsicha, bacon, batata palha, maionese da casa, barbecue, ketchup, mostarda, presunto e mussarela.", badge: "Especial Supremo" },

    { id: 17, name: "Frango com Calabresa", category: "Calabresa", price: 20, image: `${base}images/frango.jpg`, description: "Pão, frango, calabresa, salsicha, milho, batata, barbecue e maionese caseira.", badge: "Calabresa" },
    { id: 18, name: "Frango com Calabresa Especial", category: "Calabresa", price: 23, image: `${base}images/frango-especial.jpg`, description: "Pão, frango, calabresa, salsicha, milho, batata, barbecue, maionese caseira, presunto e mussarela.", badge: "Calabresa Especial" },
    { id: 19, name: "Carne com Calabresa", category: "Calabresa", price: 20, image: `${base}images/carne.jpg`, description: "Pão, carne, calabresa, salsicha, milho, batata, barbecue e maionese caseira.", badge: "Calabresa" },
    { id: 20, name: "Carne com Calabresa Especial", category: "Calabresa", price: 23, image: `${base}images/carne-especial.jpg`, description: "Pão, carne, calabresa, salsicha, presunto e mussarela, milho, batata, barbecue e maionese.", badge: "Calabresa Especial" },
    { id: 21, name: "Monstrão", category: "Calabresa", price: 30, image: `${base}images/o-brabo.jpg`, description: "Pão, carne, frango, calabresa, costela, bacon, salsicha, milho, batata, barbecue e maionese caseira.", badge: "Monstrão" },
    { id: 22, name: "Dogão de Calabresa", category: "Calabresa", price: 20, image: `${base}images/misto.jpg`, description: "Pão, calabresa acebolada, salsicha, milho, batata, barbecue e maionese caseira.", badge: "Calabresa" },
    { id: 23, name: "Dogão de Calabresa Especial", category: "Calabresa", price: 23, image: `${base}images/misto-especial.jpg`, description: "Pão, calabresa acebolada, salsicha, presunto e mussarela, milho, batata, barbecue e maionese caseira.", badge: "Calabresa Especial" },
    { id: 24, name: "Mistão", category: "Calabresa", price: 27, image: `${base}images/misto.jpg`, description: "Pão, carne, frango, calabresa, salsicha, milho, batata, barbecue e maionese caseira.", badge: "Mistão" },
    { id: 25, name: "Mistão Especial", category: "Calabresa", price: 30, image: `${base}images/misto-especial.jpg`, description: "Pão, carne, frango, calabresa, salsicha, presunto e mussarela, milho, batata, barbecue e maionese caseira.", badge: "Mistão Especial" },
    { id: 26, name: "Costela Calabresa", category: "Calabresa", price: 24, image: `${base}images/costela.jpg`, description: "Pão, costela, calabresa, barbecue, maionese, milho, batata e salsicha.", badge: "Costela" },
    { id: 27, name: "Costela Calabresa Especial", category: "Calabresa", price: 28, image: `${base}images/costela-especial.jpg`, description: "Pão, costela, calabresa, barbecue, maionese, milho, batata, salsicha, presunto e mussarela.", badge: "Costela Especial" },
    { id: 28, name: "Monstrão Especial", category: "Calabresa", price: 34, image: `${base}images/o-brabo-especial.jpg`, description: "Pão, carne, frango, calabresa, costela, bacon, salsicha, presunto e mussarela, milho, batata, barbecue e maionese caseira.", badge: "Monstrão Especial" },
    { id: 29, name: "Dogão Americano", category: "Calabresa", price: 21, image: `${base}images/tradicional-especial.jpg`, description: "Pão, presunto, mussarela, salsicha, ovo, milho e batata, ketchup, maionese e mostarda.", badge: "Americano" },
    { id: 30, name: "Dogão Americano Turbo", category: "Calabresa", price: 24, image: `${base}images/misto-luizshow-especial.jpg`, description: "Pão, presunto, mussarela, salsicha, calabresa, ovo, milho, batata, ketchup, maionese e mostarda.", badge: "Turbo" },
  ];

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNeighborhood, setCustomerNeighborhood] = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [changeFor, setChangeFor] = useState("");

  const featured = products[27];
  const filteredProducts = products.filter((product) => product.category === activeCategory);

  const addToCart = (product) => {
    const extras = [];
    if (window.confirm(`Deseja adicionar bacon ao ${product.name} por R$ 3,00?`)) extras.push({ name: "Bacon", price: 3 });
    if (window.confirm(`Deseja adicionar cheddar ao ${product.name} por R$ 5,00?`)) extras.push({ name: "Cheddar", price: 5 });
    const extrasKey = extras.map((extra) => extra.name).join(", ") || "Sem adicionais";

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
  const paymentLabel = paymentMethod === "pix" ? "Pix" : paymentMethod === "dinheiro" ? "Dinheiro" : "Cartão";

  const buildWhatsAppMessage = () => {
    const orderLines = cart.map((item) => {
      const extras = item.extras || [];
      const extrasText = extras.length
        ? ` | Adicionais: ${extras.map((extra) => `${extra.name} (+R$ ${extra.price.toFixed(2).replace(".", ",")})`).join(", ")}`
        : "";
      const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
      const lineTotal = (item.price + extrasTotal) * item.quantity;
      return `• ${item.name} x${item.quantity}${extrasText} - R$ ${lineTotal.toFixed(2).replace(".", ",")}`;
    }).join("\\n");

    const moneyLine = paymentMethod === "dinheiro" ? `\\nTroco para: ${changeFor ? `R$ ${changeFor}` : "Não informado"}` : "";
    const pixLine = paymentMethod === "pix" ? "\\nPagamento por Pix. Chave: 067.094.116-64 | Nome: Eduardo Luiz Xavier Fontes | Banco: Nubank. Envie o comprovante para este mesmo número." : "";

    return (
      `Olá, Dogão do Tigrão! Quero fazer este pedido:\\n\\n` +
      `Nome: ${customerName || "Não informado"}\\n` +
      `Endereço: ${customerAddress || "Não informado"}\\n` +
      `Bairro: ${customerNeighborhood || "Não informado"}\\n` +
      `Referência: ${customerReference || "Não informado"}\\n\\n` +
      `Itens do pedido:\\n${orderLines}\\n\\n` +
      `Forma de pagamento: ${paymentLabel}${moneyLine}${pixLine}\\n` +
      `Observações: ${customerNotes || "Nenhuma"}\\n\\n` +
      `Taxa de entrega: R$ ${deliveryFee.toFixed(2).replace(".", ",")}\\n\\n` +
      `Total: R$ ${total.toFixed(2).replace(".", ",")}`
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Adicione pelo menos um item no carrinho.");
    if (!customerName || !customerAddress || !customerNeighborhood) return alert("Preencha nome, endereço e bairro para finalizar o pedido.");
    if (paymentMethod === "dinheiro" && !changeFor) return alert("Informe o valor para troco no pagamento em dinheiro.");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`, "_blank");
  };

  const imageFallback = (e) => { e.currentTarget.src = hotdogImage; };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-6 pt-6 md:px-10">
          <div className="mb-6 flex items-center justify-between rounded-[28px] border border-white/15 bg-neutral-950/35 px-5 py-4 shadow-xl backdrop-blur md:px-7">
            <div className="flex items-center gap-4">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 md:h-32 md:w-32">
                <img
                  src={logoImage}
                  alt="Logo Dogão do Tigrão"
                  className="h-full w-full object-contain"
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
            <a href="#cart-panel" className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20">
              Ver carrinho
            </a>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-10 md:grid-cols-2 md:px-10 md:pb-16">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              🌭 Dogão do Tigrão • Delivery Profissional
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">
              O melhor cachorro quente de costela da cidade.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">
              Agora com opções tradicionais, especiais e também cardápio de calabresa.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#cardapio" className="rounded-2xl bg-neutral-950 px-6 py-3 font-semibold text-white shadow-2xl transition hover:scale-[1.02]">
                Ver cardápio
              </a>
              <a href="#cart-panel" className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Ver carrinho
              </a>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">30</div>
                <div className="text-sm text-white/80">Opções no cardápio</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">3</div>
                <div className="text-sm text-white/80">Categorias</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">{cartCount}</div>
                <div className="text-sm text-white/80">Itens no carrinho</div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h3 className="text-lg font-bold">WhatsApp oficial</h3>
            <p className="mt-2 text-sm text-white/70">(34) 99978-3791</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h3 className="text-lg font-bold">Seg a Qui</h3>
            <p className="mt-2 text-sm text-white/70">19h às 23h</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
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
            Adicionais disponíveis em qualquer lanche: <strong>Bacon +R$ 3,00</strong> e <strong>Cheddar +R$ 5,00</strong>.
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-2xl px-5 py-3 font-bold transition ${
                activeCategory === category
                  ? "bg-orange-500 text-white"
                  : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20"
              }`}
            >
              {category === "Tradicionais" ? "Cachorro-quente Tradicional" : category === "Especiais" ? "Cachorro-quente Especial" : "Cachorro-quente de Calabresa"}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <h3 className="text-2xl font-black">
              {activeCategory === "Tradicionais" ? "Cachorro-quente Tradicional" : activeCategory === "Especiais" ? "Cachorro-quente Especial" : "Cachorro-quente de Calabresa"}
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-xl transition hover:-translate-y-1 hover:border-orange-400/50"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={imageFallback}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
                    {product.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{product.category}</p>
                      <h3 className="mt-1 text-xl font-black">{product.name}</h3>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 px-3 py-2 text-sm font-bold">
                      R$ {product.price}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/65">{product.description}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-5 block w-full rounded-2xl bg-orange-500 py-3 text-center font-bold transition hover:brightness-110"
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="checkout" className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-3xl font-black">Finalizar pedido</h2>
            <p className="mt-2 text-white/65">Preencha seus dados e envie o pedido pronto pelo WhatsApp.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome" className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35" />
              <input value={customerNeighborhood} onChange={(e) => setCustomerNeighborhood(e.target.value)} placeholder="Bairro" className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35" />
              <input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Endereço completo" className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35 md:col-span-2" />
              <input value={customerReference} onChange={(e) => setCustomerReference(e.target.value)} placeholder="Ponto de referência" className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35 md:col-span-2" />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold">Forma de pagamento</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[{ value: "pix", label: "Pix" }, { value: "dinheiro", label: "Dinheiro" }, { value: "cartao", label: "Cartão" }].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPaymentMethod(option.value)}
                    className={`rounded-2xl border px-4 py-3 font-bold transition ${paymentMethod === option.value ? "border-orange-500 bg-orange-500 text-white" : "border-white/10 bg-neutral-900 text-white/75 hover:border-white/20"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "dinheiro" && (
                <div className="mt-4">
                  <input value={changeFor} onChange={(e) => setChangeFor(e.target.value)} placeholder="Troco para quanto? Ex: 50,00" className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35" />
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-white/80">
                  <p className="font-bold text-white">Pagamento via Pix</p>
                  <p className="mt-2">Chave Pix: <span className="font-bold text-white">{pixKey}</span></p>
                  <p>Nome: <span className="font-bold text-white">{pixName}</span></p>
                  <p>Banco: <span className="font-bold text-white">{pixBank}</span></p>
                  <p className="mt-2">Após o pagamento, envie o comprovante para o WhatsApp <span className="font-bold text-white">(34) 99978-3791</span>.</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} placeholder="Observações do pedido" rows={4} className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none placeholder:text-white/35" />
            </div>
          </div>

          <aside id="cart-panel" className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/8 to-white/5 p-6 shadow-2xl backdrop-blur h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-black">Seu carrinho</h3>
                <p className="text-sm text-white/60">Confira antes de enviar</p>
              </div>
              <div className="rounded-2xl bg-orange-500 px-3 py-2 text-sm font-bold">
                {cartCount} item{cartCount !== 1 ? "s" : ""}
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
                    <div key={`${item.id}-${item.extrasKey}`} className="rounded-2xl bg-neutral-900/80 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <div className="text-sm text-white/60">
                            <p>R$ {item.price.toFixed(2).replace(".", ",")} cada</p>
                            {!!item.extras?.length && (
                              <p>
                                Adicionais: {item.extras.map((extra) => `${extra.name} (+R$ ${extra.price.toFixed(2).replace(".", ",")})`).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.extrasKey)} className="text-sm font-bold text-red-400">
                          Remover
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button onClick={() => decreaseQuantity(item.id, item.extrasKey)} className="h-9 w-9 rounded-full bg-white/10 text-lg font-bold">-</button>
                          <span className="min-w-6 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id, item.extrasKey)} className="h-9 w-9 rounded-full bg-white/10 text-lg font-bold">+</button>
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
                Taxa de entrega inicial de R$ 4,00. Esse valor pode alterar dependendo do endereço, e nós te avisaremos no WhatsApp caso a taxa fique maior que R$ 4,00.
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

            <button onClick={handleCheckout} className="mt-6 w-full rounded-2xl bg-green-500 py-4 text-base font-black text-white transition hover:scale-[1.01]">
              Finalizar pedido no WhatsApp
            </button>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10">
        <div className="rounded-[36px] border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">Dogão do Tigrão</p>
              <h2 className="text-3xl font-black md:text-4xl">Pedido rápido e direto no WhatsApp.</h2>
              <p className="mt-4 max-w-xl text-white/70">
                Agora com categorias organizadas para o cliente escolher melhor entre tradicional, especial e calabresa.
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
        onClick={() => document.getElementById("cart-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="fixed bottom-6 right-6 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-2xl transition hover:scale-105"
      >
        Carrinho ({cartCount})
      </button>
    </div>
  );
}
