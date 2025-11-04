import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Composant ProductCard - Carte d'affichage d'un produit
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.product - Les données du produit
 * @param {Function} props.onAddToCart - Fonction appelée lors de l'ajout au panier
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
    <Card hover onClick={handleCardClick} className="flex flex-col h-full">
      {/* Image du produit */}
      <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square">
        <img
          src={product.image_url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock_qty === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Informations du produit */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Prix et stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">
            {product.price_euros.toFixed(2)} €
          </span>
          <span className="text-sm text-gray-500">
            {product.stock_qty > 0 ? `${product.stock_qty} en stock` : 'Épuisé'}
          </span>
        </div>

        {/* Bouton ajouter au panier */}
        <Button
          variant="primary"
          className="w-full"
          disabled={product.stock_qty === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />
          Ajouter au panier
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
