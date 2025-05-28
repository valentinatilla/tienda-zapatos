from pydantic import BaseModel
from typing import Optional

# ------------------------------
# Esquemas para productos
# ------------------------------

class ProductBase(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    stock: int
    image: Optional[str] = None  # ← Para mostrar la imagen en base64

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

# ------------------------------
# Esquemas para usuarios
# ------------------------------

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    is_admin: bool = False

class User(UserBase):
    id: int
    is_admin: bool

    class Config:
        orm_mode = True