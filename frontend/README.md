# E-Shop Frontend

Frontend React moderne pour une application e-commerce complète.

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **React Router v6** - Routing côté client
- **Axios** - Client HTTP pour l'API
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes

## 📋 Prérequis

- Node.js 16+ et npm
- Backend FastAPI en cours d'exécution sur `http://localhost:8000`

## 🛠️ Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**

   Le fichier `.env` est déjà configuré avec:
   ```
   VITE_API_URL=http://localhost:8000
   ```

## 🎯 Démarrage

### Mode développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`

### Build de production
```bash
npm run build
```

### Prévisualiser le build
```bash
npm run preview
```

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Composants réutilisables (Button, Input, Card, etc.)
│   │   ├── layout/          # Header, Footer
│   │   ├── product/         # ProductCard, ProductList
│   │   ├── cart/            # CartItem, CartSummary
│   │   └── order/           # OrderCard, OrderDetails
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SupportPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── OrderManagement.jsx
│   │       └── ProductManagement.jsx
│   ├── context/
│   │   ├── AuthContext.jsx  # Gestion authentification
│   │   └── CartContext.jsx  # Gestion panier
│   ├── services/
│   │   └── api.js           # Configuration Axios et fonctions API
│   ├── utils/
│   │   └── helpers.js       # Fonctions utilitaires
│   ├── App.jsx              # Configuration des routes
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Fonctionnalités

### Pour les utilisateurs
- ✅ Inscription et connexion
- ✅ Navigation dans le catalogue de produits
- ✅ Recherche et filtres
- ✅ Détail des produits
- ✅ Gestion du panier
- ✅ Processus de checkout complet
- ✅ **Page de paiement simulée** (aucun paiement réel)
- ✅ Historique des commandes
- ✅ Suivi des commandes
- ✅ Support client avec chat
- ✅ Gestion du profil

### Pour les administrateurs
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des commandes (validation, expédition, livraison)
- ✅ Gestion des produits (création, modification, stock)
- ✅ Vue d'ensemble des revenus

## 🔐 Authentification

L'authentification se fait via JWT stocké dans le `localStorage`.
- Le token est automatiquement ajouté à chaque requête API
- En cas d'erreur 401, l'utilisateur est redirigé vers la page de connexion

## 🎭 Routes protégées

### Routes publiques
- `/` - Page d'accueil
- `/products` - Liste des produits
- `/products/:id` - Détail produit
- `/login` - Connexion
- `/register` - Inscription

### Routes authentifiées
- `/cart` - Panier
- `/checkout` - Finalisation commande
- `/payment/:orderId` - Paiement
- `/orders` - Mes commandes
- `/orders/:id` - Détail commande
- `/profile` - Mon profil
- `/support` - Support client

### Routes admin (nécessite is_admin = true)
- `/admin` - Dashboard
- `/admin/orders` - Gestion des commandes
- `/admin/products` - Gestion des produits

## ⚠️ Important - Page de paiement

La page de paiement (`/payment/:orderId`) est une **simulation complète** :
- Design réaliste inspiré de Stripe
- Formulaire de carte bancaire (visuel uniquement)
- Validation des champs
- **AUCUN PAIEMENT RÉEL N'EST EFFECTUÉ**
- Message d'avertissement très visible
- Utilise un numéro de carte factice (4242424242424242)

## 🎨 Design

- **Responsive** : Mobile-first, fonctionne sur tous les écrans
- **Moderne** : Design épuré avec Tailwind CSS
- **Accessible** : Bonnes pratiques d'accessibilité
- **Performant** : Optimisé pour la vitesse
- **Animations** : Transitions fluides et professionnelles

## 🔧 Configuration API

Toutes les requêtes API sont configurées dans `src/services/api.js`.
Le fichier inclut :
- Configuration Axios avec intercepteurs
- Gestion automatique du token Bearer
- Gestion des erreurs 401 (déconnexion auto)
- Toutes les fonctions pour interagir avec le backend

## 📝 Comptes de test

Si vous avez un backend avec des données de test :
- **Utilisateur** : alice@example.com / password123
- **Admin** : admin@example.com / admin123

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend
1. Vérifiez que le backend est en cours d'exécution sur `http://localhost:8000`
2. Vérifiez la variable `VITE_API_URL` dans `.env`
3. Vérifiez la console du navigateur pour les erreurs CORS

### Erreurs de build
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

Ce projet est à des fins éducatives.

## 👥 Auteur

Projet créé pour démonstration d'une application e-commerce complète.
