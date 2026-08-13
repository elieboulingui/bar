# 📊 Gestion de Bar - Application Web

Une application web complète de gestion de bar construite avec **Next.js 16**, **TypeScript**, **Prisma** et **Tailwind CSS**.

## ✨ Fonctionnalités

### 🔐 Authentification et Rôles
- **Administrateur**: Peut gérer les produits (ajouter, modifier, supprimer, gérer le stock)
- **Caissier**: Peut uniquement vendre des produits et générer des reçus

### 💼 Gestion des Produits (Admin)
- ✅ Ajouter des produits (jus, boissons, etc.)
- ✅ Modifier les produits existants
- ✅ Supprimer les produits
- ✅ Gérer le stock/quantité
- ✅ Catégoriser les produits
- ✅ Description des produits

### 🛒 Caisse (Caissier)
- ✅ Visualiser les produits disponibles
- ✅ Ajouter des produits au panier
- ✅ Gérer les quantités
- ✅ Générer des reçus
- ✅ Imprimer les reçus
- ✅ Support du mode hors ligne

### 📱 Mode Hors Ligne (Offline-First) - LA MEILLEURE PARTIE!
L'application fonctionne **COMPLÈTEMENT SANS INTERNET**:
- ✅ **IndexedDB** pour stocker les produits localement
- ✅ **Service Worker** pour le cache des pages
- ✅ **Synchronisation automatique** quand la connexion revient
- ✅ **Ventes en attente** sauvegardées localement
- ✅ **Indicateur de statut** en ligne/hors ligne

C'est PARFAIT pour les bars sans connexion internet stable!

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone <repo>
cd bar-management-app

# 2. Installer les dépendances
npm install

# 3. Configurer la base de données
npx prisma migrate dev --name init

# 4. Lancer le serveur de développement
npm run dev
```

L'application est accessible à `http://localhost:3000`

## 📝 Configuration

Modifier le fichier `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret"
```

## 🔑 Comptes de Test

### Administrateur
```
Email: admin@bar.local
Mot de passe: admin123
```

### Caissier
```
Email: cashier@bar.local
Mot de passe: cashier123
```

(À créer depuis la page d'inscription)

## 📂 Structure du Projet

```
app/
├── api/
│   ├── auth/              # Routes d'authentification
│   ├── products/          # Routes produits
│   └── sales/             # Routes ventes
├── components/            # Composants React
│   ├── AuthForm.tsx       # Formulaire login/register
│   ├── AdminDashboard.tsx # Tableau de bord admin
│   ├── CashierDashboard.tsx # Tableau de bord caissier
│   └── RegisterServiceWorker.tsx
├── dashboard/             # Pages tableau de bord
│   ├── admin/page.tsx
│   └── cashier/page.tsx
├── auth/                  # Pages authentification
│   ├── login/page.tsx
│   └── register/page.tsx
├── lib/
│   ├── auth.ts           # Utilitaires JWT
│   ├── prisma.ts         # Client Prisma
│   └── indexeddb.ts      # Utilitaires IndexedDB
└── layout.tsx            # Layout principal
```

## 🛠️ Technos Utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage strict
- **Prisma** - ORM base de données
- **SQLite** - Base de données légère
- **Tailwind CSS** - Styling
- **JWT** - Authentification
- **bcryptjs** - Hash de mots de passe
- **Service Worker** - Cache offline
- **IndexedDB** - Stockage local navigateur

## 📖 Utilisation

### Pour l'Administrateur

1. Se connecter: `/auth/login` avec identifiants Admin
2. Accès automatique: `/dashboard/admin`
3. **Ajouter un produit**: Cliquer sur "+ Ajouter un produit"
4. **Modifier**: Cliquer sur "Modifier" dans le tableau
5. **Supprimer**: Cliquer sur "Supprimer" dans le tableau
6. **Gérer le stock**: Remplir le champ "Quantité"

### Pour le Caissier

1. Se connecter: `/auth/login` avec identifiants Caissier
2. Accès automatique: `/dashboard/cashier`
3. **Ajouter au panier**: Cliquer sur "Ajouter" sur les produits disponibles
4. **Modifier la quantité**: Utiliser les boutons +/- du panier
5. **Finaliser la vente**: Cliquer sur "Finaliser la vente"
6. **Imprimer le reçu**: Cliquer sur "Imprimer" dans la boîte de dialogue

## 🌐 Mode Hors Ligne - Pour les Bars Sans Internet!

### Comment ça fonctionne?

1. **Première visite**: L'application télécharge tous les produits et les cache localement
2. **Stockage local**: Les produits sont sauvegardés dans IndexedDB du navigateur
3. **Pas d'internet?**: L'app continue à fonctionner 100% avec les données locales!
4. **Ventes offline**: Les ventes sont sauvegardées localement jusqu'à la reconnexion
5. **Reconnexion**: Quand la connexion revient, les données se synchronisent automatiquement

### Indicateurs de Statut
- 🟢 **Connecté** - Connecté à internet, synchronisation en direct
- 🔴 **Mode hors ligne** - Pas de connexion, fonctionnement en local
- ⏳ **Ventes en attente** - Des ventes attendent synchronisation

### Scénarios d'Utilisation Hors Ligne

#### Bar sans WiFi/4G stable
```
1. Admin configure les produits une fois (avec internet)
2. Les produits sont mis en cache localement
3. Caissier peut travailler SANS internet toute la journée!
4. Les ventes se synchronisent quand internet revient
```

#### Coupure internet pendant les ventes
```
1. Caissier vend normalement
2. Internet coupe? L'app continue fonctionner!
3. Ventes sauvegardées localement
4. Internet revient? Synchronisation auto!
```

#### Sauvegarder les données
Toutes les données sont sauvegardées:
- ✅ Dans la base de données serveur (avec internet)
- ✅ Dans IndexedDB du navigateur (sans internet)
- ✅ Dans le cache (pages et assets)

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Hash de mots de passe (bcryptjs)
- ✅ Vérification des rôles sur les API routes
- ✅ Cookies httpOnly
- ✅ Protection des données locales
- ✅ Validation des données côté serveur

## 📊 Base de Données

### Modèles Prisma

**User** (Utilisateurs)
- id: String (unique)
- email: String (unique)
- password: String (hashé)
- name: String
- role: ADMIN | CASHIER
- createdAt, updatedAt: DateTime

**Product** (Produits/Jus)
- id: String (unique)
- name: String
- price: Float
- quantity: Int
- category: String
- description: String (optionnel)
- createdAt, updatedAt: DateTime

**Sale** (Ventes)
- id: String (unique)
- productId: String → Product
- quantity: Int
- price: Float (prix au moment de la vente)
- total: Float (quantité × prix)
- createdAt: DateTime

## 🚢 Déploiement

### Sur Vercel (Recommandé)

```bash
# Vérifier les fichiers
git add .
git commit -m "Initial commit"

# Déployer
vercel
```

### Variables d'environnement nécessaires

```
DATABASE_URL=file:./prod.db  (ou URL PostgreSQL pour production)
JWT_SECRET=your-very-secret-key
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### On-Premise (Serveur local)

```bash
# Build production
npm run build

# Lancer
npm start
```

## 📱 PWA (Progressive Web App)

L'application peut être installée comme une PWA native:

### Sur Mobile (iOS/Android)
1. Ouvrir dans un navigateur
2. Menu → "Ajouter à l'écran d'accueil"
3. L'app se lance comme une app native!
4. Fonctionne en hors ligne

### Sur Desktop (Windows/Mac/Linux)
1. Menu navigateur → "Installer l'app"
2. L'app se lance indépendamment
3. Accès rapide depuis le menu

## 🐛 Troubleshooting

### Erreur de base de données

```bash
# Réinitialiser la migration
npx prisma migrate reset

# Ou juste pousser les changements
npx prisma db push
```

### Service Worker ne s'enregistre pas

- Vérifier que l'app est en HTTPS (ou localhost:3000)
- Vider le cache du navigateur: DevTools → Application → Clear
- Redémarrer le navigateur

### Données offline ne se synchronisent pas

- Vérifier la connexion internet
- Ouvrir Console (F12) pour voir les erreurs
- Vérifier que le token JWT est valide

### IndexedDB plein

```javascript
// Console browser
await indexedDB.deleteDatabase('BarManagementDB');
```

## 💡 Tips & Astuces

### Performance Hors Ligne
- L'app charge les 50 derniers produits en cache
- Actualiser la page charge toujours depuis le serveur d'abord
- Les ventes hors ligne se synchronisent par lot

### Sauvegarder Manuellement
```javascript
// Console browser
// Exporter les ventes en attente
const sales = await getPendingSales();
console.log(JSON.stringify(sales));
```

### Réinitialiser Complètement
```bash
# Supprimer la DB SQLite
rm prisma/dev.db

# Recréer la migration
npx prisma migrate dev --name init
```

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifier les logs: `npm run dev` (terminal)
2. DevTools: F12 → Console et Network tabs
3. Vérifier `.env.local` est configuré
4. Redémarrer le serveur

## 📄 Licence

MIT - Libre d'utilisation

## 👨‍💻 Auteur

Créé avec ❤️ pour les bars de tous les pays

---

## 🎯 Points Clés

✅ **Fonctionne sans internet** - IndexedDB + Service Worker  
✅ **Rôles et permissions** - Admin vs Caissier  
✅ **Génération de reçus** - Avec impression  
✅ **Gestion complète** - Produits, stock, ventes  
✅ **Moderne et responsive** - Tailwind CSS  
✅ **Sécurisé** - JWT, bcryptjs, validation  
✅ **Extensible** - Architecture modulaire TypeScript  

**Idéal pour les petits bars qui n'ont pas accès à internet stable!** 🍹
