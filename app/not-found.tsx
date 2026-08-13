// app/not-found.tsx
"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Home, ArrowLeft, Search, GlassWater, Beer, Wine, Martini, Coffee } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
    const router = useRouter()
    
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navigation simplifiée */}
            <nav className="border-b-2 border-black bg-white">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-2xl font-black text-black tracking-tight">
                        BAR<span className="text-black/50">MANAGER</span>
                    </Link>
                    <div className="flex gap-2">
                        <Link 
                            href="/dashboard" 
                            className="px-4 py-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link 
                            href="/stock" 
                            className="px-4 py-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors"
                        >
                            Stock
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center py-20">
                <div className="container mx-auto px-4 text-center">
                    {/* Badge 404 */}
                    <div className="mb-8">
                        <Badge className="bg-black text-white border-2 border-black text-lg px-6 py-2 mb-4">
                            404
                        </Badge>
                    </div>

                    {/* Animation / Icônes de boissons */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <div className="absolute inset-0 bg-black/5 rounded-full animate-ping opacity-75" />
                        <div className="relative w-32 h-32 rounded-full border-4 border-black flex items-center justify-center bg-white">
                            <GlassWater className="h-16 w-16 text-black animate-bounce" style={{ animationDuration: '2s' }} />
                        </div>
                        <div className="absolute -top-2 -left-2 text-black/60 animate-bounce" style={{ animationDuration: '1.5s' }}>
                            <Beer className="h-6 w-6" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 text-black/60 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }}>
                            <Wine className="h-6 w-6" />
                        </div>
                        <div className="absolute top-1/2 -right-6 text-black/60 animate-bounce" style={{ animationDuration: '1.8s', animationDelay: '0.6s' }}>
                            <Martini className="h-6 w-6" />
                        </div>
                        <div className="absolute -left-6 top-1/4 text-black/60 animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }}>
                            <Coffee className="h-6 w-6" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 text-black">
                        Page <span className="bg-black text-white px-4 py-1">Introuvable</span>
                    </h1>

                    <p className="text-black/60 max-w-lg mx-auto mb-8 text-lg font-medium">
                        Oups ! On dirait que cette page est partie en pause. 
                        Comme un bon cocktail, cette page n'existe pas ou a été déplacée.
                    </p>

                    {/* Suggestions */}
                    <div className="max-w-md mx-auto mb-8 p-6 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-black font-bold mb-4 flex items-center justify-center gap-2">
                            <Search className="h-4 w-4" />
                            Que cherchez-vous ?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                { label: "Dashboard", href: "/dashboard" },
                                { label: "Ventes", href: "/ventes" },
                                { label: "Stock", href: "/stock" },
                                { label: "Employés", href: "/employes" },
                                { label: "Produits", href: "/produits" },
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="px-4 py-2 rounded-full text-sm font-bold bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button className="bg-black hover:bg-white text-white hover:text-black border-2 border-black gap-2 font-bold px-8 py-6 text-lg transition-colors">
                                <Home className="h-5 w-5" />
                                Retour au Dashboard
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="outline" 
                            className="bg-white border-2 border-black text-black hover:bg-black hover:text-white gap-2 font-bold px-8 py-6 text-lg transition-colors"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Page Précédente
                        </Button>
                    </div>

                    {/* Message humoristique */}
                    <div className="mt-12 text-black/50 text-sm italic max-w-md mx-auto">
                        <p className="flex items-center justify-center gap-2">
                            <span className="text-black text-xl">&ldquo;</span>
                            Même le meilleur barman ne trouve pas toujours sa bouteille...
                            <span className="text-black text-xl">&rdquo;</span>
                        </p>
                        <p className="mt-1 font-bold text-black/70">- Proverbe du bar</p>
                    </div>
                </div>
            </main>

            {/* Footer simplifié */}
            <footer className="border-t-2 border-black bg-white">
                <div className="container mx-auto px-4 py-6 text-center">
                    <p className="text-black/60 font-medium">
                        © 2024 BarManager - Gérez votre bar comme un pro
                    </p>
                </div>
            </footer>
        </div>
    )
}
