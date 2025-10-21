'use client';

import BaseModal from './base-modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <BaseModal open={open} onClose={onCancel} title={title} description={description}>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" onClick={onCancel} className="border border-slate-200 bg-white text-slate-600">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} disabled={loading} className="min-w-[110px] bg-rose-500 hover:bg-rose-600">
          {loading ? <Spinner size={18} /> : confirmLabel}
        </Button>
      </div>
    </BaseModal>
  );
}
