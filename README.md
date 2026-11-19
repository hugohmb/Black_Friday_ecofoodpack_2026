# Landing Page Black Friday — Ecofoodpack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Sem dependências](https://img.shields.io/badge/depend%C3%AAncias-0-B4E61D?style=flat)
![Responsivo](https://img.shields.io/badge/responsivo-mobile%20%7C%20tablet%20%7C%20desktop-0D0E0B?style=flat)

Landing page da campanha de **Black Friday 2026 da Ecofoodpack**, marca de embalagens para delivery do Grupo Exact.
É uma experiência de *scrollytelling*: as animações acompanham a rolagem do usuário e reiniciam quando ele volta. O rodapé tem física 2D interativa, e a vitrine de produtos se atualiza sozinha a partir da categoria da loja.

> A página foi feita para rodar dentro de uma loja **Tray**, que exige um único arquivo HTML. Este repositório traz o código organizado em arquivos separados e um script de *build* que gera a versão de arquivo único para publicação.

<!-- Coloque aqui um GIF ou print da página, por exemplo:
![Prévia da landing](docs/preview.gif)
-->

---

## ✨ Destaques

- **Animações guiadas pela rolagem**, todas reversíveis: rolando de volta, cada efeito volta ao estado inicial e roda de novo.
  - Título "BLACK FRIDAY" que entra letra por letra e se espalha ao rolar.
  - Texto que se revela letra por letra, enquanto uma embalagem gira de forma suave, interpolada a cada quadro.
  - Seção fixa com ondas coloridas que se expandem do centro e cards que crescem e encolhem junto com a opacidade.
  - Letras que "saltam" em onda, das extremidades para o centro.
  - Galeria horizontal comandada pela rolagem vertical.
  - Títulos que entram em partes, uma linha pela esquerda e outra pela direita.
- **Física 2D no rodapé**, escrita do zero, sem bibliotecas: selos caem, colidem e podem ser arrastados com mouse ou toque.
- **Fita "PUXE"**: uma etiqueta que o usuário arrasta para revelar o desconto e que volta sozinha ao soltar (mouse e toque).
- **Vitrine de produtos automática**: lê a categoria `/outlet` da loja, com paginação, e monta os cards com foto, preço "de/por", preço no Pix e % de desconto. Se a leitura falhar, usa uma lista de reserva.
- **Responsiva de verdade**: o layout considera a largura e também a altura da tela (unidades `svh` e cálculo em JavaScript), para nada ficar encoberto em celulares mais "baixos".
- **Interações de UI**: menu sanduíche, efeito *ripple* nos botões, hover com escala e sombra, rolagem suave, ícones animados e contagem regressiva.

## 🛠️ Tecnologias

- **HTML5** semântico, com atributos de acessibilidade (`aria-*`, `alt`, `role`).
- **CSS3**: variáveis, Grid/Flexbox, `position: sticky`, `clip-path`, `content-visibility`, `@keyframes` e *media queries* por largura e altura.
- **JavaScript (ES5+ / vanilla)**: `requestAnimationFrame`, `IntersectionObserver`, Pointer Events, `fetch` + `DOMParser` e `sessionStorage`.
- **Node.js**, usado apenas no script de build. A página em si não tem dependências.

## 📁 Estrutura

```
landing-black-friday-ecofoodpack/
├── index.html              # marcação da página
├── assets/
│   ├── css/
│   │   └── styles.css      # estilos, todos escopados em #efp-bf
│   └── js/
│       ├── config.js       # imagens, links, data da campanha e produtos
│       └── main.js         # motor de rolagem, animações, física e vitrine
├── scripts/
│   └── build-tray.mjs      # gera o arquivo único para a Tray
├── package.json
├── .editorconfig
└── .gitignore
```

## 🚀 Como rodar localmente

Abra o `index.html` com um servidor local, por exemplo a extensão **Live Server** do VS Code, ou rode:

```bash
npm run dev        # sobe um servidor em http://localhost:5500
```

> A vitrine automática lê a categoria da loja pelo mesmo domínio. Localmente, o navegador bloqueia essa leitura por política de CORS, e a página usa a lista de reserva definida em `config.js`.

## ⚙️ Configuração

Tudo o que muda com frequência fica em **`assets/js/config.js`**. Não é preciso mexer na lógica para atualizar a campanha.

| Chave | O que controla |
|---|---|
| `IMG` | Links de todas as imagens (logo, selo, banner, mascote, texturas…) |
| `WHATSAPP` | Link de atendimento usado nos botões de contato |
| `FIM_CAMPANHA` | Data e hora em que a contagem regressiva termina |
| `LOJA` / `OUTLET` | Endereço da loja e da categoria lida pela vitrine automática |
| `PRODUTOS` | Produto-personagem (história e superpoderes) |
| `EXCLUIR` | Trechos de link de produtos que nunca devem aparecer na vitrine |
| `GRADE` | Lista de reserva de produtos, usada se a leitura automática falhar |
| `SELOS` | Imagens que caem no rodapé com física |

## 📦 Publicação (Tray)

```bash
npm run build
```

Gera `dist/landing-tray.html`, um **arquivo único** com CSS e JS embutidos, pronto para colar no editor da Tray.
O build também converte todos os caracteres fora do ASCII (acentos, travessões, setas) em códigos seguros, porque o editor da Tray não interpreta UTF-8 e exibia esses caracteres como "?".

## 🧠 Decisões técnicas

- **Um único laço de animação.** Todo o trabalho visual acontece em um só `requestAnimationFrame`, disparado pela rolagem.
- **Leitura antes de escrita.** As medidas de layout são lidas uma vez por quadro, antes de qualquer alteração de estilo, para evitar *layout thrashing*. Medidas estáveis ficam em cache e só são recalculadas no `resize`.
- **Animação só com `transform` e `opacity`**, as propriedades que a GPU compõe sem recalcular layout.
- **Carregamento por prioridade.** O que aparece na abertura carrega primeiro, e as demais imagens usam *lazy loading*. A textura de fundo, mais pesada, carrega em segundo plano. Seções abaixo da dobra usam `content-visibility: auto`.
- **Sem conflito com a loja.** Todo o CSS é escopado em `#efp-bf` e todo o JS fica dentro de uma IIFE, para não interferir no tema da loja.
- **Acessibilidade.** Respeita `prefers-reduced-motion`, usa botões e links reais, rótulos `aria-label` em controles com ícone e funciona pelo teclado.

## 👤 Autor

**Hugo Mendes**: [LinkedIn](https://www.linkedin.com/) · [Portfólio](#)

## 📄 Direitos

Código disponibilizado para fins de portfólio.
A marca **Ecofoodpack**, o mascote, as fotos e as artes da campanha são de propriedade da Ecofoodpack / Grupo Exact e não podem ser reutilizados sem autorização.
