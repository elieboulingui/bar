'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Boxes, LogOut, Package, ReceiptText, Users, WifiOff } from 'lucide-react';
import { cn } from '@/app/lib/utils';

const items = [
  { href: '/dashboard/admin/products', label: 'Produits', icon: Package },
  { href: '/dashboard/admin/stock', label: 'Stock', icon: Boxes },
  { href: '/dashboard/admin/sales', label: 'Ventes', icon: ReceiptText },
  { href: '/dashboard/admin/reports', label: 'Rapports', icon: BarChart3 },
  { href: '/dashboard/admin/users', label: 'Équipe', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-64 lg:self-start">
      <div className="flex items-center justify-between rounded-2xl bg-sidebar p-3 text-sidebar-foreground lg:min-h-[calc(100vh-3rem)] lg:flex-col lg:items-stretch lg:p-4">
        <div className="flex items-center gap-3 px-2 py-1 lg:py-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary font-mono text-sm font-bold text-sidebar-primary-foreground">BP</span>
          <div><p className="font-heading font-semibold">Bar Pilot</p><p className="text-xs text-sidebar-foreground/55">Espace administrateur</p></div>
        </div>
        <nav className="hidden flex-1 flex-col gap-1 py-8 lg:flex" aria-label="Navigation administrateur">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href.endsWith('/products') && pathname === '/dashboard/admin');
            return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={cn('flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors', active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')}><Icon className="size-5" />{label}</Link>;
          })}
        </nav>
        <div className="hidden flex-col gap-2 lg:flex">
          <Link href="/hors-ligne" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><WifiOff className="size-5" />Mode hors ligne</Link>
          <Link href="/api/auth/logout" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><LogOut className="size-5" />Déconnexion</Link>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto lg:hidden">
          {items.slice(0, 4).map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-label={label} className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', pathname === href ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/65')}><Icon className="size-5" /></Link>)}
        </div>
      </div>
    </aside>
  );
}
