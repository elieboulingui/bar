'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Boxes, PackagePlus, Pencil, Plus, Search, ShoppingBag, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

interface Product { id: string; name: string; price: number; quantity: number; category?: string; description?: string }
interface Sale { id: string; productId: string; quantity: number; price: number; total: number; createdAt: string; product?: Product }
type Tab = 'products' | 'stock' | 'sales' | 'reports' | 'users';
const money = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

const copy: Record<Tab, { title: string; description: string }> = {
  products: { title: 'Catalogue produits', description: 'Gérez les boissons proposées à la caisse.' },
  stock: { title: 'Stock & inventaire', description: 'Surveillez les niveaux et enregistrez les mouvements.' },
  sales: { title: 'Historique des ventes', description: 'Consultez toutes les opérations enregistrées.' },
  reports: { title: 'Rapports', description: 'Une lecture rapide de l’activité de votre bar.' },
  users: { title: 'Équipe', description: 'Gestion des accès administrateur et caissier.' },
};

export default function AdminDashboardV2({ initialTab = 'products' }: { initialTab?: Tab }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', price: '', category: '', quantity: '', description: '' });

  const fetchProducts = async () => { try { const response = await fetch('/api/products'); if (!response.ok) { router.push('/auth/login'); return; } setProducts(await response.json()); } catch (error) { console.error('Error fetching products:', error); } finally { setLoading(false); } };
  const fetchSales = async () => { try { const response = await fetch('/api/sales'); if (response.ok) setSales(await response.json()); } catch (error) { console.error('Error fetching sales:', error); } };
  // Data loading synchronizes this client view with the existing API.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(); if (initialTab === 'sales' || initialTab === 'reports') fetchSales(); }, [initialTab]);

  const resetForm = () => { setFormData({ name: '', price: '', category: '', quantity: '', description: '' }); setEditingId(null); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!formData.name || !formData.price) return alert('Le nom et le prix sont obligatoires.'); const payload = { ...formData, price: Number(formData.price), quantity: Number(formData.quantity || 0) }; const response = await fetch(editingId ? `/api/products/${editingId}` : '/api/products', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) return alert('Impossible d’enregistrer ce produit.'); resetForm(); setShowForm(false); fetchProducts(); };
  const edit = (p: Product) => { setFormData({ name: p.name, price: String(p.price), category: p.category || '', quantity: String(p.quantity), description: p.description || '' }); setEditingId(p.id); setShowForm(true); };
  const remove = async (id: string) => { if (!confirm('Supprimer définitivement ce produit ?')) return; const response = await fetch(`/api/products/${id}`, { method: 'DELETE' }); if (response.ok) fetchProducts(); };
  const adjust = async (p: Product, suggested: number) => { const amount = Number(prompt('Quantité à ajouter ou retirer :', String(suggested))); if (!Number.isFinite(amount)) return; const response = await fetch(`/api/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: Math.max(0, p.quantity + amount) }) }); if (response.ok) fetchProducts(); };
  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const lowStock = products.filter((p) => p.quantity <= 5).length;
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Chargement de votre espace…</div>;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Administration</p><h1 className="mt-2 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">{copy[initialTab].title}</h1><p className="mt-2 text-muted-foreground">{copy[initialTab].description}</p></div>
        {initialTab === 'products' && <Button onClick={() => { resetForm(); setShowForm((value) => !value); }}><Plus data-icon="inline-start" />{showForm ? 'Fermer' : 'Nouveau produit'}</Button>}
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric icon={Boxes} label="Références" value={String(products.length)} />
        <Metric icon={AlertTriangle} label="Stock faible" value={String(lowStock)} alert={lowStock > 0} />
        <Metric icon={TrendingUp} label="Ventes suivies" value={money(revenue)} />
      </div>

      {initialTab === 'products' && showForm && <Card><CardHeader><CardTitle>{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</CardTitle><CardDescription>Les informations seront immédiatement disponibles à la caisse.</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit} className="flex flex-col gap-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Nom *"><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Field><Field label="Prix (FCFA) *"><Input type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></Field><Field label="Catégorie"><Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Bière, soda, spiritueux…" /></Field><Field label="Quantité initiale"><Input type="number" min="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} /></Field></div><Field label="Description"><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Field><div className="flex gap-3"><Button type="submit"><PackagePlus data-icon="inline-start" />{editingId ? 'Enregistrer' : 'Ajouter au catalogue'}</Button><Button type="button" variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>Annuler</Button></div></form></CardContent></Card>}

      {(initialTab === 'products' || initialTab === 'stock') && <Card><CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><CardTitle>{initialTab === 'stock' ? 'État du stock' : 'Tous les produits'}</CardTitle><CardDescription>{filtered.length} référence{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</CardDescription></div><label className="relative block w-full md:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><span className="sr-only">Rechercher</span><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" /></label></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Produit</TableHead><TableHead>Prix</TableHead><TableHead>Stock</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{filtered.map((p) => <TableRow key={p.id}><TableCell><p className="font-medium">{p.name}</p><p className="text-sm text-muted-foreground">{p.category || 'Sans catégorie'}</p></TableCell><TableCell className="font-mono">{money(p.price)}</TableCell><TableCell><span className={p.quantity <= 5 ? 'font-semibold text-destructive' : 'font-semibold text-primary'}>{p.quantity} unité{p.quantity > 1 ? 's' : ''}</span></TableCell><TableCell><div className="flex justify-end gap-2">{initialTab === 'stock' ? <><Button size="sm" variant="outline" onClick={() => adjust(p, 1)}>Entrée</Button><Button size="sm" variant="outline" onClick={() => adjust(p, -1)}>Sortie</Button></> : <><Button size="icon" variant="ghost" aria-label={`Modifier ${p.name}`} onClick={() => edit(p)}><Pencil /></Button><Button size="icon" variant="ghost" aria-label={`Supprimer ${p.name}`} onClick={() => remove(p.id)}><Trash2 /></Button></>}</div></TableCell></TableRow>)}</TableBody></Table>{filtered.length === 0 && <div className="flex flex-col items-center gap-2 py-12 text-center"><ShoppingBag className="size-8 text-muted-foreground" /><p className="font-medium">Aucun produit trouvé</p><p className="text-sm text-muted-foreground">Ajoutez une référence ou modifiez votre recherche.</p></div>}</div></CardContent></Card>}

      {(initialTab === 'sales' || initialTab === 'reports') && <Card><CardHeader><CardTitle>{initialTab === 'reports' ? 'Synthèse des opérations' : 'Dernières ventes'}</CardTitle><CardDescription>Montants exprimés en francs CFA.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Produit</TableHead><TableHead>Qté</TableHead><TableHead>Total</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{sales.map((sale) => <TableRow key={sale.id}><TableCell className="font-medium">{sale.product?.name || sale.productId}</TableCell><TableCell>{sale.quantity}</TableCell><TableCell className="font-mono">{money(sale.total)}</TableCell><TableCell>{new Date(sale.createdAt).toLocaleString('fr-FR')}</TableCell></TableRow>)}</TableBody></Table>{sales.length === 0 && <p className="py-12 text-center text-muted-foreground">Aucune vente enregistrée.</p>}</div></CardContent></Card>}

      {initialTab === 'users' && <Card><CardHeader><CardTitle>Gestion de l’équipe</CardTitle><CardDescription>Cette section conserve le système d’accès actuel.</CardDescription></CardHeader><CardContent><p className="rounded-xl bg-muted p-5 text-sm leading-relaxed text-muted-foreground">Les comptes administrateur et caissier sont gérés par le système d’authentification existant. Les prochains membres pourront être ajoutés ici sans modifier la caisse.</p></CardContent></Card>}
    </div>
  );
}

function Metric({ icon: Icon, label, value, alert }: { icon: typeof Boxes; label: string; value: string; alert?: boolean }) { return <div className="flex items-center gap-4 rounded-2xl border bg-card p-4"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${alert ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'}`}><Icon className="size-5" /></span><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="truncate font-heading text-xl font-semibold">{value}</p></div></div> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="flex flex-col gap-2"><Label>{label}</Label>{children}</label> }
