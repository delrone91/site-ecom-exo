import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit, Save, X, Upload } from 'lucide-react';
import { getAllProducts, updateStock, createProduct, updateProduct, uploadImage } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';

/**
 * Page de gestion des produits (admin)
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, isEditing = false) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      const result = await uploadImage(file);
      const imageUrl = `http://localhost:8000${result.image_url}`;

      if (isEditing) {
        setEditingProduct({ ...editingProduct, image_url: imageUrl });
      } else {
        setNewProductData({ ...newProductData, image_url: imageUrl });
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await updateStock(productId, parseInt(newStock));
      await loadProducts();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductData.name || !newProductData.price || !newProductData.stock) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        ...newProductData,
        price: parseFloat(newProductData.price),
        stock: parseInt(newProductData.stock),
      };
      await createProduct(productData);
      await loadProducts();
      setShowNewProduct(false);
      setNewProductData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      setSaving(true);
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        image_url: editingProduct.image_url,
      };
      await updateProduct(editingProduct.id, productData);
      await loadProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      alert('Erreur lors de la mise à jour du produit');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement des produits..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des produits
          </h1>
          <Button
            variant="primary"
            onClick={() => setShowNewProduct(!showNewProduct)}
          >
            <Plus size={20} />
            Nouveau produit
          </Button>
        </div>

        {/* Formulaire nouveau produit */}
        {showNewProduct && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Créer un nouveau produit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Nom du produit"
                placeholder="Ex: Smartphone XYZ"
                value={newProductData.name}
                onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                required
              />
              <Input
                label="Prix (€)"
                type="number"
                step="0.01"
                placeholder="99.99"
                value={newProductData.price}
                onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                required
              />
              <Input
                label="Stock"
                type="number"
                placeholder="50"
                value={newProductData.stock}
                onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image du produit (optionnel)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], false)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span className="text-sm text-gray-500">Upload en cours...</span>}
                </div>
                {newProductData.image_url && (
                  <img src={newProductData.image_url} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 min-h-24"
                placeholder="Description détaillée du produit..."
                value={newProductData.description}
                onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleCreateProduct}
                loading={saving}
                disabled={saving}
              >
                <Save size={20} />
                Créer le produit
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowNewProduct(false)}
              >
                <X size={20} />
                Annuler
              </Button>
            </div>
          </Card>
        )}

        {/* Liste des produits */}
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => {
            const isEditing = editingProduct?.id === product.id;
            const editData = isEditing ? editingProduct : product;

            return (
              <Card key={product.id}>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={editData.image_url || 'https://via.placeholder.com/150'}
                      alt={editData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informations */}
                  <div className="flex-1 space-y-3">
                    {isEditing ? (
                      <>
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditingProduct({ ...editData, name: e.target.value })}
                        />
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 min-h-20"
                          value={editData.description}
                          onChange={(e) => setEditingProduct({ ...editData, description: e.target.value })}
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            label="Prix (€)"
                            type="number"
                            step="0.01"
                            value={editData.price}
                            onChange={(e) => setEditingProduct({ ...editData, price: e.target.value })}
                          />
                          <Input
                            label="Stock"
                            type="number"
                            value={editData.stock}
                            onChange={(e) => setEditingProduct({ ...editData, stock: e.target.value })}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Statut
                            </label>
                            <span className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold ${
                              editData.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {editData.stock > 0 ? 'En stock' : 'Rupture'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image du produit (optionnel)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e.target.files[0], true)}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                              disabled={uploadingImage}
                            />
                            {uploadingImage && <span className="text-sm text-gray-500">Upload en cours...</span>}
                          </div>
                          {editData.image_url && (
                            <img src={editData.image_url} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-600">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-600">Prix: </span>
                            <span className="text-xl font-bold text-primary-600">
                              {product.price_euros.toFixed(2)} €
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Stock: </span>
                            <span className={`font-bold ${
                              product.stock_qty > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {product.stock_qty}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock_qty > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock_qty > 0 ? 'En stock' : 'Rupture'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-48">
                    {isEditing ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleUpdateProduct}
                          loading={saving}
                          disabled={saving}
                        >
                          <Save size={16} />
                          Enregistrer
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingProduct(null)}
                        >
                          <X size={16} />
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit size={16} />
                          Modifier
                        </Button>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Stock"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateStock(product.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          Entrez nouveau stock puis appuyez sur Entrée
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Aucun produit dans le catalogue</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
