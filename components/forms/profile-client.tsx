'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { profileSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const schema = profileSchema;
type FormValues = z.infer<typeof schema>;

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatarUrl);
  const [avatarData, setAvatarData] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email
    }
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, avatarData })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Erro ao atualizar perfil');
      }

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível atualizar suas informações.');
  } finally {
    setSubmitting(false);
    setValue('currentPassword', '');
    setValue('newPassword', '');
    setValue('confirmPassword', '');
  }
};

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }

    const dataUrl = await readFileAsDataURL(file);
    setAvatarPreview(dataUrl);
    setAvatarData(dataUrl);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-10 py-6">
        <h1 className="text-2xl font-semibold text-slate-900">Perfil</h1>
        <p className="text-sm text-slate-500">Atualize suas informações pessoais e preferências de conta.</p>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Informações principais</h2>
            <p className="text-sm text-slate-500">Nome, e-mail e avatar usados no sistema.</p>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-slate-200">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 text-xs text-slate-400">
                  <label className="cursor-pointer rounded-xl border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100">
                    Alterar avatar
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  <span>PNG ou JPG até 2MB</span>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="name">
                    Nome completo
                  </label>
                  <Input id="name" placeholder="Seu nome" {...register('name')} />
                  {errors.name ? <p className="text-xs text-rose-500">{errors.name.message}</p> : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">
                    E-mail
                  </label>
                  <Input id="email" type="email" placeholder="seuemail@empresa.com" {...register('email')} />
                  {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Segurança</h2>
            <p className="text-sm text-slate-500">Troque sua senha para manter a conta protegida.</p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="currentPassword">
                  Senha atual
                </label>
                <Input id="currentPassword" type="password" placeholder="••••••" {...register('currentPassword')} />
                {errors.currentPassword ? <p className="text-xs text-rose-500">{errors.currentPassword.message}</p> : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="newPassword">
                  Nova senha
                </label>
                <Input id="newPassword" type="password" placeholder="••••••" {...register('newPassword')} />
                {errors.newPassword ? <p className="text-xs text-rose-500">{errors.newPassword.message}</p> : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                  Confirmar nova senha
                </label>
                <Input id="confirmPassword" type="password" placeholder="••••••" {...register('confirmPassword')} />
                {errors.confirmPassword ? <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p> : null}
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-slate-200 bg-white text-slate-600"
              onClick={() => {
                setAvatarPreview(user.avatarUrl);
                setAvatarData(undefined);
                setValue('name', user.name);
                setValue('email', user.email);
                setValue('currentPassword', '');
                setValue('newPassword', '');
                setValue('confirmPassword', '');
              }}
            >
              Reverter alterações
            </Button>
            <Button type="submit" disabled={submitting} className="min-w-[160px]">
              {submitting ? <Spinner size={18} /> : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
