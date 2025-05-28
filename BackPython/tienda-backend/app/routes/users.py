from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas
from app.models import User
from app.database import get_db
from app.utils import verify_password, create_access_token

router = APIRouter(
    prefix="/users",
    tags=["Usuarios"]
)

# ---------------------------------
# Registrar usuario
# ---------------------------------

@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    return crud.create_user(db, user)

# ---------------------------------
# Iniciar sesión
# ---------------------------------

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = create_access_token(data={"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "is_admin": user.is_admin  # 👈 ASEGÚRATE DE ENVIAR ESTO
    }