"""
Script pour vérifier les utilisateurs existants dans la base de données
"""
from main import app_context

print("=== Vérification des utilisateurs ===\n")

users_repo = app_context.users_repo

# Récupérer tous les utilisateurs
print("📋 Liste des utilisateurs enregistrés :")
print("-" * 60)

# Vérifier si des utilisateurs existent
if not users_repo._by_email:
    print("❌ AUCUN UTILISATEUR TROUVÉ !")
    print("\n⚠️ Vous devez exécuter : python seed.py")
else:
    for email, user in users_repo._by_email.items():
        print(f"📧 Email: {user.email}")
        print(f"   👤 Nom: {user.first_name} {user.last_name}")
        print(f"   🔑 Admin: {'Oui' if user.is_admin else 'Non'}")
        print(f"   🆔 ID: {user.id}")
        print("-" * 60)

    print(f"\n✅ Total: {len(users_repo._by_email)} utilisateur(s)")

    # Vérifier spécifiquement l'admin
    admin = users_repo.get_by_email("admin@example.com")
    if admin:
        print("\n✅ Admin trouvé: admin@example.com")
    else:
        print("\n❌ Admin NON trouvé avec l'email: admin@example.com")
