import { useMemo, useState } from "react";

export default function App() {
  const base = import.meta.env.BASE_URL;
  const logoImage = `${base}images/logo-dogao.png`;
  const hotdogImage = `${base}images/fallback-hotdog.jpg`;
  const whatsappNumber = "5534999783791";

  const categories = ["Tradicionais", "Especiais"];

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
  ];

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNeighborhood, setCustomerNeighborhood] = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [changeFor, setChangeFor] = useState("");

  const featured = products[15];
  const filteredByCategory = (category) => products.filter((product) => product.category === category);

  const addToCart = (product) => {
    const extras = [];
    if (window.confirm(`Deseja adicionar bacon ao ${product.name} por R$ 3,00?`)) extras.push({ name: "Bacon", price: 3 });
    if (window.confirm(`Deseja adicionar cheddar ao ${product.name} por R$ 5,00?`)) extras.push({ name: "Cheddar", price: 5 });
    const extrasKey = extras.map((extra) => extra.name).join(", ") || "Sem adicionais";

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id && item.extrasKey === extrasKey);
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

  const deliveryFee = cart.length > 0 ? 3 : 0;
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
    }).join("\n");

    const moneyLine = paymentMethod === "dinheiro" ? `\nTroco para: ${changeFor ? `R$ ${changeFor}` : "Não informado"}` : "";
    const pixLine = paymentMethod === "pix" ? "\nPagamento por Pix. Enviarei o comprovante neste mesmo número." : "";

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
    if (cart.length === 0) return alert("Adicione pelo menos um item no carrinho.");
    if (!customerName || !customerAddress || !customerNeighborhood) return alert("Preencha nome, endereço e bairro para finalizar o pedido.");
    if (paymentMethod === "dinheiro" && !changeFor) return alert("Informe o valor para troco no pagamento em dinheiro.");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`, "_blank");
  };

  const imageFallback = (e) => { e.currentTarget.src = hotdogImage; };

  return <div className="min-h-screen bg-neutral-950 text-white"><section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600"><div className="absolute inset-0 bg-black/20" /><div className="relative mx-auto max-w-7xl px-6 pt-6 md:px-10"><div className="mb-6 flex items-center justify-between rounded-[28px] border border-white/15 bg-neutral-950/35 px-4 py-4 shadow-xl backdrop-blur md:px-6"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10"><img src={logoImage} alt="Logo Dogão do Tigrão" className="h-full w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; const fallback = e.currentTarget.nextElementSibling; if (fallback) fallback.style.display = "flex"; }} /><div style={{ display: "none" }} className="h-full w-full items-center justify-center bg-orange-500 text-xl font-black text-white">DT</div></div><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-300">Sua logo aqui</p><h2 className="text-xl font-black text-white md:text-2xl">Dogão do Tigrão</h2></div></div><a href="#checkout" className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20">Fazer pedido</a></div></div><div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-10 md:grid-cols-2 md:px-10 md:pb-16"><div className="flex flex-col justify-center"><div className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">🌭 Dogão do Tigrão • Delivery Profissional</div><h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">O cachorro-quente mais bruto da cidade.</h1><p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">Monte seu pedido no carrinho e finalize direto no WhatsApp.</p><div className="mt-8 flex flex-wrap gap-4"><a href="#cardapio" className="rounded-2xl bg-neutral-950 px-6 py-3 font-semibold text-white shadow-2xl transition hover:scale-[1.02]">Ver cardápio</a><a href="#checkout" className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">Finalizar pedido</a></div><div className="mt-8 grid max-w-lg grid-cols-3 gap-3"><div className="rounded-2xl bg-black/20 p-4 backdrop-blur"><div className="text-2xl font-black">16</div><div className="text-sm text-white/80">Opções no cardápio</div></div><div className="rounded-2xl bg-black/20 p-4 backdrop-blur"><div className="text-2xl font-black">3</div><div className="text-sm text-white/80">Pagamentos</div></div><div className="rounded-2xl bg-black/20 p-4 backdrop-blur"><div className="text-2xl font-black">{cartCount}</div><div className="text-sm text-white/80">Itens no carrinho</div></div></div></div><div className="relative flex items-center justify-center"><div className="w-full max-w-md rounded-[32px] border border-white/15 bg-neutral-950/80 p-4 shadow-2xl backdrop-blur-xl"><div className="rounded-[28px] bg-neutral-900 p-4"><div className="mb-4 flex items-center justify-between gap-4"><div><p className="text-sm text-white/60">Destaque da casa</p><h3 className="text-lg font-bold">{featured.name}</h3></div><div className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold">R$ {featured.price}</div></div><img src={featured.image} alt={featured.name} className="h-64 w-full rounded-[24px] object-cover" onError={imageFallback} /><div className="mt-4 rounded-[24px] bg-neutral-800 p-4"><p className="text-sm text-white/75">{featured.description}</p><button onClick={() => addToCart(featured)} className="mt-4 block w-full rounded-2xl bg-orange-500 py-3 text-center font-bold transition hover:brightness-110">Adicionar ao carrinho</button></div></div></div></div></div></section></div>;
}
