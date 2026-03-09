# 🦖 DinoLand - Ark Survival Ascended Builds

Um catálogo interativo de dinossauros do Ark Survival Ascended com builds especializadas, stats e preços.

## ✨ Features

- 🔍 **Busca Inteligente** - Encontre dinossauros rapidamente
- 🍖 **Filtros por Dieta** - Carnívoro, Herbívoro, Onívoro e Especial
- 📱 **Design Responsivo** - Interface adaptada para desktop e mobile
- 🎨 **Modal de Imagens** - Visualize imagens em alta qualidade
- ⚡ **Performance Otimizada** - Carregamento rápido com Next.js 14
- 📊 **Builds Organizadas** - Damage, HP, Weight, Balanced e mais
- 💰 **Sistema de Preços** - Valores para eggs, babies e clones
- 🔗 **Links Sociais** - WhatsApp, Telegram e Facebook integrados

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [React Icons](https://react-icons.github.io/react-icons/) - Ícones
- [Tailwind CSS](https://tailwindcss.com/) - Estilização

## 🎮 Getting Started

Instale as dependências:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🖼️ Gerenciamento de Imagens

### Comando: `npm run gerar`

Este comando processa automaticamente todas as imagens dos dinossauros e gera:

- `public/images.js` (arquivo final consumido pela aplicação)
- `public/images-metadata.json` (arquivo para editar manualmente `description`, `isEgg` e `price`)

**O que o script faz:**

1. Varre recursivamente todas as pastas em `public/assets/`
2. Renomeia as imagens para o padrão correto (minúsculas e formato padronizado)
3. Extrai informações de variante dos nomes dos arquivos
4. Gera um único arquivo `public/images.js` com todos os dinossauros organizados
5. Gera/atualiza `public/images-metadata.json` com os campos editáveis

### Arquivo Para Edição Manual

Edite apenas `public/images-metadata.json` para ajustar:

- `description`
- `isEgg` (`true` ou `false`)
- `price`

Exemplo:

```json
{
  "gasbag": {
    "weight": {
      "description": "Build com foco em peso",
      "isEgg": false,
      "price": {
        "egg-pair": 5,
        "egg-m-or-f": 3,
        "baby-pair": 0,
        "baby-m-or-f": 0,
        "clone-m-or-f": 0,
        "clone-pair": 0
      }
    }
  }
}
```

Depois rode `npm run gerar` para refletir no `public/images.js`.

### Estrutura de Pastas

As imagens devem seguir esta estrutura:

```
public/assets/
├── [nome-do-dino]/          # Nome do dinossauro (ex: carcharodontossauro, thylacoleo)
│   ├── capa.png             # Opcional: imagem de capa do dino
│   ├── capa.jpg             # Ou jpg/jpeg/webp
│   ├── [tipo-build-1]/      # Tipo de build (ex: balanced, damage, hp, weight)
│   │   ├── [01]-balanced.png
│   │   ├── [02]-balanced.png
│   │   └── [cyber]-balanced.png
│   └── [tipo-build-2]/
│       ├── [01]-damage.png
│       └── [139]-damage.png
└── [outro-dino]/
    └── [tipo-build]/
        └── [variante]-tipo.png
```

### Padrão de Nomenclatura das Imagens

Na pasta raiz do dinossauro, a imagem de capa pode ter qualquer nome `.png`.

Dentro das subpastas de build, o formato obrigatório continua sendo: `[variante]-tipo.png`

- `[variante]` = identificador entre colchetes (ex: `[01]`, `[cc]`, `[cyber]`, `[164]`)
- `-` = hífen obrigatório após o colchete
- `tipo` = deve corresponder ao nome da pasta (ex: `balanced`, `damage`, `hp`, `weight`)

## 📁 Estrutura do Projeto

```
dinos-ark/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout root
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Header.tsx         # Cabeçalho com busca e filtros
│   ├── DinoList.tsx       # Lista lateral de dinossauros
│   ├── DinoContent.tsx    # Conteúdo principal dos dinos
│   ├── Footer.tsx         # Rodapé com links sociais
│   └── types.ts           # TypeScript types
├── public/
│   ├── assets/            # Imagens dos dinossauros
│   ├── images.js          # Dados gerados automaticamente
│   └── images-metadata.json # Metadados editáveis
└── scripts/
    └── process_images.js  # Script de processamento de imagens
```

## 🎨 Customização

### Atualizar Links Sociais

Edite [components/Footer.tsx](components/Footer.tsx) e atualize as URLs:

```tsx
{
  name: 'Telegram',
  icon: <FaTelegram />,
  url: 'https://t.me/seunometelegram', // Seu @usuário
},
{
  name: 'Facebook',
  icon: <FaFacebook />,
  url: 'https://facebook.com/seuperfil', // Seu perfil
}
```

### Adicionar Novos Dinossauros

1. Crie uma pasta em `public/assets/[nome-do-dino]`
2. Adicione as imagens seguindo o padrão de nomenclatura
3. Execute `npm run gerar`
4. Edite `public/images-metadata.json` com description e preços
5. Execute `npm run gerar` novamente

## 📱 Responsividade

### Desktop (> 960px)

- Filtros de dieta inline
- Sidebar de dinossauros fixa
- Grid de 2 colunas

### Mobile (≤ 960px)

- Filtros em modal (botão hamburger ☰)
- Lista de dinos em modal (botão "Dinos List")
- Conteúdo em coluna única

## 📝 License

Este projeto é de uso pessoal.

## 👤 Contato

- WhatsApp: [+55 62 98154-0735](https://wa.me/5562981540735)
- Telegram: [Seu Telegram]
- Facebook: [Seu Facebook]

---

Desenvolvido com ❤️ para a comunidade Ark Survival Ascended

- Tudo em **minúsculas**

### Regra da Capa

- Se existir um arquivo de imagem `.png`, `.jpg`, `.jpeg` ou `.webp` diretamente dentro da pasta do dinossauro, ele será usado como `capa`
- A capa não passa pela normalização de nome usada nas builds
- A capa não vira uma nova build
- A capa não cria um novo dinossauro, ela apenas é anexada ao mesmo objeto do dino
- Se houver mais de uma imagem `.png` na raiz da pasta, o script usa a primeira em ordem alfabética

**Exemplos corretos:**

- `[01]-balanced.png`
- `[cyber]-damage.png`
- `[164]-weight.png`
- `[tiger]-hp.png`

**Exemplos incorretos:**

- `[01] balanced.png` ❌ (espaço ao invés de hífen)
- `[01]-Balanced.png` ❌ (maiúscula)
- `01-balanced.png` ❌ (falta os colchetes)

### Estrutura do JSON Gerado

O arquivo `public/images.js` terá esta estrutura:

```javascript
export const dinos = [
  {
    "dino": "carcharodontossauro",
    "capa": "/assets/carcharodontossauro/capa.png",
    "builds": {
      "balanced": {
        "description": "",
        "variantes": [
          { "variant": "01", "fotos": "/assets/carcharodontossauro/balanced/[01]-balanced.png" },
          { "variant": "02", "fotos": "/assets/carcharodontossauro/balanced/[02]-balanced.png" }
        ]
      },
      "damage": {
        "description": "",
        "variantes": [...]
      }
    }
  }
]
```

### Como Adicionar Novos Dinossauros

1. Crie uma pasta com o nome do dinossauro em `public/assets/`
2. Se quiser, adicione uma imagem `.png` direto na raiz para ser a capa
3. Dentro dela, crie subpastas para cada tipo de build (balanced, damage, hp, etc)
4. Adicione as imagens das builds seguindo o padrão `[variante]-tipo.png`
5. Execute `npm run gerar` para atualizar o arquivo JSON
6. O array será automaticamente atualizado com o novo dinossauro

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
