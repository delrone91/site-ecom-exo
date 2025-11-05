import React from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import Card from '../common/Card';

/**
 * Composant OrderDetails - Détails complets d'une commande
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.order - Les données de la commande
 */
const OrderDetails = ({ order }) => {
  const statusConfig = {
    CREE: {
      label: 'En attente de validation',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Clock,
    },
    VALIDEE: {
      label: 'Validée - En préparation',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle,
    },
    PAYEE: {
      label: 'Payée - En préparation',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: CheckCircle,
    },
    EXPEDIEE: {
      label: 'Expédiée - En cours de livraison',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Truck,
    },
    LIVREE: {
      label: 'Livrée',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: Package,
    },
    ANNULEE: {
      label: 'Annulée',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle,
    },
  };

  const status = statusConfig[order.status] || statusConfig.CREE;
  const StatusIcon = status.icon;

  const formatDate = (dateString) => {
    // Les timestamps du backend sont en secondes, on les convertit en millisecondes
    const timestamp = typeof dateString === 'number' ? dateString * 1000 : dateString;
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Statut de la commande */}
      <Card>
        <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${status.color}`}>
          <StatusIcon size={24} />
          <div>
            <h3 className="font-bold text-lg">{status.label}</h3>
            <p className="text-sm">Commande passée le {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Tracking si expédiée */}
        {order.tracking_number && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={20} />
              <span className="font-semibold">Numéro de suivi:</span>
              <span className="font-mono">{order.tracking_number}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Articles commandés */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Articles commandés</h3>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image_url || 'https://via.placeholder.com/100'}
                  alt={item.name || 'Produit'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {item.name || 'Produit'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Quantité: {item.quantity} × {item.unit_price_euros.toFixed(2)} €
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600">
                  {item.line_total_euros.toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total payé</span>
            <span className="text-primary-600">{order.total_euros.toFixed(2)} €</span>
          </div>
        </div>
      </Card>

      {/* Informations de livraison */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Informations de livraison</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Adresse:</span>{' '}
            {order.shipping_address || 'Non spécifiée'}
          </p>
          <p>
            <span className="font-semibold">Méthode de paiement:</span> Carte bancaire
          </p>
          {order.paid_at && (
            <p>
              <span className="font-semibold">Payé le:</span>{' '}
              {formatDate(order.paid_at)}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
