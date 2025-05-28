from sqlalchemy.orm import Session
from app import models, schemas
from app.auth import get_password_hash, verify_password
from app import token as token_module 
# ----------------------------
# CRUD para productos
# ----------------------------
def get_user_by_token(db: Session, token_str: str, credentials_exception):
    try:
        payload = token_module.decode_token(token_str)
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    user = get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, updated_data: schemas.ProductCreate):
    product = get_product(db, product_id)
    if product:
        product.name = updated_data.name
        product.price = updated_data.price
        product.description = updated_data.description
        db.commit()
        db.refresh(product)
    return product

def delete_product(db: Session, product_id: int):
    product = get_product(db, product_id)
    if product:
        db.delete(product)
        db.commit()
    return product

# ----------------------------
# CRUD para usuarios
# ----------------------------

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        password=hashed,
        role=user.role  # 👈 Nuevo
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.password):
        return None
    return user