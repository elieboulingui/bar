'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  description?: string;
}

interface Sale {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
  product?: Product;
}

export default function AdminDashboardV2({ initialTab }: { initialTab?: 'products' | 'stock' | 'sales' | 'reports' | 'users' }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'products' | 'stock' | 'sales' | 'reports' | 'users'>(initialTab || 'products');

  // product form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    quantity: '',
    description: '',
  });

  useEffect(() => {
    // initial load
    fetchProducts();

    // if initialTab provided, use it; otherwise set tab from hash
    if (!initialTab) {
      const initialHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
      if (initialHash === 'stock' || initialHash === 'sales' || initialHash === 'reports' || initialHash === 'users') {
        setTab(initialHash as any);
      }

      const onHash = () => {
        const h = window.location.hash.replace('#', '');
        if (h === 'stock' || h === 'sales' || h === 'reports' || h === 'users' || h === 'products') setTab(h as any);
      };

      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }

    return;
  }, []);

  useEffect(() => {
    if (tab === 'sales') fetchSales();
  }, [tab]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      if (!res.ok) {
        console.error('Erreur fetching sales', res.status);
        return;
      }
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      quantity: '',
      description: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert('Nom et prix sont obligatoires');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: formData.quantity ? parseInt(formData.quantity, 10) : 0,
      };

      const response = await fetch(
        editingId ? `/api/products/${editingId}` : '/api/products',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        alert(editingId ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
        return;
      }

      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erreur serveur');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category || '',
      quantity: product.quantity.toString(),
      description: product.description || '',
    });
    setEditingId(product.id);
    setShowForm(true);
    // ensure products tab
    window.location.hash = 'products';
    setTab('products');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Erreur lors de la suppression');
        return;
      }

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur serveur');
    }
  };

  const adjustStock = async (product: Product, delta: number) => {
    const amount = parseInt(prompt('Quantité à ajouter (positif) ou retirer (négatif) :', String(delta)) || '0', 10);
    if (isNaN(amount)) return;
    const newQty = product.quantity + amount;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) {
        alert('Erreur lors de la mise à jour du stock');
        return;
      }
      fetchProducts();
    } catch (err) {
      console.error('adjustStock error', err);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleString();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              {tab === 'products' && 'Gestion des Produits'}
              {tab === 'stock' && 'Stock & Inventaire'}
              {tab === 'sales' && 'Historique des Ventes'}
              {tab === 'reports' && 'Rapports'}
            </h1>
            <p className="text-slate-600 mt-1">{tab === 'products' ? 'Ajoutez ou modifiez des jus et boissons.' : ''}</p>
          </div>
          {tab === 'products' && (
            <Button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                resetForm();
              }}
            >
              {showForm ? 'Annuler' : '+ Ajouter un produit'}
            </Button>
          )}
        </div>

        {tab === 'products' && showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</CardTitle>
              <CardDescription>Remplissez les détails du produit pour le rendre disponible au caissier.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Jus, Boisson, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {tab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>Produits existants</CardTitle>
              <CardDescription>Liste des jus et boissons enregistrés.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium text-slate-950">{product.name}</div>
                          {product.description ? (
                            <div className="text-slate-500 text-sm">{product.description}</div>
                          ) : null}
                        </TableCell>
                        <TableCell>{product.category || '-'}</TableCell>
                        <TableCell>{product.price.toFixed(2)} €</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              product.quantity > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                            {product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" onClick={() => handleEdit(product)}>
                            Modifier
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {products.length === 0 && (
                  <div className="py-8 text-center text-slate-500">Aucun produit. Commencez par en ajouter un!</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === 'stock' && (
          <Card>
            <CardHeader>
              <CardTitle>Stock & Inventaire</CardTitle>
              <CardDescription>Modifier rapidement les quantités en stock.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium text-slate-950">{product.name}</div>
                          <div className="text-slate-500 text-sm">{product.category || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" onClick={() => adjustStock(product, 1)}>Entrée stock</Button>
                          <Button size="sm" variant="destructive" onClick={() => adjustStock(product, -1)}>Sortie / Casse</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {tab === 'sales' && (
          <Card>
            <CardHeader>
              <CardTitle>Historique des Ventes</CardTitle>
              <CardDescription>Liste des ventes enregistrées.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.product?.name || s.productId}</TableCell>
                        <TableCell>{s.quantity}</TableCell>
                        <TableCell>{s.price.toFixed(2)} €</TableCell>
                        <TableCell>{s.total.toFixed(2)} €</TableCell>
                        <TableCell>{formatDate(s.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {sales.length === 0 && <div className="py-8 text-center text-slate-500">Aucune vente trouvée.</div>}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
