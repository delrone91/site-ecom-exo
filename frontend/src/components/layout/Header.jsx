import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/**
 * Composant Header - En-tête de l'application avec navigation
 */
const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            <ShoppingCart size={32} />
            <span>E-Shop</span>
          </Link>

          {/* Navigation principale */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Produits
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Mes commandes
              </Link>
            )}
            <Link to="/support" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Support
            </Link>
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {/* Panier */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Menu utilisateur */}
            {user ? (
              <div className="flex items-center gap-3">
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="Administration"
                  >
                    <Settings size={24} />
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User size={24} />
                  <span className="hidden lg:inline font-medium">{user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
