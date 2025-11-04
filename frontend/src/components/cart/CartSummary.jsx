import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Composant CartSummary - Résumé du panier avec total
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.cart - Les données du panier
 * @param {Function} props.onCheckout - Fonction appelée pour passer commande
 * @param {boolean} props.loading - État de chargement
 */
const CartSummary = ({ cart, onCheckout, loading = false }) => {
  const itemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const subtotal = cart?.total_euros || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Card className="sticky top-20">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Résumé de la commande</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total ({itemsCount} article{itemsCount > 1 ? 's' : ''})</span>
          <span className="font-semibold">{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Frais de livraison</span>
          <span className="font-semibold">
            {subtotal > 0 ? `${shipping.toFixed(2)} €` : 'Gratuit'}
          </span>
        </div>
        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total</span>
            <span className="text-primary-600">{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onCheckout}
        disabled={itemsCount === 0 || loading}
        loading={loading}
      >
        {loading ? 'Traitement...' : 'Passer la commande'}
      </Button>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Livraison gratuite à partir de 50€</p>
        <p className="mt-1">Paiement sécurisé</p>
      </div>
    </Card>
  );
};

export default CartSummary;
