from sqlalchemy.orm import Session
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Depends
from app.database import Base, engine, get_db
from app import models, schemas
from app.routes import users, products
from app import auth
from app.database import SessionLocal
from app.auth import get_password_hash
from app.utils import hash_password

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la Tienda API"}

def crear_usuario_admin():
    db = SessionLocal()
    usuario = db.query(models.User).filter(models.User.username == "admin").first()
    if not usuario:
        nuevo = models.User(
    username="admin",
    hashed_password=get_password_hash("admin")  
)
        db.add(nuevo)
        db.commit()
        print("✅ Usuario admin creado")
    else:
        print("⚠️ Ya existe un usuario admin")
        usuario.hashed_password = get_password_hash("admin")  
        db.commit()
        print("🔄 Contraseña del admin actualizada")
    db.close()

crear_usuario_admin()

# main.py o users.py
@app.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):  
    hashed_password = hash_password(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user