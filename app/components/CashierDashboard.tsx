'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Minus, Plus, Search, ShoppingCart, Trash2, Wifi } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Sidebar } from '@/app/components/ui/sidebar';
import { getProducts } from '@/app/lib/indexeddb';

interface Product { id: string; name: string; price: number; quantity: number; category?: string }
const money = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  useEffect(() => { let mounted = true; const load = async () => { try { const res = await fetch('/api/products'); if (!res.ok) throw new Error(); const data = await res.json(); if (mounted) setProducts(data); } catch { const cached = await getProducts(); if (mounted) { setProducts(cached); setOnline(false); } } finally { if (mounted) setLoading(false); } }; load(); return () => { mounted = false; }; }, []);
  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const lines = products.filter((p) => cart[p.id]).map((p) => ({ ...p, count: cart[p.id] }));
  const total = lines.reduce((sum, line) => sum + line.price * line.count, 0);
  const add = (p: Product) => setCart((current) => ({ ...current, [p.id]: Math.min(p.quantity, (current[p.id] || 0) + 1) }));
  const change = (id: string, delta: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }));
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Préparation de la caisse…</div>;

  return <main className="min-h-screen bg-muted/40 p-3 md:p-6"><div className="mx-auto flex max-w-[1500px] flex-col gap-4 lg:flex-row"><Sidebar /><section className="min-w-0 flex-1"><header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Point de vente</p><h1 className="mt-2 font-heading text-3xl font-bold">Caisse rapide</h1><p className="mt-1 text-sm text-muted-foreground">Touchez un produit pour l’ajouter au panier.</p></div><span className="flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"><Wifi className="size-4 text-primary" />{online ? 'Synchronisé' : 'Données locales'}</span></header>
  <div className="grid gap-4 xl:grid-cols-[1fr_380px]"><Card><CardHeader><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Produits disponibles</CardTitle><CardDescription>{filtered.length} articles</CardDescription></div><label className="relative"><span className="sr-only">Rechercher</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" /></label></div></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{filtered.map((p) => <button key={p.id} onClick={() => add(p)} disabled={p.quantity <= 0} className="flex min-h-32 flex-col justify-between rounded-2xl border bg-background p-4 text-left transition hover:border-primary hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-45"><div><p className="font-heading text-lg font-semibold">{p.name}</p><p className="text-sm text-muted-foreground">{p.category || 'Boisson'}</p></div><div className="flex items-end justify-between"><strong className="font-mono text-primary">{money(p.price)}</strong><span className="text-xs text-muted-foreground">{p.quantity} dispo.</span></div></button>)}</div></CardContent></Card>
  <Card className="h-fit xl:sticky xl:top-6"><CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="size-5" />Commande</CardTitle><CardDescription>{lines.reduce((n, l) => n + l.count, 0)} article(s)</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-4">{lines.length === 0 ? <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted py-10 text-center"><ShoppingCart className="size-8 text-muted-foreground" /><div><p className="font-medium">Panier vide</p><p className="text-sm text-muted-foreground">Sélectionnez une boisson.</p></div></div> : lines.map((line) => <div key={line.id} className="flex items-center justify-between gap-3 border-b pb-4"><div className="min-w-0"><p className="truncate font-medium">{line.name}</p><p className="font-mono text-xs text-muted-foreground">{money(line.price * line.count)}</p></div><div className="flex items-center gap-1"><Button size="icon" variant="outline" aria-label="Retirer une unité" onClick={() => change(line.id, -1)}><Minus /></Button><span className="w-7 text-center font-mono text-sm">{line.count}</span><Button size="icon" variant="outline" aria-label="Ajouter une unité" onClick={() => change(line.id, 1)}><Plus /></Button></div></div>)}<div className="flex items-center justify-between pt-2"><span className="font-medium">Total</span><strong className="font-heading text-2xl">{money(total)}</strong></div><Button size="lg" disabled={!lines.length}><Check data-icon="inline-start" />Encaisser</Button>{lines.length > 0 && <Button variant="ghost" onClick={() => setCart({})}><Trash2 data-icon="inline-start" />Vider la commande</Button>}</div></CardContent></Card></div></section></div></main>;
}
