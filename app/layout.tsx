import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RegisterServiceWorker } from './components/RegisterServiceWorker';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Bar Pilot — Gestion de bar', template: '%s · Bar Pilot' },
  description: 'Caisse, stock, ventes et rapports pour les bars au Gabon, en ligne et hors ligne.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
};

export const viewport: Viewport = { themeColor: '#123c2b', width: 'device-width', initialScale: 1, userScalable: true };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}><body className="min-h-screen font-sans"><RegisterServiceWorker />{children}</body></html>;
}
