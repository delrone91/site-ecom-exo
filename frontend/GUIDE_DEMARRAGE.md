# 🚀 Guide de Démarrage Rapide - E-Shop Frontend

## Installation et Lancement en 3 étapes

### 1️⃣ Installer les dépendances
```bash
cd /mnt/c/Users/delro/Desktop/école/site_ecom/frontend
npm install
```

### 2️⃣ Démarrer le backend (dans un autre terminal)
```bash
cd /mnt/c/Users/delro/Desktop/école/site_ecom/backend
# Assurez-vous que le backend FastAPI est en cours d'exécution sur http://localhost:8000
```

### 3️⃣ Lancer le frontend
```bash
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

---

## 📱 Fonctionnalités disponibles

### Pour les visiteurs (non connectés)
- ✅ Voir la page d'accueil avec les produits en vedette
- ✅ Parcourir le catalogue complet des produits
- ✅ Voir les détails d'un produit
- ✅ S'inscrire pour créer un compte
- ✅ Se connecter

### Pour les utilisateurs connectés
- ✅ Ajouter des produits au panier
- ✅ Gérer le panier (modifier quantités, supprimer articles)
- ✅ Passer une commande (checkout)
- ✅ **Effectuer un paiement simulé** (page réaliste mais factice)
- ✅ Voir l'historique de ses commandes
- ✅ Suivre ses commandes (statut, tracking)
- ✅ Modifier son profil
- ✅ Contacter le support (système de chat)

### Pour les administrateurs
- ✅ Accéder au tableau de bord avec statistiques
- ✅ Voir toutes les commandes
- ✅ Valider les commandes
- ✅ Expédier les commandes (avec numéro de suivi)
- ✅ Marquer les commandes comme livrées
- ✅ Gérer les produits (créer, modifier, gérer le stock)

---

## 🎯 Parcours utilisateur typique

### Nouveau client
1. **Arrivée sur la page d'accueil** → Découverte des produits en vedette
2. **Clic sur "Voir tous les produits"** → Catalogue complet
3. **Clic sur "S'inscrire"** → Création de compte
4. **Connexion automatique** → Redirection vers l'accueil
5. **Clic sur un produit** → Page détail avec bouton "Ajouter au panier"
6. **Ajout au panier** → Badge avec nombre d'articles s'affiche
7. **Clic sur l'icône panier** → Page panier avec résumé
8. **Clic sur "Passer la commande"** → Page checkout (adresse de livraison)
9. **Clic sur "Procéder au paiement"** → **Page de paiement simulée**
10. **Simulation du paiement** → Confirmation et redirection vers la commande
11. **Page commande** → Détails, statut, tracking

### Administrateur
1. **Connexion avec un compte admin**
2. **Clic sur l'icône paramètres** → Accès admin
3. **Tableau de bord** → Vue d'ensemble (commandes, revenus, stats)
4. **Gestion des commandes** → Valider, expédier, livrer
5. **Gestion des produits** → Créer, modifier, gérer le stock

---

## ⚠️ Page de Paiement - TRÈS IMPORTANT

### Caractéristiques de la page de paiement
- **Design ultra-réaliste** inspiré de Stripe
- **Formulaire de carte bancaire** (numéro, titulaire, expiration, CVV)
- **Validation des champs** (format, longueur)
- **Détection du type de carte** (Visa, Mastercard, Amex)
- **Message d'avertissement TRÈS VISIBLE** :
  > ⚠️ Ceci est une page de démonstration - AUCUN PAIEMENT RÉEL

### Comment tester le paiement
1. Ajoutez des produits au panier
2. Passez une commande (checkout)
3. Sur la page de paiement, utilisez ces données de test :
   - **Numéro de carte** : `4242 4242 4242 4242` (ou n'importe quel numéro à 16 chiffres)
   - **Titulaire** : Votre nom
   - **Expiration** : N'importe quelle date future (ex: 12/2025)
   - **CVV** : N'importe quel code à 3 chiffres (ex: 123)
4. Cliquez sur "Simuler le paiement"
5. Animation de traitement pendant 2 secondes
6. Redirection vers la page de commande avec confirmation

---

## 🎨 Technologies et Design

### Stack technique
- **React 18** avec hooks modernes (useState, useEffect, useContext)
- **React Router v6** pour la navigation
- **Axios** avec intercepteurs pour les appels API
- **Tailwind CSS** pour le design
- **Lucide React** pour les icônes
- **Vite** comme build tool

### Design
- **Responsive** : Parfaitement adapté mobile, tablette et desktop
- **Moderne** : Design épuré et professionnel
- **Accessible** : Navigation au clavier, contrastes suffisants
- **Performant** : Chargement rapide, animations fluides
- **Cohérent** : Palette de couleurs harmonieuse (bleu primaire)

---

## 🔐 Comptes de test

Si votre backend a des comptes pré-créés :

**Utilisateur normal :**
- Email : `alice@example.com`
- Mot de passe : `password123`

**Administrateur :**
- Email : `admin@example.com`
- Mot de passe : `admin123`

Sinon, créez un compte via la page d'inscription.

---

## 📂 Structure des fichiers

```
frontend/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── common/       # Button, Input, Card, Loading, Toast
│   │   ├── layout/       # Header, Footer
│   │   ├── product/      # ProductCard, ProductList
│   │   ├── cart/         # CartItem, CartSummary
│   │   └── order/        # OrderCard, OrderDetails
│   ├── pages/            # Pages de l'application
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── PaymentPage.jsx    ⚠️ PAGE DE PAIEMENT SIMULÉE
│   │   ├── OrdersPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── admin/        # Pages admin
│   ├── context/          # Gestion d'état global
│   │   ├── AuthContext.jsx    # Authentification
│   │   └── CartContext.jsx    # Panier
│   ├── services/         # Appels API
│   │   └── api.js        # Configuration Axios
│   ├── utils/            # Fonctions utilitaires
│   │   └── helpers.js
│   ├── App.jsx           # Routing principal
│   └── main.jsx          # Point d'entrée
└── package.json
```

---

## 🔄 Flux de données

### Authentification
1. Connexion → Token JWT stocké dans `localStorage`
2. Token ajouté automatiquement à chaque requête API (header `Authorization: Bearer {token}`)
3. Si erreur 401 → Déconnexion automatique et redirection vers `/login`

### Panier
1. Ajout au panier → Appel API `/cart/add`
2. Synchronisation avec le backend
3. Mise à jour du contexte `CartContext`
4. Badge du panier mis à jour automatiquement

### Commandes
1. Checkout → Création de la commande (statut: `pending`)
2. Paiement simulé → Mise à jour (statut: `pending`, `paid_at` renseigné)
3. Admin valide → Statut passe à `validated`
4. Admin expédie → Statut passe à `shipped` + numéro de tracking
5. Admin livre → Statut passe à `delivered`

---

## 🐛 Dépannage

### Le frontend ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur "Cannot connect to API"
1. Vérifiez que le backend est en cours d'exécution sur `http://localhost:8000`
2. Vérifiez le fichier `.env` → `VITE_API_URL=http://localhost:8000`
3. Vérifiez la console navigateur pour les erreurs CORS

### Le panier ne se met pas à jour
1. Vérifiez que vous êtes connecté
2. Ouvrez la console navigateur (F12) pour voir les erreurs
3. Vérifiez que le backend retourne bien les bonnes données

### Les routes admin ne fonctionnent pas
1. Assurez-vous d'être connecté avec un compte admin (`is_admin = true`)
2. Si vous n'avez pas de compte admin, créez-en un directement dans la base de données

---

## 📞 Support

Ce projet est une démonstration complète d'une application e-commerce moderne.

**Fonctionnalités clés :**
- ✅ Authentification complète
- ✅ Gestion du panier synchronisée
- ✅ Processus de checkout complet
- ✅ **Page de paiement réaliste (simulée)**
- ✅ Suivi des commandes
- ✅ Support client avec chat
- ✅ Administration complète

Bon développement ! 🚀
