'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { resetConfirmSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const schema = resetConfirmSchema;
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordTokenPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token }
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Não foi possível alterar sua senha.');
      }

      toast.success('Senha alterada com sucesso. Faça seu login.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível alterar sua senha.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Defina uma nova senha</h1>
        <p className="text-sm text-slate-500">Crie uma senha forte para manter sua conta protegida.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value={token} readOnly {...register('token')} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Nova senha
          </label>
          <Input id="password" type="password" placeholder="••••••" {...register('password')} />
          {errors.password ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirmar nova senha
          </label>
          <Input id="confirmPassword" type="password" placeholder="••••••" {...register('confirmPassword')} />
          {errors.confirmPassword ? <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p> : null}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Spinner size={18} /> : 'Atualizar senha'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Lembrou da senha?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
