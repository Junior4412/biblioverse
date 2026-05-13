# BiblioVerse 📚

A plataforma social para amantes de livros. Descubra, avalie e compartilhe suas leituras.

## 🚀 Como subir no GitHub
## teste deploy

### 1. Pré-requisitos
- Node.js 18+
- Git instalado
- Conta no GitHub

### 2. Instalar dependências e testar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

### 3. Criar repositório no GitHub

**Via interface web:**
1. Acesse https://github.com/new
2. Defina um nome (ex: `biblioverse`)
3. Deixe **sem** README (o projeto já tem)
4. Clique em "Create repository"

**Via GitHub CLI (alternativa):**
```bash
gh repo create biblioverse --public --source=. --remote=origin --push
```

### 4. Subir o código

```bash
# Dentro da pasta do projeto:
git init
git add .
git commit -m "feat: BiblioVerse - plataforma social de leitura"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/biblioverse.git
git push -u origin main
```

> Substitua `SEU_USUARIO` pelo seu nome de usuário no GitHub.

### 5. Deploy no Vercel (recomendado)

```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça o deploy
vercel --prod
```

Ou conecte seu repositório diretamente em https://vercel.com/new

O arquivo `vercel.json` já está configurado corretamente para SPA com React Router.

---

## 🛠️ Stack

- **React 18** + **TypeScript**
- **Vite** — bundler
- **Tailwind CSS** — estilização
- **React Router v6** — roteamento
- **Zustand** — gerenciamento de estado
- **Lucide React** — ícones

## 📄 Páginas disponíveis

| Rota | Página |
|---|---|
| `/` | Home |
| `/feed` | Feed de atividades |
| `/books` | Explorar livros |
| `/books/:id` | Detalhes do livro |
| `/dashboard` | Dashboard pessoal |
| `/genres` | Explorar por gênero |
| `/libraries` | Bibliotecas |
| `/login` | Login |
| `/register` | Cadastro |

## ✅ Correções aplicadas

1. **Rotas faltando** — `/dashboard`, `/genres` e `/libraries` agora funcionam com páginas próprias
2. **Notificações** — painel dropdown funcional com mock de notificações e botão "marcar como lidas"
3. **Modo claro/escuro** — toggle aplica classe CSS no `<html>` com variáveis visuais para ambos os temas
4. **Footer** — todos os links agora usam `<Link>` do React Router e navegam corretamente
5. **Gêneros → Livros** — links da página de gêneros filtram automaticamente a página de livros via `?genre=`
