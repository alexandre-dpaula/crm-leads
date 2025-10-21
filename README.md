# FlowCRM (CRM Leads V2)

Aplicação SaaS simples para gestão de leads com pipeline Kanban, construída em Next.js 14, Prisma e Tailwind CSS.

## ✨ Principais funcionalidades

- Autenticação com registro, login, logout e reset de senha por e-mail.
- Isolamento de dados por usuário com Prisma + PostgreSQL.
- Pipeline Kanban com drag-and-drop, criação/edição/exclusão de leads em modais.
- Edição inline dos nomes das colunas (estágios).
- Dashboard com layout inspirado em CRMs modernos (sidebar escura, cards com sombras suaves).
- Página pública (landing page) apresentando o produto.
- Tela de perfil com atualização de dados e upload de avatar.

## 🧱 Stack técnica

- **Front-end**: Next.js 14 (App Router) + React 18 + Tailwind CSS.
- **Back-end**: API Routes do Next.js com Prisma ORM.
- **Banco**: PostgreSQL.
- **Autenticação**: JWT com cookies httpOnly.
- **Drag-and-drop**: `@hello-pangea/dnd`.
- **Formulários & validação**: `react-hook-form` + `zod`.
- **Feedback visual**: `react-hot-toast`.

## ⚙️ Configuração do projeto

1. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn
   ```

2. Configure as variáveis de ambiente copiando `.env.example` para `.env` e ajustando os valores:

   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/crm_leads"
   JWT_SECRET="altere-esta-chave"
   APP_BASE_URL="http://localhost:3000"
   EMAIL_TRANSPORT_URL="smtp://user:pass@smtp.example.com:587"
   EMAIL_FROM="FlowCRM <no-reply@flowcrm.com>"
   ```

3. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

## 📧 E-mails de reset de senha

- Configure `EMAIL_TRANSPORT_URL` com uma string de conexão SMTP válida.
- Em ambiente local você pode usar serviços como [Mailtrap](https://mailtrap.io/) para testes.
- `APP_BASE_URL` precisa apontar para a URL pública da aplicação para montar o link de reset corretamente.

## 📦 Deploy

- Front-end (Next.js) pode ser publicado na Vercel.
- Banco e API podem ser hospedados na Railway/Render utilizando um banco PostgreSQL.
- Garanta que as variáveis de ambiente estejam configuradas no provedor escolhido.

## ✅ Próximos passos sugeridos

- Implementar logs de atividades por lead.
- Adicionar testes automatizados para os fluxos críticos (auth e CRUD de leads).
- Documentar a API com Swagger/OpenAPI.
- Habilitar modo escuro persistente e alternância via usuário.
