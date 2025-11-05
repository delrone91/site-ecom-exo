import React from 'react';
import { ArrowRight, Shield, TruckIcon, Sparkles } from 'lucide-react';

/**
 * CartSummary Moderne avec Glassmorphism
 */
const CartSummary = ({ cart, onCheckout, loading = false }) => {
  const itemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const subtotal = cart?.total_euros || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="sticky top-24 backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-glass">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
          Résumé de la commande
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
      </div>

      {/* Détails */}
      <div className="space-y-4 mb-6">
        {/* Sous-total */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="text-sm font-medium">
            Sous-total ({itemsCount} article{itemsCount > 1 ? 's' : ''})
          </span>
          <span className="font-bold text-lg">{subtotal.toFixed(2)} €</span>
        </div>

        {/* Livraison */}
        <div className="flex justify-between items-center text-gray-700">
          <div className="flex items-center gap-2">
            <TruckIcon className="text-primary-600" size={16} />
            <span className="text-sm font-medium">Livraison</span>
          </div>
          <span className="font-bold text-lg">
            {subtotal > 0 ? `${shipping.toFixed(2)} €` : 'Gratuit'}
          </span>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {total.toFixed(2)} €
          </span>
        </div>
      </div>

      {/* Bouton Commander */}
      <button
        onClick={onCheckout}
        disabled={itemsCount === 0 || loading}
        className="group relative w-full px-8 py-4 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Traitement...
            </>
          ) : (
            <>
              Passer la commande
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>

      {/* Avantages */}
      <div className="space-y-3">
        {/* Livraison gratuite */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50/50 to-accent-50/50 border border-primary-100/50">
          <TruckIcon className="text-primary-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-gray-800">Livraison express</p>
            <p className="text-xs text-gray-600">Gratuite dès 50€ d'achat</p>
          </div>
        </div>

        {/* Paiement sécurisé */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-accent-50/50 to-primary-50/50 border border-accent-100/50">
          <Shield className="text-accent-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-gray-800">Paiement sécurisé</p>
            <p className="text-xs text-gray-600">Transactions 100% protégées</p>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50/50 to-accent-50/50 border border-primary-100/50">
          <Sparkles className="text-primary-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-gray-800">Satisfait ou remboursé</p>
            <p className="text-xs text-gray-600">30 jours pour changer d'avis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
