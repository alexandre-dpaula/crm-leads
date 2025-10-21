'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { HomeIcon, UsersIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Leads', href: '/dashboard', icon: UsersIcon },
  { name: 'Configurações', href: '/profile', icon: Cog6ToothIcon }
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Erro ao sair.');
      }
      toast.success('Sessão encerrada.');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível encerrar a sessão.');
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col gap-8 bg-slate-950 px-6 py-8 text-slate-100">
      <Link href="/dashboard" className="flex items-center gap-3 text-lg font-semibold">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">F</span>
        FlowCRM
      </Link>

      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              pathname === item.href ? 'bg-slate-900 text-white shadow-inner shadow-slate-900/40' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-200">
              {getInitials(user.name)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="mt-4 w-full justify-center gap-2 border border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
