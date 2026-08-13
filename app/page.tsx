'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Cloud, PackageCheck, ShieldCheck, Smartphone, WifiOff } from 'lucide-react';
import { buttonVariants } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

const features = [
  { icon: PackageCheck, title: 'Stock sous contrôle', text: 'Suivez chaque bouteille, entrée et casse sans calcul manuel.' },
  { icon: BarChart3, title: 'Chiffres lisibles', text: 'Visualisez ventes, recettes et produits les plus demandés.' },
  { icon: Smartphone, title: 'Pensé pour le comptoir', text: 'Une interface rapide, tactile et confortable sur mobile.' },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Bar Pilot, accueil">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-mono text-sm font-bold text-primary-foreground">BP</span>
            <span><strong className="block font-heading text-base">Bar Pilot</strong><span className="block text-xs text-muted-foreground">Gestion simple. Service fluide.</span></span>
          </Link>
          <Link href="/auth/login" className={buttonVariants({ variant: 'outline' })}>Se connecter</Link>
        </div>
      </header>

      <section className="relative border-b">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
          <div className="flex flex-col items-start gap-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium"><span className="size-2 rounded-full bg-primary" />Conçu pour les bars du Gabon</div>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-3xl text-balance font-heading text-5xl font-bold tracking-tight md:text-7xl">Votre bar, piloté avec précision.</h1>
              <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">Caisse, stock et résultats réunis dans un outil clair. Travaillez connecté avec votre équipe, ou gardez la main même sans réseau.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/auth/login" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>Accéder à l’espace en ligne <ArrowRight className="size-4" /></Link>
              <Link href="/hors-ligne" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2')}><WifiOff className="size-4" />Ouvrir le mode hors ligne</Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4" />Données protégées</span>
              <span className="flex items-center gap-2"><Cloud className="size-4" />Synchronisation en ligne</span>
              <span className="flex items-center gap-2"><WifiOff className="size-4" />Mode local autonome</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[2rem] border bg-card p-3 shadow-2xl shadow-primary/10">
              <div className="rounded-3xl bg-foreground p-5 text-background md:p-7">
                <div className="flex items-center justify-between border-b border-background/15 pb-5">
                  <div><p className="text-sm text-background/60">Recette du jour</p><p className="font-heading text-3xl font-semibold">284 500 FCFA</p></div>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Ouvert</span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-5">
                  <div className="rounded-2xl bg-background/10 p-4"><p className="text-xs text-background/60">Articles vendus</p><p className="mt-1 text-2xl font-semibold">137</p></div>
                  <div className="rounded-2xl bg-background/10 p-4"><p className="text-xs text-background/60">Stock faible</p><p className="mt-1 text-2xl font-semibold">4</p></div>
                </div>
                <div className="flex flex-col gap-3">
                  {['Régab 65 cl', 'Beaufort 50 cl', 'Coca-Cola'].map((name, index) => (
                    <div key={name} className="flex items-center justify-between rounded-xl bg-background px-4 py-3 text-foreground">
                      <span className="font-medium">{name}</span><span className="font-mono text-sm">{[1500, 2000, 1000][index].toLocaleString('fr-FR')} F</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 max-w-2xl"><p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Tout ce qui compte</p><h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-5xl">Moins de cahiers. Plus de maîtrise.</h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border bg-card p-6">
              <span className="mb-6 flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></span>
              <h3 className="font-heading text-xl font-semibold">{title}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8"><p>Bar Pilot — Gestion de bar en FCFA</p><p>En ligne ou hors ligne, vous gardez le contrôle.</p></div></footer>
    </main>
  );
}
