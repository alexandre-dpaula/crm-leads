'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { loginSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const schema = loginSchema;
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Erro ao entrar.');
      }

      toast.success('Bem-vindo de volta!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Acesse sua conta</h1>
        <p className="text-sm text-slate-500">Gerencie seus leads com a experiência FlowCRM.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            E-mail
          </label>
          <Input id="email" type="email" placeholder="seuemail@empresa.com" {...register('email')} />
          {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Senha
            </label>
            <Link href="/reset-password" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Esqueceu a senha?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••" {...register('password')} />
          {errors.password ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Spinner size={18} /> : 'Entrar'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Não possui conta?{' '}
        <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
          Criar acesso
        </Link>
      </p>
    </div>
  );
}
