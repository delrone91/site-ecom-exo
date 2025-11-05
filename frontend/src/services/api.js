import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si erreur 401, déconnecter l'utilisateur
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTIFICATION ====================

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur (email, password, full_name, address, phone)
 * @returns {Promise<Object>} Token d'accès
 */
export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Token d'accès
 */
export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  console.log('📤 Envoi de la requête de login:', payload);

  const response = await api.post('/api/auth/login', payload);

  console.log('📥 Réponse de login:', response.data);

  return response.data;
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * @returns {Promise<Object>} Profil utilisateur
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

/**
 * Mettre à jour le profil de l'utilisateur
 * @param {Object} userData - Données à mettre à jour
 * @returns {Promise<Object>} Profil mis à jour
 */
export const updateProfile = async (userData) => {
  const response = await api.put('/api/auth/me', userData);
  return response.data;
};

// ==================== CATALOGUE ====================

/**
 * Récupérer tous les produits
 * @returns {Promise<Array>} Liste des produits
 */
export const getProducts = async () => {
  const response = await api.get('/api/catalog/products');
  return response.data.products;
};

/**
 * Récupérer un produit par son ID
 * @param {number} productId - ID du produit
 * @returns {Promise<Object>} Détails du produit
 */
export const getProduct = async (productId) => {
  const response = await api.get(`/api/catalog/products/${productId}`);
  return response.data;
};

// ==================== PANIER ====================

/**
 * Récupérer le panier de l'utilisateur connecté
 * @returns {Promise<Object>} Panier avec items et total
 */
export const getCart = async () => {
  const response = await api.get('/api/cart');
  return response.data;
};

/**
 * Ajouter un produit au panier
 * @param {number} productId - ID du produit
 * @param {number} quantity - Quantité à ajouter
 * @returns {Promise<Object>} Panier mis à jour
 */
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/api/cart/add', { product_id: productId, quantity });
  return response.data;
};

/**
 * Retirer un produit du panier complètement
 * @param {number} productId - ID du produit
 * @returns {Promise<Object>} Panier mis à jour
 */
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/api/cart/remove/${productId}`);
  return response.data;
};

/**
 * Diminuer la quantité d'un produit dans le panier
 * @param {number} productId - ID du produit
 * @param {number} quantity - Quantité à retirer
 * @returns {Promise<Object>} Panier mis à jour
 */
export const removeQuantityFromCart = async (productId, quantity) => {
  const response = await api.post('/api/cart/remove', { product_id: productId, quantity });
  return response.data;
};

/**
 * Vider le panier
 * @returns {Promise<void>}
 */
export const clearCart = async () => {
  const response = await api.delete('/api/cart/clear');
  return response.data;
};

// ==================== COMMANDES ====================

/**
 * Créer une commande à partir du panier
 * @param {string} shippingAddress - Adresse de livraison
 * @returns {Promise<Object>} Commande créée
 */
export const checkout = async (shippingAddress) => {
  const response = await api.post('/api/orders/checkout', { shipping_address: shippingAddress });
  return response.data;
};

/**
 * Payer une commande
 * @param {number} orderId - ID de la commande
 * @param {Object} paymentData - Données de paiement (factice)
 * @returns {Promise<Object>} Commande mise à jour
 */
export const payOrder = async (orderId, paymentData) => {
  const response = await api.post('/api/orders/pay', {
    order_id: orderId,
    ...paymentData
  });
  return response.data;
};

/**
 * Récupérer toutes les commandes de l'utilisateur
 * @returns {Promise<Array>} Liste des commandes
 */
export const getOrders = async () => {
  const response = await api.get('/api/orders/');
  return response.data.orders;
};

/**
 * Récupérer une commande par son ID
 * @param {number} orderId - ID de la commande
 * @returns {Promise<Object>} Détails de la commande
 */
export const getOrder = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

/**
 * Annuler une commande
 * @param {number} orderId - ID de la commande
 * @returns {Promise<Object>} Commande annulée
 */
export const cancelOrder = async (orderId) => {
  const response = await api.post('/api/orders/cancel', { order_id: orderId });
  return response.data;
};

// ==================== SUPPORT ====================

/**
 * Créer un nouveau thread de support
 * @param {string} subject - Sujet du thread
 * @param {string} message - Premier message
 * @returns {Promise<Object>} Thread créé
 */
export const createThread = async (subject, message) => {
  const response = await api.post('/api/support/threads', {
    subject,
    initial_message: message,
    order_id: null
  });
  return response.data;
};

/**
 * Poster un message dans un thread
 * @param {number} threadId - ID du thread
 * @param {string} message - Message à poster
 * @returns {Promise<Object>} Message créé
 */
export const postMessage = async (threadId, message) => {
  const response = await api.post(`/api/support/threads/${threadId}/messages`, { body: message });
  return response.data;
};

/**
 * Récupérer tous les threads de l'utilisateur
 * @returns {Promise<Array>} Liste des threads
 */
export const getThreads = async () => {
  const response = await api.get('/api/support/threads');
  return response.data.threads;
};

/**
 * Récupérer un thread par son ID
 * @param {number} threadId - ID du thread
 * @returns {Promise<Object>} Thread avec messages
 */
export const getThread = async (threadId) => {
  const response = await api.get(`/api/support/threads/${threadId}`);
  return response.data;
};

// ==================== ADMIN ====================

/**
 * Récupérer toutes les commandes (admin)
 * @returns {Promise<Array>} Liste de toutes les commandes
 */
export const getAllOrders = async () => {
  const response = await api.get('/api/admin/orders');
  return response.data.orders;
};

/**
 * Valider une commande (admin)
 * @param {number} orderId - ID de la commande
 * @returns {Promise<Object>} Commande validée
 */
export const validateOrder = async (orderId) => {
  const response = await api.post('/api/admin/orders/validate', { order_id: orderId });
  return response.data;
};

/**
 * Marquer une commande comme expédiée (admin)
 * @param {number} orderId - ID de la commande
 * @param {string} trackingNumber - Numéro de suivi
 * @returns {Promise<Object>} Commande mise à jour
 */
export const shipOrder = async (orderId, trackingNumber) => {
  const response = await api.post('/api/admin/orders/ship', { order_id: orderId });
  return response.data;
};

/**
 * Marquer une commande comme livrée (admin)
 * @param {number} orderId - ID de la commande
 * @returns {Promise<Object>} Commande mise à jour
 */
export const markDelivered = async (orderId) => {
  const response = await api.post('/api/admin/orders/deliver', { order_id: orderId });
  return response.data;
};

/**
 * Récupérer tous les produits (admin)
 * @returns {Promise<Array>} Liste de tous les produits
 */
export const getAllProducts = async () => {
  const response = await api.get('/api/admin/products');
  return response.data;
};

/**
 * Mettre à jour le stock d'un produit (admin)
 * @param {number} productId - ID du produit
 * @param {number} stock - Nouveau stock
 * @returns {Promise<Object>} Produit mis à jour
 */
export const updateStock = async (productId, stock) => {
  const response = await api.put(`/api/admin/products/${productId}/stock`, { stock });
  return response.data;
};

/**
 * Créer un nouveau produit (admin)
 * @param {Object} productData - Données du produit
 * @returns {Promise<Object>} Produit créé
 */
export const createProduct = async (productData) => {
  const response = await api.post('/api/admin/products', productData);
  return response.data;
};

/**
 * Mettre à jour un produit (admin)
 * @param {number} productId - ID du produit
 * @param {Object} productData - Données à mettre à jour
 * @returns {Promise<Object>} Produit mis à jour
 */
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/api/admin/products/${productId}`, productData);
  return response.data;
};

/**
 * Récupérer les statistiques (admin)
 * @returns {Promise<Object>} Statistiques
 */
export const getStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

/**
 * Upload une image pour un produit (admin)
 * @param {File} file - Fichier image à uploader
 * @returns {Promise<Object>} URL de l'image uploadée
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/admin/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Récupérer tous les threads de support (admin)
 * @returns {Promise<Array>} Liste de tous les threads
 */
export const getAllThreads = async () => {
  const response = await api.get('/api/admin/support/threads');
  return response.data.threads;
};

/**
 * Répondre à un thread de support (admin)
 * @param {string} threadId - ID du thread
 * @param {string} message - Message à poster
 * @returns {Promise<Object>} Thread mis à jour
 */
export const replyToThread = async (threadId, message) => {
  const response = await api.post(`/api/admin/support/threads/${threadId}/reply`, { body: message });
  return response.data;
};

/**
 * Fermer un thread de support (admin)
 * @param {string} threadId - ID du thread
 * @returns {Promise<Object>} Thread mis à jour
 */
export const closeThread = async (threadId) => {
  const response = await api.post(`/api/admin/support/threads/${threadId}/close`);
  return response.data;
};

export default api;
