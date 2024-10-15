import React, { useState } from 'react';
import { setDoc, doc, Timestamp, arrayUnion, collection, addDoc, getDoc } from 'firebase/firestore';
import { auth, db } from "../firebase-config"; // Make sure to import your Firebase config

function CategoriesModal({ isOpen, onClose, product, onAddToCart }) {
  const [size, setSize] = useState(''); // State for size
  const [sellingPrice, setSellingPrice] = useState(''); // State for selling price
  const [notification, setNotification] = useState(''); // State for notification

  // Function to handle adding the sale to Firestore
  const handleAddToCart = async () => {
    const currentUser = auth.currentUser; // Get the current user

    if (!size) {
      alert('Size is required'); // Alert if size is not entered
      return;
    }

    if (currentUser) {
      // Calculate the final selling price and buying price based on size
      const calculatedSellingPrice = parseFloat(size) * (sellingPrice ? parseFloat(sellingPrice) : product.sellingPrice);
      const calculatedBuyingPrice = parseFloat(size) * product.buyingPrice;

      const saleData = {
        productId: product.id, // Store the product ID
        name: currentUser.displayName, // Logged-in user's display name
        productName: product.name,
        material: product.material,
        imageUrl: product.imageUrl,
        size: size, // Use the input size
        sellingPrice: calculatedSellingPrice, // Use the calculated selling price
        buyingPrice: calculatedBuyingPrice, // Use the calculated buying price
        timestamp: Timestamp.now(), // Timestamp for when the sale was made
        saleId: Timestamp.now().toMillis() // Unique sale ID to differentiate entries
      };

      // Calculate profit or loss
      const profitOrLoss = calculatedSellingPrice - calculatedBuyingPrice;

      try {
        // Fetch the current product size from Firestore
        const productDocRef = doc(db, 'curtains', product.id); // Adjust collection name if needed
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          const currentProductData = productDoc.data();
          const currentSize = currentProductData.size || 0; // Get current size, default to 0 if not found

          // Check if the entered size exceeds the available size
          if (parseFloat(size) > currentSize) {
            setNotification(`The entered size exceeds available stock. Please enter a value less than or equal to ${currentSize} meters.`);
            return;
          }

          // Calculate new size after sale
          const newSize = currentSize - parseFloat(size);

          // Update the product size in Firestore
          await setDoc(productDocRef, { size: newSize }, { merge: true });

          // Add sale data to the sales collection with an auto-generated ID
          const salesCollectionRef = collection(db, 'sales');
          await addDoc(salesCollectionRef, {
            ...saleData, // Spread existing sale data
            profitOrLoss // Add profit or loss to the sale data
          });

          // Clear inputs and close modal
          setSize('');
          setSellingPrice('');
          setNotification(''); // Clear notification
          onClose();
        } else {
          console.error('Product does not exist in Firestore.');
        }
      } catch (error) {
        console.error('Error adding sale: ', error);
      }
    } else {
      console.error('No user is currently logged in.');
    }
  };

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-full sm:w-3/4 md:w-1/3 lg:w-1/3"> 
        {/* Adjusted width for responsiveness */}
        <h2 className="text-lg font-bold mb-2">Product Details</h2>
        <img src={product.imageUrl} alt={product.name} className="object-cover h-40 w-full mb-2" />
        <h1 className="font-bold text-xl">Name: {product.name}</h1>
        <h1>Price: Ksh {product.sellingPrice}</h1>
        <h1>Material: {product.material}</h1>
        
        {/* Notification Message */}
        {notification && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {notification}
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="size" className="block mb-1">Enter Size (meters):</label>
          <input
            type="number"
            id="size" // Unique ID for the size input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border rounded-md p-2 w-full"
            placeholder="Size in meters"
            required // Making the input required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="sellingPrice" className="block mb-1">Enter Selling Price:</label>
          <input
            type="number"
            id="sellingPrice" // Unique ID for the selling price input
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="border rounded-md p-2 w-full"
            placeholder="Selling Price"
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
            Sell Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoriesModal;
