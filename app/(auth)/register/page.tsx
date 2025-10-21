'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { registerSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const schema = registerSchema;
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Erro ao criar conta.');
      }

      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível finalizar o cadastro.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Crie sua conta FlowCRM</h1>
        <p className="text-sm text-slate-500">Organize seus leads com um pipeline inteligente.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Nome
          </label>
          <Input id="name" placeholder="Seu nome completo" {...register('name')} />
          {errors.name ? <p className="text-xs text-rose-500">{errors.name.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            E-mail
          </label>
          <Input id="email" type="email" placeholder="seuemail@empresa.com" {...register('email')} />
          {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Senha
          </label>
          <Input id="password" type="password" placeholder="••••••" {...register('password')} />
          {errors.password ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <Input id="confirmPassword" type="password" placeholder="••••••" {...register('confirmPassword')} />
          {errors.confirmPassword ? <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p> : null}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Spinner size={18} /> : 'Criar conta'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Já possui conta?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
