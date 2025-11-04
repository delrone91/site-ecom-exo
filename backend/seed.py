"""
Script de seed pour ajouter des données de test au site e-commerce.
Crée des produits, des utilisateurs (admin et clients), et quelques commandes de test.
"""

import uuid
from models import Product, User, PasswordHasher


def seed_data(context):
    """
    Ajoute des données de test au système.

    Args:
        context: Le contexte applicatif contenant tous les repositories et services
    """

    print("🌱 Début du seed des données...")

    # =========================
    # ===== UTILISATEURS =====
    # =========================

    print("\n👥 Création des utilisateurs...")

    # Admin
    admin = User(
        id=str(uuid.uuid4()),
        email="admin@example.com",
        password_hash=PasswordHasher.hash("admin123"),
        first_name="Admin",
        last_name="Administrateur",
        address="1 Avenue de l'Administration, 75001 Paris",
        is_admin=True
    )
    context.users_repo.add(admin)
    print(f"  ✓ Admin créé: {admin.email} / admin123")

    # Clients
    clients = [
        User(
            id=str(uuid.uuid4()),
            email="alice@example.com",
            password_hash=PasswordHasher.hash("password123"),
            first_name="Alice",
            last_name="Martin",
            address="12 Rue des Fleurs, 69001 Lyon",
            is_admin=False
        ),
        User(
            id=str(uuid.uuid4()),
            email="bob@example.com",
            password_hash=PasswordHasher.hash("password123"),
            first_name="Bob",
            last_name="Durand",
            address="34 Boulevard Victor Hugo, 31000 Toulouse",
            is_admin=False
        ),
        User(
            id=str(uuid.uuid4()),
            email="charlie@example.com",
            password_hash=PasswordHasher.hash("password123"),
            first_name="Charlie",
            last_name="Dubois",
            address="56 Avenue de la République, 13001 Marseille",
            is_admin=False
        ),
    ]

    for client in clients:
        context.users_repo.add(client)
        print(f"  ✓ Client créé: {client.email} / password123")

    # =========================
    # ===== PRODUITS =====
    # =========================

    print("\n📦 Création des produits...")

    products = [
        # Vêtements
        Product(
            id=str(uuid.uuid4()),
            name="T-Shirt Classic Blanc",
            description="T-shirt en coton bio, coupe classique. Parfait pour un style décontracté et confortable.",
            price_cents=1999,
            stock_qty=150,
            active=True,
            image_url="http://localhost:8000/api/uploads/T-Shirt-Classic-Blanc.png"
        ),
        Product(
            id=str(uuid.uuid4()),
            name="T-Shirt Classic Noir",
            description="T-shirt en coton bio, coupe classique. Intemporel et polyvalent.",
            price_cents=1999,
            stock_qty=120,
            active=True,
            image_url="http://localhost:8000/api/uploads/T-Shirt-Classic-Noir.png"
        ),
        Product(
            id=str(uuid.uuid4()),
            name="Sweat à Capuche Gris",
            description="Sweat en molleton doux avec capuche et poche kangourou. Idéal pour les journées fraîches.",
            price_cents=4999,
            stock_qty=75,
            active=True,
            image_url="http://localhost:8000/api/uploads/Sweat-à-Capuche-Gris.png"
        ),
        Product(
            id=str(uuid.uuid4()),
            name="Jean Coupe Droite",
            description="Jean en denim stretch confortable. Coupe droite intemporelle et polyvalente.",
            price_cents=6999,
            stock_qty=60,
            active=True,
            image_url="http://localhost:8000/api/uploads/JeanCoupe-Droite.png"
        ),
        Product(
            id=str(uuid.uuid4()),
            name="Veste en Jean",
            description="Veste en denim classique. Un essentiel du vestiaire décontracté.",
            price_cents=7999,
            stock_qty=40,
            active=True,
            image_url="http://localhost:8000/api/uploads/Veste-enJean.png"
        ),

        # Accessoires
        Product(
            id=str(uuid.uuid4()),
            name="Casquette",
            description="Casquette ajustable avec broderie. Protection solaire et style garantis.",
            price_cents=2499,
            stock_qty=100,
            active=True,
            image_url="http://localhost:8000/api/uploads/Casquette.png"
        ),
        Product(
            id=str(uuid.uuid4()),
            name="Ceinture Cuir Marron",
            description="Ceinture en cuir véritable. Élégante et durable.",
            price_cents=3499,
            stock_qty=45,
            active=True,
            image_url="http://localhost:8000/api/uploads/CeintureCuirMarron.png"
        ),
        Product(
            id=str(uuid.uuid4()),
            name="Écharpe Laine",
            description="Écharpe en laine mérinos. Douceur et chaleur pour l'hiver.",
            price_cents=2999,
            stock_qty=35,
            active=True,
            image_url="http://localhost:8000/api/uploads/ÉcharpeLaine.png"
        ),

        # Produits en stock faible (pour les alertes admin)
        Product(
            id=str(uuid.uuid4()),
            name="Pull Col Roulé Beige",
            description="Pull en cachemire mélangé. Doux et chaud pour l'hiver.",
            price_cents=7999,
            stock_qty=5,  # Stock faible
            active=True,
            image_url="http://localhost:8000/api/uploads/Pull-Col-Roulé-Beige.png"
        ),
    ]

    for product in products:
        context.products_repo.add(product)
        status = "✓" if product.active else "✗"
        stock_info = f"(stock: {product.stock_qty})"
        if product.stock_qty < 10 and product.stock_qty > 0:
            stock_info = f"⚠️  (stock faible: {product.stock_qty})"
        elif product.stock_qty == 0:
            stock_info = "❌ (rupture de stock)"
        print(f"  {status} {product.name} - {product.price_cents/100:.2f}€ {stock_info}")

    # =========================
    # ===== COMMANDES DE TEST =====
    # =========================

    print("\n🛒 Création de commandes de test...")

    # Commande complète pour Alice (livrée)
    alice = clients[0]
    tshirt_blanc = products[0]  # T-Shirt Classic Blanc
    sweat = products[2]  # Sweat à Capuche Gris

    # Ajout au panier
    context.cart_service.add_to_cart(alice.id, tshirt_blanc.id, 2)
    context.cart_service.add_to_cart(alice.id, sweat.id, 1)

    # Checkout et paiement
    try:
        order_alice = context.order_service.checkout(alice.id)
        print(f"  ✓ Commande créée pour {alice.first_name} (ID: {order_alice.id[:8]}...)")

        # Validation admin
        context.order_service.backoffice_validate_order(admin.id, order_alice.id)

        # Paiement (carte qui fonctionne)
        context.order_service.pay_by_card(
            order_id=order_alice.id,
            card_number="4242424242424242",
            exp_month=12,
            exp_year=2030,
            cvc="123"
        )
        print(f"    → Paiement effectué")

        # Expédition
        context.order_service.backoffice_ship_order(admin.id, order_alice.id)
        print(f"    → Commande expédiée")

        # Livraison
        context.order_service.backoffice_mark_delivered(admin.id, order_alice.id)
        print(f"    → Commande livrée (statut: {order_alice.status.name})")

    except Exception as e:
        print(f"  ✗ Erreur lors de la création de la commande: {e}")

    # Commande en cours pour Bob (payée, pas encore expédiée)
    bob = clients[1]
    jean = products[3]  # Jean Coupe Droite
    casquette = products[5]  # Casquette

    context.cart_service.add_to_cart(bob.id, jean.id, 1)
    context.cart_service.add_to_cart(bob.id, casquette.id, 1)

    try:
        order_bob = context.order_service.checkout(bob.id)
        print(f"  ✓ Commande créée pour {bob.first_name} (ID: {order_bob.id[:8]}...)")

        context.order_service.backoffice_validate_order(admin.id, order_bob.id)

        context.order_service.pay_by_card(
            order_id=order_bob.id,
            card_number="4242424242424242",
            exp_month=12,
            exp_year=2030,
            cvc="123"
        )
        print(f"    → Paiement effectué (en attente d'expédition)")

    except Exception as e:
        print(f"  ✗ Erreur: {e}")

    # Panier en cours pour Charlie (pas encore commandé)
    charlie = clients[2]
    veste = products[4]  # Veste en Jean
    echarpe = products[7]  # Écharpe Laine

    context.cart_service.add_to_cart(charlie.id, veste.id, 1)
    context.cart_service.add_to_cart(charlie.id, echarpe.id, 1)
    print(f"  ✓ Panier créé pour {charlie.first_name} (non commandé)")

    # =========================
    # ===== SUPPORT CLIENT =====
    # =========================

    print("\n💬 Création de fils de discussion support...")

    # Thread de Alice (résolu)
    thread_alice = context.customer_service.open_thread(
        user_id=alice.id,
        subject="Question sur la taille",
        order_id=order_alice.id
    )
    context.customer_service.post_message(
        thread_id=thread_alice.id,
        author_user_id=alice.id,
        body="Bonjour, je voudrais savoir si le t-shirt blanc taille grand ou petit ?"
    )
    context.customer_service.post_message(
        thread_id=thread_alice.id,
        author_user_id=None,  # Support
        body="Bonjour Alice, le t-shirt blanc taille normalement. Nous vous conseillons de prendre votre taille habituelle. N'hésitez pas si vous avez d'autres questions !"
    )
    context.customer_service.close_thread(thread_alice.id, admin.id)
    print(f"  ✓ Thread résolu pour {alice.first_name}")

    # Thread de Bob (en cours)
    thread_bob = context.customer_service.open_thread(
        user_id=bob.id,
        subject="Délai de livraison ?",
        order_id=order_bob.id
    )
    context.customer_service.post_message(
        thread_id=thread_bob.id,
        author_user_id=bob.id,
        body="Bonjour, quand ma commande sera-t-elle expédiée ?"
    )
    print(f"  ✓ Thread ouvert pour {bob.first_name} (en attente de réponse)")

    # =========================
    # ===== RÉSUMÉ =====
    # =========================

    print("\n" + "="*60)
    print("✅ Seed terminé avec succès !")
    print("="*60)
    print(f"\n📊 Résumé des données créées:")
    print(f"  • Utilisateurs: {len(context.users_repo._by_id)} (1 admin, {len(clients)} clients)")
    print(f"  • Produits: {len(context.products_repo._by_id)}")
    print(f"  • Commandes: {len(context.orders_repo._by_id)}")
    print(f"  • Threads support: {len(context.threads_repo._by_id)}")

    print(f"\n🔑 Comptes de test:")
    print(f"  Admin: admin@example.com / admin123")
    print(f"  Client 1: alice@example.com / password123")
    print(f"  Client 2: bob@example.com / password123")
    print(f"  Client 3: charlie@example.com / password123")

    print(f"\n🌐 API disponible sur: http://localhost:8000")
    print(f"📚 Documentation: http://localhost:8000/docs")
    print("="*60 + "\n")


if __name__ == "__main__":
    """
    Point d'entrée pour exécuter le seed directement.
    """

    # Import du contexte de l'application
    from main import app_context

    # Exécution du seed
    seed_data(app_context)

    print("Pour démarrer le serveur, exécutez:")
    print("  python main.py")
    print("ou")
    print("  uvicorn main:app --reload")
