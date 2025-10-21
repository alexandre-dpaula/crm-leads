'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { resetRequestSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const schema = resetRequestSchema;
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Não foi possível enviar o e-mail.');
      }

      toast.success('Se o e-mail existir, enviaremos as instruções.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível enviar o e-mail.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Recuperar acesso</h1>
        <p className="text-sm text-slate-500">
          Informe seu e-mail para receber o link de redefinição de senha.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            E-mail
          </label>
          <Input id="email" type="email" placeholder="seuemail@empresa.com" {...register('email')} />
          {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Spinner size={18} /> : 'Enviar link'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Lembrou sua senha?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
