"""
Application FastAPI principale pour le site e-commerce.
Configure l'application, les middlewares, la gestion d'erreurs et les routes.
"""

from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from typing import Optional
import uvicorn
import os

# Import des modèles et services
from models import (
    UserRepository, ProductRepository, CartRepository, OrderRepository,
    InvoiceRepository, PaymentRepository, ThreadRepository,
    SessionManager, AuthService, CatalogService, CartService,
    BillingService, DeliveryService, PaymentGateway, OrderService,
    CustomerService
)

# Import des routers
from routers import auth, catalog, cart, orders, support, admin


# =========================
# ===== INITIALISATION DES SERVICES =====
# =========================

# Création des repositories (singletons en mémoire)
users_repo = UserRepository()
products_repo = ProductRepository()
carts_repo = CartRepository()
orders_repo = OrderRepository()
invoices_repo = InvoiceRepository()
payments_repo = PaymentRepository()
threads_repo = ThreadRepository()
sessions_manager = SessionManager()

# Création des services
auth_service = AuthService(users_repo, sessions_manager)
catalog_service = CatalogService(products_repo)
cart_service = CartService(carts_repo, products_repo)
billing_service = BillingService(invoices_repo)
delivery_service = DeliveryService()
payment_gateway = PaymentGateway()
order_service = OrderService(
    orders_repo, products_repo, carts_repo, payments_repo,
    invoices_repo, billing_service, delivery_service,
    payment_gateway, users_repo
)
customer_service = CustomerService(threads_repo, users_repo)


# =========================
# ===== CONTENEUR DE DÉPENDANCES =====
# =========================

class AppContext:
    """Conteneur pour tous les services de l'application."""
    def __init__(self):
        self.users_repo = users_repo
        self.products_repo = products_repo
        self.carts_repo = carts_repo
        self.orders_repo = orders_repo
        self.invoices_repo = invoices_repo
        self.payments_repo = payments_repo
        self.threads_repo = threads_repo
        self.sessions_manager = sessions_manager
        self.auth_service = auth_service
        self.catalog_service = catalog_service
        self.cart_service = cart_service
        self.billing_service = billing_service
        self.delivery_service = delivery_service
        self.payment_gateway = payment_gateway
        self.order_service = order_service
        self.customer_service = customer_service


app_context = AppContext()

# Note: get_context() et les autres dépendances d'authentification
# sont définies dans dependencies.py pour éviter les importations circulaires


# =========================
# ===== APPLICATION FASTAPI =====
# =========================

app = FastAPI(
    title="API E-Commerce",
    description="API complète pour un site e-commerce avec gestion des commandes, paiements et support client",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# =========================
# ===== CONFIGURATION CORS =====
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend React (Vite par défaut)
        "http://localhost:5173",  # Frontend React (Vite alternatif)
        "http://localhost:4173",  # Frontend React (Vite preview)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ===== GESTION D'ERREURS =====
# =========================

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Gestion des erreurs de validation métier."""
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )


@app.exception_handler(PermissionError)
async def permission_error_handler(request: Request, exc: PermissionError):
    """Gestion des erreurs de permission."""
    return JSONResponse(
        status_code=403,
        content={"detail": str(exc)}
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Gestion des exceptions HTTP."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Gestion des erreurs génériques."""
    print(f"Erreur non gérée: {exc}")  # Log l'erreur
    return JSONResponse(
        status_code=500,
        content={"detail": "Erreur interne du serveur"}
    )


# =========================
# ===== ROUTES PRINCIPALES =====
# =========================

@app.get("/")
async def root():
    """Route racine - informations sur l'API."""
    return {
        "message": "API E-Commerce",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Endpoint de vérification de santé."""
    return {"status": "healthy"}


# =========================
# ===== INCLUSION DES ROUTERS =====
# =========================

# Authentification
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentification"]
)

# Catalogue
app.include_router(
    catalog.router,
    prefix="/api/catalog",
    tags=["Catalogue"]
)

# Panier
app.include_router(
    cart.router,
    prefix="/api/cart",
    tags=["Panier"]
)

# Commandes
app.include_router(
    orders.router,
    prefix="/api/orders",
    tags=["Commandes"]
)

# Support client
app.include_router(
    support.router,
    prefix="/api/support",
    tags=["Support Client"]
)

# Administration
app.include_router(
    admin.router,
    prefix="/api/admin",
    tags=["Administration"]
)

# Servir les images uploadées
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=uploads_dir), name="uploads")


# =========================
# ===== CHARGEMENT DES DONNÉES =====
# =========================

# Charger automatiquement les données de test au démarrage
try:
    from seed import seed_data
    seed_data(app_context)
    print("\n✅ Données de test chargées avec succès!\n")
except Exception as e:
    print(f"\n⚠️ Erreur lors du chargement des données: {e}\n")


# =========================
# ===== DÉMARRAGE DU SERVEUR =====
# =========================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
