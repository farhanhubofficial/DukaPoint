import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idNumber: '',
    phoneNumber: '',
    shopName: ''  // Add shopName to the user object
  });
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'attendant'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    const fetchShopNames = async () => {
      const shopNamesSnapshot = await getDocs(collection(db, 'shopnames'));
      const namesList = shopNamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShopNames(namesList);
    };

    fetchUsers();
    fetchShopNames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...newUser,
        role: 'attendant',
      });
      // Add the new user to the state immediately
      setUsers(prevUsers => [
        ...prevUsers,
        { id: docRef.id, ...newUser }
      ]);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', idNumber: '', phoneNumber: '', shopName: '' });
      setShowAddUserForm(false);
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userDoc = doc(db, 'users', selectedUser.id);
      await updateDoc(userDoc, newUser);
      // Update the user in the state immediately
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...newUser } : user
        )
      );
      setShowEditModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', idNumber: '', phoneNumber: '', shopName: '' });
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const userDoc = doc(db, 'users', user.id);
      await deleteDoc(userDoc);
      // Remove the user from the state immediately
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  const toggleUserDetails = (userId) => {
    setExpandedUserId(prev => (prev === userId ? null : userId));
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Shop attendants</h2>
        <ul className="list-disc list-inside mb-4">
          {users.map(user => (
            <li key={user.id} className="p-2 border-b flex flex-col">
              <div className="flex justify-between items-center" onClick={() => toggleUserDetails(user.id)}>
                <span>{user.firstName} {user.lastName} - {user.email}</span>
                <span className="cursor-pointer text-blue-500">{expandedUserId === user.id ? '▲' : '▼'}</span>
              </div>
              {expandedUserId === user.id && (
                <div className="mt-2">
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteConfirm(true);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={() => setShowAddUserForm(prev => !prev)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {showAddUserForm ? 'Cancel' : 'Add New User'}
      </button>

      {showAddUserForm && (
        <form onSubmit={handleAddUser} className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">New User Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="idNumber"
              placeholder="ID Number"
              value={newUser.idNumber}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            {/* Dropdown for Shop Names */}
            <select
              name="shopName"
              value={newUser.shopName}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            >
              <option value="" disabled>Select Shop Name</option>
              {shopNames.map(shop => (
                <option key={shop.id} value={shop.name}>{shop.name}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add User
          </button>
        </form>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Edit User Details</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="idNumber"
                  placeholder="ID Number"
                  value={newUser.idNumber}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={newUser.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                {/* Dropdown for Shop Names in Edit Modal */}
                <select
                  name="shopName"
                  value={newUser.shopName}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                >
                  <option value="" disabled>Select Shop Name</option>
                  {shopNames.map(shop => (
                    <option key={shop.id} value={shop.name}>{shop.name}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Update User
              </button>
              <button 
                type="button"
                onClick={() => setShowEditModal(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}?</p>
            <div className="mt-4">
              <button 
                onClick={() => handleDeleteUser(selectedUser)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mr-2"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
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

export default ManageUsers;
