import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../Store/Api/CartSlice';
import Modal from './Modal'; // Import the Modal component
import CategoriesModal from './CategoriesModal';

function AddminCurtainTile({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    setIsModalOpen(true); // Open modal when Add to Cart is clicked
  };

  const handleImageClick = () => {
    navigate(`/subproducts/${product.id}`);
  };

  const handleAddToCartWithSize = (item) => {
    dispatch(addItemToCart(item)); // Dispatch the action with size
  };

  return (
    <div className=" flex flex-col items-center border-2 border-red-900 gap-3 h-[364px] mt-10 ml-5 rounded-xl">
      <div className="h-[180px]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover h-60 w-72 cursor-pointer"
          onClick={handleImageClick}
        />
        <h1 className="font-bold text-xl lg:text-sm">Name: {product.name}</h1>
        <h1>Price: Ksh {product.sellingPrice}</h1>
        <h1>Material: {product.material}</h1>
        <button
          className="mt-1 bg-green-600 text-white h-10 w-40 rounded-lg"
          onClick={handleAddToCart}
        >
          Sale
        </button>
      </div>

      {/* Modal Component */}
      <CategoriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onAddToCart={handleAddToCartWithSize}
      />
    </div>
  );
}

export default AddminCurtainTile;
