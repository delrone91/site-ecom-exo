import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getErrorMessage } from '../utils/helpers';

/**
 * Page de connexion
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

  // Rediriger vers la page d'origine après connexion
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-primary-600 mb-4">
            <ShoppingCart size={48} />
            <span className="text-4xl font-bold">E-Shop</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Connexion à votre compte
          </h1>
          <p className="text-gray-600 mt-2">
            Accédez à votre espace personnel
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="votre.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              <LogIn size={20} />
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </Card>

        {/* Informations de test */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-2">
            Comptes de test disponibles :
          </p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>👤 Client: alice@example.com / password123</p>
            <p>👑 Admin: admin@example.com / admin123</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
