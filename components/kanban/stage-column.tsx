'use client';

import { Droppable } from '@hello-pangea/dnd';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import LeadCard from './lead-card';
import { cn } from '@/utils/cn';

interface StageColumnProps {
  stage: {
    id: string;
    name: string;
    order: number;
  };
  leads: Array<{
    id: string;
    name: string;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    value?: number | string | null;
    notes?: string | null;
    avatarColor?: string | null;
  }>;
  onAddLead: (stageId: string) => void;
  onEditStage: (stageId: string, name: string) => void;
  onEditLead: (id: string) => void;
  onDeleteLead: (id: string) => void;
}

export default function StageColumn({ stage, leads, onAddLead, onEditStage, onEditLead, onDeleteLead }: StageColumnProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [stageName, setStageName] = useState(stage.name);

  useEffect(() => {
    setStageName(stage.name);
  }, [stage.name]);

  const handleStageNameBlur = () => {
    if (stageName.trim() && stageName.trim() !== stage.name) {
      onEditStage(stage.id, stageName.trim());
    } else {
      setStageName(stage.name);
    }
    setIsEditingName(false);
  };

  return (
    <section className="flex h-full min-h-[28rem] flex-col rounded-3xl bg-slate-100">
      <div className="flex items-center justify-between px-4 pt-4">
        {isEditingName ? (
          <input
            value={stageName}
            autoFocus
            onChange={(event) => setStageName(event.target.value)}
            onBlur={handleStageNameBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleStageNameBlur();
              }
              if (event.key === 'Escape') {
                setStageName(stage.name);
                setIsEditingName(false);
              }
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-brand-400 focus:outline-none focus:ring"
          />
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{stage.name}</h3>
            <button
              className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              onClick={() => setIsEditingName(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-200"
          onClick={() => onAddLead(stage.id)}
        >
          <PlusIcon className="h-4 w-4" />
          Novo
        </Button>
      </div>

      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'mt-4 flex flex-1 flex-col gap-4 px-4 pb-6 transition',
              snapshot.isDraggingOver ? 'rounded-3xl border border-dashed border-brand-400 bg-brand-50/40' : ''
            )}
          >
            {leads.length === 0 ? (
              <Transition
                show
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
              >
                <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 text-center text-sm text-slate-400">
                  Nenhum lead neste estágio
                </div>
              </Transition>
            ) : null}
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} onEdit={onEditLead} onDelete={onDeleteLead} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
