// src/ProductForm.js
import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photoLink, setPhotoLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-container">
        <h1 className='text-green-600 text-4xl'>Success!</h1>
        <p>Product Name: {productName}</p>
        <p>Price: ${price}</p>
        <p>Quantity: {quantity}</p>
        {photoLink && <img src={photoLink} alt="Product" className="product-photo" />}
        <button onClick={() => setSubmitted(false)}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Enter Product Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photoLink">Photo Link</label>
          <input
            type="url"
            id="photoLink"
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
