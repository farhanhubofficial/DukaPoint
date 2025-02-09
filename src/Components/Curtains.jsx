import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase-config';
import CurtainTile from './CurtainTile';

function Curtains() {
  const [allcurtains, setAllCurtains] = useState([]); // State to hold curtains data

  // Fetch data from Firestore on component mount
  useEffect(() => {
    const fetchCurtains = async () => {
      try {
        const curtainsCollection = collection(db, 'curtains'); // Reference to the 'curtains' collection
        const curtainSnapshot = await getDocs(curtainsCollection); // Get all documents
        const curtainsList = curtainSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map data and include doc IDs
        setAllCurtains(curtainsList); // Set state with fetched curtains
      } catch (error) {
        console.error('Error fetching curtains: ', error);
      }
    };

    fetchCurtains(); // Call fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className='relative'>
      <div className='grid grid-cols-1 lg:grid-cols-4 '>
        {allcurtains && allcurtains.length
          ? allcurtains.map((productItem) => (
              <CurtainTile key={productItem.id} product={productItem} />
            ))
          : <p>No curtains available</p>} {/* Show message if no curtains */}
      </div>
    </div>
  );
}

export default Curtains;
