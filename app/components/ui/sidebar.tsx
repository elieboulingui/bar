'use client';

import * as React from 'react';
import { cn } from '@/app/lib/utils';
import { List, ShoppingCart, Receipt, Clock4 } from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const items: SidebarItem[] = [
  { href: '#products', label: 'Produits', icon: List },
  { href: '#cart', label: 'Panier', icon: ShoppingCart },
  { href: '#receipt', label: 'Reçu', icon: Receipt },
  { href: '#status', label: 'Statut', icon: Clock4 },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">Caisse</h2>
          <p className="text-sm text-slate-500">Navigation rapide pour le caissier.</p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon className="h-5 w-5 text-slate-500 group-hover:text-slate-950" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
