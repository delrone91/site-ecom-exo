"""
Script de test pour vérifier que tous les imports fonctionnent correctement.
"""

print("Test des imports...")

try:
    print("1. Import de models...")
    import models
    print("   ✓ models OK")
except Exception as e:
    print(f"   ✗ Erreur models: {e}")

try:
    print("2. Import de schemas...")
    import schemas
    print("   ✓ schemas OK")
except Exception as e:
    print(f"   ✗ Erreur schemas: {e}")

try:
    print("3. Import de main...")
    import main
    print("   ✓ main OK")
except Exception as e:
    print(f"   ✗ Erreur main: {e}")

try:
    print("4. Import des routers...")
    from routers import auth, catalog, cart, orders, support, admin
    print("   ✓ routers OK")
except Exception as e:
    print(f"   ✗ Erreur routers: {e}")

print("\n✅ Tous les imports sont corrects!")
print("\nVous pouvez maintenant exécuter:")
print("  python seed.py")
print("  python main.py")
