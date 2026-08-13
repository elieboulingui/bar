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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="text-2xl font-bold text-black">
            {type === 'login' ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <CardDescription className="text-black/70">
            {type === 'login'
              ? 'Connectez-vous pour accéder à la caisse.'
              : 'Créez un compte caissier pour commencer à vendre.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 rounded-lg border-2 border-black bg-black px-4 py-3 text-sm text-white">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-semibold">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="border-2 border-black bg-white text-black placeholder:text-black/40 focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@bar.local"
                required
                className="border-2 border-black bg-white text-black placeholder:text-black/40 focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-semibold">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-2 border-black bg-white text-black placeholder:text-black/40 focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors font-bold"
              disabled={loading}
            >
              {loading ? 'Chargement...' : type === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-black/70">
            {type === 'login' ? (
              <>
                Pas de compte ?{' '}
                <Link href="/auth/register" className="text-black font-bold underline hover:opacity-70">
                  Inscrivez-vous
                </Link>
              </>
            ) : (
              <>
                Déjà inscrit ?{' '}
                <Link href="/auth/login" className="text-black font-bold underline hover:opacity-70">
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
