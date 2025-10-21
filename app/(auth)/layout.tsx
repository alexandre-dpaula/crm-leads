import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlowCRM — Acesse sua conta'
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
          {children}
        </div>
      </div>
    </div>
  );
}
