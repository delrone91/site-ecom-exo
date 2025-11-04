# 🏗️ Architecture du Backend E-Commerce

## Vue d'ensemble

Ce backend FastAPI suit une architecture en couches avec une séparation claire des responsabilités.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  ROUTERS (Endpoints)                     │
│  ┌─────────┬──────────┬──────┬─────────┬─────────┬────┐ │
│  │  Auth   │ Catalog  │ Cart │ Orders  │ Support │Admin│ │
│  └─────────┴──────────┴──────┴─────────┴─────────┴────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 SCHEMAS (DTOs Pydantic)                  │
│         Validation et sérialisation des données          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVICES (Logique métier)               │
│  ┌──────────┬─────────┬────────┬─────────┬───────────┐  │
│  │   Auth   │ Catalog │  Cart  │  Order  │ Customer  │  │
│  │ Service  │ Service │Service │ Service │  Service  │  │
│  └──────────┴─────────┴────────┴─────────┴───────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              REPOSITORIES (Accès aux données)            │
│  ┌──────┬─────────┬──────┬────────┬─────────┬────────┐  │
│  │ User │ Product │ Cart │ Order  │ Invoice │ Thread │  │
│  │ Repo │  Repo   │ Repo │  Repo  │  Repo   │  Repo  │  │
│  └──────┴─────────┴──────┴────────┴─────────┴────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   MODÈLES DE DONNÉES                     │
│      User, Product, Cart, Order, Invoice, Thread...      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              STOCKAGE EN MÉMOIRE (Dict)                  │
└─────────────────────────────────────────────────────────┘
```

## 📦 Composants principaux

### 1. Models (models.py)

Contient toutes les définitions de base :

**Modèles de données** (@dataclass)
- `User` - Utilisateur
- `Product` - Produit
- `Cart` - Panier
- `Order` - Commande
- `Invoice` - Facture
- `Payment` - Paiement
- `Delivery` - Livraison
- `MessageThread` - Fil de discussion support

**Repositories** (pattern Repository)
- Abstraction de la persistence
- Interface simple (add, get, list)
- Stockage en mémoire (Dict)

**Services**
- `AuthService` - Authentification et gestion utilisateurs
- `CatalogService` - Catalogue produits
- `CartService` - Gestion panier
- `OrderService` - Cycle de vie des commandes
- `BillingService` - Facturation
- `DeliveryService` - Livraison
- `CustomerService` - Support client
- `PaymentGateway` - Passerelle de paiement (mock)
- `SessionManager` - Gestion des sessions

### 2. Schemas (schemas.py)

Schémas Pydantic pour la validation et sérialisation :

**Requêtes** (Request)
- Validation automatique des données entrantes
- Conversion de types
- Messages d'erreur clairs

**Réponses** (Response)
- Sérialisation uniforme
- Documentation automatique (OpenAPI)
- Conversions (ex: cents → euros)

**Exemples :**
```python
RegisterRequest      → Inscription
LoginResponse        → Réponse connexion
ProductResponse      → Produit
OrderResponse        → Commande
```

### 3. Routers (routers/)

Endpoints HTTP organisés par domaine fonctionnel :

#### auth.py - Authentification
- `POST /register` - Inscription
- `POST /login` - Connexion
- `POST /logout-v2` - Déconnexion
- `GET /profile` - Profil
- `PUT /profile` - Mise à jour profil

#### catalog.py - Catalogue
- `GET /products` - Liste produits
- `GET /products/{id}` - Détail produit

#### cart.py - Panier
- `GET /` - Voir panier
- `POST /add` - Ajouter produit
- `POST /remove` - Retirer produit
- `DELETE /clear` - Vider panier

#### orders.py - Commandes
- `POST /checkout` - Créer commande
- `POST /pay` - Payer
- `GET /` - Mes commandes
- `GET /{id}` - Détail commande
- `POST /cancel` - Annuler

#### support.py - Support Client
- `POST /threads` - Créer fil
- `GET /threads` - Mes fils
- `GET /threads/{id}` - Détail fil
- `POST /threads/{id}/messages` - Poster message

#### admin.py - Administration
- Gestion commandes (validate, ship, deliver, refund)
- Gestion produits (create, update, stock)
- Support (reply, close threads)
- Statistiques

### 4. Main (main.py)

Point d'entrée de l'application :

**Initialisation**
- Création des repositories
- Instanciation des services
- Configuration du contexte applicatif

**Configuration FastAPI**
- CORS (http://localhost:5173)
- Gestion d'erreurs globale
- Documentation automatique

**Dépendances**
- `get_context()` - Injection du contexte
- `get_current_user_id()` - Authentification
- `get_current_admin_user_id()` - Autorisation admin

## 🔄 Flux de données typiques

### Flux 1 : Connexion utilisateur

```
1. Client → POST /api/auth/login
2. Router auth.py → AuthService.login()
3. AuthService → UserRepository.get_by_email()
4. AuthService → PasswordHasher.verify()
5. AuthService → SessionManager.create_session()
6. Router → LoginResponse (avec token)
7. Client ← Token de session
```

### Flux 2 : Ajout au panier

```
1. Client → POST /api/cart/add (avec token)
2. Middleware → get_current_user_id() (validation token)
3. Router cart.py → CartService.add_to_cart()
4. CartService → ProductRepository.get() (validation produit)
5. CartService → CartRepository.get_or_create()
6. CartService → Cart.add() (logique métier)
7. Router → CartResponse
8. Client ← Panier mis à jour
```

### Flux 3 : Création de commande

```
1. Client → POST /api/orders/checkout
2. Router orders.py → OrderService.checkout()
3. OrderService → CartRepository.get_or_create()
4. OrderService → ProductRepository.reserve_stock() (pour chaque item)
5. OrderService → Order (création)
6. OrderService → OrderRepository.add()
7. OrderService → CartRepository.clear()
8. Router → OrderResponse
9. Client ← Commande créée
```

### Flux 4 : Paiement

```
1. Client → POST /api/orders/pay
2. Router → OrderService.pay_by_card()
3. OrderService → PaymentGateway.charge_card()
4. OrderService → Payment (création)
5. OrderService → PaymentRepository.add()
6. OrderService → BillingService.issue_invoice()
7. OrderService → Order.status = PAYEE
8. Router → PaymentResponse
9. Client ← Confirmation paiement
```

## 🔐 Sécurité et Authentification

### Système de tokens

```python
# Connexion
token = SessionManager.create_session(user_id)  # UUID

# Sessions en mémoire
sessions = {
    "token-uuid-1": "user-id-1",
    "token-uuid-2": "user-id-2"
}

# Validation
def get_current_user_id(authorization: str):
    token = extract_token(authorization)
    user_id = SessionManager.get_user_id(token)
    if not user_id:
        raise HTTPException(401)
    return user_id
```

### Niveaux d'autorisation

1. **Public** - Pas d'authentification
   - Catalogue produits
   - Health check

2. **Authentifié** - Token requis
   - Panier
   - Commandes
   - Profil
   - Support

3. **Admin** - Token + is_admin=True
   - Gestion commandes
   - Gestion produits
   - Statistiques
   - Support (répondre)

## 📊 Cycle de vie d'une commande

```
CREE (checkout)
  │
  ├─→ VALIDEE (admin validate) [optionnel]
  │
  ├─→ PAYEE (client pay)
  │     │
  │     ├─→ EXPEDIEE (admin ship)
  │     │     │
  │     │     └─→ LIVREE (admin deliver) [FINAL]
  │     │
  │     └─→ REMBOURSEE (admin refund) [FINAL]
  │
  └─→ ANNULEE (client cancel) [FINAL]
```

## 🔄 Gestion du stock

```python
# Lors du checkout
for item in cart.items:
    ProductRepository.reserve_stock(item.product_id, item.quantity)
    # product.stock_qty -= quantity

# Lors de l'annulation/remboursement
for item in order.items:
    ProductRepository.release_stock(item.product_id, item.quantity)
    # product.stock_qty += quantity
```

## 🎯 Bonnes pratiques appliquées

### Séparation des responsabilités
- **Routers** : HTTP uniquement, pas de logique métier
- **Services** : Logique métier, orchestration
- **Repositories** : Accès aux données uniquement
- **Schemas** : Validation et sérialisation

### Gestion d'erreurs
```python
try:
    # Logique métier
except ValueError as e:
    raise HTTPException(400, detail=str(e))
except PermissionError as e:
    raise HTTPException(403, detail=str(e))
```

### Injection de dépendances
```python
def endpoint(
    user_id: str = Depends(get_current_user_id),
    context: AppContext = Depends(get_context)
):
    # user_id et context injectés automatiquement
```

### Documentation automatique
- Tous les endpoints documentés via docstrings
- Schémas Pydantic → OpenAPI
- Swagger UI disponible sur /docs

## 🚀 Évolutions possibles

### Court terme
- [ ] JWT au lieu de sessions en mémoire
- [ ] Bcrypt pour les mots de passe
- [ ] Validation email (regex plus stricte)
- [ ] Rate limiting

### Moyen terme
- [ ] SQLAlchemy + PostgreSQL
- [ ] Redis pour les sessions
- [ ] Celery pour les tâches asynchrones
- [ ] Upload d'images (AWS S3)

### Long terme
- [ ] Microservices (séparation auth, orders, payments)
- [ ] GraphQL en complément de REST
- [ ] Elasticsearch pour la recherche
- [ ] Event sourcing pour l'historique des commandes

## 📚 Ressources

- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Pydantic](https://docs.pydantic.dev/)
- [Pattern Repository](https://martinfowler.com/eaaCatalog/repository.html)
- [REST API Best Practices](https://restfulapi.net/)

---

Cette architecture offre une base solide et extensible pour un site e-commerce complet !
