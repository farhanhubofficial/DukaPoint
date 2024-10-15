import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase-config'; // Import your Firebase config
import AddminCurtainTile from './AddminCurtainTile';

function AdminCategories() {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]); // Will store filtered curtains/shears
  const [category, setCategory] = useState('All'); // Default category is 'All'
  const [allItems, setAllItems] = useState([]); // Will store all curtains and shears
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch curtains and shears when 'All Categories' is selected
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      try {
        let itemsList = [];

        if (category === 'All') {
          // Fetch both curtains and shears
          const curtainsSnapshot = await getDocs(collection(db, 'curtains'));
          const shearsSnapshot = await getDocs(collection(db, 'shears'));

          const curtains = curtainsSnapshot.docs.map((doc) => ({
            id: doc.id,
            category: 'Curtains', // Mark as curtain
            ...doc.data(),
          }));

          const shears = shearsSnapshot.docs.map((doc) => ({
            id: doc.id,
            category: 'Shears', // Mark as shear
            ...doc.data(),
          }));

          itemsList = [...curtains, ...shears]; // Combine curtains and shears
        } else {
          // Fetch specific category (either curtains or shears)
          const querySnapshot = await getDocs(collection(db, category.toLowerCase()));
          itemsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            category: category, // Mark as either 'Curtains' or 'Shears'
            ...doc.data(),
          }));
        }

        setAllItems(itemsList);
      } catch (error) {
        console.error('Error fetching items: ', error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchData();
  }, [category]);

  // Apply search filter
  useEffect(() => {
    let filtered = allItems;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [search, allItems]);

  if (loading) {
    return <p>Loading items...</p>;
  }

  return (
    <div className="bg-white shadow-md border border-gray-300 p-6 rounded-lg">
      {/* Search and Filter Options */}
      <div className="mb-4 w-full max-w-4xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Items"
          className="border p-2 mb-4 w-full max-w-4xl"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="All">All Categories</option>
          <option value="Curtains">Curtains</option>
          <option value="Shears">Shears</option>
        </select>
      </div>

      {/* Item Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px] overflow-y-scroll">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
            >
              <AddminCurtainTile product={item} />
            </div>
          ))
        ) : (
          <p>No {category === 'All' ? 'items' : category} available</p>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
