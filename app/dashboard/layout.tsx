import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from '@/components/layout/sidebar';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="grid min-h-screen grid-cols-[16rem_1fr] bg-slate-100">
      <Sidebar user={{ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }} />
      <div className="flex flex-col overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
