import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getOrder, cancelOrder } from '../services/api';
import OrderDetails from '../components/order/OrderDetails';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

/**
 * Page de détail d'une commande
 */
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  // Afficher un message de succès si on vient de payer
  const paymentSuccess = location.state?.paymentSuccess;

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      setCanceling(true);
      await cancelOrder(id);
      // Recharger la commande
      await loadOrder();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert('Impossible d\'annuler cette commande');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement de la commande..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Commande non trouvée
          </h2>
          <Button onClick={() => navigate('/orders')}>
            Retour aux commandes
          </Button>
        </Card>
      </div>
    );
  }

  const canCancel = order.status === 'pending' && !order.paid_at;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Message de succès du paiement */}
        {paymentSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-lg p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-600 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  Paiement effectué avec succès !
                </h2>
                <p className="text-green-700">
                  Votre commande a été payée et sera traitée dans les plus brefs délais.
                  Vous recevrez un email de confirmation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bouton retour */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour aux commandes
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Commande #{order.id}
          </h1>
          {canCancel && (
            <Button
              variant="danger"
              onClick={handleCancelOrder}
              loading={canceling}
              disabled={canceling}
            >
              Annuler la commande
            </Button>
          )}
        </div>

        <OrderDetails order={order} />
      </div>
    </div>
  );
};

export default OrderDetailPage;
