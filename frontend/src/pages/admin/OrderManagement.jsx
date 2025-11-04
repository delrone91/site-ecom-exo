import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';
import { getAllOrders, validateOrder, shipOrder, markDelivered } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';

/**
 * Page de gestion des commandes (admin)
 */
const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filter, searchTerm, orders]);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filtre par statut
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }

    // Filtre par recherche (ID ou email)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(search) ||
        order.user?.email?.toLowerCase().includes(search)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleValidate = async (orderId) => {
    try {
      setActionLoading(orderId);
      await validateOrder(orderId);
      await loadOrders();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      alert('Erreur lors de la validation de la commande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShip = async (orderId) => {
    const trackingNumber = prompt('Numéro de suivi:');
    if (!trackingNumber) return;

    try {
      setActionLoading(orderId);
      await shipOrder(orderId, trackingNumber);
      await loadOrders();
    } catch (error) {
      console.error('Erreur lors de l\'expédition:', error);
      alert('Erreur lors de l\'expédition de la commande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliver = async (orderId) => {
    if (!confirm('Confirmer la livraison de cette commande ?')) return;

    try {
      setActionLoading(orderId);
      await markDelivered(orderId);
      await loadOrders();
    } catch (error) {
      console.error('Erreur lors de la livraison:', error);
      alert('Erreur lors de la livraison de la commande');
    } finally {
      setActionLoading(null);
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading fullScreen message="Chargement des commandes..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Gestion des commandes
        </h1>

        {/* Filtres */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rechercher par ID ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validées</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="canceled">Annulées</option>
            </select>
          </div>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`p-4 rounded-lg text-center transition-all ${
                  filter === status
                    ? config.color + ' shadow-lg scale-105'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm mt-1">{config.label}</p>
              </button>
            );
          })}
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Aucune commande trouvée</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isLoading = actionLoading === order.id;

              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Informations de base */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Commande #{order.id}
                        </h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                          <StatusIcon size={16} />
                          <span className="text-sm font-medium">{status.label}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Client: {order.user?.email || 'N/A'}</p>
                        <p>Date: {formatDate(order.created_at)}</p>
                        <p>Articles: {order.items?.reduce((total, item) => total + item.quantity, 0) || 0}</p>
                        <p className="font-bold text-primary-600 text-lg">
                          Total: {order.total_euros.toFixed(2)} €
                        </p>
                        {order.tracking_number && (
                          <p className="font-mono text-xs">
                            Suivi: {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        Détails
                      </Button>

                      {order.status === 'pending' && order.paid_at && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleValidate(order.id)}
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          <CheckCircle size={16} />
                          Valider
                        </Button>
                      )}

                      {order.status === 'validated' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleShip(order.id)}
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          <Truck size={16} />
                          Expédier
                        </Button>
                      )}

                      {order.status === 'shipped' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleDeliver(order.id)}
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          <Package size={16} />
                          Livrer
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
