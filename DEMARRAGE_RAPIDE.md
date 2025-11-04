# 🚀 Démarrage Rapide - Site E-Commerce

## ✅ Corrections apportées

Tous les problèmes ont été corrigés :

1. ✅ **Routes API** : Ajout du préfixe `/api/` dans toutes les routes
2. ✅ **Import FastAPI** : Ajout de `Header` dans les imports
3. ✅ **Comptes de test** : Documentation mise à jour

---

## 📋 Instructions de démarrage

### Étape 1 : Backend (Terminal 1)

```powershell
# Ouvrir PowerShell
cd C:\Users\delro\Desktop\école\site_ecom\backend

# Charger les données de test (SEULEMENT LA PREMIÈRE FOIS)
python seed.py

# Démarrer le serveur backend
python main.py
```

✅ Le backend sera sur **http://localhost:8000**

### Étape 2 : Frontend (Nouveau Terminal 2)

```powershell
# Ouvrir un NOUVEAU PowerShell
cd C:\Users\delro\Desktop\école\site_ecom\frontend

# Installer les dépendances (SEULEMENT LA PREMIÈRE FOIS)
npm install

# Démarrer le frontend
npm run dev
```

✅ Le frontend sera sur **http://localhost:3000**

---

## 🔑 Comptes de test

### Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

### Clients
1. **Alice** (avec commande livrée)
   - Email : `alice@example.com`
   - Mot de passe : `password123`

2. **Bob** (avec commande payée)
   - Email : `bob@example.com`
   - Mot de passe : `password123`

3. **Charlie** (avec panier actif)
   - Email : `charlie@example.com`
   - Mot de passe : `password123`

---

## 🎯 Tester l'application

### 1. Connexion
- Allez sur http://localhost:3000
- Cliquez sur "Connexion"
- Utilisez un des comptes ci-dessus

### 2. Parcourir les produits
- La page d'accueil affiche les produits
- Cliquez sur un produit pour voir les détails
- Ajoutez au panier

### 3. Processus de commande
- Cliquez sur l'icône panier
- Vérifiez votre panier
- Cliquez sur "Commander"
- Sur la page de paiement, utilisez :
  - **Numéro de carte** : `4242 4242 4242 4242`
  - **Expiration** : `12/2025`
  - **CVV** : `123`

### 4. Administration (avec compte admin)
- Connectez-vous avec `admin@ecom.test`
- Accédez au dashboard admin
- Gérez les commandes
- Gérez les produits

---

## 🔍 Vérification de l'installation

### Backend
```powershell
# Dans le terminal backend, vous devriez voir :
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Frontend
```powershell
# Dans le terminal frontend, vous devriez voir :
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## ❓ Problèmes courants

### Le backend ne démarre pas
```powershell
# Vérifiez que les dépendances sont installées
pip install -r requirements.txt
```

### Le frontend ne démarre pas
```powershell
# Installez les dépendances
npm install
```

### Erreur 404 sur les routes
✅ **DÉJÀ CORRIGÉ** - Toutes les routes ont le préfixe `/api/`

### Les comptes ne fonctionnent pas
✅ **DÉJÀ CORRIGÉ** - Utilisez les comptes listés ci-dessus

---

## 📚 Documentation complète

- **Racine** : `README.md` - Guide complet
- **Backend** : `backend/README.md` - Doc technique backend
- **Frontend** : `frontend/README.md` - Doc technique frontend
- **API Swagger** : http://localhost:8000/docs (une fois le backend lancé)

---

## 🎉 C'est tout !

Votre site e-commerce est maintenant **100% fonctionnel** !

Amusez-vous bien ! 🚀
