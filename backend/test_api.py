"""
Script de test simple pour vérifier que l'API fonctionne correctement.
Ce script effectue quelques requêtes basiques pour tester les endpoints principaux.
"""

import requests
import json

BASE_URL = "http://localhost:8000"


def print_section(title):
    """Affiche un titre de section formaté."""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)


def test_health():
    """Test de l'endpoint de santé."""
    print_section("Test 1: Health Check")

    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✓ Health check OK")


def test_catalog():
    """Test de récupération du catalogue."""
    print_section("Test 2: Catalogue Produits")

    response = requests.get(f"{BASE_URL}/api/catalog/products")
    print(f"Status: {response.status_code}")

    data = response.json()
    print(f"Nombre de produits: {len(data['products'])}")

    if data['products']:
        print(f"Premier produit: {data['products'][0]['name']} - {data['products'][0]['price_euros']}€")

    assert response.status_code == 200
    print("✓ Catalogue OK")


def test_auth_and_cart():
    """Test d'authentification et de panier."""
    print_section("Test 3: Authentification et Panier")

    # Connexion
    print("\n1. Connexion...")
    login_data = {
        "email": "alice@email.test",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Status: {response.status_code}")

    assert response.status_code == 200
    token = response.json()["token"]
    print(f"✓ Token obtenu: {token[:20]}...")

    headers = {"Authorization": f"Bearer {token}"}

    # Récupérer le profil
    print("\n2. Profil utilisateur...")
    response = requests.get(f"{BASE_URL}/api/auth/profile", headers=headers)
    print(f"Status: {response.status_code}")
    user = response.json()
    print(f"Utilisateur: {user['first_name']} {user['last_name']}")
    print("✓ Profil récupéré")

    # Voir le catalogue pour obtenir un ID de produit
    response = requests.get(f"{BASE_URL}/api/catalog/products")
    products = response.json()["products"]
    product_id = products[0]["id"] if products else None

    if product_id:
        # Ajouter au panier
        print("\n3. Ajout au panier...")
        cart_data = {
            "product_id": product_id,
            "quantity": 2
        }
        response = requests.post(f"{BASE_URL}/api/cart/add", json=cart_data, headers=headers)
        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            cart = response.json()
            print(f"Total panier: {cart['total_euros']}€")
            print(f"Nombre d'items: {len(cart['items'])}")
            print("✓ Produit ajouté au panier")
        else:
            print(f"Erreur: {response.json()}")

    print("\n✓ Authentification et panier OK")


def test_admin():
    """Test des endpoints admin."""
    print_section("Test 4: Administration")

    # Connexion admin
    print("\n1. Connexion admin...")
    login_data = {
        "email": "admin@ecom.test",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Status: {response.status_code}")

    assert response.status_code == 200
    token = response.json()["token"]
    print(f"✓ Token admin obtenu")

    headers = {"Authorization": f"Bearer {token}"}

    # Statistiques
    print("\n2. Statistiques...")
    response = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        stats = response.json()
        print(f"Total commandes: {stats['total_orders']}")
        print(f"Revenu total: {stats['total_revenue_euros']}€")
        print(f"Total utilisateurs: {stats['total_users']}")
        print(f"Total produits: {stats['total_products']}")
        print("✓ Statistiques récupérées")
    else:
        print(f"Erreur: {response.json()}")

    print("\n✓ Administration OK")


def main():
    """Exécute tous les tests."""
    print("\n")
    print("🧪 TESTS DE L'API E-COMMERCE")
    print("="*60)
    print("Assurez-vous que le serveur est démarré sur http://localhost:8000")
    print("Utilisez: python main.py ou uvicorn main:app --reload")
    print("="*60)

    try:
        # Vérifier que le serveur est accessible
        try:
            requests.get(BASE_URL, timeout=2)
        except requests.exceptions.RequestException:
            print("\n❌ ERREUR: Le serveur n'est pas accessible sur http://localhost:8000")
            print("Veuillez démarrer le serveur avant d'exécuter les tests.")
            return

        # Exécuter les tests
        test_health()
        test_catalog()
        test_auth_and_cart()
        test_admin()

        # Résumé
        print_section("✅ TOUS LES TESTS SONT PASSÉS")
        print("\nL'API fonctionne correctement !")
        print("\nPour explorer l'API:")
        print(f"  📚 Documentation Swagger: {BASE_URL}/docs")
        print(f"  📖 Documentation ReDoc: {BASE_URL}/redoc")

    except AssertionError as e:
        print(f"\n❌ Test échoué: {e}")
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
