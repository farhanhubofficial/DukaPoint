import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useDeleteCurtainMutation } from '../Store/Api/CurtSlice';

function AdminCurtainTilePage({ product }) {
  const navigate = useNavigate();
  const [deleteCurtain] = useDeleteCurtainMutation();

  const handleImageClick = () => {
    navigate(`/subproducts/${product.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCurtain(id).unwrap(); // Call the delete mutation and unwrap the promise
      // Optionally, you can add logic to refresh the list or show a success message
    } catch (error) {
      console.error('Failed to delete curtain: ', error); // Handle the error
    }
  };

  const handleEdit = () => {
    navigate(`/editcurtain/${product.id}`);
  };

  return (
    <div className="group flex flex-col items-center border-2 border-red-900 gap-3 h-[371px] mt-10 ml-5 rounded-xl">
      <div className="h-[180px]">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover h-60 w-72 cursor-pointer"
          onClick={handleImageClick}
        />
        <h1 className="font-bold text-xl lg:text-sm">Name: {product.name}</h1>
        <h1>Price: ksh {product.price}</h1>
        <h1>Material: {product.material}</h1>
        <h1 > Available Quantity: <span className='font-bold'>{product.size} Mtrs</span> </h1>
        
        <div className="flex justify-between w-full mt-3 px-4">
          <MdDelete
            className="text-red-600 hover:text-red-800 cursor-pointer text-2xl"
            onClick={() => handleDelete(product.id)} // Pass the product ID to handleDelete
          />
          <CiEdit
            className="text-blue-600 hover:text-blue-800 cursor-pointer text-2xl"
            onClick={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminCurtainTilePage;
