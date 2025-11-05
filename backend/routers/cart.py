"""
Router pour la gestion du panier d'achat.
Endpoints: ajout au panier, retrait du panier, consultation du panier.
"""

from fastapi import APIRouter, Depends, HTTPException

# Import depuis le module parent
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from schemas import (
    AddToCartRequest, RemoveFromCartRequest,
    CartResponse, CartItemResponse, SimpleMessageResponse
)


router = APIRouter()


# =========================
# ===== VOIR LE PANIER =====
# =========================

@router.get("", response_model=CartResponse)
async def get_cart(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère le panier de l'utilisateur connecté.

    Retourne tous les items du panier avec leurs détails et le total.
    """
    try:
        cart = context.cart_service.view_cart(user_id)
        total_cents = context.cart_service.cart_total(user_id)

        # Conversion des items du panier
        items = []
        for cart_item in cart.items.values():
            product = context.products_repo.get(cart_item.product_id)

            if product and product.active:
                items.append(CartItemResponse(
                    product_id=product.id,
                    product_name=product.name,
                    unit_price_cents=product.price_cents,
                    unit_price_euros=product.price_cents / 100.0,
                    quantity=cart_item.quantity,
                    line_total_cents=product.price_cents * cart_item.quantity,
                    line_total_euros=(product.price_cents * cart_item.quantity) / 100.0,
                    image_url=getattr(product, 'image_url', None)
                ))

        return CartResponse(
            items=items,
            total_cents=total_cents,
            total_euros=total_cents / 100.0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== AJOUTER AU PANIER =====
# =========================

@router.post("/add", response_model=CartResponse)
async def add_to_cart(
    request: AddToCartRequest,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Ajoute un produit au panier.

    Args:
        request: Contient l'ID du produit et la quantité à ajouter

    Returns:
        Le panier mis à jour
    """
    try:
        context.cart_service.add_to_cart(
            user_id=user_id,
            product_id=request.product_id,
            qty=request.quantity
        )

        # Retourne le panier mis à jour
        return await get_cart(user_id, context)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== RETIRER DU PANIER =====
# =========================

@router.post("/remove", response_model=CartResponse)
async def remove_from_cart(
    request: RemoveFromCartRequest,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Retire un produit du panier ou diminue sa quantité.

    Args:
        request: Contient l'ID du produit et la quantité à retirer
                 (0 ou non spécifié = retrait complet)

    Returns:
        Le panier mis à jour
    """
    try:
        context.cart_service.remove_from_cart(
            user_id=user_id,
            product_id=request.product_id,
            qty=request.quantity
        )

        # Retourne le panier mis à jour
        return await get_cart(user_id, context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== VIDER LE PANIER =====
# =========================

@router.delete("/clear", response_model=SimpleMessageResponse)
async def clear_cart(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Vide complètement le panier de l'utilisateur.

    Supprime tous les items du panier.
    """
    try:
        context.carts_repo.clear(user_id)

        return SimpleMessageResponse(message="Panier vidé avec succès")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
