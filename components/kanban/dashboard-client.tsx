'use client';

import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import StageColumn from './stage-column';
import LeadModal, { LeadFormValues } from './lead-modal';
import ConfirmDialog from '@/components/modals/confirm-dialog';
import { useLeads } from '@/hooks/use-leads';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface DashboardClientProps {
  initialStages: Array<{ id: string; name: string; order: number }>;
}

export default function DashboardClient({ initialStages }: DashboardClientProps) {
  const queryClient = useQueryClient();
  const { leadsQuery, reorderMutation, createLeadMutation, updateLeadMutation, deleteLeadMutation, updateStagesMutation } =
    useLeads({ stages: initialStages, leads: [] });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>();

  const stages = leadsQuery.data?.stages ?? initialStages;
  const leads = leadsQuery.data?.leads ?? [];

  const groupedLeads = useMemo(() => {
    const map = new Map<string, typeof leads>();
    stages.forEach((stage) => {
      map.set(stage.id, []);
    });
    leads.forEach((lead) => {
      if (lead.stageId && map.has(lead.stageId)) {
        map.get(lead.stageId)!.push(lead);
      }
    });
    for (const [, list] of map) {
      list.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return map;
  }, [leads, stages]);

  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId), [leads, selectedLeadId]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceStageId = source.droppableId;
    const destinationStageId = destination.droppableId;

    const current = queryClient.getQueryData(['leads']);
    if (!current) return;

    const sourceLeads = [...(groupedLeads.get(sourceStageId) ?? [])];
    const destLeads = sourceStageId === destinationStageId ? sourceLeads : [...(groupedLeads.get(destinationStageId) ?? [])];
    const movingLeadIndex = sourceLeads.findIndex((lead) => lead.id === draggableId);

    if (movingLeadIndex === -1) return;

    const [movingLead] = sourceLeads.splice(movingLeadIndex, 1);
    if (sourceStageId === destinationStageId) {
      destLeads.splice(destination.index, 0, movingLead);
    } else {
      destLeads.splice(destination.index, 0, { ...movingLead, stageId: destinationStageId });
    }

    const columnsToPersist = new Map<string, typeof sourceLeads>();
    columnsToPersist.set(sourceStageId, sourceStageId === destinationStageId ? destLeads : sourceLeads);
    if (destinationStageId !== sourceStageId) {
      columnsToPersist.set(destinationStageId, destLeads);
    }

    const moves: Array<{ id: string; stageId: string; position: number }> = [];
    columnsToPersist.forEach((items, stageId) => {
      items.forEach((lead, index) => {
        moves.push({ id: lead.id, stageId, position: index });
      });
    });

    const updatedLeads = leads.map((lead) => {
      const move = moves.find((m) => m.id === lead.id);
      if (!move) return lead;
      return { ...lead, stageId: move.stageId, position: move.position };
    });

    queryClient.setQueryData(['leads'], (prev: typeof leadsQuery.data | undefined) => {
      if (!prev) return prev;
      return { ...prev, leads: updatedLeads };
    });

    reorderMutation.mutate(moves, {
      onError: () => {
        queryClient.invalidateQueries({ queryKey: ['leads'] });
      }
    });
  };

  const handleCreateLead = async (values: LeadFormValues) => {
    await createLeadMutation.mutateAsync({ ...values, stageId: values.stageId ?? selectedStageId });
    setIsCreateModalOpen(false);
  };

  const handleUpdateLead = async (values: LeadFormValues) => {
    if (!selectedLeadId) return;
    await updateLeadMutation.mutateAsync({ id: selectedLeadId, payload: values });
    setIsEditModalOpen(false);
  };

  const handleDeleteLead = async () => {
    if (!selectedLeadId) return;
    await deleteLeadMutation.mutateAsync(selectedLeadId);
    setIsDeleteModalOpen(false);
  };

  const handleStageRename = async (stageId: string, name: string) => {
    const stage = stages.find((item) => item.id === stageId);
    if (!stage) return;
    await updateStagesMutation.mutateAsync([{ id: stage.id, name, order: stage.order }]);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kanban de Leads</h1>
          <p className="text-sm text-slate-500">Organize seu pipeline e acompanhe o progresso dos clientes.</p>
        </div>
        <Button
          onClick={() => {
            setSelectedStageId(stages[0]?.id);
            setIsCreateModalOpen(true);
          }}
          className="rounded-xl px-5"
        >
          <PlusIcon className="h-5 w-5" />
          Novo lead
        </Button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {leadsQuery.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size={28} />
          </div>
        ) : (
          <div className="flex flex-1 overflow-x-auto bg-slate-100 px-6 py-10">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex min-h-full gap-6">
                {stages.map((stage) => (
                  <div key={stage.id} className="w-80 flex-shrink-0">
                    <StageColumn
                      stage={stage}
                      leads={groupedLeads.get(stage.id) ?? []}
                      onAddLead={(id) => {
                        setSelectedStageId(id);
                        setIsCreateModalOpen(true);
                      }}
                      onEditStage={handleStageRename}
                      onEditLead={(id) => {
                        setSelectedLeadId(id);
                        setIsEditModalOpen(true);
                      }}
                      onDeleteLead={(id) => {
                        setSelectedLeadId(id);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        )}
      </main>

      <LeadModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
        submitting={createLeadMutation.isPending}
        stages={stages}
        defaultStageId={selectedStageId ?? stages[0]?.id}
        title="Novo lead"
        ctaLabel="Criar lead"
      />

      <LeadModal
        open={isEditModalOpen && !!selectedLead}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateLead}
        submitting={updateLeadMutation.isPending}
        stages={stages}
        defaultStageId={selectedLead?.stageId ?? stages[0]?.id}
        initialData={selectedLead}
        title="Editar lead"
        ctaLabel="Salvar alterações"
      />

      <ConfirmDialog
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteLead}
        loading={deleteLeadMutation.isPending}
        title="Excluir lead"
        description="Esta ação removerá o lead do pipeline de forma permanente."
        confirmLabel="Excluir"
      />
    </div>
  );
}
