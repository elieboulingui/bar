'use client';

import Link from 'next/link';
import { Home, LogOut, ShoppingCart, WifiOff } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-60 lg:self-start">
      <div className="flex items-center justify-between rounded-2xl bg-sidebar p-3 text-sidebar-foreground lg:min-h-[calc(100vh-3rem)] lg:flex-col lg:items-stretch lg:p-4">
        <Link href="/" className="flex items-center gap-3 px-2 py-1">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary font-mono text-sm font-bold text-sidebar-primary-foreground">BP</span>
          <div><p className="font-heading font-semibold">Bar Pilot</p><p className="text-xs text-sidebar-foreground/55">Poste caissier</p></div>
        </Link>
        <nav className="hidden flex-1 flex-col gap-1 py-8 lg:flex" aria-label="Navigation caissier">
          <a href="#produits" className="flex items-center gap-3 rounded-xl bg-sidebar-primary px-3 py-3 text-sm font-medium text-sidebar-primary-foreground"><ShoppingCart className="size-5" />Nouvelle vente</a>
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Home className="size-5" />Accueil</Link>
          <Link href="/hors-ligne" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><WifiOff className="size-5" />Mode hors ligne</Link>
        </nav>
        <Link href="/api/auth/logout" aria-label="Déconnexion" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><LogOut className="size-5" /><span className="hidden lg:inline">Déconnexion</span></Link>
      </div>
    </aside>
  );
}
