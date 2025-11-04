# 🚀 Guide de démarrage rapide

## Installation et lancement en 3 étapes

### 1. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 2. Charger les données de test

```bash
python seed.py
```

Cela va créer :
- 1 compte administrateur
- 3 comptes clients
- 15 produits variés
- 2 commandes de test
- 2 fils de discussion support

### 3. Démarrer le serveur

```bash
python main.py
```

ou

```bash
uvicorn main:app --reload
```

L'API est maintenant accessible sur **http://localhost:8000**

Documentation interactive : **http://localhost:8000/docs**

---

## 🧪 Tester l'API

### Option 1 : Script de test automatique

```bash
python test_api.py
```

### Option 2 : Swagger UI

Ouvrez http://localhost:8000/docs dans votre navigateur et testez directement les endpoints.

### Option 3 : Exemples curl

**1. Connexion client**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@email.test","password":"password123"}'
```

**2. Voir le catalogue**
```bash
curl http://localhost:8000/api/catalog/products
```

**3. Ajouter au panier** (nécessite un token)
```bash
TOKEN="votre_token_ici"
PRODUCT_ID="id_du_produit"

curl -X POST http://localhost:8000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":\"$PRODUCT_ID\",\"quantity\":1}"
```

---

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@ecom.test | admin123 |
| Client | alice@email.test | password123 |
| Client | bob@email.test | password123 |
| Client | charlie@email.test | password123 |

---

## 📚 Endpoints principaux

### Publics
- `GET /api/catalog/products` - Liste des produits

### Authentification requise
- `POST /api/auth/login` - Connexion
- `GET /api/cart` - Voir mon panier
- `POST /api/cart/add` - Ajouter au panier
- `POST /api/orders/checkout` - Créer une commande
- `POST /api/orders/pay` - Payer une commande

### Admin uniquement
- `GET /api/admin/stats` - Statistiques
- `POST /api/admin/orders/ship` - Expédier une commande
- `PUT /api/admin/products/stock` - Mettre à jour le stock

---

## 📖 Documentation complète

Consultez le fichier [README.md](./README.md) pour :
- Structure détaillée du projet
- Tous les endpoints disponibles
- Workflow complet d'une commande
- Guide d'authentification
- Notes techniques et améliorations futures

---

## ❓ Problèmes courants

**Le serveur ne démarre pas**
- Vérifiez que le port 8000 est libre
- Vérifiez que toutes les dépendances sont installées

**"Token invalide"**
- Reconnectez-vous pour obtenir un nouveau token
- Vérifiez le format : `Authorization: Bearer <token>`

**"Produit introuvable" lors de l'ajout au panier**
- Vérifiez que l'ID du produit existe dans le catalogue
- Vérifiez que le produit est actif (active=true)

---

Bon développement ! 🎉
