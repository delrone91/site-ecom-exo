"""
Router pour la gestion des commandes.
Endpoints: checkout, paiement, liste des commandes, annulation.
"""

from fastapi import APIRouter, Depends, HTTPException

# Import depuis le module parent
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from schemas import (
    CheckoutRequest, PaymentRequest, OrderResponse,
    OrderListResponse, PaymentResponse, CancelOrderRequest
)


router = APIRouter()


# =========================
# ===== CRÉER UNE COMMANDE (CHECKOUT) =====
# =========================

@router.post("/checkout", response_model=OrderResponse, status_code=201)
async def checkout(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Crée une commande à partir du panier de l'utilisateur.

    Le panier est vidé après la création de la commande.
    Le stock est réservé pour les produits commandés.
    La commande est créée avec le statut CREE.
    """
    try:
        order = context.order_service.checkout(user_id)
        return OrderResponse.from_order(order, context.products_repo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== PAYER UNE COMMANDE =====
# =========================

@router.post("/pay", response_model=PaymentResponse)
async def pay_order(
    request: PaymentRequest,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Effectue le paiement d'une commande par carte bancaire.

    Args:
        request: Contient l'ID de la commande et les informations de paiement

    Returns:
        Les détails du paiement effectué

    Raises:
        400: Si le paiement est refusé ou si la commande n'est pas éligible
        404: Si la commande n'existe pas
    """
    try:
        # Vérifier que la commande appartient à l'utilisateur
        order = context.orders_repo.get(request.order_id)

        if not order:
            raise HTTPException(status_code=404, detail="Commande introuvable")

        if order.user_id != user_id:
            raise HTTPException(status_code=403, detail="Accès non autorisé à cette commande")

        # Effectuer le paiement
        payment = context.order_service.pay_by_card(
            order_id=request.order_id,
            card_number=request.card_number,
            exp_month=request.exp_month,
            exp_year=request.exp_year,
            cvc=request.cvc
        )

        return PaymentResponse(
            payment_id=payment.id,
            order_id=payment.order_id,
            amount_cents=payment.amount_cents,
            amount_euros=payment.amount_cents / 100.0,
            succeeded=payment.succeeded
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== VOIR MES COMMANDES =====
# =========================

@router.get("", response_model=OrderListResponse)
async def get_my_orders(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère toutes les commandes de l'utilisateur connecté.

    Retourne la liste complète des commandes avec leur historique et détails.
    """
    try:
        orders = context.order_service.view_orders(user_id)

        order_responses = [
            OrderResponse.from_order(order, context.products_repo)
            for order in orders
        ]

        return OrderListResponse(orders=order_responses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== DÉTAIL D'UNE COMMANDE =====
# =========================

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère les détails d'une commande spécifique.

    Args:
        order_id: Identifiant de la commande

    Returns:
        Les détails complets de la commande

    Raises:
        403: Si la commande n'appartient pas à l'utilisateur (sauf pour les admins)
        404: Si la commande n'existe pas
    """
    try:
        order = context.orders_repo.get(order_id)

        if not order:
            raise HTTPException(status_code=404, detail="Commande introuvable")

        # Vérifier si l'utilisateur est admin
        user = context.users_repo.get(user_id)
        is_admin = user and user.is_admin

        # Autoriser l'accès si c'est l'utilisateur propriétaire ou un admin
        if order.user_id != user_id and not is_admin:
            raise HTTPException(status_code=403, detail="Accès non autorisé à cette commande")

        return OrderResponse.from_order(order, context.products_repo)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== ANNULER UNE COMMANDE =====
# =========================

@router.post("/cancel", response_model=OrderResponse)
async def cancel_order(
    request: CancelOrderRequest,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Annule une commande.

    L'annulation n'est possible que si la commande n'est pas encore expédiée.
    Le stock est restitué pour les produits de la commande annulée.

    Args:
        request: Contient l'ID de la commande à annuler

    Returns:
        La commande mise à jour avec le statut ANNULEE

    Raises:
        400: Si la commande ne peut pas être annulée (déjà expédiée)
        403: Si la commande n'appartient pas à l'utilisateur
        404: Si la commande n'existe pas
    """
    try:
        order = context.order_service.request_cancellation(
            user_id=user_id,
            order_id=request.order_id
        )

        return OrderResponse.from_order(order, context.products_repo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
