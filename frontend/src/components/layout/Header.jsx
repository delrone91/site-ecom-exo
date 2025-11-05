import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/**
 * Header Moderne avec Glassmorphism
 */
const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group"
            >
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/products"
              className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group"
            >
              Produits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <Link
                to="/orders"
                className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group"
              >
                Mes commandes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            <Link
              to="/support"
              className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group"
            >
              Support
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {/* Panier avec badge animé */}
            <Link
              to="/cart"
              className="relative group"
            >
              <div className="relative p-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 transition-all duration-300 transform hover:scale-110">
                <ShoppingCart className="text-primary-600" size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce-slow shadow-glow">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Menu utilisateur */}
            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="p-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 transition-all duration-300 transform hover:scale-110"
                    title="Administration"
                  >
                    <Settings size={22} />
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 transition-all duration-300 transform hover:scale-105"
                >
                  <User size={20} />
                  <span className="font-medium hidden xl:inline">{user.first_name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 transform hover:scale-110"
                  title="Déconnexion"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="relative group px-6 py-2.5 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
                  <span className="relative text-white font-medium">S'inscrire</span>
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 transition-all duration-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden backdrop-blur-xl bg-white/90 border-t border-white/20 animate-slide-up">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium transition-all"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium transition-all"
            >
              Produits
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium transition-all"
                >
                  Mes commandes
                </Link>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium transition-all"
                  >
                    Administration
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium transition-all"
                >
                  Mon profil
                </Link>
              </>
            )}
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium transition-all"
            >
              Support
            </Link>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all"
              >
                Déconnexion
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 text-primary-600 font-medium text-center transition-all"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-medium text-center transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
