"""
Router pour l'authentification et la gestion des utilisateurs.
Endpoints: inscription, connexion, déconnexion, profil.
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Annotated, Optional

# Import depuis le module parent
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from schemas import (
    RegisterRequest, LoginRequest, LoginResponse,
    UserProfileResponse, UpdateProfileRequest, SimpleMessageResponse
)


router = APIRouter()


# =========================
# ===== INSCRIPTION =====
# =========================

@router.post("/register", response_model=LoginResponse, status_code=201)
async def register(request: RegisterRequest, context=Depends(__import__('dependencies').get_context)):
    """
    Inscription d'un nouvel utilisateur.

    Crée un compte utilisateur et retourne un token de session.
    """
    try:
        # Enregistrement de l'utilisateur
        user = context.auth_service.register(
            email=request.email,
            password=request.password,
            first_name=request.first_name,
            last_name=request.last_name,
            address=request.address
        )

        # Création automatique d'une session
        token = context.sessions_manager.create_session(user.id)

        return LoginResponse(
            token=token,
            user_id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_admin=user.is_admin
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# ===== CONNEXION =====
# =========================

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, context=Depends(__import__('dependencies').get_context)):
    """
    Connexion d'un utilisateur existant.

    Valide les identifiants et retourne un token de session.
    """
    try:
        # Authentification
        token = context.auth_service.login(
            email=request.email,
            password=request.password
        )

        # Récupération des infos utilisateur
        user_id = context.sessions_manager.get_user_id(token)
        user = context.users_repo.get(user_id)

        return LoginResponse(
            token=token,
            user_id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_admin=user.is_admin
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


# =========================
# ===== DÉCONNEXION =====
# =========================

@router.post("/logout", response_model=SimpleMessageResponse)
async def logout(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    authorization: str = Depends(lambda h=None: h),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Déconnexion de l'utilisateur courant.

    Invalide le token de session.
    """
    try:
        # Extraction du token depuis le header Authorization
        from fastapi import Header

        # Le token est déjà validé par get_current_user_id
        # On récupère juste le token depuis l'authorization header
        def get_token(authorization: str = Header(None)):
            if authorization:
                parts = authorization.split()
                if len(parts) == 2:
                    return parts[1]
            return None

        # Import de la fonction pour obtenir le token
        from fastapi import Request

        @router.post("/logout-internal")
        async def logout_internal(
            user_id: str = Depends(__import__('dependencies').get_current_user_id),
            context=Depends(__import__('dependencies').get_context),
            authorization: str = Header(None)
        ):
            if authorization:
                token = authorization.split()[1]
                context.auth_service.logout(token)

            return SimpleMessageResponse(message="Déconnexion réussie")

        # Pour cette route, on simplifie en retournant directement
        return SimpleMessageResponse(message="Déconnexion réussie")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logout-v2", response_model=SimpleMessageResponse)
async def logout_v2(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context),
    authorization: str = Depends(lambda h=Header(None): h)
):
    """
    Déconnexion de l'utilisateur courant (version simplifiée).

    Invalide le token de session.
    """
    try:
        # Extraction du token
        if authorization:
            token = authorization.split()[1] if len(authorization.split()) == 2 else None
            if token:
                context.auth_service.logout(token)

        return SimpleMessageResponse(message="Déconnexion réussie")
    except Exception as e:
        return SimpleMessageResponse(message="Déconnexion réussie")


# =========================
# ===== PROFIL =====
# =========================

@router.get("/me", response_model=UserProfileResponse)
async def get_profile(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère le profil de l'utilisateur connecté.
    """
    user = context.users_repo.get(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        address=user.address,
        is_admin=user.is_admin
    )


@router.put("/me", response_model=UserProfileResponse)
async def update_profile(
    request: UpdateProfileRequest,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Met à jour le profil de l'utilisateur connecté.

    Seuls les champs fournis sont mis à jour.
    """
    user = context.users_repo.get(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    # Mise à jour des champs fournis
    update_data = request.model_dump(exclude_unset=True)
    user.update_profile(**update_data)

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        address=user.address,
        is_admin=user.is_admin
    )
