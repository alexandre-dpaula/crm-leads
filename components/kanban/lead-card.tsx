'use client';

import { Draggable } from '@hello-pangea/dnd';
import { formatCurrency } from '@/utils/formatters';
import { EllipsisHorizontalIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '@/utils/cn';

interface LeadCardProps {
  lead: {
    id: string;
    name: string;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    value?: number | string | null;
    notes?: string | null;
    avatarColor?: string | null;
  };
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function LeadCard({ lead, index, onEdit, onDelete }: LeadCardProps) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow',
            snapshot.isDragging ? 'shadow-xl shadow-slate-900/20' : 'hover:shadow-md'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: lead.avatarColor ?? '#4fb689' }}
              >
                {getInitials(lead.name)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{lead.name}</p>
                <p className="text-xs text-slate-400">{lead.company ?? 'Empresa não informada'}</p>
              </div>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-2xl border border-slate-200 bg-white p-1 text-sm shadow-lg">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex w-full items-center rounded-xl px-3 py-2 text-left',
                          active ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                        )}
                        onClick={() => onEdit(lead.id)}
                      >
                        Editar
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex w-full items-center rounded-xl px-3 py-2 text-left',
                          active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'
                        )}
                        onClick={() => onDelete(lead.id)}
                      >
                        Excluir
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500">
            {lead.email ? (
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{lead.email}</span>
              </div>
            ) : null}
            {lead.phone ? (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{lead.phone}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Valor estimado</span>
            <span className="text-sm font-semibold text-slate-700">{formatCurrency(lead.value)}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
