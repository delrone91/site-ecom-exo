"""
Dépendances FastAPI pour l'injection dans les routes.
Sépare les dépendances pour éviter les importations circulaires.
"""

from fastapi import Depends, HTTPException, Header
from typing import Optional


def get_context():
    """
    Dependency pour injecter le contexte de l'application.
    Import lazy pour éviter les importations circulaires.
    """
    from main import app_context
    return app_context


def get_current_user_id(
    context = Depends(get_context),
    authorization: Optional[str] = Header(None, alias="Authorization")
) -> str:
    """
    Extrait et valide le token d'authentification.
    Format attendu: "Bearer <token>"
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Token manquant")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Format de token invalide")

    token = parts[1]
    user_id = context.sessions_manager.get_user_id(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

    return user_id


def get_current_admin_user_id(
    user_id: str = Depends(get_current_user_id),
    context = Depends(get_context)
) -> str:
    """
    Vérifie que l'utilisateur connecté est un administrateur.
    """
    user = context.users_repo.get(user_id)
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Droits administrateur requis")

    return user_id
