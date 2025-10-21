'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import BaseModal from '@/components/modals/base-modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { leadSchema } from '@/lib/validators';

const schema = leadSchema.pick({
  name: true,
  company: true,
  email: true,
  phone: true,
  value: true,
  notes: true,
  stageId: true
});

export type LeadFormValues = z.infer<typeof schema>;

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  submitting?: boolean;
  stages: Array<{ id: string; name: string; order: number }>;
  defaultStageId?: string;
  initialData?: Partial<LeadFormValues>;
  title: string;
  ctaLabel: string;
}

export default function LeadModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  stages,
  defaultStageId,
  initialData,
  title,
  ctaLabel
}: LeadModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      stageId: defaultStageId,
      ...initialData
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        company: initialData?.company ?? '',
        email: initialData?.email ?? '',
        phone: initialData?.phone ?? '',
        value: initialData?.value ?? '',
        notes: initialData?.notes ?? '',
        stageId: initialData?.stageId ?? defaultStageId
      });
    }
  }, [open, initialData, defaultStageId, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <BaseModal open={open} onClose={onClose} title={title} size="lg">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Nome do lead
          </label>
          <Input id="name" placeholder="Ex.: Ana Silva" {...register('name')} />
          {errors.name ? <p className="text-xs text-rose-500">{errors.name.message}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="company">
              Empresa
            </label>
            <Input id="company" placeholder="Ex.: Flow Studio" {...register('company')} />
            {errors.company ? <p className="text-xs text-rose-500">{errors.company.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="stageId">
              Estágio
            </label>
            <select
              id="stageId"
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              {...register('stageId')}
            >
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
            {errors.stageId ? <p className="text-xs text-rose-500">{errors.stageId.message}</p> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              E-mail
            </label>
            <Input id="email" type="email" placeholder="contato@cliente.com" {...register('email')} />
            {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="phone">
              Telefone
            </label>
            <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
            {errors.phone ? <p className="text-xs text-rose-500">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="value">
            Valor estimado (R$)
          </label>
          <Input id="value" type="number" step="0.01" placeholder="4500" {...register('value')} />
          {errors.value ? <p className="text-xs text-rose-500">{errors.value.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="notes">
            Anotações
          </label>
          <Textarea id="notes" rows={4} placeholder="Adicione observações relevantes" {...register('notes')} />
          {errors.notes ? <p className="text-xs text-rose-500">{errors.notes.message}</p> : null}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="border border-slate-200 bg-white text-slate-700">
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting ? <Spinner size={18} /> : ctaLabel}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
