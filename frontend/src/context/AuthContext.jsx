import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../services/api';

/**
 * Context pour la gestion de l'authentification
 */
const AuthContext = createContext(null);

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * Provider pour le contexte d'authentification
 * Gère l'état de l'utilisateur, le token et les actions d'authentification
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Charger le profil utilisateur au démarrage si un token existe
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
          // Si le token est invalide, on le supprime
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  /**
   * Connexion de l'utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Les données de l'utilisateur
   */
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      // Charger le profil après la connexion
      const userData = await getProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} Les données de l'utilisateur créé
   */
  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      // Charger le profil après l'inscription
      const userProfile = await getProfile();
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /**
   * Mettre à jour le profil utilisateur
   * @param {Object} updatedUser - Données mises à jour
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
