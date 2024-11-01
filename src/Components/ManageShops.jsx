import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase-config';

function ManageShops() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopNames, setShopNames] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [editShopId, setEditShopId] = useState('');
  const [editShopName, setEditShopName] = useState('');
  const [expandedShopId, setExpandedShopId] = useState(null);
  const shopId = '8ZdzhGj9kNlZKRDOJ9Z0';

  const handleRegisterClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopName) {
      alert("Please enter a name for the subcollection.");
      return;
    }

    try {
      const subcollectionRef = collection(db, 'shops', shopId, shopName);
      await setDoc(doc(subcollectionRef), {});
      const shopsNamesRef = collection(db, 'shopnames');
      await setDoc(doc(shopsNamesRef), { name: shopName });

      setShopName('');
      setIsFormVisible(false);
      alert(`Subcollection "${shopName}" created successfully under shop "${shopId}".`);
      fetchShopNames();
    } catch (error) {
      console.error('Error creating subcollection or adding to shopnames: ', error);
    }
  };

  const fetchShopNames = async () => {
    try {
      const shopNamesRef = collection(db, 'shopnames');
      const snapshot = await getDocs(shopNamesRef);
      const names = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShopNames(names);
    } catch (error) {
      console.error('Error fetching shop names: ', error);
    }
  };

  const handleDelete = async (id, name) => {
    setSelectedShop({ id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const { id, name } = selectedShop;
    try {
      const subcollectionRef = collection(db, 'shops', shopId, name);
      const snapshot = await getDocs(subcollectionRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      await deleteDoc(doc(db, 'shopnames', id));
      fetchShopNames();
      alert('Shop name and corresponding subcollection deleted successfully.');
    } catch (error) {
      console.error('Error deleting shop name or subcollection: ', error);
    } finally {
      setShowDeleteConfirm(false);
      setSelectedShop(null);
    }
  };

  const handleEditClick = (id, name) => {
    setEditShopId(id);
    setEditShopName(name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editShopName) return;

    try {
      const oldShop = shopNames.find(shop => shop.id === editShopId);
      if (!oldShop) return;

      const oldName = oldShop.name;

      const oldSubcollectionRef = collection(db, 'shops', shopId, oldName);
      const snapshot = await getDocs(oldSubcollectionRef);
      const newSubcollectionRef = collection(db, 'shops', shopId, editShopName);
      const batch = writeBatch(db);

      snapshot.docs.forEach(oldDoc => {
        const newDocRef = doc(newSubcollectionRef);
        batch.set(newDocRef, oldDoc.data());
      });
      await batch.commit();

      const deleteBatch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        deleteBatch.delete(doc.ref);
      });
      await deleteBatch.commit();

      await setDoc(doc(db, 'shopnames', editShopId), { name: editShopName });
      fetchShopNames();
      setShowEditModal(false);
      alert('Shop name and corresponding subcollection updated successfully.');
    } catch (error) {
      console.error('Error updating shop name or subcollection: ', error);
    }
  };

  useEffect(() => {
    fetchShopNames();
  }, []);

  const toggleShopDetails = (shopId) => {
    setExpandedShopId(prev => (prev === shopId ? null : shopId));
  };

  return (
    <div className="container mx-auto p-5 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Shops</h2>

      <h3 className="text-xl mb-2">Existing Shop Names:</h3>
      <ul className="space-y-2">
        {shopNames.map((shop) => (
          <li key={shop.id} className="border-b p-2">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleShopDetails(shop.id)}>
              <span>{shop.name}</span>
              <span className="text-blue-500">{expandedShopId === shop.id ? '▲' : '▼'}</span>
            </div>
            {expandedShopId === shop.id && (
              <div className="mt-2 flex justify-between">
                <button 
                  onClick={() => handleEditClick(shop.id, shop.name)} 
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(shop.id, shop.name)} 
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <button 
        onClick={handleRegisterClick} 
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {isFormVisible ? 'Cancel' : 'Register New Shop'}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block mb-2">
              Shop Name:
              <input 
                type="text" 
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)} 
                required 
                className="border rounded p-2 w-full"
              />
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Subcollection</button>
        </form>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md  ">
            <h4 className="text-lg font-bold mb-4">Edit Shop Name</h4>
            <input 
              type="text" 
              value={editShopName} 
              onChange={(e) => setEditShopName(e.target.value)} 
              required 
              className="border rounded p-2 w-full mb-4"
            />
            <div className="flex justify-between">
              <button 
                onClick={handleUpdate} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p>Are you sure you want to delete the shop "{selectedShop?.name}"?</p>
            <div className="mt-4">
              <button 
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageShops;
