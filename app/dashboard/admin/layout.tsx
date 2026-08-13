import React from 'react';
import { redirect } from 'next/navigation';
import { getAuth } from '@/app/lib/auth';
import AdminSidebar from '@/app/components/ui/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuth();
  if (!auth) redirect('/auth/login');
  if (auth.role !== 'ADMIN') redirect('/dashboard/cashier');

  return (
    <div className="min-h-screen bg-muted/40 p-3 md:p-6">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 lg:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 py-2 lg:py-1">{children}</main>
      </div>
    </div>
  );
}
