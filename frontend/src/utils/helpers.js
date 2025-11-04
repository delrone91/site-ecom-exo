/**
 * Fonctions utilitaires pour l'application
 */

/**
 * Formater un prix en euros
 * @param {number} price - Prix à formater
 * @returns {string} Prix formaté
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * Formater une date
 * @param {string|Date} date - Date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} Date formatée
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Date(date).toLocaleDateString('fr-FR', defaultOptions);
};

/**
 * Formater une date avec heure
 * @param {string|Date} date - Date à formater
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Tronquer un texte
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Valider un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valider un numéro de carte bancaire (basique)
 * @param {string} cardNumber - Numéro de carte
 * @returns {boolean} True si valide
 */
export const isValidCardNumber = (cardNumber) => {
  // Supprime les espaces
  const cleaned = cardNumber.replace(/\s/g, '');
  // Vérifie que ce sont uniquement des chiffres et qu'il y en a 16
  return /^\d{16}$/.test(cleaned);
};

/**
 * Formater un numéro de carte bancaire
 * @param {string} cardNumber - Numéro de carte
 * @returns {string} Numéro formaté avec espaces
 */
export const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

/**
 * Masquer un numéro de carte bancaire
 * @param {string} cardNumber - Numéro de carte
 * @returns {string} Numéro masqué (ex: **** **** **** 1234)
 */
export const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
};

/**
 * Calculer le total d'un panier
 * @param {Array} items - Articles du panier
 * @returns {number} Total du panier
 */
export const calculateCartTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    return total + item.line_total_euros;
  }, 0);
};

/**
 * Générer un ID unique
 * @returns {string} ID unique
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Débounce une fonction
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Temps d'attente en ms
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Obtenir le message d'erreur depuis une réponse API
 * @param {Error} error - Erreur à analyser
 * @returns {string} Message d'erreur
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Une erreur est survenue';
};
