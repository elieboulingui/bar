'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/auth/login');
          return;
        }

        const data = await response.json();
        if (data.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/cashier');
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? <p>Chargement...</p> : null}
    </div>
  );
}
