"""
Router pour le support client.
Endpoints: créer un fil de discussion, poster un message, voir les fils.
"""

from fastapi import APIRouter, Depends, HTTPException

# Import depuis le module parent
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from schemas import (
    CreateThreadRequest, PostMessageRequest,
    ThreadResponse, ThreadListResponse, MessageResponse
)


router = APIRouter()


# =========================
# ===== CRÉER UN FIL DE DISCUSSION =====
# =========================

@router.post("/threads", response_model=ThreadResponse, status_code=201)
async def create_thread(
    request: dict,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Crée un nouveau fil de discussion avec le support.

    Args:
        request: Contient le sujet, le message initial et optionnellement l'ID de commande

    Returns:
        Le fil de discussion créé avec le message initial
    """
    try:
        print(f"DEBUG: Création de thread - request reçu: {request}")

        # Extraire et valider les données
        subject = request.get('subject', '').strip()
        initial_message = request.get('initial_message', '').strip()
        order_id = request.get('order_id')

        if not subject or len(subject) < 3:
            raise HTTPException(status_code=400, detail="Le sujet doit contenir au moins 3 caractères")

        if not initial_message or len(initial_message) < 1:
            raise HTTPException(status_code=400, detail="Le message ne peut pas être vide")

        # Vérifier que la commande existe et appartient à l'utilisateur si spécifiée
        if order_id:
            order = context.orders_repo.get(order_id)
            if not order:
                raise HTTPException(status_code=404, detail="Commande introuvable")
            if order.user_id != user_id:
                raise HTTPException(status_code=403, detail="Cette commande ne vous appartient pas")

        # Créer le fil
        print(f"DEBUG: Création du thread avec user_id={user_id}, subject={subject}, order_id={order_id}")
        thread = context.customer_service.open_thread(
            user_id=user_id,
            subject=subject,
            order_id=order_id
        )
        print(f"DEBUG: Thread créé avec id={thread.id}")

        # Ajouter le message initial
        print(f"DEBUG: Ajout du message initial: {initial_message}")
        context.customer_service.post_message(
            thread_id=thread.id,
            author_user_id=user_id,
            body=initial_message
        )
        print(f"DEBUG: Message ajouté, conversion en response...")

        response = ThreadResponse.from_thread(thread, context.users_repo)
        print(f"DEBUG: Conversion réussie, retour de la response")
        return response
    except ValueError as e:
        print(f"DEBUG ERROR ValueError: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG ERROR Exception: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== VOIR MES FILS DE DISCUSSION =====
# =========================

@router.get("/threads", response_model=ThreadListResponse)
async def get_my_threads(
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère tous les fils de discussion de l'utilisateur connecté.

    Retourne la liste de tous les fils avec leurs messages.
    """
    try:
        print(f"DEBUG: Récupération des threads pour user_id={user_id}")
        threads = context.threads_repo.list_by_user(user_id)
        print(f"DEBUG: {len(threads)} thread(s) trouvé(s)")

        thread_responses = []
        for i, thread in enumerate(threads):
            print(f"DEBUG: Conversion du thread {i+1}/{len(threads)}: id={thread.id}")
            try:
                thread_response = ThreadResponse.from_thread(thread, context.users_repo)
                thread_responses.append(thread_response)
            except Exception as e:
                print(f"DEBUG ERROR: Erreur lors de la conversion du thread {thread.id}: {e}")
                import traceback
                traceback.print_exc()
                raise

        print(f"DEBUG: Conversion réussie de tous les threads")
        return ThreadListResponse(threads=thread_responses)
    except Exception as e:
        print(f"DEBUG ERROR get_my_threads: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== DÉTAIL D'UN FIL =====
# =========================

@router.get("/threads/{thread_id}", response_model=ThreadResponse)
async def get_thread(
    thread_id: str,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Récupère les détails d'un fil de discussion spécifique.

    Args:
        thread_id: Identifiant du fil de discussion

    Returns:
        Le fil avec tous ses messages

    Raises:
        403: Si le fil n'appartient pas à l'utilisateur (sauf pour les admins)
        404: Si le fil n'existe pas
    """
    try:
        thread = context.threads_repo.get(thread_id)

        if not thread:
            raise HTTPException(status_code=404, detail="Fil de discussion introuvable")

        # Vérifier si l'utilisateur est admin
        user = context.users_repo.get(user_id)
        is_admin = user and user.is_admin

        # Autoriser l'accès si c'est l'utilisateur propriétaire ou un admin
        if thread.user_id != user_id and not is_admin:
            raise HTTPException(status_code=403, detail="Accès non autorisé à ce fil")

        return ThreadResponse.from_thread(thread, context.users_repo)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ===== POSTER UN MESSAGE =====
# =========================

@router.post("/threads/{thread_id}/messages", response_model=ThreadResponse)
async def post_message(
    thread_id: str,
    request: PostMessageRequest,
    user_id: str = Depends(__import__('dependencies').get_current_user_id),
    context=Depends(__import__('dependencies').get_context)
):
    """
    Ajoute un message à un fil de discussion existant.

    Args:
        thread_id: Identifiant du fil de discussion
        request: Contient le corps du message

    Returns:
        Le fil mis à jour avec le nouveau message

    Raises:
        400: Si le fil est fermé
        403: Si le fil n'appartient pas à l'utilisateur
        404: Si le fil n'existe pas
    """
    try:
        thread = context.threads_repo.get(thread_id)

        if not thread:
            raise HTTPException(status_code=404, detail="Fil de discussion introuvable")

        if thread.user_id != user_id:
            raise HTTPException(status_code=403, detail="Accès non autorisé à ce fil")

        if thread.closed:
            raise HTTPException(status_code=400, detail="Ce fil de discussion est fermé")

        # Ajouter le message
        context.customer_service.post_message(
            thread_id=thread_id,
            author_user_id=user_id,
            body=request.body
        )

        return ThreadResponse.from_thread(thread, context.users_repo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
