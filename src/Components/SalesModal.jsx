import React, { useState } from 'react';
import { useAddSaleMutation } from '../Store/Api/salesSlice'; // Import mutation hook
import { useAddProfitMutation } from '../Store/Api/profitSlice';
import { useAddLossMutation } from '../Store/Api/lossesSlice';
import { formatDistanceToNow } from 'date-fns'; // For time formatting
import { getAuth } from 'firebase/auth';
function SalesModal({ isOpen, onClose, product }) {
  const [size, setSize] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  


  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userEmail = currentUser ? currentUser.email : null;
  // Get the mutation hook for adding a sale
  const [addSale, { isLoading, isError, isSuccess }] = useAddSaleMutation();
const [addProfit] = useAddProfitMutation()
const [addLoss] =useAddLossMutation()



  const handleSubmitSale = async () => {
    // Get the current time when the sale is being submitted
    const currentDate = new Date();
    
    // Prepare sale details
    const saleDetails = {
      productId: product.id,
      name: product.name,
      size,
      sellingPrice,
      email:userEmail,
      price: product.price,
      material: product.material,
      timeCreated: currentDate.toISOString(), // Exact timestamp in ISO format
      timeAgo: formatDistanceToNow(currentDate, { addSuffix: true }) // "3 minutes ago"
    };
const profit = saleDetails.sellingPrice - saleDetails.price
    console.log("profit",  profit);

    if (profit > 0) {
      await addProfit({
        id:saleDetails.id,
        profit,
        email:userEmail, // For reference, you can include any necessary metadata
      });
    } 
    // If profit is negative, add to losses slice
    else if (profit < 0) {
      await addLoss({
        id:saleDetails.id,
        loss: Math.abs(profit), // Store the absolute value of the loss
        email:userEmail, // For reference
      });
    }

    try {
      // Call the mutation to add the sale
      await addSale(saleDetails).unwrap();
      console.log('Sale submitted successfully:', saleDetails);
      
      // Reset input fields after successful submission
      setSize('');
      setSellingPrice('');
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Failed to submit sale:', error);
      // Handle error (optional: display an error message to the user)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-1/3">
        <h2 className="text-lg font-bold mb-2">Product Details</h2>
        <img src={product.image} alt={product.name} className="object-cover h-40 w-full mb-2" />
        <h1 className="font-bold text-xl">Name: {product.name}</h1>
        <h1>Price: ${product.price}</h1>
        <h1>Material: {product.material}</h1>

        {/* Input for Size */}
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

        {/* Input for Selling Price */}
        <div className="mt-4">
          <label htmlFor="sellingPrice" className="block mb-1">Selling Price:</label>
          <input
            type="number"
            id="sellingPrice"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="border rounded-md p-2 w-full"
            placeholder="Enter selling price"
          />
        </div>

        {/* Modal Actions */}
        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-500 text-white rounded-md px-4 py-2 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2"
            onClick={handleSubmitSale}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Submitting...' : 'Submit Sale'}
          </button>
        </div>

        {/* Display error message if any */}
        {isError && <p className="text-red-500 mt-2">Failed to submit sale. Please try again.</p>}
      </div>
    </div>
  );
}

export default SalesModal;
