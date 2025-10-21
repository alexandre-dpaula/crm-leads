import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, Users } from '@radix-ui/react-icons';

const features = [
  {
    icon: Sparkles,
    title: 'Pipeline visual e intuitivo',
    description:
      'Organize seu funil em colunas personalizáveis, arraste oportunidades e acompanhe a evolução do time.'
  },
  {
    icon: Users,
    title: 'Colaboração sem atrito',
    description:
      'Compartilhe contexto com sua equipe, centralize atividades e mantenha todos alinhados com o cliente.'
  },
  {
    icon: ShieldCheck,
    title: 'Autenticação segura',
    description:
      'Tokens seguros, reset de senha por e-mail e isolamento total dos dados dos seus clientes.'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">F</span>
          FlowCRM
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-200 hover:text-white">
            Entrar
          </Link>
          <Button asChild variant="primary" size="md">
            <Link href="/register" className="flex items-center gap-2">
              Experimente grátis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24">
        <section className="grid grid-cols-1 gap-16 pt-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="flex flex-col gap-8">
            <span className="w-fit rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              CRM minimalista
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Simplifique o acompanhamento dos seus leads e feche negócios com mais velocidade.
            </h1>
            <p className="max-w-xl text-base text-slate-300">
              FlowCRM é um CRM moderno, focado em produtividade. Crie pipelines visuais, automatize etapas e mantenha
              seu time alinhado com uma interface elegante e responsiva.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Começar agora</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="border border-slate-800 bg-transparent text-white">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-6 text-sm text-slate-400">
              <div>
                <span className="block text-base font-semibold text-white">+3x</span>
                Mais oportunidades concluídas
              </div>
              <div>
                <span className="block text-base font-semibold text-white">98%</span>
                de satisfação dos usuários
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,1)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Visualização Kanban</p>
              <h2 className="pt-4 text-2xl font-semibold text-white">Pipeline em tempo real</h2>
              <p className="pt-2 text-sm text-slate-400">
                Organize leads em colunas claras, arraste e solte cards, acompanhe atividades e feche mais vendas sem
                perder o foco.
              </p>
              <div className="mt-8 grid gap-3 text-xs text-slate-400">
                <div className="flex items-center justify-between rounded-xl bg-slate-900/70 p-3">
                  <span className="font-medium text-white">Novo Lead — Ana Silva</span>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-brand-300">Novo</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/70 p-3">
                  <span className="font-medium text-white">Reunião agendada — StartUpX</span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-300">Em contato</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/70 p-3">
                  <span className="font-medium text-white">Proposta enviada — Agência Aurora</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">Fechamento</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,1)]"
            >
              <feature.icon className="h-6 w-6 text-brand-300" />
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-900/60 bg-slate-950/80 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} FlowCRM. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-white">
              Entrar
            </Link>
            <Link href="/register" className="hover:text-white">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
