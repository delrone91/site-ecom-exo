"""
Schémas Pydantic pour les DTOs (Data Transfer Objects) de l'API.
Ces schémas définissent la structure des requêtes et réponses.
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from enum import Enum


# =========================
# ===== ENUMS =====
# =========================

class OrderStatusEnum(str, Enum):
    """Statuts possibles d'une commande."""
    CREE = "CREE"
    VALIDEE = "VALIDEE"
    PAYEE = "PAYEE"
    EXPEDIEE = "EXPEDIEE"
    LIVREE = "LIVREE"
    ANNULEE = "ANNULEE"
    REMBOURSEE = "REMBOURSEE"


# =========================
# ===== AUTHENTIFICATION =====
# =========================

class RegisterRequest(BaseModel):
    """Requête d'inscription d'un nouvel utilisateur."""
    email: EmailStr
    password: str = Field(..., min_length=6)
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    address: str = Field(..., min_length=5)


class LoginRequest(BaseModel):
    """Requête de connexion."""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Réponse après connexion réussie."""
    token: str
    user_id: str
    email: str
    first_name: str
    last_name: str
    is_admin: bool


class UserProfileResponse(BaseModel):
    """Profil utilisateur."""
    id: str
    email: str
    first_name: str
    last_name: str
    address: str
    is_admin: bool


class UpdateProfileRequest(BaseModel):
    """Requête de mise à jour du profil."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    address: Optional[str] = None


# =========================
# ===== CATALOGUE =====
# =========================

class ProductResponse(BaseModel):
    """Représentation d'un produit."""
    id: str
    name: str
    description: str
    price_cents: int
    price_euros: float
    stock_qty: int
    active: bool
    image_url: Optional[str] = None

    @staticmethod
    def from_product(product):
        """Convertit un modèle Product en ProductResponse."""
        return ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price_cents=product.price_cents,
            price_euros=product.price_cents / 100.0,
            stock_qty=product.stock_qty,
            active=product.active,
            image_url=getattr(product, 'image_url', None)
        )


class ProductListResponse(BaseModel):
    """Liste de produits."""
    products: List[ProductResponse]


# =========================
# ===== PANIER =====
# =========================

class AddToCartRequest(BaseModel):
    """Requête d'ajout au panier."""
    product_id: str
    quantity: int = Field(ge=1)


class RemoveFromCartRequest(BaseModel):
    """Requête de retrait du panier."""
    product_id: str
    quantity: int = Field(default=1, ge=0)


class CartItemResponse(BaseModel):
    """Item dans le panier."""
    product_id: str
    product_name: str
    unit_price_cents: int
    unit_price_euros: float
    quantity: int
    line_total_cents: int
    line_total_euros: float
    image_url: Optional[str] = None


class CartResponse(BaseModel):
    """Panier complet."""
    items: List[CartItemResponse]
    total_cents: int
    total_euros: float


# =========================
# ===== COMMANDES =====
# =========================

class CheckoutRequest(BaseModel):
    """Requête de création de commande (checkout)."""
    pass  # Le panier est déjà stocké côté serveur


class PaymentRequest(BaseModel):
    """Requête de paiement par carte."""
    order_id: str
    card_number: str = Field(..., min_length=16, max_length=16)
    exp_month: int = Field(..., ge=1, le=12)
    exp_year: int = Field(..., ge=2025)
    cvc: str = Field(..., min_length=3, max_length=4)


class OrderItemResponse(BaseModel):
    """Item dans une commande."""
    product_id: str
    name: str
    unit_price_cents: int
    unit_price_euros: float
    quantity: int
    line_total_cents: int
    line_total_euros: float


class DeliveryResponse(BaseModel):
    """Information de livraison."""
    id: str
    carrier: str
    tracking_number: Optional[str]
    address: str
    status: str


class OrderResponse(BaseModel):
    """Représentation d'une commande."""
    id: str
    user_id: str
    items: List[OrderItemResponse]
    status: OrderStatusEnum
    total_cents: int
    total_euros: float
    created_at: float
    validated_at: Optional[float] = None
    paid_at: Optional[float] = None
    shipped_at: Optional[float] = None
    delivered_at: Optional[float] = None
    cancelled_at: Optional[float] = None
    refunded_at: Optional[float] = None
    delivery: Optional[DeliveryResponse] = None
    invoice_id: Optional[str] = None
    payment_id: Optional[str] = None

    @staticmethod
    def from_order(order):
        """Convertit un modèle Order en OrderResponse."""
        items = [
            OrderItemResponse(
                product_id=item.product_id,
                name=item.name,
                unit_price_cents=item.unit_price_cents,
                unit_price_euros=item.unit_price_cents / 100.0,
                quantity=item.quantity,
                line_total_cents=item.unit_price_cents * item.quantity,
                line_total_euros=(item.unit_price_cents * item.quantity) / 100.0
            )
            for item in order.items
        ]

        delivery = None
        if order.delivery:
            delivery = DeliveryResponse(
                id=order.delivery.id,
                carrier=order.delivery.carrier,
                tracking_number=order.delivery.tracking_number,
                address=order.delivery.address,
                status=order.delivery.status
            )

        return OrderResponse(
            id=order.id,
            user_id=order.user_id,
            items=items,
            status=OrderStatusEnum(order.status.name),
            total_cents=order.total_cents(),
            total_euros=order.total_cents() / 100.0,
            created_at=order.created_at,
            validated_at=order.validated_at,
            paid_at=order.paid_at,
            shipped_at=order.shipped_at,
            delivered_at=order.delivered_at,
            cancelled_at=order.cancelled_at,
            refunded_at=order.refunded_at,
            delivery=delivery,
            invoice_id=order.invoice_id,
            payment_id=order.payment_id
        )


class OrderListResponse(BaseModel):
    """Liste de commandes."""
    orders: List[OrderResponse]


class PaymentResponse(BaseModel):
    """Réponse après paiement."""
    payment_id: str
    order_id: str
    amount_cents: int
    amount_euros: float
    succeeded: bool


class CancelOrderRequest(BaseModel):
    """Requête d'annulation de commande."""
    order_id: str


# =========================
# ===== SERVICE CLIENT =====
# =========================

class CreateThreadRequest(BaseModel):
    """Requête de création d'un fil de discussion."""
    subject: str = Field(..., min_length=3)
    order_id: Optional[str] = None
    initial_message: str = Field(..., min_length=1)


class PostMessageRequest(BaseModel):
    """Requête d'ajout d'un message."""
    body: str = Field(..., min_length=1)


class MessageResponse(BaseModel):
    """Représentation d'un message."""
    id: str
    thread_id: str
    author_user_id: Optional[str]
    author_name: str  # "Client" ou nom de l'agent
    body: str
    created_at: float


class ThreadResponse(BaseModel):
    """Représentation d'un fil de discussion."""
    id: str
    user_id: str
    order_id: Optional[str]
    subject: str
    messages: List[MessageResponse]
    closed: bool

    @staticmethod
    def from_thread(thread, users_repo):
        """Convertit un modèle MessageThread en ThreadResponse."""
        messages = []
        for msg in thread.messages:
            if msg.author_user_id:
                user = users_repo.get(msg.author_user_id)
                author_name = f"{user.first_name} {user.last_name}" if user else "Utilisateur"
            else:
                author_name = "Support"

            messages.append(MessageResponse(
                id=msg.id,
                thread_id=msg.thread_id,
                author_user_id=msg.author_user_id,
                author_name=author_name,
                body=msg.body,
                created_at=msg.created_at
            ))

        return ThreadResponse(
            id=thread.id,
            user_id=thread.user_id,
            order_id=thread.order_id,
            subject=thread.subject,
            messages=messages,
            closed=thread.closed
        )


class ThreadListResponse(BaseModel):
    """Liste de fils de discussion."""
    threads: List[ThreadResponse]


# =========================
# ===== ADMINISTRATION =====
# =========================

class ValidateOrderRequest(BaseModel):
    """Requête de validation de commande (admin)."""
    order_id: str


class ShipOrderRequest(BaseModel):
    """Requête d'expédition de commande (admin)."""
    order_id: str


class MarkDeliveredRequest(BaseModel):
    """Requête de marquage commande livrée (admin)."""
    order_id: str


class RefundOrderRequest(BaseModel):
    """Requête de remboursement (admin)."""
    order_id: str
    amount_cents: Optional[int] = None


class UpdateStockRequest(BaseModel):
    """Requête de mise à jour du stock (admin)."""
    product_id: str
    stock_qty: int = Field(ge=0)


class CreateProductRequest(BaseModel):
    """Requête de création de produit (admin)."""
    name: str = Field(..., min_length=1)
    description: str
    price_cents: int = Field(ge=0)
    stock_qty: int = Field(ge=0)


class UpdateProductRequest(BaseModel):
    """Requête de mise à jour de produit (admin)."""
    product_id: str
    name: Optional[str] = None
    description: Optional[str] = None
    price_cents: Optional[int] = Field(default=None, ge=0)
    stock_qty: Optional[int] = Field(default=None, ge=0)
    active: Optional[bool] = None


class AdminStatsResponse(BaseModel):
    """Statistiques pour l'administration."""
    total_orders: int
    total_revenue_cents: int
    total_revenue_euros: float
    total_revenue: float  # Alias pour total_revenue_euros
    orders_by_status: dict
    pending_orders: int
    validated_orders: int
    shipped_orders: int
    delivered_orders: int
    total_users: int
    total_products: int
    low_stock_products: List[ProductResponse]


# =========================
# ===== MESSAGES D'ERREUR =====
# =========================

class ErrorResponse(BaseModel):
    """Réponse d'erreur standard."""
    detail: str


class SimpleMessageResponse(BaseModel):
    """Réponse de message simple."""
    message: str
