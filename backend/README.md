# Backend E-Commerce - API FastAPI

API REST complète pour un site e-commerce avec gestion des utilisateurs, produits, commandes, paiements et support client.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
pip install -r requirements.txt
```

### Initialisation des données de test

```bash
python seed.py
```

### Lancement du serveur

```bash
python main.py
```

ou avec uvicorn directement :

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

L'API sera accessible sur : http://localhost:8000

Documentation interactive (Swagger) : http://localhost:8000/docs

Documentation alternative (ReDoc) : http://localhost:8000/redoc

## 📁 Structure du projet

```
backend/
├── models.py           # Modèles de données, repositories et services métier
├── schemas.py          # Schémas Pydantic pour les DTOs (requêtes/réponses)
├── main.py             # Application FastAPI principale
├── seed.py             # Script de création de données de test
├── routers/            # Endpoints de l'API
│   ├── __init__.py
│   ├── auth.py         # Authentification (inscription, connexion, profil)
│   ├── catalog.py      # Catalogue produits (liste, détails)
│   ├── cart.py         # Panier (ajout, retrait, consultation)
│   ├── orders.py       # Commandes (checkout, paiement, annulation)
│   ├── support.py      # Support client (threads, messages)
│   └── admin.py        # Administration (gestion commandes, produits, stats)
└── requirements.txt    # Dépendances Python
```

## 🔑 Comptes de test

Après avoir exécuté `seed.py`, vous pouvez utiliser ces comptes :

**Administrateur :**
- Email : `admin@ecom.test`
- Mot de passe : `admin123`

**Clients :**
- Email : `alice@email.test` / Mot de passe : `password123`
- Email : `bob@email.test` / Mot de passe : `password123`
- Email : `charlie@email.test` / Mot de passe : `password123`

## 📋 Endpoints disponibles

### Authentification (`/api/auth`)

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout-v2` - Déconnexion
- `GET /api/auth/profile` - Récupérer son profil
- `PUT /api/auth/profile` - Mettre à jour son profil

### Catalogue (`/api/catalog`)

- `GET /api/catalog/products` - Liste tous les produits actifs
- `GET /api/catalog/products/{id}` - Détail d'un produit

### Panier (`/api/cart`)

- `GET /api/cart` - Voir son panier
- `POST /api/cart/add` - Ajouter un produit au panier
- `POST /api/cart/remove` - Retirer un produit du panier
- `DELETE /api/cart/clear` - Vider le panier

### Commandes (`/api/orders`)

- `POST /api/orders/checkout` - Créer une commande depuis le panier
- `POST /api/orders/pay` - Payer une commande par carte
- `GET /api/orders` - Liste de mes commandes
- `GET /api/orders/{id}` - Détail d'une commande
- `POST /api/orders/cancel` - Annuler une commande

### Support Client (`/api/support`)

- `POST /api/support/threads` - Créer un fil de discussion
- `GET /api/support/threads` - Voir mes fils de discussion
- `GET /api/support/threads/{id}` - Détail d'un fil
- `POST /api/support/threads/{id}/messages` - Poster un message

### Administration (`/api/admin`) 🔒

**Gestion des commandes :**
- `GET /api/admin/orders` - Toutes les commandes
- `POST /api/admin/orders/validate` - Valider une commande
- `POST /api/admin/orders/ship` - Expédier une commande
- `POST /api/admin/orders/deliver` - Marquer comme livrée
- `POST /api/admin/orders/refund` - Rembourser une commande

**Gestion des produits :**
- `GET /api/admin/products` - Tous les produits (actifs et inactifs)
- `POST /api/admin/products` - Créer un produit
- `PUT /api/admin/products` - Mettre à jour un produit
- `PUT /api/admin/products/stock` - Mettre à jour le stock

**Support client :**
- `GET /api/admin/support/threads` - Tous les threads
- `POST /api/admin/support/threads/{id}/reply` - Répondre en tant que support
- `POST /api/admin/support/threads/{id}/close` - Fermer un thread

**Statistiques :**
- `GET /api/admin/stats` - Statistiques globales du site

## 🔐 Authentification

L'API utilise un système de tokens pour l'authentification.

**Étapes :**

1. Connexion via `/api/auth/login` ou `/api/auth/register`
2. Récupération du token dans la réponse
3. Envoi du token dans le header `Authorization` pour les requêtes suivantes

**Format du header :**
```
Authorization: Bearer <votre_token>
```

**Exemple avec curl :**
```bash
# Connexion
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@email.test","password":"password123"}' \
  | jq -r '.token')

# Utilisation du token
curl http://localhost:8000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

## 💳 Paiement (Simulation)

Le système de paiement est simulé pour les tests :

**Carte qui fonctionne :**
- Numéro : `4242424242424242`
- Expiration : N'importe quelle date future (ex: 12/2030)
- CVC : N'importe quel code 3-4 chiffres (ex: 123)

**Carte qui échoue :**
- Numéro se terminant par `0000` (ex: `4242424242420000`)

## 📊 Workflow complet d'une commande

1. **Client** : Inscription/Connexion
2. **Client** : Ajout de produits au panier
3. **Client** : Checkout (création de la commande)
4. **Admin** : Validation de la commande *(optionnel selon la logique métier)*
5. **Client** : Paiement par carte
6. **Admin** : Expédition de la commande
7. **Admin** : Marquage comme livrée

**Statuts de commande :**
- `CREE` - Commande créée, en attente de paiement
- `VALIDEE` - Validée par un admin
- `PAYEE` - Payée, en attente d'expédition
- `EXPEDIEE` - En cours de livraison
- `LIVREE` - Livrée au client
- `ANNULEE` - Annulée (par le client avant expédition)
- `REMBOURSEE` - Remboursée (par un admin)

## 🛠️ Développement

### CORS

Le CORS est configuré pour accepter les requêtes depuis `http://localhost:5173` (frontend Vite).

Pour modifier les origines autorisées, éditez `main.py` :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Ajoutez vos origines ici
    ...
)
```

### Gestion d'erreurs

L'API gère automatiquement les erreurs suivantes :

- `ValueError` → HTTP 400 (Bad Request)
- `PermissionError` → HTTP 403 (Forbidden)
- `HTTPException` → Code HTTP correspondant
- `Exception` → HTTP 500 (Internal Server Error)

## 📝 Notes techniques

- **Base de données** : Stockage en mémoire (les données sont perdues au redémarrage)
- **Hash de mot de passe** : Implémentation simple pour la démo (à remplacer par bcrypt/argon2)
- **Paiement** : Gateway simulé (à remplacer par Stripe/Adyen en production)
- **Sessions** : Stockage en mémoire avec tokens UUID (à remplacer par JWT ou sessions Redis)

## 🚧 Améliorations futures

- [ ] Persistence avec SQLAlchemy + PostgreSQL
- [ ] JWT pour l'authentification
- [ ] Hash sécurisé des mots de passe (bcrypt)
- [ ] Intégration Stripe pour les paiements
- [ ] Upload d'images produits
- [ ] Envoi d'emails (confirmation commande, tracking)
- [ ] Gestion des variantes produits (tailles, couleurs)
- [ ] Système de reviews/notes produits
- [ ] Recherche et filtres avancés

## 📄 Licence

Ce projet est développé dans un cadre éducatif.
