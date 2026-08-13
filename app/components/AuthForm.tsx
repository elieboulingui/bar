'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: type === 'register' ? name : undefined,
          action: type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur d\'authentification');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{type === 'login' ? 'Connexion' : 'Inscription'}</CardTitle>
          <CardDescription>
            {type === 'login'
              ? 'Connectez-vous pour accéder à la caisse.'
              : 'Créez un compte caissier pour commencer à vendre.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@bar.local"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Chargement...' : type === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            {type === 'login' ? (
              <>
                Pas de compte ?{' '}
                <Link href="/auth/register" className="text-slate-950 underline">
                  Inscrivez-vous
                </Link>
              </>
            ) : (
              <>
                Déjà inscrit ?{' '}
                <Link href="/auth/login" className="text-slate-950 underline">
                  Connectez-vous
                </Link>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
