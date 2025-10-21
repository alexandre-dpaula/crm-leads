'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface LeadStage {
  id: string;
  name: string;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  value?: string | number | null;
  notes?: string | null;
  stageId?: string | null;
  position: number;
  avatarColor?: string | null;
  stage?: LeadStage | null;
}

interface LeadsResponse {
  leads: Lead[];
  stages: LeadStage[];
}

export function useLeads(initialData?: Partial<LeadsResponse>) {
  const queryClient = useQueryClient();

  const leadsQuery = useQuery<LeadsResponse>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Erro ao carregar leads');
      }
      return res.json();
    },
    initialData: initialData
      ? {
          leads: initialData.leads ?? [],
          stages: initialData.stages ?? []
        }
      : undefined,
    staleTime: 5 * 60 * 1000
  });

  const reorderMutation = useMutation({
    mutationFn: async (moves: Array<{ id: string; stageId: string; position: number }>) => {
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moves })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Não foi possível reordenar os leads');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['leads'], (prev: LeadsResponse | undefined) => {
        if (!prev) return { leads: data.leads, stages: [] } as LeadsResponse;
        return { ...prev, leads: data.leads };
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao reordenar leads');
    }
  });

  const createLeadMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Não foi possível criar o lead');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['leads'], (prev: LeadsResponse | undefined) => {
        if (!prev) return { leads: [data.lead], stages: [] } as LeadsResponse;
        return { ...prev, leads: [data.lead, ...prev.leads] };
      });
      toast.success('Lead criado com sucesso');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar lead');
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Não foi possível atualizar o lead');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['leads'], (prev: LeadsResponse | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: prev.leads.map((lead) => (lead.id === data.lead.id ? data.lead : lead))
        };
      });
      toast.success('Lead atualizado');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar lead');
    }
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Não foi possível remover o lead');
      }

      return response.json();
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(['leads'], (prev: LeadsResponse | undefined) => {
        if (!prev) return prev;
        return { ...prev, leads: prev.leads.filter((lead) => lead.id !== id) };
      });
      toast.success('Lead removido');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao remover lead');
    }
  });

  const updateStagesMutation = useMutation({
    mutationFn: async (stages: Array<{ id: string; name: string; order: number }>) => {
      const response = await fetch('/api/stages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stages })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Não foi possível atualizar os estágios');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['leads'], (prev: LeadsResponse | undefined) => {
        if (!prev) return prev;
        const updatedStages = data.stages as LeadStage[];
        const stageMap = new Map(updatedStages.map((stage) => [stage.id, stage]));
        return {
          stages: updatedStages,
          leads: prev.leads.map((lead) =>
            lead.stageId && stageMap.has(lead.stageId) ? { ...lead, stage: stageMap.get(lead.stageId) } : lead
          )
        } as LeadsResponse;
      });
      toast.success('Estágios atualizados');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar estágios');
    }
  });

  return {
    leadsQuery,
    reorderMutation,
    createLeadMutation,
    updateLeadMutation,
    deleteLeadMutation,
    updateStagesMutation
  };
}
