import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/api';
import { useAuth } from './AuthContext';

/**
 * Context pour la gestion du panier
 */
const CartContext = createContext(null);

/**
 * Hook pour utiliser le contexte du panier
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

/**
 * Provider pour le contexte du panier
 * Gère l'état du panier et les actions associées
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Charger le panier quand l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  /**
   * Charger le panier depuis l'API
   */
  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ajouter un produit au panier
   * @param {number} productId - ID du produit
   * @param {number} quantity - Quantité à ajouter
   */
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const updatedCart = await apiAddToCart(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retirer un produit du panier
   * @param {number} productId - ID du produit à retirer
   */
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const updatedCart = await apiRemoveFromCart(productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Erreur lors du retrait du panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vider le panier
   */
  const clearCart = async () => {
    try {
      setLoading(true);
      await apiClearCart();
      setCart({ items: [], total_euros: 0, total_cents: 0 });
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mettre à jour la quantité d'un produit
   * @param {number} productId - ID du produit
   * @param {number} newQuantity - Nouvelle quantité
   */
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    // Trouver la quantité actuelle
    const currentItem = cart?.items?.find(item => item.product_id === productId);
    if (!currentItem) return;

    const difference = newQuantity - currentItem.quantity;
    if (difference !== 0) {
      return addToCart(productId, difference);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
