import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import DashboardClient from '@/components/kanban/dashboard-client';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const stages = await prisma.leadStage.findMany({
    where: { userId: user.id },
    orderBy: { order: 'asc' }
  });

  return <DashboardClient initialStages={stages.map((stage) => ({ id: stage.id, name: stage.name, order: stage.order }))} />;
}
