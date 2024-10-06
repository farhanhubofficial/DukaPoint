import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function Sales() {
  const [sales, setSales] = useState([]);

  // Fetch sales from Firestore on component mount
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesCollection = collection(db, 'sales');
        const salesSnapshot = await getDocs(salesCollection);
        const salesList = salesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSales(salesList);
      } catch (error) {
        console.error('Error fetching sales: ', error);
      }
    };

    fetchSales();
  }, []);

  // Handle delete sale from Firestore
  const handleDelete = async (id) => {
    try {
      // Reference the specific sale in Firestore
      const saleRef = doc(db, 'sales', id);
      await deleteDoc(saleRef); // Delete sale from Firestore
      console.log(`Sale with ID ${id} has been deleted`);

      // Update the UI by filtering out the deleted sale
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
    } catch (error) {
      console.error('Error deleting sale: ', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Sales</h1>
      {sales.length > 0 ? (
        <ul>
          {sales.map((sale, index) => (
            <li key={index} className="mb-4 p-4 border border-gray-300 rounded">
              <div className="p-4 text-right">
                <p className="font-bold text-gray-800">User: {sale.displayName}</p>
                <p className="text-gray-600">Email: {sale.email}</p>
              </div>
              <h2 className="font-bold text-gray-800">{sale.name}</h2>
              <p>Price: ksh {sale.price}</p>
              <p>Size: {sale.size}</p>
              <p>Total: ksh {sale.size * sale.price}</p>
              <p>Date: {new Date(sale.date).toLocaleDateString()}</p>
              <p>ID: {sale.id}</p>

              {/* Delete sale button */}
              <button
                onClick={() => handleDelete(sale.id)} // Delete sale from Firestore
                className="mt-4 bg-red-600 text-white h-10 w-32 rounded-lg hover:bg-red-700"
              >
                Delete Sale
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center h-[50vh] text-gray-600">No sales recorded.</p>
      )}
    </div>
  );
}

export default Sales;
