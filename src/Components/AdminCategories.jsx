import React, { useEffect, useState } from 'react';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import AddminCurtainTile from './AddminCurtainTile';

function AdminCategories() {
  const { data: allcurtains = [] } = useFetchCurtainsQuery();

  const [search, setSearch] = useState('');
  const [filteredCurtains, setFilteredCurtains] = useState([]);
  const [category, setCategory] = useState('All'); // New state for category filter

  useEffect(() => {
    let filtered = [];

    // Filter by category if 'Curtains' is selected
    if (category === 'Curtains') {
      filtered = allcurtains;
    }

    // Apply search term filtering
    if (search) {
      filtered = filtered.filter((curtain) =>
        curtain.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCurtains(filtered);
  }, [search, category, allcurtains]);
console.log(filteredCurtains)
  return (
    <div className="bg-white shadow-md border border-gray-300 p-6 rounded-lg">
      {/* Search and Filter Options */}
      <div className="mb-4 w-full max-w-4xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Curtains"
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
          <option value="Pillows">Pillows</option>
          <option value="Carpets">Carpets</option>
          <option value="Duvets">Duvets</option>
        </select>
      </div>

      {/* Curtain Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-[500px] overflow-y-scroll">
      {category === 'All' ? (
    <p>Choose a category</p>
  ) : filteredCurtains.length > 0 ? (
    filteredCurtains.map((curtain) => (
      <div
        key={curtain.id}
        className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
      >
        <AddminCurtainTile product={curtain} />
      </div>
    ))
  ) : (
    <p>No {category} available</p>
  )} 
      </div>
    </div>
  );
}

export default AdminCategories;
