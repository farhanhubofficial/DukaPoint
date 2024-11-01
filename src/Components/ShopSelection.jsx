import React, { useEffect, useState } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase-config'; // Adjust the import as necessary

const ShopSelection = () => {
  const [shops, setShops] = useState([]); // Holds shop document IDs
  const [selectedShop, setSelectedShop] = useState('');
  const [subcollectionNames, setSubcollectionNames] = useState([]); // Holds subcollection names for selected shop

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopsRef = collection(db, 'shops');
        const shopsSnapshot = await getDocs(shopsRef);

        const shopList = shopsSnapshot.docs.map(doc => doc.id); // Get the shop document IDs
        setShops(shopList);
      } catch (error) {
        console.error('Error fetching shops: ', error);
      }
    };

    fetchShops();
  }, []);

  const handleShopChange = async (e) => {
    const shopId = e.target.value;
    setSelectedShop(shopId);

    if (shopId) {
      // Fetch subcollection names for the selected shop
      try {
        const subcollectionsRef = collection(db, 'shops', shopId);
        const subcollectionsSnapshot = await getDocs(subcollectionsRef);

        const subcollectionList = subcollectionsSnapshot.docs.map(doc => doc.id); // Get subcollection names
        setSubcollectionNames(subcollectionList);
      } catch (error) {
        console.error('Error fetching subcollections: ', error);
      }
    } else {
      setSubcollectionNames([]); // Reset if no shop is selected
    }
  };

  return (
    <div>
      <h2>Select Shop</h2>
      <select value={selectedShop} onChange={handleShopChange} className="border p-2">
        <option value="">Select a shop</option>
        {shops.map(shop => (
          <option key={shop} value={shop}>
            {shop}
          </option>
        ))}
      </select>

      {selectedShop && (
        <>
          <h3>Select Subcollection</h3>
          <select className="border p-2">
            <option value="">Select a subcollection</option>
            {subcollectionNames.map((subcollection) => (
              <option key={subcollection} value={subcollection}>
                {subcollection}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default ShopSelection;
