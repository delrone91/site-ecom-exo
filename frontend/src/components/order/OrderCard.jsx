import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Composant OrderCard - Carte d'affichage d'une commande
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.order - Les données de la commande
 */
const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const statusConfig = {
    pending: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    validated: {
      label: 'Validée',
      color: 'bg-blue-100 text-blue-800',
      icon: CheckCircle,
    },
    shipped: {
      label: 'Expédiée',
      color: 'bg-purple-100 text-purple-800',
      icon: Truck,
    },
    delivered: {
      label: 'Livrée',
      color: 'bg-green-100 text-green-800',
      icon: Package,
    },
    canceled: {
      label: 'Annulée',
      color: 'bg-red-100 text-red-800',
      icon: XCircle,
    },
  };

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card hover onClick={() => navigate(`/orders/${order.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Commande #{order.id}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Passée le {formatDate(order.created_at)}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
          <StatusIcon size={16} />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Articles:</span>
          <span className="font-semibold">
            {order.items?.reduce((total, item) => total + item.quantity, 0) || 0}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-primary-600 text-lg">
            {order.total_euros.toFixed(2)} €
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full" size="sm">
        Voir les détails
      </Button>
    </Card>
  );
};

export default OrderCard;
