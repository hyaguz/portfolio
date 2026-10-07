# Portfólio — Hyago Soares Matos

Site de portfólio feito só com **HTML, CSS e JavaScript** (sem frameworks, sem instalar nada).
Funciona direto no **GitHub Pages**.

## Estrutura de pastas

```
portfolio/
├── index.html              ← estrutura e textos da página
├── css/
│   └── style.css           ← visual (cores, fontes, layout, animações)
├── js/
│   ├── data.js             ← ✏️ AQUI você edita tecnologias e projetos
│   ├── icons.js            ← 🎨 ícones SVG das tecnologias
│   ├── tech3d.js           ← cards 3D das tecnologias (animação e interação)
│   └── script.js           ← comportamento (tema, menu, modal, filtros)
├── assets/
│   ├── images/             ← 🖼️ AQUI ficam as capas dos projetos
│   │   ├── dh-store.svg … (capas provisórias)
│   │   └── og-image.png    ← imagem que aparece ao compartilhar o link
│   └── icons/
│       └── favicon.svg     ← ícone da aba do navegador
└── README.md
```

---

## 1. Como testar no seu computador

Abra o arquivo `index.html` com dois cliques (ele abre no navegador). Pronto.

---

## 2. Como colocar no GitHub (passo a passo, sem terminal)

Você já tem um repositório chamado **portfolio**. Há duas opções:

**Opção A — Usar o repositório `portfolio` que já existe (mais simples)**

1. Acesse https://github.com/hyaguz/portfolio.
2. Clique em **Add file → Upload files**.
3. Arraste para a página **o conteúdo da pasta** (`index.html`, e as pastas `css`, `js`, `assets` e o `README.md`).
   - ⚠️ Arraste os arquivos e pastas que estão **dentro** da pasta `portfolio`, não a pasta inteira. O `index.html` precisa ficar na raiz do repositório.
   - Se já existirem arquivos com o mesmo nome (como `index.html`), o GitHub vai substituí-los.
4. Na caixa **Commit changes**, escreva algo como `Novo portfólio` e clique em **Commit changes**.

**Opção B — Criar um repositório novo**

1. Acesse https://github.com/new.
2. Em **Repository name**, escreva `portfolio-novo` (ou outro nome), deixe **Public** e clique em **Create repository**.
3. Clique em **uploading an existing file**, arraste o conteúdo como no passo 3 acima e faça o **Commit changes**.

---

## 3. Como ativar o GitHub Pages

1. No repositório, clique em **Settings** (Configurações).
2. No menu da esquerda, clique em **Pages**.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
5. Espere de 1 a 3 minutos e atualize a página. O endereço do seu site aparece no topo, assim:

   `https://hyaguz.github.io/portfolio/`

6. **Importante:** se o endereço do seu site for **diferente** disso, abra o `index.html` e troque
   `https://hyaguz.github.io/portfolio/` pelo seu endereço real. Ele aparece em 5 lugares no começo do arquivo
   (`canonical`, `og:url`, `og:image`, `twitter:image` e no bloco `application/ld+json`).
   Sem isso, a imagem de pré-visualização pode não aparecer ao compartilhar o link.

Depois que o site estiver no ar, você pode usar o link do portfólio no seu GitHub, no LinkedIn e no currículo.

---

## 3b. Publicar no Cloudflare Pages (alternativa ao GitHub Pages)

O site é 100% estático: **não existe build**.

1. Envie o conteúdo desta pasta para um repositório no GitHub (com o `index.html` na raiz).
2. No painel do Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Preencha assim:
   - **Framework preset:** None
   - **Build command:** *(deixe vazio)*
   - **Build output directory:** `/` (ou deixe em branco)
4. Clique em **Save and Deploy**. O endereço fica algo como `https://seu-projeto.pages.dev`.
5. Depois de saber o endereço final, troque `https://hyaguz.github.io/portfolio/` no começo do `index.html`
   (`canonical`, `og:url`, `og:image`, `twitter:image` e `application/ld+json`) pelo endereço novo.

---

## 4. Onde colocar as imagens dos projetos

1. Tire um **print (screenshot)** do seu projeto. Tamanho ideal: **1200 × 750 pixels** (proporção 16:10), em formato `.png`, `.jpg` ou `.webp`, com **menos de 300 KB** para o site carregar rápido.
2. Salve a imagem dentro da pasta **`assets/images/`**. Exemplo: `assets/images/dh-store.png`.
3. Abra o arquivo **`js/data.js`**, encontre o projeto e troque a linha `image`:

   ```js
   image: "assets/images/dh-store.png",
   ```

4. Faça o upload da imagem para o GitHub (**Add file → Upload files**, dentro da pasta `assets/images`).

> As capas `.svg` que vêm no projeto são **provisórias**: servem só para o site não ficar vazio. Troque por prints reais assim que puder.

---

## 5. Onde editar textos, tecnologias e projetos

| O que você quer mudar | Onde |
|---|---|
| Tecnologias (cards 3D) | `js/data.js`, bloco `technologies` · ícones em `js/icons.js` |
| Projetos (nome, descrição, tecnologias, links, status) | `js/data.js`, bloco `projects` |
| Adicionar ou remover um projeto | `js/data.js`: copie um bloco `{ ... }`, cole abaixo e edite (ou apague um bloco) |
| Textos do Hero, Sobre, Processo e Contato | `index.html` (procure pelo texto que você quer mudar) |
| Cores do site | `css/style.css`, começo do arquivo, seção **TOKENS** |
| E-mail e link do GitHub | `index.html` (procure por `hyaguzzz@gmail.com` e `github.com/hyaguz`) |

### Como adicionar uma tecnologia (card 3D)

1. Em `js/data.js`, dentro de `technologies`, acrescente uma linha:

   ```js
   { name: "Python", icon: "python", description: "Automação e análise de dados." },
   ```

2. Informe o ícone de um destes dois jeitos:
   - cole o SVG em `js/icons.js` com a mesma chave (`python: '<svg viewBox="…">…</svg>'`); ou
   - salve o arquivo em `assets/icons/tech/python.svg` e use `icon: "assets/icons/tech/python.svg"`.

Logos de uma cor só podem usar `fill="currentColor"`: ficam pretos no tema claro e brancos no escuro.

### Como adicionar um projeto

Copie este modelo para dentro da lista `projects` (lembre da vírgula entre os blocos):

```js
{
  id: "meu-novo-projeto",
  name: "Meu Novo Projeto",
  category: "web",                 // "web", "mobile" ou "other"
  status: "Em desenvolvimento",
  summary: "Frase curta que aparece no card.",
  description: "Texto maior que aparece ao abrir o projeto.",
  tech: ["HTML", "CSS", "JavaScript"],
  image: "assets/images/meu-novo-projeto.png",
  imageAlt: "Print da tela inicial do Meu Novo Projeto",
  repo: "https://github.com/hyaguz/meu-novo-projeto",
  demo: "",                        // link do site publicado, se existir
  embed: false                     // true = tenta mostrar o site dentro do modal
}
```

### Sobre a prévia dentro do modal (`embed`)

Se o projeto estiver publicado (por exemplo, no GitHub Pages), coloque o link em `demo` e troque `embed` para `true`.
O modal vai oferecer o botão **"Carregar prévia interativa"**. Alguns sites não permitem ser exibidos dentro de outra página;
nesse caso o modal continua funcionando normalmente, com a imagem e o botão **"Abrir projeto"**.

### Repositórios automáticos do GitHub

Em `js/data.js`, `github.useApi: true` faz o site buscar seus repositórios públicos e listar, numa área separada
("Outros repositórios no GitHub"), os que **não** estão na sua lista manual. Se o GitHub estiver fora do ar ou o limite de
requisições for atingido, aparece uma mensagem e o resto do site continua normal. Para desligar, troque para `useApi: false`.

---

## 6. Dicas finais

- Depois de enviar alterações ao GitHub, o site atualiza sozinho em 1 a 3 minutos. Se não mudar, aperte **Ctrl + F5**.
- As descrições dos projetos atuais são **provisórias** (eu não tenho como saber o que cada projeto faz). Reescreva com suas palavras em `js/data.js`.
- Os campos `status` (ex.: "Em evolução", "Experimento") também são sugestões. Ajuste conforme a realidade.
