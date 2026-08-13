'use client';

import * as React from 'react';
import { List, Box, Database, BarChart2, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">Admin</h2>
          <p className="text-sm text-slate-500">Gestion complète de la boutique</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard/admin/products"
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <List className="h-5 w-5 text-slate-500 group-hover:text-slate-950" />
            Produits
          </Link>

          <Link
            href="/dashboard/admin/stock"
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Database className="h-5 w-5 text-slate-500 group-hover:text-slate-950" />
            Stock / Inventaire
          </Link>

          <Link
            href="/dashboard/admin/sales"
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Box className="h-5 w-5 text-slate-500 group-hover:text-slate-950" />
            Ventes
          </Link>

          <Link
            href="/dashboard/admin/reports"
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <BarChart2 className="h-5 w-5 text-slate-500 group-hover:text-slate-950" />
            Rapports
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Users className="h-5 w-5 text-slate-500 group-hover:text-slate-950" />
            Utilisateurs
          </Link>
        </nav>
      </div>
    </aside>
  );
}
