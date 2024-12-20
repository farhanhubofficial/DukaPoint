import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { Link } from 'react-router-dom';
import AdminCurtainTilePage from './AdminCurtainTilePage';
import { db } from '../firebase-config'; // Import Firebase config

function AdminCurtainsPage() {
  const [allcurtains, setAllCurtains] = useState([]); // State to hold fetched curtains data

  // Fetch data from Firestore when component mounts
  useEffect(() => {
    const fetchCurtains = async () => {
      try {
        const curtainsCollection = collection(db, 'curtains'); // Reference to 'curtains' collection in Firestore
        const curtainSnapshot = await getDocs(curtainsCollection); // Get all documents from 'curtains'
        const curtainsList = curtainSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map data and include doc IDs
        setAllCurtains(curtainsList); // Set state with the fetched data
      } catch (error) {
        console.error('Error fetching curtains: ', error);
      }
    };

    fetchCurtains(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs once on component mount

  const handlePrint = () => {
    window.print(); // Trigger the print dialog
  };

  return (
    <div className='relative'>
      <div>
        {allcurtains && allcurtains.length ? (
          <div className='relative'>
            <button onClick={handlePrint} className='bg-blue-500 text-white rounded-md px-4 py-2 mb-4'>
              Print
            </button>
            <div className='grid grid-cols-1 lg:grid-cols-4'>
              {allcurtains.map((productItem) => (
                <AdminCurtainTilePage key={productItem.id} product={productItem} />
              ))}
            </div>
            {/* Add More button that links to adding curtains */}
            {/* <Link to='/admin/Addcurtains'>
              <button className='fixed bottom-0 right-0 text-white bg-black font-bold text-xl mt-9 ml-36 p-1 rounded-lg h-24'>
                Add More +
              </button>
            </Link> */}
          </div>
        ) : (
          <p>No curtains available</p>
        )}
      </div>
    </div>
  );
}

export default AdminCurtainsPage;
