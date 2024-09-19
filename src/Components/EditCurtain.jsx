import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditCurtainMutation, useFetchCurtainsQuery } from '../Store/Api/CurtSlice';

function EditCurtain() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: allcurtains = [] } = useFetchCurtainsQuery();
  const curtain = allcurtains.find(c => c.id === id);
  console.log(curtain) // Ensure comparison is done correctly

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [updateCurtain] = useEditCurtainMutation();

  useEffect(() => {
    if (curtain) {
      // Set the fields with the curtain details when available
      setName(curtain.name || ''); // Default to empty string if undefined
      setPrice(curtain.price || ''); // Default to empty string if undefined
      setMaterial(curtain.material || ''); // Default to empty string if undefined
      setImage(curtain.image || ''); // Default to empty string if undefined
      setDescription(curtain.description || '');
      setSize(curtain.size || '') 
      setColor(curtain.color || '')// Default to empty string if undefined
    } else {
      // If curtain is not found, redirect
      navigate('/admin');
    }
  }, [curtain, navigate]); // Dependency on curtain and navigate

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image to the file's URL
      };
      reader.readAsDataURL(file); // Convert the file to a base64 URL
    }
  };

  const handleUpdate = async () => {
    if (curtain) {
      await updateCurtain({ id, name, price, material, image, description, size, color }).unwrap();
      navigate('/admin/AdminCurtainsPage');
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Curtain</h1>
      <div className="w-1/2 flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Curtain Name"
          className="p-2 border-2 border-gray-300 rounded-md"
        />
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price"
          className="p-2 border-2 border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={material}
          onChange={e => setMaterial(e.target.value)}
          placeholder="Material"
          className="p-2 border-2 border-gray-300 rounded-md"
        />
          <input
          type="number"
          value={size}
          onChange={e => setSize(e.target.value)}
          placeholder="size"
          
          className="p-2 border-2 border-gray-300 rounded-md"
        />
          <input
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
          placeholder="color"
          
          className="p-2 border-2 border-gray-300 rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 border-2 border-gray-300 rounded-md"
        />
        {image && (
          <img
            src={image}
            alt="Selected"
            className="w-16 h-16 object-cover mt-2" // Display image in smaller size
          />
        )}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          className="p-2 border-2 border-gray-300 rounded-md"
        />
        <button
          onClick={handleUpdate}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
        >
          Update Curtain
        </button>
      </div>
    </div>
  );
}

export default EditCurtain;
