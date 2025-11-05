import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, CheckCircle, TruckIcon, Shield, Star, Minus, Plus } from 'lucide-react';
import { getProduct } from '../services/api';
import Loading from '../components/common/Loading';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * ProductDetailPage Moderne avec Glassmorphism
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement du produit..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 flex items-center justify-center py-24">
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-12 shadow-glass text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <Package className="text-red-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Produit non trouvé
            </span>
          </h2>
          <p className="text-gray-600 mb-6">Ce produit n'existe pas ou a été supprimé</p>
          <button
            onClick={() => navigate('/products')}
            className="group relative px-8 py-4 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
            <span className="relative text-white font-semibold">Retour aux produits</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 py-24">
      {/* Cercles flottants */}
      <div className="fixed top-40 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-40 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/60 border border-white/20 hover:bg-white/80 text-gray-700 font-medium transition-all duration-300 transform hover:scale-105 shadow-glass animate-fade-in"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Image du produit */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-glass">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden group">
              <img
                src={product.image_url || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600';
                }}
              />
              {product.stock_qty > 0 && product.stock_qty < 10 && (
                <div className="absolute top-4 left-4 backdrop-blur-xl bg-accent-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-glow-blue flex items-center gap-2 animate-pulse">
                  <Star size={16} />
                  Dernières pièces
                </div>
              )}
              {product.stock_qty === 0 && (
                <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/30 px-8 py-4 rounded-2xl">
                    <span className="text-white font-bold text-xl">Rupture de stock</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations du produit */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-glass">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {product.name}
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {product.price_euros.toFixed(2)} €
                </span>
                {product.stock_qty > 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-semibold text-green-700">En stock ({product.stock_qty})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full">
                    <Package size={20} className="text-red-600" />
                    <span className="font-semibold text-red-700">Rupture de stock</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Sélecteur de quantité */}
              {product.stock_qty > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantité
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/20 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
                    >
                      <Minus size={20} className="text-gray-700" />
                    </button>
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent min-w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_qty, quantity + 1))}
                      disabled={quantity >= product.stock_qty}
                      className="p-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/20 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
                    >
                      <Plus size={20} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bouton d'action */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock_qty === 0 || addingToCart}
                className="group relative w-full px-8 py-5 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3 text-white font-bold text-xl">
                  {addingToCart ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      Ajouter au panier
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Informations supplémentaires */}
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-6 shadow-glass">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="text-primary-600" size={20} />
                Avantages
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: TruckIcon, text: 'Livraison gratuite à partir de 50€', color: 'primary' },
                  { icon: CheckCircle, text: 'Retour gratuit sous 30 jours', color: 'accent' },
                  { icon: Shield, text: 'Garantie 2 ans', color: 'primary' }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50/50 to-accent-50/50 border border-primary-100/50">
                    <item.icon size={18} className={`text-${item.color}-600 flex-shrink-0`} />
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
