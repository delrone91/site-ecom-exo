import React, { useState } from 'react';
import { User, Mail, MapPin, Phone, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getErrorMessage } from '../utils/helpers';

/**
 * Page de profil utilisateur
 */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    address: user?.address || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

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
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setGeneralError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mon profil
        </h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              Profil mis à jour avec succès !
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Informations de compte */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-100 rounded-full">
                <User className="text-primary-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Informations de compte
                </h2>
                <p className="text-sm text-gray-600">
                  Ces informations ne peuvent pas être modifiées
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-800">{user?.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user?.is_admin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.is_admin ? 'Administrateur' : 'Client'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-100 rounded-full">
                <User className="text-primary-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Informations personnelles
                </h2>
                <p className="text-sm text-gray-600">
                  Modifiez vos informations personnelles
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {generalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{generalError}</p>
                </div>
              )}

              <Input
                label="Nom complet"
                type="text"
                placeholder="Jean Dupont"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                error={errors.full_name}
                required
              />

              <Input
                label="Adresse"
                type="text"
                placeholder="123 Rue du Commerce, 75001 Paris"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
                required
              />

              <Input
                label="Téléphone"
                type="tel"
                placeholder="+33 1 23 45 67 89"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                <Save size={20} />
                Enregistrer les modifications
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
