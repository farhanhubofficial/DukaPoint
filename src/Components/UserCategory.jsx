import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import AddminCurtainTile from './AddminCurtainTile';
import { onAuthStateChanged } from 'firebase/auth';

function UserCategory() {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState('All'); // Default category is 'All'
  const [allItems, setAllItems] = useState([]); // Will store all curtains and shears
  const [loading, setLoading] = useState(true); // Set loading initially to true
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Stop loading after determining user state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !user) return; // Only fetch data if not loading and user is defined

    const fetchData = async () => {
      setLoading(true);
      try {
        let itemsList = [];

        if (category === 'All') {
          // Fetch both curtains and shears filtered by attendant
          const curtainsQuery = query(collection(db, 'curtains'), where('attendant', '==', user.email));
          const shearsQuery = query(collection(db, 'shears'), where('attendant', '==', user.email));

          const curtainsSnapshot = await getDocs(curtainsQuery);
          const shearsSnapshot = await getDocs(shearsQuery);

          const curtains = curtainsSnapshot.docs.map((doc) => ({
            id: doc.id,
            category: 'Curtains',
            ...doc.data(),
          }));

          const shears = shearsSnapshot.docs.map((doc) => ({
            id: doc.id,
            category: 'Shears',
            ...doc.data(),
          }));

          itemsList = [...curtains, ...shears]; // Combine curtains and shears
        } else {
          // Fetch specific category (either curtains or shears) filtered by attendant
          const querySnapshot = await getDocs(
            query(collection(db, category.toLowerCase()), where('attendant', '==', user.email))
          );
          itemsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            category: category,
            ...doc.data(),
          }));
        }

        setAllItems(itemsList);
      } catch (error) {
        console.error('Error fetching items: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, category]); // Depend on user and category

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
      <div className="mb-4 w-full max-w-4xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Items"
          className="border p-2 mb-4 w-full"
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px] overflow-y-scroll">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100">
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

export default UserCategory;
