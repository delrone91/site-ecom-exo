# 📚 Exemples de Code - E-Shop Frontend

Ce document présente des exemples de code clés pour comprendre le fonctionnement de l'application.

---

## 🔐 Authentification avec Context API

### Utilisation du AuthContext dans un composant

```jsx
import { useAuth } from '../context/AuthContext';

function MonComposant() {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login('alice@example.com', 'password123');
      // Redirection automatique après connexion
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bienvenue {user.email}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

---

## 🛒 Gestion du Panier avec Context API

### Utilisation du CartContext

```jsx
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price} €</p>
      <button onClick={handleAddToCart}>Ajouter au panier</button>
    </div>
  );
}
```

### Afficher le nombre d'articles dans le panier

```jsx
import { useCart } from '../context/CartContext';

function Header() {
  const { cart } = useCart();

  const itemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div>
      <span>Panier ({itemsCount})</span>
    </div>
  );
}
```

---

## 🌐 Appels API avec Axios

### Configuration de base (déjà dans api.js)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Exemple d'utilisation dans un composant

```jsx
import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## 🔒 Protection des Routes

### Route protégée (nécessite authentification)

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Utilisation dans App.jsx
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  }
/>
```

### Route admin (nécessite is_admin = true)

```jsx
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

---

## 🎨 Composants Réutilisables

### Bouton avec états de chargement

```jsx
<Button
  variant="primary"      // primary, secondary, danger, success, outline
  size="lg"              // sm, md, lg
  loading={isLoading}    // Affiche un spinner
  disabled={isDisabled}  // Désactive le bouton
  onClick={handleClick}
>
  Mon Bouton
</Button>
```

### Input avec validation

```jsx
<Input
  label="Email"
  type="email"
  placeholder="votre@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}          // Message d'erreur à afficher
  required               // Affiche une *
/>
```

### Card avec effet hover

```jsx
<Card hover onClick={handleClick}>
  <h3>Titre de la carte</h3>
  <p>Contenu de la carte</p>
</Card>
```

---

## 📱 Navigation avec React Router

### Navigation programmatique

```jsx
import { useNavigate } from 'react-router-dom';

function MonComposant() {
  const navigate = useNavigate();

  const goToProduct = (id) => {
    navigate(`/products/${id}`);
  };

  const goBack = () => {
    navigate(-1); // Retour en arrière
  };

  return (
    <div>
      <button onClick={goBack}>Retour</button>
      <button onClick={() => goToProduct(123)}>Voir produit</button>
    </div>
  );
}
```

### Liens avec React Router

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Accueil</Link>
      <Link to="/products">Produits</Link>
      <Link to="/cart">Panier</Link>
    </nav>
  );
}
```

### Récupérer les paramètres d'URL

```jsx
import { useParams } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams(); // Récupère :id depuis /products/:id

  useEffect(() => {
    loadProduct(id);
  }, [id]);

  // ...
}
```

---

## 💳 Page de Paiement Simulée

### Validation du formulaire

```jsx
const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

const validateCVV = (cvv) => {
  return cvv.length === 3 && /^\d+$/.test(cvv);
};
```

### Formatage du numéro de carte

```jsx
const handleCardNumberChange = (e) => {
  // Formater avec des espaces tous les 4 chiffres
  let value = e.target.value.replace(/\s/g, '');
  value = value.replace(/\D/g, '').substring(0, 16);
  const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
  setCardNumber(formatted);
};
```

### Détection du type de carte

```jsx
const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (cleaned.startsWith('4')) return 'Visa';
  if (cleaned.startsWith('5')) return 'Mastercard';
  if (cleaned.startsWith('3')) return 'American Express';
  return null;
};
```

### Simulation du paiement

```jsx
const handlePayment = async () => {
  if (!validateForm()) return;

  try {
    setProcessing(true);

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Envoyer les données factices à l'API
    const paymentData = {
      card_number: '4242424242424242',  // Carte factice
      card_holder: cardHolder,
      expiry_date: `${expiryMonth}/${expiryYear}`,
      cvv: cvv,
    };

    await payOrder(orderId, paymentData);

    // Rediriger vers la confirmation
    navigate(`/orders/${orderId}`, {
      state: { paymentSuccess: true }
    });
  } catch (error) {
    alert('Erreur lors du paiement');
  } finally {
    setProcessing(false);
  }
};
```

---

## 🎯 Gestion des États

### État local avec useState

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Compteur: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

### Effet de bord avec useEffect

```jsx
import { useState, useEffect } from 'react';

function ProductDetail({ id }) {
  const [product, setProduct] = useState(null);

  // Se déclenche quand id change
  useEffect(() => {
    loadProduct(id);
  }, [id]);

  // Se déclenche une seule fois au montage
  useEffect(() => {
    console.log('Composant monté');
    return () => {
      console.log('Composant démonté'); // Cleanup
    };
  }, []);

  // ...
}
```

### État complexe

```jsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: '',
});

// Mise à jour d'un champ spécifique
const handleChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};

// Ou avec l'événement directement
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

---

## 🔄 Gestion des Erreurs

### Try-catch avec async/await

```jsx
const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.getData();
    setData(data);
  } catch (error) {
    console.error('Erreur:', error);
    setError(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};
```

### Affichage des erreurs

```jsx
function MyForm() {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email requis';
    if (!password) newErrors.password = 'Mot de passe requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form>
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
    </form>
  );
}
```

---

## 🎨 Styling avec Tailwind CSS

### Classes utilitaires de base

```jsx
// Layout
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">

// Spacing
<div className="p-4 m-2">  // padding 1rem, margin 0.5rem
<div className="px-6 py-3"> // padding horizontal 1.5rem, vertical 0.75rem

// Colors
<div className="bg-primary-600 text-white">
<div className="bg-gray-100 text-gray-800">

// Typography
<h1 className="text-3xl font-bold">
<p className="text-sm text-gray-600">

// Border & Shadow
<div className="rounded-lg shadow-md border border-gray-200">

// Hover & Focus
<button className="hover:bg-primary-700 focus:ring-2 focus:ring-primary-200">

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### Animations

```jsx
// Classes d'animation définies dans tailwind.config.js
<div className="animate-fade-in">
<div className="animate-slide-in">
<div className="animate-spin">  // Pour les spinners
```

---

## 📊 Patterns Courants

### Conditional Rendering

```jsx
// If simple
{isLoggedIn && <UserMenu />}

// If-else
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// Multiple conditions
{status === 'loading' && <Loading />}
{status === 'error' && <Error />}
{status === 'success' && <Data />}
```

### Mapping sur des listes

```jsx
{products.map((product) => (
  <ProductCard
    key={product.id}  // Important pour la performance
    product={product}
    onAddToCart={handleAddToCart}
  />
))}
```

### Conditional Classes

```jsx
// Avec template literals
<div className={`base-class ${isActive ? 'active-class' : 'inactive-class'}`}>

// Avec fonction helper
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

<div className={getStatusClass(order.status)}>
```

---

## 🚀 Optimisations

### Éviter les re-renders inutiles

```jsx
import { memo } from 'react';

// Composant qui ne se re-render que si les props changent
const ProductCard = memo(({ product }) => {
  return <div>{product.name}</div>;
});
```

### Debouncing pour la recherche

```jsx
import { debounce } from '../utils/helpers';

const debouncedSearch = debounce((term) => {
  // Effectuer la recherche
  searchProducts(term);
}, 300); // Attendre 300ms après la dernière frappe

<input
  onChange={(e) => debouncedSearch(e.target.value)}
  placeholder="Rechercher..."
/>
```

---

## 🎓 Bonnes Pratiques

1. **Toujours utiliser try-catch pour les appels API**
2. **Afficher un état de chargement pendant les opérations asynchrones**
3. **Valider les données avant de les envoyer**
4. **Utiliser des composants réutilisables**
5. **Séparer la logique métier des composants UI**
6. **Utiliser les contexts pour l'état global (auth, cart)**
7. **Nommer clairement les variables et fonctions en français**
8. **Commenter le code complexe**
9. **Gérer les cas d'erreur**
10. **Penser responsive dès le début**

---

Ces exemples couvrent les patterns les plus utilisés dans l'application.
Pour plus de détails, consultez le code source des composants ! 🚀
