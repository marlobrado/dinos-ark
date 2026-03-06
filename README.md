This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Gerenciamento de Imagens

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
