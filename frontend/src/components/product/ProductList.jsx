import React from 'react';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';

/**
 * Composant ProductList - Liste de produits en grille
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.products - La liste des produits
 * @param {Function} props.onAddToCart - Fonction appelée lors de l'ajout au panier
 * @param {boolean} props.loading - État de chargement
 */
const ProductList = ({ products, onAddToCart, loading }) => {
  if (loading) {
    return <Loading size="lg" message="Chargement des produits..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
