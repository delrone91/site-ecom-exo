import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Sparkles } from 'lucide-react';

/**
 * ProductCard Moderne avec Effets 3D et Glassmorphism
 */
const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl overflow-hidden shadow-glass hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer animate-scale-in"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-500 pointer-events-none"></div>

      {/* Image Container avec effet 3D */}
      <div className="relative overflow-hidden rounded-t-3xl aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400';
          }}
        />

        {/* Overlay gradient au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badge "Nouveau" si nécessaire */}
        {product.stock_qty > 0 && product.stock_qty < 10 && (
          <div className="absolute top-4 left-4 backdrop-blur-xl bg-accent-500/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-glow-blue flex items-center gap-1.5 animate-pulse">
            <Sparkles size={14} />
            Dernières pièces
          </div>
        )}

        {/* Badge rupture de stock */}
        {product.stock_qty === 0 && (
          <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 px-6 py-3 rounded-2xl">
              <span className="text-white font-bold text-lg">Rupture de stock</span>
            </div>
          </div>
        )}

        {/* Actions rapides au survol */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <button
            onClick={handleCardClick}
            className="p-3 backdrop-blur-xl bg-white/90 hover:bg-white rounded-xl shadow-glass hover:shadow-glow transition-all duration-300 transform hover:scale-110"
            title="Voir les détails"
          >
            <Eye className="text-primary-600" size={20} />
          </button>
          {product.stock_qty > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-3 backdrop-blur-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-xl shadow-glow transition-all duration-300 transform hover:scale-110"
              title="Ajouter au panier"
            >
              <ShoppingCart className="text-white" size={20} />
            </button>
          )}
        </div>

        {/* Badge stock */}
        {product.stock_qty > 0 && (
          <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/80 border border-white/30 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-glass opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            {product.stock_qty} en stock
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-6 relative">
        {/* Nom du produit */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Séparateur */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>

        {/* Prix et bouton */}
        <div className="flex items-center justify-between gap-4">
          {/* Prix */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {product.price_euros.toFixed(2)} €
            </div>
          </div>

          {/* Bouton d'action */}
          {product.stock_qty > 0 ? (
            <button
              onClick={handleAddToCart}
              className="group/btn relative px-6 py-3 rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover/btn:from-primary-600 group-hover/btn:to-accent-600 transition-all duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-lg transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2 text-white font-semibold text-sm">
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Ajouter</span>
              </span>
            </button>
          ) : (
            <div className="px-6 py-3 rounded-xl backdrop-blur-xl bg-gray-300/50 border border-gray-300/20 text-gray-500 font-semibold text-sm flex-shrink-0">
              Épuisé
            </div>
          )}
        </div>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
      </div>
    </div>
  );
};

export default ProductCard;
