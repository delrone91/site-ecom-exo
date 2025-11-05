import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Lock, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

/**
 * RegisterPage Moderne avec Glassmorphism
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nom complet requis';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adresse requise';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setGeneralError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Cercles flottants d'arrière-plan */}
      <div className="fixed top-40 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-40 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-2xl w-full relative z-10 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Inscription
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Rejoignez-nous pour profiter de tous nos avantages
          </p>
        </div>

        {/* Formulaire */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            {generalError && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl animate-scale-in">
                <p className="text-sm text-red-800 font-medium">{generalError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="votre.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border ${
                      errors.email ? 'border-red-300' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Nom complet */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border ${
                      errors.full_name ? 'border-red-300' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500`}
                    autoComplete="name"
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.full_name}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border ${
                      errors.password ? 'border-red-300' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="123 Rue du Commerce, 75001 Paris"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border ${
                    errors.address ? 'border-red-300' : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500`}
                  autoComplete="street-address"
                />
              </div>
              {errors.address && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.address}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border ${
                    errors.phone ? 'border-red-300' : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500`}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Bouton Inscription */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full px-8 py-4 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inscription...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    S'inscrire
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hover:from-primary-700 hover:to-accent-700 transition-all"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
