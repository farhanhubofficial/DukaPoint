import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../Store/Api/CartSlice';


function SubproductsPage() {
  const [subproducts, setSubproducts] = useState([]);



const dispatch = useDispatch()
  const handleAddToCart = (subproduct) => {
    dispatch(addItemToCart(subproduct));
  };
  


  const { productId } = useParams();
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubproducts = async () => {
      try {
        const response = await fetch(`http://localhost:3002/TotalCurtains`);
        if (!response.ok) {
          throw new Error('Failed to fetch subproducts');
        }
        const data = await response.json();

        // Find the main product by ID
        const product = data.find((curtain) => curtain.id === productId);

        // Set subproducts or show a message if there are none
        if (product && product.subproducts) {
          setSubproducts(product.subproducts);
        } else {
          setSubproducts([]); // Ensures subproducts state is empty if none found
        }
      } catch (error) {
        console.error('Error fetching subproducts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubproducts();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!subproducts || subproducts.length === 0) {
    return <div className="flex justify-center font-bold text-2xl  text-gray-600 mt-10 h-96 items-center">No subproducts found for this product <span className='text-red-800 font-bold text-3xl'>!</span>.</div>;
  }

  return (
    <div>
      <h1>Subproducts for Product {productId}</h1>
      <div className="grid grid-cols-3 gap-4">
        {subproducts.map((subproduct) => (
          <div key={subproduct.id} className="border p-4">
            <img
              src={subproduct.image}
              alt={subproduct.name}
              className="object-cover h-40 w-full mb-2"
            />
            <h2 className="font-bold">{subproduct.name}</h2>
            <p>Price: ksh {subproduct.price}</p>
            <p>Material: {subproduct.material}</p>
            <p>Color: {subproduct.color}</p>
            <p>Size: {subproduct.size}</p>
            <button
          className="mt-1 bg-slate-800 text-white h-10 w-40 rounded-lg"
          onClick={()=>handleAddToCart(subproduct)}
        >
          Add To Cart
        </button>          </div>
        ))}
      </div>
    </div>
  );
}

export default SubproductsPage;
