import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { checkout } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';

/**
 * Page de checkout - Résumé avant paiement
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.total_euros || 0;
  const shipping = 5.99;
  const total = subtotal + shipping;

  const handleProceedToPayment = async () => {
    if (!shippingAddress.trim()) {
      setError('Veuillez saisir une adresse de livraison');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Créer la commande
      const order = await checkout(shippingAddress);
      // Rediriger vers la page de paiement avec l'ID de la commande
      navigate(`/payment/${order.id}`);
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      setError('Erreur lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Création de la commande..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Finaliser la commande
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de livraison */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  Adresse de livraison
                </h2>
              </div>

              <Input
                label="Adresse complète"
                placeholder="Ex: 123 Rue du Commerce, 75001 Paris"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                error={error}
                required
              />

              <p className="text-sm text-gray-600 mt-4">
                Assurez-vous que votre adresse est complète et correcte pour éviter tout retard de livraison.
              </p>
            </Card>

            {/* Articles commandés */}
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Articles ({cart.items.length})
              </h2>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={'https://via.placeholder.com/100'}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qté: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">
                        {item.line_total_euros.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Résumé
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-semibold">{shipping.toFixed(2)} €</span>
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
                onClick={handleProceedToPayment}
                disabled={loading}
                loading={loading}
              >
                Procéder au paiement
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                En continuant, vous acceptez nos conditions d'utilisation
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
