import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase-config'; // Make sure to import your Firebase config

function AdminCurtainTilePage({ product }) {
  const navigate = useNavigate();

  // Navigate to detailed product view on image click
  const handleImageClick = () => {
    navigate(`/subproducts/${product.id}`);
  };

  // Handle delete operation from Firestore
  const handleDelete = async (id) => {
    try {
      // Reference to the document in Firestore
      const curtainRef = doc(db, "curtains", id);
      await deleteDoc(curtainRef); // Call deleteDoc to remove the curtain
      console.log(`Curtain with ID ${id} has been deleted`);
    } catch (error) {
      console.error('Failed to delete curtain: ', error); // Log error if delete fails
    }
  };

  // Navigate to edit page for curtain
  const handleEdit = () => {
    navigate(`/admin/editcurtain/${product.id}`); // Navigate to edit page with product ID
  };

  return (
    <div className="group flex flex-col items-center border-2 border-red-900 gap-3 h-[371px] mt-10 ml-5 rounded-xl">
      <div className="h-[180px]">
        {/* Curtain Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover h-60 w-72 cursor-pointer"
          onClick={handleImageClick}
        />
        {/* Curtain Details */}
        <h1 className="font-bold text-xl lg:text-sm">Name: {product.name}</h1>
        <h1>Price: ksh {product.price}</h1>
        <h1>Material: {product.material}</h1>
        <h1>Available Quantity: <span className="font-bold">{product.size} Mtrs</span></h1>

        {/* Delete and Edit Buttons */}
        <div className="flex justify-between w-full mt-3 px-4">
          <MdDelete
            className="text-red-600 hover:text-red-800 cursor-pointer text-2xl"
            onClick={() => handleDelete(product.id)} // Pass the product ID to handleDelete
          />
          <CiEdit
            className="text-blue-600 hover:text-blue-800 cursor-pointer text-2xl"
            onClick={handleEdit} // Handle edit by navigating to edit page
          />
        </div>
      </div>
    </div>
  );
}

export default AdminCurtainTilePage;
