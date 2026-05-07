# 🌭 Dogão do Tigrão — Cardápio Online

Site de cardápio e pedidos online do **Dogão do Tigrão**, desenvolvido por **Eduardo Luiz Xavier Fontes**. O projeto foi criado para facilitar os pedidos dos clientes de forma rápida e prática, direto pelo WhatsApp, sem precisar de aplicativo ou sistema de delivery externo.

---

## 📸 Sobre o projeto

O Dogão do Tigrão é um negócio de hot dogs artesanais localizado em Frutal - MG. Este site foi desenvolvido do zero para substituir o processo manual de pedidos, oferecendo ao cliente uma experiência moderna de cardápio digital com carrinho de compras integrado.

O cliente navega pelas categorias, monta o carrinho com os produtos que quiser, preenche os dados de entrega, escolhe a forma de pagamento e finaliza o pedido direto no WhatsApp — tudo em poucos cliques.

---

## ✨ Funcionalidades

- **Cardápio completo** organizado por categorias
- **Carrinho de compras** com controle de quantidade por item
- **Adicionais** — opção de incluir bacon (+R$ 3,00) e cheddar (+R$ 5,00) em qualquer lanche
- **Formulário de pedido** com nome, endereço, bairro, ponto de referência e observações
- **Formas de pagamento**: PIX, dinheiro (com troco) ou cartão
- **Envio automático do pedido** via WhatsApp com resumo completo do pedido
- **Taxa de entrega** de R$ 4,00 (com aviso de possível ajuste por distância)
- **Design responsivo** — funciona bem no celular e no computador
- **Botão flutuante** do carrinho para acesso rápido

---

## 🗂️ Categorias do cardápio

| Categoria | Descrição |
|---|---|
| Tradicionais | Os clássicos da casa, de R$ 13 a R$ 25 |
| Especiais | Versões com presunto e mussarela, de R$ 16 a R$ 28 |
| Calabresa | Combinações com calabresa acebolada e muito recheio |
| Frango | Lanches tipo X com frango grelhado |
| Hambúrguer | Lanches tipo X com hambúrguer artesanal |
| Diversos | Hot dog simples, misto quente, Bacar e mais |

---

## 🛠️ Tecnologias utilizadas

- [React 18](https://react.dev/) — biblioteca de interface
- [Vite](https://vitejs.dev/) — bundler e servidor de desenvolvimento
- [Tailwind CSS v4](https://tailwindcss.com/) — estilização com classes utilitárias

---

## 📁 Estrutura do projeto

```
dogao-do-tigrao/
├── public/
│   └── images/          ← fotos dos produtos e logo
├── src/
│   ├── App.jsx          ← componente principal (cardápio, carrinho, pedido)
│   ├── main.jsx         ← entrada da aplicação
│   └── styles.css       ← estilos globais e importação do Tailwind
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---


## 📦 Build para produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/` e estão prontos para deploy no GitHub Pages ou qualquer hospedagem estática.

---



---

> Desenvolvido por **Luiz Fernando Andrade Silva** 🧡
