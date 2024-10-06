import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Import your Firebase config

function EditCurtain() {
  const { id } = useParams(); // Get the curtain ID from URL parameters
  const navigate = useNavigate(); // Navigation hook
  const [curtain, setCurtain] = useState(null); // State for the curtain to be edited

  // Individual state fields for the curtain properties
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  // Fetch curtain data from Firestore using the curtain ID
  useEffect(() => {
    const fetchCurtain = async () => {
      try {
        const curtainRef = doc(db, 'curtains', id);
        const curtainSnap = await getDoc(curtainRef);

        if (curtainSnap.exists()) {
          const foundCurtain = curtainSnap.data();
          setCurtain(foundCurtain);
          setName(foundCurtain.name || '');
          setPrice(foundCurtain.price || '');
          setMaterial(foundCurtain.material || '');
          setImage(foundCurtain.image || '');
          setDescription(foundCurtain.description || '');
          setSize(foundCurtain.size || '');
          setColor(foundCurtain.color || '');
        } else {
          console.log('Curtain not found, redirecting...'); // Debugging: log curtain not found
          navigate('/admin'); // Redirect if curtain not found
        }
      } catch (error) {
        console.error('Error fetching curtain: ', error); // Log any errors
      }
    };

    fetchCurtain();
  }, [id, navigate]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Convert the image file to base64 and set it
      };
      reader.readAsDataURL(file); // Read the image as data URL
    }
  };

  // Handle curtain update
  const handleUpdate = async () => {
    if (curtain) {
      console.log('Updating curtain with ID:', id); // Debugging: log the curtain update
      try {
        const curtainRef = doc(db, 'curtains', id); // Reference to the curtain document
        await updateDoc(curtainRef, {
          name,
          price,
          material,
          image,
          description,
          size,
          color,
        });
        navigate('/admin/AdminCurtainsPage'); // Navigate to Admin Curtains page after update
      } catch (error) {
        console.error('Error updating curtain: ', error); // Log any errors during update
      }
    }
  };

  // Prevent component rendering if the curtain is not set
  if (!curtain) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

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
          placeholder="Size"
          className="p-2 border-2 border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
          placeholder="Color"
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
            className="w-16 h-16 object-cover mt-2"
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
