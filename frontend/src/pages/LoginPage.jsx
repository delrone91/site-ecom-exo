import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

/**
 * LoginPage Moderne avec Glassmorphism
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
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
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);
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

      <div className="max-w-md w-full relative z-10 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Connexion
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Accédez à votre espace personnel
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

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Bouton Connexion */}
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
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Se connecter
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Lien inscription */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hover:from-primary-700 hover:to-accent-700 transition-all"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Informations de test */}
        <div className="mt-6 backdrop-blur-xl bg-accent-50/50 border border-accent-100/50 rounded-2xl p-6 shadow-glass">
          <p className="text-sm font-bold text-accent-800 mb-3">
            Comptes de test disponibles :
          </p>
          <div className="text-xs text-accent-700 space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <User size={16} className="text-accent-600" />
              <span className="font-medium">Client: alice@example.com / password123</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <User size={16} className="text-primary-600" />
              <span className="font-medium">Admin: admin@example.com / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
