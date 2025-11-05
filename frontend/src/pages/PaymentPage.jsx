import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getOrder, payOrder } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';

/**
 * Page de paiement factice mais réaliste
 * ⚠️ AUCUN PAIEMENT RÉEL N'EST EFFECTUÉ
 */
const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Données de carte factice
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await getOrder(orderId);
      if (data.paid_at) {
        // Si déjà payée, rediriger vers la page de commande
        navigate(`/orders/${orderId}`);
        return;
      }
      setOrder(data);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation du numéro de carte (16 chiffres)
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber || cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres requis)';
    }

    // Validation du titulaire
    if (!cardData.cardHolder.trim()) {
      newErrors.cardHolder = 'Nom du titulaire requis';
    }

    // Validation du mois d'expiration
    const month = parseInt(cardData.expiryMonth);
    if (!month || month < 1 || month > 12) {
      newErrors.expiryMonth = 'Mois invalide';
    }

    // Validation de l'année d'expiration
    const year = parseInt(cardData.expiryYear);
    const currentYear = new Date().getFullYear();
    if (!year || year < currentYear || year > currentYear + 20) {
      newErrors.expiryYear = 'Année invalide';
    }

    // Validation du CVV (3 chiffres)
    if (!cardData.cvv || cardData.cvv.length !== 3 || !/^\d+$/.test(cardData.cvv)) {
      newErrors.cvv = 'CVV invalide (3 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setProcessing(true);

      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Envoyer le paiement (avec une fausse carte)
      const paymentData = {
        card_number: '4242424242424242', // Numéro de carte factice
        exp_month: parseInt(cardData.expiryMonth),
        exp_year: parseInt(cardData.expiryYear),
        cvc: cardData.cvv,
      };

      await payOrder(orderId, paymentData);

      // Rediriger vers la page de confirmation
      navigate(`/orders/${orderId}`, {
        state: { paymentSuccess: true }
      });
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCardNumberChange = (e) => {
    // Formater le numéro de carte avec des espaces
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const detectCardType = () => {
    const number = cardData.cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return null;
  };

  if (loading) {
    return <Loading fullScreen message="Chargement..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Commande non trouvée
          </h2>
          <Button onClick={() => navigate('/orders')}>
            Mes commandes
          </Button>
        </Card>
      </div>
    );
  }

  const cardType = detectCardType();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Avertissement TRÈS VISIBLE */}
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={32} />
            <div>
              <h2 className="text-xl font-bold text-yellow-800 mb-2">
                ⚠️ Page de démonstration - AUCUN PAIEMENT RÉEL
              </h2>
              <p className="text-yellow-700">
                Ceci est une simulation de paiement à des fins éducatives uniquement.
                Aucune transaction réelle ne sera effectuée. Vous pouvez utiliser n'importe
                quel numéro de carte à 16 chiffres pour tester.
              </p>
              <p className="text-yellow-700 font-semibold mt-2">
                Exemple: 4242 4242 4242 4242 (carte de test classique)
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Paiement sécurisé
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  Informations de paiement
                </h2>
                <Lock className="text-green-600 ml-auto" size={20} />
              </div>

              <div className="space-y-6">
                {/* Numéro de carte */}
                <div>
                  <Input
                    label="Numéro de carte"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    error={errors.cardNumber}
                    required
                  />
                  {cardType && (
                    <p className="text-sm text-gray-600 mt-1">
                      Type de carte détecté: <span className="font-semibold">{cardType}</span>
                    </p>
                  )}
                </div>

                {/* Nom du titulaire */}
                <Input
                  label="Nom du titulaire"
                  placeholder="JEAN DUPONT"
                  value={cardData.cardHolder}
                  onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                  error={errors.cardHolder}
                  required
                />

                {/* Date d'expiration et CVV */}
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Mois"
                    placeholder="MM"
                    value={cardData.expiryMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').substring(0, 2);
                      setCardData({ ...cardData, expiryMonth: value });
                    }}
                    error={errors.expiryMonth}
                    required
                  />
                  <Input
                    label="Année"
                    placeholder="AAAA"
                    value={cardData.expiryYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                      setCardData({ ...cardData, expiryYear: value });
                    }}
                    error={errors.expiryYear}
                    required
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                      setCardData({ ...cardData, cvv: value });
                    }}
                    error={errors.cvv}
                    required
                  />
                </div>

                {/* Icônes des cartes acceptées */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Cartes acceptées (simulation)</p>
                  <div className="flex gap-3">
                    <div className="px-3 py-2 bg-gray-100 rounded text-sm font-semibold">VISA</div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-sm font-semibold">MASTERCARD</div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-sm font-semibold">AMEX</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Informations de sécurité */}
            <Card className="mt-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <Lock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">
                    Paiement 100% sécurisé
                  </h3>
                  <p className="text-sm text-green-700">
                    Vos informations sont cryptées et sécurisées. Nous ne stockons jamais
                    vos données bancaires.
                  </p>
                </div>
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
                  <span>Commande #{order.id}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Articles</span>
                  <span className="font-semibold">
                    {order.items?.reduce((total, item) => total + item.quantity, 0) || 0}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total à payer</span>
                    <span className="text-primary-600">{order.total_euros.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handlePayment}
                disabled={processing}
                loading={processing}
              >
                {processing ? 'Traitement en cours...' : 'Simuler le paiement'}
              </Button>

              {processing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm font-medium">Traitement du paiement...</span>
                  </div>
                </div>
              )}

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

export default PaymentPage;
