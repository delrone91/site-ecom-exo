# Instructions pour créer un site e-commerce complet avec Claude Code

## Contexte
J'ai un fichier Python (`ecommerce_backend.py`) qui contient toute la logique métier d'une boutique en ligne. Je veux créer une application web complète basée sur ce code.

## Architecture technique souhaitée

### Backend
- **Framework**: FastAPI (Python) - cohérent avec le fichier source
- **Structure**: Utiliser le code existant comme base
- **API**: REST API avec endpoints pour toutes les fonctionnalités
- **Authentification**: JWT tokens basés sur le SessionManager existant

### Frontend
- **Framework**: React avec Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API ou Redux Toolkit
- **HTTP Client**: Axios

### Base de données
- Garder les repositories en mémoire pour le moment (comme dans le code source)
- Structure prête pour migration future vers PostgreSQL/SQLite

## Étapes de développement

### Phase 1: Compléter et préparer le backend

1. **Compléter les noms manquants (???)**
   - Identifier tous les `???` dans le code
   - Proposer des noms français cohérents:
     - Enum des statuts → `OrderStatus` (déjà nommé)
     - Classes de données → `User`, `Product`, `CartItem`, `Cart`, etc.
     - Services → `AuthService`, `CatalogService`, `OrderService`, `CustomerService`
     - Repositories → `UserRepository`, `ProductRepository`, `CartRepository`, etc.

2. **Créer l'API FastAPI**
   - Fichier `main.py` avec FastAPI
   - Routers séparés:
     - `/api/auth` - inscription, connexion, déconnexion
     - `/api/catalog` - liste produits
     - `/api/cart` - gestion panier
     - `/api/orders` - commandes client
     - `/api/admin` - gestion back-office
     - `/api/support` - service client
   - Middleware CORS
   - Gestion des erreurs globale
   - Documentation Swagger automatique

3. **Modèles Pydantic**
   - DTOs pour les requêtes/réponses API
   - Validation des données
   - Sérialisation JSON

### Phase 2: Créer le frontend React

1. **Structure du projet**
   ```
   frontend/
   ├── src/
   │   ├── components/
   │   │   ├── common/       # Boutons, inputs, cards
   │   │   ├── layout/       # Header, Footer, Navigation
   │   │   ├── product/      # ProductCard, ProductList
   │   │   ├── cart/         # CartItem, CartSummary
   │   │   └── order/        # OrderCard, OrderDetails
   │   ├── pages/
   │   │   ├── HomePage.jsx
   │   │   ├── ProductsPage.jsx
   │   │   ├── ProductDetailPage.jsx
   │   │   ├── CartPage.jsx
   │   │   ├── CheckoutPage.jsx
   │   │   ├── PaymentPage.jsx (non fonctionnelle)
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
   │   │   ├── AuthContext.jsx
   │   │   └── CartContext.jsx
   │   ├── services/
   │   │   └── api.js
   │   ├── utils/
   │   └── App.jsx
   ```

2. **Pages principales à créer**

   **Page d'accueil**
   - Bannière hero
   - Produits en vedette
   - Catégories
   - Design moderne et attrayant

   **Catalogue produits**
   - Grille de produits
   - Filtres (prix, disponibilité)
   - Recherche
   - Pagination

   **Détail produit**
   - Images produit
   - Description
   - Prix
   - Stock disponible
   - Bouton "Ajouter au panier"
   - Quantité sélectionnable

   **Panier**
   - Liste des articles
   - Modification quantités
   - Suppression articles
   - Total en temps réel
   - Bouton checkout

   **Page de paiement (NON FONCTIONNELLE)**
   - Formulaire de carte bancaire (visuel seulement)
   - Champs: numéro, expiration, CVV
   - Message: "Ceci est une page de démonstration"
   - Bouton "Simuler paiement" qui valide automatiquement
   - Design réaliste type Stripe/PayPal

   **Mes commandes**
   - Liste des commandes
   - Statuts colorés
   - Détails de chaque commande
   - Numéro de suivi si expédiée
   - Bouton annulation (si possible)

   **Support client**
   - Liste des fils de discussion
   - Création nouveau ticket
   - Vue détaillée des messages
   - Interface de chat

   **Back-office admin**
   - Dashboard avec statistiques
   - Gestion des commandes (validation, expédition, livraison)
   - Liste de tous les produits
   - Gestion du stock

3. **Fonctionnalités clés**
   - Authentification persistante (localStorage)
   - Panier persistant
   - Notifications toast pour les actions
   - Loading states
   - Gestion d'erreurs
   - Responsive design (mobile-first)

### Phase 3: Intégration et tests

1. **Connexion Frontend-Backend**
   - Configuration proxy Vite vers FastAPI
   - Variables d'environnement
   - Intercepteurs Axios pour auth

2. **Données de test**
   - Script de seeding avec produits
   - Utilisateurs de test (admin + clients)
   - Commandes exemples

3. **Documentation**
   - README avec instructions de lancement
   - Variables d'environnement nécessaires
   - Screenshots de l'application

## Contraintes spécifiques

### Page de paiement
- **Doit ressembler** à une vraie page de paiement
- **Ne doit PAS** être fonctionnelle
- **Doit afficher** clairement qu'il s'agit d'une démo
- **Doit valider** automatiquement quand on clique sur "Payer"
- Design inspiré de Stripe Elements ou PayPal

### Respect du code source
- Garder la logique métier du fichier Python
- Ne pas réinventer les services existants
- Utiliser les mêmes noms de méthodes
- Respecter la structure OrderStatus, etc.

### Design
- Interface moderne et professionnelle
- Expérience utilisateur fluide
- Accessibilité (a11y)
- Dark mode optionnel

## Commandes de démarrage attendues

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

## Livrables attendus

1. ✅ Application frontend React complète et fonctionnelle
2. ✅ API Backend FastAPI complète
3. ✅ Toutes les pages listées ci-dessus
4. ✅ Page de paiement factice mais réaliste
5. ✅ Interface d'administration
6. ✅ Authentification complète
7. ✅ README avec instructions
8. ✅ Code propre et commenté en français

## Priorités

**HAUTE**
- Catalogue et détail produit
- Panier fonctionnel
- Processus de commande complet
- Page de paiement (même factice)
- Authentification

**MOYENNE**
- Interface admin
- Support client
- Profil utilisateur

**BASSE**
- Dark mode
- Animations avancées
- PWA features

---

**Note pour Claude Code**: Crée une application e-commerce moderne, complète et prête à démontrer. Le code doit être propre, maintenable et bien structuré. La page de paiement doit être visuellement convaincante même si non fonctionnelle.