import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loading from '../components/common/Loading';

/**
 * CartPage Moderne avec Glassmorphism
 */
const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, loading } = useCart();

  if (loading) {
    return <Loading fullScreen message="Chargement du panier..." />;
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 flex items-center justify-center py-24">
        {/* Cercles flottants */}
        <div className="fixed top-40 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="fixed bottom-40 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="text-center relative z-10 animate-scale-in">
          <div className="max-w-md mx-auto backdrop-blur-xl bg-white/60 border border-white/20 rounded-3xl p-12 shadow-glass">
            {/* Icône */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-primary-600" size={48} />
            </div>

            {/* Texte */}
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Votre panier est vide
              </span>
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Découvrez nos produits exclusifs et commencez vos achats dès maintenant !
            </p>

            {/* Bouton */}
            <button
              onClick={() => navigate('/products')}
              className="group relative px-8 py-4 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3 text-white font-semibold text-lg">
                <ShoppingBag size={24} />
                Découvrir nos produits
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 py-24">
      {/* Cercles flottants */}
      <div className="fixed top-40 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-40 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-xl bg-white/50 border border-white/20 shadow-glass mb-6">
            <Package className="text-primary-600" size={18} />
            <span className="text-sm font-semibold text-gray-700">
              {cart.items.length} article{cart.items.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Mon Panier
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Vérifiez vos articles avant de passer commande
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {cart.items.map((item, index) => (
              <div
                key={item.product_id}
                className="animate-scale-in"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              </div>
            ))}

            {/* Bouton continuer les achats */}
            <button
              onClick={() => navigate('/products')}
              className="w-full py-4 rounded-2xl backdrop-blur-xl bg-white/60 border-2 border-white/20 hover:bg-white/80 text-gray-800 font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-glass hover:shadow-glow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Continuer mes achats
            </button>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CartSummary
              cart={cart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
