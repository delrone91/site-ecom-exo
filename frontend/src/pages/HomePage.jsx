import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TruckIcon, Shield, HeadphonesIcon } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductList from '../components/product/ProductList';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Page d'accueil avec bannière hero et produits en vedette
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      // Afficher seulement les 8 premiers produits
      setProducts(data.slice(0, 8));
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setToastMessage(`${product.name} ajouté au panier`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          {toastMessage}
        </div>
      )}

      {/* Section Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Bienvenue sur E-Shop
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Découvrez notre sélection de produits de qualité à prix compétitifs.
              Livraison rapide et service client exceptionnel.
            </p>
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
                onClick={() => navigate('/products')}
              >
                <ShoppingBag size={20} />
                Voir les produits
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                  onClick={() => navigate('/register')}
                >
                  S'inscrire
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <TruckIcon className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Livraison rapide</h3>
              <p className="text-gray-600 text-sm">
                Livraison gratuite à partir de 50€
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Shield className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-gray-600 text-sm">
                Vos transactions sont 100% sécurisées
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <HeadphonesIcon className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Support 24/7</h3>
              <p className="text-gray-600 text-sm">
                Notre équipe est là pour vous aider
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <ShoppingBag className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Satisfait ou remboursé</h3>
              <p className="text-gray-600 text-sm">
                30 jours pour changer d'avis
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Produits en vedette */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Produits en vedette
            </h2>
            <p className="text-gray-600">
              Découvrez notre sélection de produits populaires
            </p>
          </div>

          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            loading={loading}
          />

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/products')}
            >
              Voir tous les produits
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
