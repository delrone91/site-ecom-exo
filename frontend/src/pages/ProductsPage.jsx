import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3x3, Sparkles, ShoppingBag, Package } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductList from '../components/product/ProductList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * ProductsPage Moderne avec Glassmorphism
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setToastMessage(`${product.name} ajouté au panier`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 py-24">
      {/* Toast moderne avec glassmorphism */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 backdrop-blur-xl bg-white/80 border border-white/20 shadow-glow px-6 py-4 rounded-2xl animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <p className="text-gray-800 font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Cercles flottants d'arrière-plan */}
      <div className="fixed top-40 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-40 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Titre */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Nos Produits
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez notre collection exclusive de produits premium sélectionnés avec soin
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/60 border border-white/20 rounded-2xl shadow-glass p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nombre de résultats */}
        {!loading && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
                  <Grid3x3 className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {searchTerm ? `Résultats pour "${searchTerm}"` : 'Tous nos produits'}
                  </p>
                </div>
              </div>

              {/* Stats rapides */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {products.filter(p => p.stock_qty > 0).length}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">Disponibles</p>
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {products.length}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">Total</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message si aucun résultat */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="max-w-md mx-auto backdrop-blur-xl bg-white/60 border border-white/20 rounded-3xl p-12 shadow-glass">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                <Search className="text-primary-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Réinitialiser la recherche
              </button>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
