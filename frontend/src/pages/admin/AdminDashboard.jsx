import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { getStats } from '../../services/api';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

/**
 * Tableau de bord administrateur avec statistiques
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement du tableau de bord..." />;
  }

  const statCards = [
    {
      title: 'Total Commandes',
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      link: '/admin/orders',
    },
    {
      title: 'Revenus Totaux',
      value: `${(stats?.total_revenue || 0).toFixed(2)} €`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Commandes en Attente',
      value: stats?.pending_orders || 0,
      icon: Package,
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
    {
      title: 'Produits',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'bg-purple-500',
      link: '/admin/products',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre boutique
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const CardComponent = stat.link ? Link : 'div';
            const cardProps = stat.link ? { to: stat.link } : {};

            return (
              <CardComponent key={index} {...cardProps} className="block">
                <Card hover={!!stat.link}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`p-4 ${stat.color} rounded-lg`}>
                      <Icon className="text-white" size={32} />
                    </div>
                  </div>
                </Card>
              </CardComponent>
            );
          })}
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commandes par statut */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Commandes par statut
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-800">En attente</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats?.pending_orders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-800">Validées</span>
                <span className="text-2xl font-bold text-blue-600">
                  {stats?.validated_orders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-800">Expédiées</span>
                <span className="text-2xl font-bold text-purple-600">
                  {stats?.shipped_orders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-800">Livrées</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.delivered_orders || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions rapides */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Actions rapides
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/orders"
                className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Gérer les commandes
                    </h3>
                    <p className="text-sm text-gray-600">
                      Valider, expédier et suivre les commandes
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/products"
                className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="text-purple-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Gérer les produits
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ajouter, modifier et gérer le stock
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/support"
                className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="text-green-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Support client
                    </h3>
                    <p className="text-sm text-gray-600">
                      Voir et répondre aux demandes de support
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>

        {/* Informations complémentaires */}
        <Card className="mt-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <div className="flex items-center gap-4">
            <TrendingUp size={48} />
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Revenu moyen par commande
              </h3>
              <p className="text-3xl font-bold">
                {stats?.total_orders > 0
                  ? (stats.total_revenue / stats.total_orders).toFixed(2)
                  : '0.00'}{' '}
                €
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
