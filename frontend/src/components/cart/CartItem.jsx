import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import Button from '../common/Button';

/**
 * Composant CartItem - Article dans le panier
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.item - L'article du panier
 * @param {Function} props.onUpdateQuantity - Fonction pour mettre à jour la quantité
 * @param {Function} props.onRemove - Fonction pour supprimer l'article
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product_id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.product_id, item.quantity + 1);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Image du produit */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={'https://via.placeholder.com/100'}
          alt={item.product_name || 'Produit'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Informations du produit */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {item.product_name || 'Produit'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Prix unitaire: {item.unit_price_euros.toFixed(2)} €
        </p>
        <p className="text-lg font-bold text-primary-600 mt-2">
          Total: {item.line_total_euros.toFixed(2)} €
        </p>
      </div>

      {/* Contrôles de quantité */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleDecrease}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          disabled={item.quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-semibold w-8 text-center">
          {item.quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Bouton supprimer */}
      <button
        onClick={() => onRemove(item.product_id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
        title="Supprimer"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;
