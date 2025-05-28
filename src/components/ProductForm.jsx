import { useState } from "react";

function ProductForm({ token, onProductCreated }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:8000/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || JSON.stringify(data));
      } else {
        alert("✅ Product created!");
        onProductCreated(data); // opcional: notifica al padre
        // Reset form
        setName("");
        setPrice("");
        setDescription("");
        setStock("");
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      alert("Network error");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create product</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <input type="file" onChange={handleImageChange} />
      {preview && (
        <div>
          <p>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "150px", marginBottom: "1rem" }}
          />
        </div>
      )}

      <button type="submit">Create</button>
    </form>
  );
}

export default ProductForm;