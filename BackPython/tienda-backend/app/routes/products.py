from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import models, schemas
from app.dependencies import get_db, get_current_user
import base64

router = APIRouter()

@router.post("/products/", response_model=schemas.Product)
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    description: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear productos")

    image_data = None
    if image:
        image_bytes = await image.read()
        image_data = base64.b64encode(image_bytes).decode("utf-8")

    db_product = models.Product(
        name=name,
        price=price,
        description=description,
        stock=stock,
        image=image_data
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products/", response_model=list[schemas.Product])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, updated: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden editar productos")

    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    product.name = updated.name
    product.price = updated.price
    product.description = updated.description
    product.stock = updated.stock
    product.image = updated.image
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden eliminar productos")

    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(product)
    db.commit()
    return