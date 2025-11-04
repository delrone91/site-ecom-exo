# 🛒 Site E-Commerce Complet

Application web e-commerce complète avec backend FastAPI et frontend React + Vite + Tailwind CSS.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Comptes de test](#comptes-de-test)
- [Documentation](#documentation)

---

## 🎯 Vue d'ensemble

Ce projet est une **plateforme e-commerce complète** comprenant :

- **Backend FastAPI** : API REST complète avec gestion des utilisateurs, produits, commandes, paiements et support client
- **Frontend React** : Interface utilisateur moderne et responsive avec toutes les fonctionnalités d'un site e-commerce professionnel
- **Page de paiement simulée** : Interface réaliste de paiement par carte bancaire (non fonctionnelle, à des fins de démonstration)

Le projet est **entièrement fonctionnel** et prêt à être utilisé pour des démonstrations ou comme base pour un projet réel.

---

## ✨ Fonctionnalités

### Pour les clients

- ✅ **Authentification** : Inscription, connexion, gestion du profil
- ✅ **Catalogue de produits** : Navigation, recherche, filtres
- ✅ **Panier d'achat** : Ajout/retrait d'articles, modification des quantités
- ✅ **Processus de commande** : Checkout, paiement simulé, confirmation
- ✅ **Historique des commandes** : Suivi des commandes avec numéros de tracking
- ✅ **Support client** : Système de tickets avec messagerie intégrée

### Pour les administrateurs

- ✅ **Dashboard** : Statistiques et aperçu des ventes
- ✅ **Gestion des commandes** : Validation, expédition, livraison, remboursement
- ✅ **Gestion des produits** : Création, modification, gestion du stock
- ✅ **Support client** : Gestion des tickets et réponses aux clients

### Caractéristiques techniques

- ✅ **API REST** complète et documentée (Swagger/ReDoc)
- ✅ **Authentification JWT** avec tokens Bearer
- ✅ **Base de données en mémoire** (facilement migratable vers PostgreSQL)
- ✅ **Interface responsive** (mobile, tablette, desktop)
- ✅ **Design moderne** avec Tailwind CSS
- ✅ **Gestion d'état** avec React Context
- ✅ **Notifications toast** pour les actions utilisateur
- ✅ **Protection des routes** (authentification requise)

---

## 🛠️ Technologies utilisées

### Backend

- **FastAPI** : Framework web Python moderne et rapide
- **Pydantic** : Validation de données avec types
- **Uvicorn** : Serveur ASGI haute performance
- **Python 3.8+** : Langage de programmation

### Frontend

- **React 18** : Bibliothèque JavaScript pour interfaces utilisateur
- **Vite** : Build tool ultra-rapide
- **React Router v6** : Routing côté client
- **Axios** : Client HTTP pour les appels API
- **Tailwind CSS** : Framework CSS utility-first
- **Lucide React** : Icônes modernes

---

## 📦 Installation

### Prérequis

- **Python 3.8+** installé
- **Node.js 16+** et **npm** installés
- Terminal/invite de commandes

### 1. Cloner le projet

```bash
cd /mnt/c/Users/delro/Desktop/école/site_ecom
```

### 2. Installer le backend

```bash
cd backend
pip install -r requirements.txt
```

### 3. Installer le frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Démarrage rapide

### Étape 1 : Charger les données de test (Backend)

Ouvrez un terminal dans le dossier `backend/` :

```bash
cd backend
python seed.py
```

Cela créera :
- 4 utilisateurs (1 admin + 3 clients)
- 15 produits variés
- 2 commandes de démonstration
- 2 fils de discussion support

### Étape 2 : Démarrer le backend

Dans le même terminal :

```bash
python main.py
```

Le backend sera accessible sur **http://localhost:8000**

Documentation API : **http://localhost:8000/docs**

### Étape 3 : Démarrer le frontend

Ouvrez un **nouveau terminal** dans le dossier `frontend/` :

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur **http://localhost:3000**

### Étape 4 : Accéder à l'application

Ouvrez votre navigateur et allez sur **http://localhost:3000**

---

## 📁 Structure du projet

```
site_ecom/
│
├── backend/                      # Backend FastAPI
│   ├── models.py                 # Modèles, repositories, services
│   ├── schemas.py                # Schémas Pydantic (DTOs)
│   ├── main.py                   # Application FastAPI principale
│   ├── seed.py                   # Script de données de test
│   ├── test_api.py               # Tests automatisés
│   ├── routers/                  # Routes de l'API
│   │   ├── auth.py               # Authentification
│   │   ├── catalog.py            # Catalogue de produits
│   │   ├── cart.py               # Panier
│   │   ├── orders.py             # Commandes
│   │   ├── support.py            # Support client
│   │   └── admin.py              # Administration
│   ├── requirements.txt          # Dépendances Python
│   └── README.md                 # Documentation backend
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   │   ├── common/           # Button, Input, Card, etc.
│   │   │   ├── layout/           # Header, Footer, Navigation
│   │   │   ├── product/          # ProductCard, ProductList
│   │   │   ├── cart/             # CartItem, CartSummary
│   │   │   └── order/            # OrderCard, OrderDetails
│   │   ├── pages/                # Pages de l'application
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── PaymentPage.jsx   # ⚠️ Page de paiement simulée
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SupportPage.jsx
│   │   │   └── admin/            # Pages administrateur
│   │   ├── context/              # Gestion d'état
│   │   │   ├── AuthContext.jsx   # Authentification
│   │   │   └── CartContext.jsx   # Panier
│   │   ├── services/
│   │   │   └── api.js            # Client API Axios
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx               # Composant principal
│   │   └── main.jsx              # Point d'entrée
│   ├── package.json              # Dépendances npm
│   ├── vite.config.js            # Configuration Vite
│   ├── tailwind.config.js        # Configuration Tailwind
│   └── README.md                 # Documentation frontend
│
├── claude/                       # Documentation du projet
│   └── claude.md                 # Instructions de développement
│
└── README.md                     # Ce fichier
```

---

## 💡 Utilisation

### Parcours client complet

1. **Inscription/Connexion**
   - Allez sur http://localhost:3000
   - Cliquez sur "Connexion" ou "S'inscrire"
   - Ou utilisez un compte de test (voir ci-dessous)

2. **Navigation et achat**
   - Parcourez le catalogue de produits
   - Cliquez sur un produit pour voir les détails
   - Ajoutez des produits au panier
   - Modifiez les quantités si nécessaire

3. **Commande**
   - Cliquez sur l'icône panier en haut à droite
   - Vérifiez votre panier
   - Cliquez sur "Passer la commande"
   - Confirmez les informations de livraison

4. **Paiement (SIMULÉ)**
   - Vous serez redirigé vers la page de paiement
   - ⚠️ **Lisez l'avertissement** : aucun paiement réel n'est effectué
   - Utilisez la carte de test : `4242 4242 4242 4242`
   - Expiration : `12/2025`
   - CVV : `123`
   - Cliquez sur "Simuler le paiement"

5. **Suivi de commande**
   - Allez dans "Mes commandes"
   - Consultez l'état de vos commandes
   - Suivez l'expédition avec le numéro de tracking (si expédiée)

6. **Support client**
   - Cliquez sur "Support"
   - Créez un nouveau ticket
   - Associez-le à une commande si nécessaire
   - Échangez des messages avec le support

### Parcours administrateur

1. **Connexion admin**
   - Email : `admin@example.com`
   - Mot de passe : `admin123`

2. **Dashboard**
   - Consultez les statistiques globales
   - Visualisez les revenus et les commandes

3. **Gestion des commandes**
   - Allez dans "Gestion des commandes"
   - Voyez toutes les commandes clients
   - Actions disponibles :
     - Valider une commande
     - Expédier (génère un numéro de tracking)
     - Marquer comme livrée
     - Rembourser si nécessaire

4. **Gestion des produits**
   - Allez dans "Gestion des produits"
   - Créez de nouveaux produits
   - Modifiez les produits existants
   - Gérez le stock en temps réel

5. **Support client**
   - Voyez tous les tickets clients
   - Répondez aux demandes
   - Fermez les tickets résolus

---

## 👥 Comptes de test

Les comptes suivants sont créés automatiquement par `seed.py` :

### Administrateur

- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`
- **Rôle** : Administrateur complet

### Clients

**Alice Martin** (avec commande livrée)
- **Email** : `alice@example.com`
- **Mot de passe** : `password123`
- **Commandes** : 1 commande livrée

**Bob Dupont** (avec commande payée)
- **Email** : `bob@example.com`
- **Mot de passe** : `password123`
- **Commandes** : 1 commande payée (en attente d'expédition)

**Charlie Dubois** (avec panier actif)
- **Email** : `charlie@example.com`
- **Mot de passe** : `password123`
- **Panier** : Contient 2 articles

---

## ⚠️ Page de paiement - IMPORTANT

La **page de paiement** (`/payment/:orderId`) est une **SIMULATION COMPLÈTE** à des fins de démonstration.

### Caractéristiques

- ✅ Design ultra-réaliste inspiré de Stripe Elements
- ✅ Formulaire complet (numéro, titulaire, expiration, CVV)
- ✅ Validation des champs et détection du type de carte
- ✅ **Message d'avertissement TRÈS VISIBLE** :

```
⚠️ Ceci est une page de démonstration - AUCUN PAIEMENT RÉEL

Aucune transaction bancaire réelle ne sera effectuée.
Les informations saisies ne sont pas stockées.

Carte de test : 4242 4242 4242 4242
```

### Comment tester

1. Créez une commande avec des produits
2. Sur la page de paiement, entrez :
   - **Numéro** : `4242 4242 4242 4242` (carte test standard)
   - **Titulaire** : Votre nom
   - **Expiration** : `12/2025`
   - **CVV** : `123`
3. Cliquez sur "Simuler le paiement"
4. Une animation s'affiche pendant le "traitement"
5. Vous êtes redirigé vers la confirmation de commande

**Note** : Le backend accepte n'importe quelle carte SAUF celles se terminant par `0000` (pour simuler un échec).

---

## 📚 Documentation

### Documentation Backend

- **README Backend** : `backend/README.md`
- **Architecture** : `backend/ARCHITECTURE.md`
- **Guide rapide** : `backend/QUICKSTART.md`
- **API Swagger** : http://localhost:8000/docs (une fois le backend lancé)
- **API ReDoc** : http://localhost:8000/redoc

### Documentation Frontend

- **README Frontend** : `frontend/README.md`
- **Guide de démarrage** : `frontend/GUIDE_DEMARRAGE.md`
- **Exemples de code** : `frontend/EXEMPLES_CODE.md`
- **Projet complet** : `frontend/PROJET_COMPLET.md`
- **Checklist** : `frontend/CHECKLIST.md`

---

## 🔧 Configuration avancée

### Variables d'environnement

#### Backend

Le backend n'a pas besoin de fichier `.env` pour fonctionner en mode développement.

#### Frontend

Fichier `frontend/.env` :

```env
VITE_API_URL=http://localhost:8000
```

### Modifier les ports

**Backend** : Éditez `backend/main.py` ligne 270 :

```python
uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8000,  # Changez ce port
    reload=True
)
```

**Frontend** : Éditez `frontend/vite.config.js` :

```javascript
export default defineConfig({
  server: {
    port: 3000,  // Changez ce port
  }
})
```

---

## 🏗️ Build pour la production

### Backend

Le backend peut être déployé tel quel avec Uvicorn :

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

Pour la production, utilisez Gunicorn avec Uvicorn workers :

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

Pour créer une version optimisée pour la production :

```bash
cd frontend
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

Pour prévisualiser le build :

```bash
npm run preview
```

---

## 🐛 Dépannage

### Le backend ne démarre pas

- Vérifiez que Python 3.8+ est installé : `python --version`
- Installez les dépendances : `pip install -r requirements.txt`
- Vérifiez qu'aucun autre processus n'utilise le port 8000

### Le frontend ne démarre pas

- Vérifiez que Node.js 16+ est installé : `node --version`
- Installez les dépendances : `npm install`
- Supprimez `node_modules/` et réinstallez si nécessaire
- Vérifiez qu'aucun autre processus n'utilise le port 3000

### Erreurs CORS

Si vous rencontrez des erreurs CORS :

1. Vérifiez que le backend est bien sur `http://localhost:8000`
2. Vérifiez que le frontend est bien sur `http://localhost:3000`
3. Le CORS est configuré dans `backend/main.py` ligne 146

### Le panier ne se synchronise pas

- Vérifiez que vous êtes bien connecté
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que le backend est démarré et répond

---

## 📝 Changelog

### Version 1.0.0 (2025-01-XX)

- ✅ Backend FastAPI complet avec 35+ endpoints
- ✅ Frontend React avec 15 pages
- ✅ Authentification JWT
- ✅ Gestion complète du panier
- ✅ Processus de commande de bout en bout
- ✅ Page de paiement simulée réaliste
- ✅ Interface administrateur complète
- ✅ Support client avec messagerie
- ✅ Design responsive avec Tailwind CSS
- ✅ Documentation exhaustive (11 fichiers)

---

## 👨‍💻 Développement

### Ajouter une nouvelle fonctionnalité

#### Backend

1. Ajoutez les modèles nécessaires dans `models.py`
2. Ajoutez les schémas Pydantic dans `schemas.py`
3. Créez un nouveau router dans `routers/`
4. Incluez le router dans `main.py`

#### Frontend

1. Créez le composant/page dans `src/components/` ou `src/pages/`
2. Ajoutez la route dans `src/App.jsx`
3. Ajoutez les appels API dans `src/services/api.js`
4. Utilisez les contexts si nécessaire (AuthContext, CartContext)

### Tests

#### Backend

Exécutez les tests automatisés :

```bash
cd backend
python test_api.py
```

#### Frontend

Créez des tests avec Vitest :

```bash
cd frontend
npm run test
```

---

## 🤝 Contribution

Ce projet est un projet éducatif de démonstration. Les contributions ne sont pas actuellement acceptées.

---

## 📄 Licence

Ce projet est à des fins éducatives et de démonstration uniquement.

---

## 🎯 Résumé des commandes

### Installation et démarrage

```bash
# Backend
cd backend
pip install -r requirements.txt
python seed.py
python main.py

# Frontend (dans un nouveau terminal)
cd frontend
npm install
npm run dev
```

### Accès

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:8000
- **API Docs** : http://localhost:8000/docs

### Comptes de test

- **Admin** : `admin@example.com` / `admin123`
- **Client** : `alice@example.com` / `password123`

---

## 🎉 Conclusion

Vous avez maintenant un **site e-commerce complet et fonctionnel** !

Le projet comprend :
- ✅ 75+ fichiers de code
- ✅ Plus de 6500 lignes de code
- ✅ Backend API complet
- ✅ Frontend React moderne
- ✅ 11 fichiers de documentation
- ✅ Scripts de test et de données
- ✅ Design professionnel et responsive

**Bon développement et bonne démonstration !** 🚀

---

*Dernière mise à jour : Janvier 2025*
