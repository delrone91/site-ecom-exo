"""
Router pour le catalogue produits.
Endpoints: liste des produits, détail d'un produit.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List

# Import depuis le module parent
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from schemas import ProductResponse, ProductListResponse


router = APIRouter()


# =========================
# ===== LISTE DES PRODUITS =====
# =========================

@router.get("/products", response_model=ProductListResponse)
async def list_products(context=Depends(__import__('dependencies').get_context)):
    """
    Récupère la liste de tous les produits actifs.

    Retourne uniquement les produits disponibles à la vente.
    """
    try:
        products = context.catalog_service.list_products()

        product_responses = [
            ProductResponse.from_product(product)
            for product in products
        ]

        return ProductListResponse(products=product_responses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== DÉTAIL D'UN PRODUIT =====
# =========================

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère les détails d'un produit spécifique.

    Args:
        product_id: Identifiant unique du produit

    Returns:
        Les informations complètes du produit
    """
    try:
        product = context.products_repo.get(product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Produit introuvable")

        if not product.active:
            raise HTTPException(status_code=404, detail="Produit non disponible")

        return ProductResponse.from_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
