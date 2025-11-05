import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TruckIcon, Shield, HeadphonesIcon, Sparkles, ArrowRight, Star, Zap } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductList from '../components/product/ProductList';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * HomePage Moderne avec Glassmorphism et Animations
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
    <div className="min-h-screen">
      {/* Toast moderne avec glassmorphism */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 backdrop-blur-xl bg-white/80 border border-white/20 shadow-glow px-6 py-4 rounded-2xl animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <p className="text-gray-800 font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Hero Section avec Gradient Mesh */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30">
        {/* Gradient animé de fond */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>

        {/* Cercles flottants */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-300/10 to-accent-300/10 rounded-full blur-3xl animate-glow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            {/* Titre principal */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-glow">
                E-Shop
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              L'excellence à portée de main
            </p>

            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Découvrez notre sélection exclusive de produits premium.
              Livraison express, qualité garantie et service client d'exception.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => navigate('/products')}
                className="group relative px-8 py-4 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3 text-white font-semibold text-lg">
                  <ShoppingBag size={24} />
                  Explorer la boutique
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/50 border-2 border-white/20 hover:bg-white/70 text-gray-800 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-glass"
                >
                  Créer un compte
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              {[
                { icon: Star, label: 'Clients satisfaits', value: '10k+' },
                { icon: ShoppingBag, label: 'Produits', value: '500+' },
                { icon: Zap, label: 'Livraison 24h', value: '100%' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 shadow-glass hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
                      <stat.icon className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Transition gradient fluide */}
      <div className="h-32 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50"></div>

      {/* Section Avantages avec Glassmorphism */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Pourquoi nous choisir ?
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une expérience d'achat incomparable à chaque étape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TruckIcon,
                title: 'Livraison Express',
                description: 'Livraison gratuite dès 50€ et suivi en temps réel',
                gradient: 'from-primary-500 to-primary-600'
              },
              {
                icon: Shield,
                title: 'Paiement Sécurisé',
                description: 'Transactions cryptées et protection maximale',
                gradient: 'from-accent-500 to-accent-600'
              },
              {
                icon: HeadphonesIcon,
                title: 'Support Premium',
                description: 'Équipe disponible 24/7 pour vous accompagner',
                gradient: 'from-primary-600 to-accent-500'
              },
              {
                icon: Star,
                title: 'Garantie Qualité',
                description: '30 jours satisfait ou remboursé sans question',
                gradient: 'from-accent-600 to-primary-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative backdrop-blur-xl bg-white/60 border border-white/20 rounded-3xl p-8 shadow-glass hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-500"></div>

                <div className="relative">
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl shadow-glow transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <feature.icon className="text-white" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition gradient fluide */}
      <div className="h-32 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50"></div>

      {/* Section Produits en vedette */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Produits en vedette
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nos coups de cœur sélectionnés avec soin pour vous
            </p>
          </div>

          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            loading={loading}
          />

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/products')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/60 border-2 border-white/20 hover:bg-white/80 text-gray-800 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-glass hover:shadow-glow-lg"
            >
              Découvrir toute la collection
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Transition gradient fluide */}
      <div className="h-32 bg-gradient-to-b from-gray-50 via-primary-50/20 to-primary-50/30"></div>

      {/* CTA Final Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary-50/30 via-accent-50/30 to-gray-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl p-12 shadow-glass">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Prêt à commencer ?
              </span>
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et profitez d'une expérience shopping unique
            </p>
            <button
              onClick={() => navigate('/products')}
              className="group relative px-10 py-5 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3 text-white font-bold text-xl">
                Commencer maintenant
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
