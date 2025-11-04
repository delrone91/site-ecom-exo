import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Composant Footer - Pied de page de l'application
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <ShoppingCart size={24} />
              <span className="text-xl font-bold">E-Shop</span>
            </div>
            <p className="text-sm text-gray-400">
              Votre destination en ligne pour des produits de qualité à prix compétitifs.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:text-primary-400 transition-colors">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm hover:text-primary-400 transition-colors">
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm hover:text-primary-400 transition-colors">
                  Support client
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm hover:text-primary-400 transition-colors">
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Politique de retour
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} />
                <span>contact@eshop.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin size={16} />
                <span>123 Rue du Commerce, Paris</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} E-Shop. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
