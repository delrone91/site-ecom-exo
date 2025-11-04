"""
Router pour l'administration du site e-commerce.
Endpoints réservés aux administrateurs: gestion des commandes, produits, statistiques.
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse

# Import depuis le module parent
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from schemas import (
    ValidateOrderRequest, ShipOrderRequest, MarkDeliveredRequest,
    RefundOrderRequest, UpdateStockRequest, CreateProductRequest,
    UpdateProductRequest, OrderResponse, ProductResponse,
    AdminStatsResponse, OrderListResponse,
    ThreadListResponse, ThreadResponse, PostMessageRequest
)
from models import Product, OrderStatus
import uuid


router = APIRouter()


# =========================
# ===== GESTION DES COMMANDES =====
# =========================

@router.post("/orders/validate", response_model=OrderResponse)
async def validate_order(
    request: ValidateOrderRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Valide une commande (passage du statut CREE à VALIDEE).

    Réservé aux administrateurs.
    """
    try:
        order = context.order_service.backoffice_validate_order(
            admin_user_id=admin_id,
            order_id=request.order_id
        )
        return OrderResponse.from_order(order)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/orders/ship", response_model=OrderResponse)
async def ship_order(
    request: ShipOrderRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Marque une commande comme expédiée.

    Crée les informations de livraison avec numéro de tracking.
    La commande doit être au statut PAYEE.
    """
    try:
        order = context.order_service.backoffice_ship_order(
            admin_user_id=admin_id,
            order_id=request.order_id
        )
        return OrderResponse.from_order(order)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/orders/deliver", response_model=OrderResponse)
async def mark_delivered(
    request: MarkDeliveredRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Marque une commande comme livrée.

    La commande doit être au statut EXPEDIEE.
    """
    try:
        order = context.order_service.backoffice_mark_delivered(
            admin_user_id=admin_id,
            order_id=request.order_id
        )
        return OrderResponse.from_order(order)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/orders/refund", response_model=OrderResponse)
async def refund_order(
    request: RefundOrderRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Rembourse une commande.

    Le stock est restitué et le montant remboursé au client.
    """
    try:
        order = context.order_service.backoffice_refund(
            admin_user_id=admin_id,
            order_id=request.order_id,
            amount_cents=request.amount_cents
        )
        return OrderResponse.from_order(order)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orders", response_model=OrderListResponse)
async def get_all_orders(
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère toutes les commandes (tous utilisateurs).

    Réservé aux administrateurs.
    """
    try:
        # Récupérer toutes les commandes
        all_orders = list(context.orders_repo._by_id.values())

        order_responses = [
            OrderResponse.from_order(order)
            for order in all_orders
        ]

        return OrderListResponse(orders=order_responses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== GESTION DES PRODUITS =====
# =========================

@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(
    request: dict,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Crée un nouveau produit.

    Accepte les formats: price/price_cents et stock/stock_qty.
    """
    try:
        # Extraire les champs requis
        name = request.get('name')
        description = request.get('description', '')

        if not name:
            raise HTTPException(status_code=400, detail="Le champ 'name' est requis")

        # Accepter 'price' (en euros) ou 'price_cents'
        if 'price' in request:
            price_cents = int(float(request['price']) * 100)
        elif 'price_cents' in request:
            price_cents = int(request['price_cents'])
        else:
            raise HTTPException(status_code=400, detail="Le champ 'price' ou 'price_cents' est requis")

        # Accepter 'stock' ou 'stock_qty'
        if 'stock' in request:
            stock_qty = int(request['stock'])
        elif 'stock_qty' in request:
            stock_qty = int(request['stock_qty'])
        else:
            stock_qty = 0

        # Gérer image_url (optionnel)
        image_url = request.get('image_url')

        product = Product(
            id=str(uuid.uuid4()),
            name=name,
            description=description,
            price_cents=price_cents,
            stock_qty=stock_qty,
            active=True,
            image_url=image_url
        )
        context.products_repo.add(product)

        return ProductResponse.from_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products", response_model=ProductResponse)
async def update_product(
    request: UpdateProductRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Met à jour un produit existant.

    Seuls les champs fournis sont mis à jour.
    """
    try:
        product = context.products_repo.get(request.product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Produit introuvable")

        # Mise à jour des champs fournis
        if request.name is not None:
            product.name = request.name
        if request.description is not None:
            product.description = request.description
        if request.price_cents is not None:
            product.price_cents = request.price_cents
        if request.stock_qty is not None:
            product.stock_qty = request.stock_qty
        if request.active is not None:
            product.active = request.active

        return ProductResponse.from_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product_by_id(
    product_id: str,
    request: dict,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Met à jour un produit existant (endpoint alternatif avec product_id dans l'URL).

    Accepte les formats: price/price_cents et stock/stock_qty.
    """
    try:
        product = context.products_repo.get(product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Produit introuvable")

        # Mise à jour des champs fournis
        if 'name' in request and request['name'] is not None:
            product.name = request['name']
        if 'description' in request and request['description'] is not None:
            product.description = request['description']

        # Accepter 'price' (en euros) ou 'price_cents'
        if 'price' in request:
            if request['price'] is not None:
                product.price_cents = int(float(request['price']) * 100)
        elif 'price_cents' in request:
            if request['price_cents'] is not None:
                product.price_cents = int(request['price_cents'])

        # Accepter 'stock' ou 'stock_qty'
        if 'stock' in request:
            if request['stock'] is not None:
                product.stock_qty = int(request['stock'])
        elif 'stock_qty' in request:
            if request['stock_qty'] is not None:
                product.stock_qty = int(request['stock_qty'])

        if 'active' in request and request['active'] is not None:
            product.active = request['active']

        # Gérer image_url
        if 'image_url' in request:
            product.image_url = request['image_url']

        return ProductResponse.from_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products/stock", response_model=ProductResponse)
async def update_stock(
    request: UpdateStockRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Met à jour le stock d'un produit.

    Réservé aux administrateurs.
    """
    try:
        product = context.products_repo.get(request.product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Produit introuvable")

        product.stock_qty = request.stock_qty

        return ProductResponse.from_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products/{product_id}/stock", response_model=ProductResponse)
async def update_stock_by_id(
    product_id: str,
    request: dict,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Met à jour le stock d'un produit (endpoint alternatif avec product_id dans l'URL).

    Réservé aux administrateurs.
    """
    try:
        product = context.products_repo.get(product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Produit introuvable")

        # Accepter 'stock' ou 'stock_qty' - vérifier la présence de la clé, pas la valeur
        if 'stock' in request:
            stock_qty = request['stock']
        elif 'stock_qty' in request:
            stock_qty = request['stock_qty']
        else:
            raise HTTPException(status_code=400, detail="Le champ 'stock' ou 'stock_qty' est requis")

        product.stock_qty = int(stock_qty)

        return ProductResponse.from_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products", response_model=list[ProductResponse])
async def get_all_products(
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère tous les produits (y compris inactifs).

    Réservé aux administrateurs.
    """
    try:
        all_products = list(context.products_repo._by_id.values())

        return [
            ProductResponse.from_product(product)
            for product in all_products
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== SUPPORT CLIENT (ADMIN) =====
# =========================

@router.get("/support/threads", response_model=ThreadListResponse)
async def get_all_threads(
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère tous les fils de discussion du support.

    Réservé aux administrateurs.
    """
    try:
        all_threads = list(context.threads_repo._by_id.values())

        thread_responses = [
            ThreadResponse.from_thread(thread, context.users_repo)
            for thread in all_threads
        ]

        return ThreadListResponse(threads=thread_responses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/support/threads/{thread_id}/reply", response_model=ThreadResponse)
async def reply_to_thread(
    thread_id: str,
    request: PostMessageRequest,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Répondre à un fil de discussion en tant que support.

    Le message sera affiché comme venant du support (author_user_id = None).
    """
    try:
        thread = context.threads_repo.get(thread_id)

        if not thread:
            raise HTTPException(status_code=404, detail="Fil de discussion introuvable")

        # Poster le message en tant que support (author_user_id = None)
        context.customer_service.post_message(
            thread_id=thread_id,
            author_user_id=None,  # None = agent support
            body=request.body
        )

        return ThreadResponse.from_thread(thread, context.users_repo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/support/threads/{thread_id}/close", response_model=ThreadResponse)
async def close_thread(
    thread_id: str,
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Ferme un fil de discussion.

    Un fil fermé ne peut plus recevoir de nouveaux messages.
    """
    try:
        thread = context.customer_service.close_thread(
            thread_id=thread_id,
            admin_user_id=admin_id
        )

        return ThreadResponse.from_thread(thread, context.users_repo)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== STATISTIQUES =====
# =========================

@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère les statistiques du site e-commerce.

    Inclut:
    - Nombre total de commandes
    - Revenu total
    - Répartition des commandes par statut
    - Nombre d'utilisateurs
    - Nombre de produits
    - Produits en stock faible
    """
    try:
        all_orders = list(context.orders_repo._by_id.values())
        all_users = list(context.users_repo._by_id.values())
        all_products = list(context.products_repo._by_id.values())

        # Revenu total (uniquement commandes payées ou livrées)
        total_revenue_cents = sum(
            order.total_cents()
            for order in all_orders
            if order.status in {OrderStatus.PAYEE, OrderStatus.EXPEDIEE, OrderStatus.LIVREE}
        )

        # Répartition par statut
        orders_by_status = {}
        for status in OrderStatus:
            count = sum(1 for order in all_orders if order.status == status)
            orders_by_status[status.name] = count

        # Produits en stock faible (< 10 unités)
        low_stock_products = [
            ProductResponse.from_product(product)
            for product in all_products
            if product.active and product.stock_qty < 10
        ]

        # Compter uniquement les commandes payées, expédiées ou livrées pour le total
        completed_orders = sum(
            1 for order in all_orders
            if order.status in {OrderStatus.PAYEE, OrderStatus.EXPEDIEE, OrderStatus.LIVREE}
        )

        return AdminStatsResponse(
            total_orders=completed_orders,
            total_revenue_cents=total_revenue_cents,
            total_revenue_euros=total_revenue_cents / 100.0,
            total_revenue=total_revenue_cents / 100.0,
            orders_by_status=orders_by_status,
            pending_orders=orders_by_status.get('CREE', 0),
            validated_orders=orders_by_status.get('VALIDEE', 0) + orders_by_status.get('PAYEE', 0),
            shipped_orders=orders_by_status.get('EXPEDIEE', 0),
            delivered_orders=orders_by_status.get('LIVREE', 0),
            total_users=len(all_users),
            total_products=len(all_products),
            low_stock_products=low_stock_products
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== UPLOAD D'IMAGES =====
# =========================

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    admin_id: str = Depends(__import__('dependencies').get_current_admin_user_id)
):
    """
    Upload une image pour un produit.

    Retourne l'URL de l'image uploadée.
    """
    try:
        # Vérifier que c'est bien une image
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Le fichier doit être une image")

        # Créer le dossier uploads s'il n'existe pas
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
        os.makedirs(uploads_dir, exist_ok=True)

        # Générer un nom de fichier unique
        file_ext = os.path.splitext(file.filename)[1] if file.filename else '.jpg'
        filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(uploads_dir, filename)

        # Sauvegarder le fichier
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Retourner l'URL de l'image
        image_url = f"/api/uploads/{filename}"
        return {"image_url": image_url}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
