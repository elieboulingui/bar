'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Cloud, CloudOff, Printer } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Sidebar } from '@/app/components/ui/sidebar';
import { getProducts } from '@/app/lib/indexeddb';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export default function CashierDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          const cached = await getProducts();
          if (mounted) setProducts(cached);
          return;
        }
        const data = await res.json();
        if (mounted) setProducts(data);
      } catch (e) {
        const cached = await getProducts();
        if (mounted) setProducts(cached);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} />
              <h1 className="text-2xl font-semibold">Caisse</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Cloud size={16} />
              <span>Connecté</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <div key={p.id} className="rounded-2xl border p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-sm text-slate-500">{p.category || '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{p.price.toFixed(2)} €</div>
                        <div className="text-xs text-slate-500">{p.quantity} en stock</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button size="sm">Ajouter</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
