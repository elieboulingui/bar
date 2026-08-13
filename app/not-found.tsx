// app/not-found.tsx
"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Home, ArrowLeft, GlassWater } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
    const router = useRouter()
    
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            {/* Icône centrale */}
            <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-black/5 rounded-full animate-ping opacity-75" />
                <div className="relative w-32 h-32 rounded-full border-4 border-black flex items-center justify-center bg-white">
                    <GlassWater className="h-16 w-16 text-black animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-black text-center">
                404 - Page Introuvable
            </h1>

            {/* Message */}
            <p className="text-black/60 max-w-md mx-auto mb-8 text-lg font-medium text-center">
                Oups ! Cette page n'existe pas ou a été déplacée.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                    <Button className="bg-black hover:bg-white text-white hover:text-black border-2 border-black gap-2 font-bold px-8 py-6 text-lg transition-colors">
                        <Home className="h-5 w-5" />
                        Retour à l'Accueil
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
            <div className="mt-12 text-black/50 text-sm italic">
                <p className="flex items-center justify-center gap-2">
                    <span className="text-black text-xl">&ldquo;</span>
                    Même le meilleur barman ne trouve pas toujours sa bouteille...
                    <span className="text-black text-xl">&rdquo;</span>
                </p>
                <p className="mt-1 font-bold text-black/70">- Proverbe du bar</p>
            </div>
        </div>
    )
}
