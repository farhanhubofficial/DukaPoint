import React, { useState } from 'react';

function Modal({ isOpen, onClose, product, onAddToCart }) {
  const [size, setSize] = useState('');

  const handleAddToCart = () => {
    onAddToCart({ ...product, size });
    setSize(''); // Reset size input
    onClose(); // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-full sm:w-3/4 md:w-1/3 lg:w-1/3"> {/* Adjusted width for responsiveness */}
        <h2 className="text-lg font-bold mb-2">Product Details</h2>
        <img src={product.imageUrl} alt={product.name} className="object-cover h-40 w-full mb-2" />
        <h1 className="font-bold text-xl">Name: {product.name}</h1>
        <h1>Price: Ksh {product.sellingPrice}</h1>
        <h1>Material: {product.material}</h1>
        
        <div className="mt-4">
          <label htmlFor="size" className="block mb-1">Enter Size (meters):</label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border rounded-md p-2 w-full"
            placeholder="Size in meters"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-500 text-white rounded-md px-4 py-2 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
