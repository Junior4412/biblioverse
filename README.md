# BiblioVerse 📚

Plataforma social para amantes de livros — descubra, avalie e conecte-se.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173

## Como fazer o build

```bash
npm run build
npm run preview
```

## Deploy no Vercel

1. Faça push deste repositório para o GitHub
2. Acesse https://vercel.com/new
3. Importe o repositório
4. Clique em **Deploy** — sem nenhuma configuração adicional

O `vercel.json` já configura o roteamento SPA automaticamente.

## Estrutura do projeto

```
src/
├── App.tsx              # Roteamento principal
├── main.tsx             # Entry point
├── index.css            # Estilos globais + Tailwind
├── layouts/
│   └── MainLayout.tsx   # Layout com Navbar + Footer
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── FeedPage.tsx     # Feed de reviews
│   ├── BooksPage.tsx    # Explorar livros
│   ├── BookDetailsPage.tsx  # Detalhes do livro
│   ├── LoginPage.tsx    # Login
│   └── RegisterPage.tsx # Cadastro
├── shared/
│   ├── components/ui/   # Componentes reutilizáveis
│   ├── constants/       # mockData.ts
│   ├── types/           # TypeScript types
│   └── utils.ts         # Funções utilitárias
└── store/
    └── index.ts         # Estado global (Zustand)
```
