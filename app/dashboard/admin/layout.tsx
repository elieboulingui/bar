import React from 'react';
import { redirect } from 'next/navigation';
import { getAuth } from '@/app/lib/auth';
import AdminSidebar from '@/app/components/ui/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuth();

  if (!auth) {
    redirect('/auth/login');
  }

  // Only allow ADMIN to access admin pages; otherwise send cashier to cashier dashboard
  if (auth.role !== 'ADMIN') {
    redirect('/dashboard/cashier');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-6 lg:px-8 flex gap-6">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
