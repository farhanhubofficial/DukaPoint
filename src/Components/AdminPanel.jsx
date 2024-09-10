import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase-config";
import { useAddCurtainMutation, useUpdateCurtainMutation, useDeleteCurtainMutation } from "../Store/Api/curtainSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AdminPanel() {
  const [curtains, setCurtains] = useState([]);
  const [curtainBatch, setCurtainBatch] = useState([{ name: "", price: "", description: "", color: "", material: "", image: null }]);
  const [currentCurtainIndex, setCurrentCurtainIndex] = useState(0);
  const [currentCurtainId, setCurrentCurtainId] = useState(null);
  const storage = getStorage();
  const fileInputRef = useRef(null);

  const curtainsCollection = collection(db, "curtains");

  const [addCurtain, { error: addError }] = useAddCurtainMutation();
  const [updateCurtain, { error: updateError }] = useUpdateCurtainMutation();
  const [deleteCurtain, { error: deleteError }] = useDeleteCurtainMutation();

  // Fetch curtains in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(curtainsCollection, (snapshot) => {
      const curtainsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurtains(curtainsData);
    });

    return () => unsubscribe();
  }, [curtainsCollection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const curtain of curtainBatch) {
        let imageUrl = curtain.image;
        if (imageUrl && typeof imageUrl === "object") {
          const imageRef = ref(storage, `curtains/${imageUrl.name}`);
          await uploadBytes(imageRef, imageUrl);
          imageUrl = await getDownloadURL(imageRef);
        }

        if (currentCurtainId) {
          await updateCurtain({
            id: currentCurtainId,
            updatedCurtain: {
              ...curtain,
              image: imageUrl || undefined,
            },
          }).unwrap();
          setCurrentCurtainId(null);
        } else {
          await addCurtain({
            ...curtain,
            image: imageUrl,
          }).unwrap();
        }
      }

      resetFormFields();
      setCurtainBatch([{ name: "", price: "", description: "", color: "", material: "", image: null }]);
      setCurrentCurtainIndex(0);
    } catch (error) {
      console.error("Error adding/updating curtain: ", error);
    }
  };

  const resetFormFields = () => {
    fileInputRef.current.value = "";
  };

  const editCurtain = (curtain) => {
    setCurrentCurtainId(curtain.id);
    setCurtainBatch([{
      name: curtain.name,
      price: curtain.price,
      description: curtain.description,
      color: curtain.color,
      material: curtain.material,
      image: curtain.image,
    }]);
    setCurrentCurtainIndex(0);
  };

  const handleDeleteCurtain = async (curtainId) => {
    try {
      await deleteCurtain(curtainId).unwrap();
    } catch (error) {
      console.error("Error deleting curtain: ", error);
    }
  };

  const handleInputChange = (e, field) => {
    const newBatch = [...curtainBatch];
    newBatch[currentCurtainIndex][field] = e.target.value;
    setCurtainBatch(newBatch);
  };

  const handleImageChange = (e) => {
    const newBatch = [...curtainBatch];
    newBatch[currentCurtainIndex].image = e.target.files[0];
    setCurtainBatch(newBatch);
  };

  const addNewCurtainToBatch = () => {
    setCurtainBatch([...curtainBatch, { name: "", price: "", description: "", color: "", material: "", image: null }]);
    setCurrentCurtainIndex(curtainBatch.length);
  };

  const handlePagination = (index) => {
    setCurrentCurtainIndex(index);
  };

  const handlePrev = () => {
    if (currentCurtainIndex > 0) {
      setCurrentCurtainIndex(currentCurtainIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentCurtainIndex < curtainBatch.length - 1) {
      setCurrentCurtainIndex(currentCurtainIndex + 1);
    }
  };

  const renderPagination = () => {
    const totalPages = curtainBatch.length;
    const maxVisiblePages = 5;
    const visiblePages = [];
    const ellipsis = '...';

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const startPages = [1, 2, 3];
      const endPages = [totalPages - 2, totalPages - 1, totalPages];

      if (currentCurtainIndex < 3) {
        visiblePages.push(...startPages);
        visiblePages.push(ellipsis);
        visiblePages.push(...endPages.slice(-2));
      } else if (currentCurtainIndex >= totalPages - 3) {
        visiblePages.push(...startPages.slice(0, 2));
        visiblePages.push(ellipsis);
        visiblePages.push(...endPages);
      } else {
        visiblePages.push(...startPages.slice(0, 2));
        visiblePages.push(ellipsis);
        visiblePages.push(currentCurtainIndex + 1);
        visiblePages.push(ellipsis);
        visiblePages.push(...endPages.slice(-2));
      }
    }

    return visiblePages.map((page, index) => (
      <button
        key={index}
        onClick={(e) => {
          e.preventDefault(); // Prevent form submission
          typeof page === 'number' && handlePagination(page - 1);
        }}
        className={`mx-1 py-1 px-3 rounded-full ${currentCurtainIndex === page - 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        style={{
          pointerEvents: typeof page === 'number' ? 'auto' : 'none',
          cursor: typeof page === 'number' ? 'pointer' : 'default',
        }}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Curtain Management</h2>
      <div className="border p-4 mb-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Add Curtains</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Curtain Name"
            value={curtainBatch[currentCurtainIndex].name}
            onChange={(e) => handleInputChange(e, "name")}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={curtainBatch[currentCurtainIndex].price}
            onChange={(e) => handleInputChange(e, "price")}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={curtainBatch[currentCurtainIndex].description}
            onChange={(e) => handleInputChange(e, "description")}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Color"
            value={curtainBatch[currentCurtainIndex].color}
            onChange={(e) => handleInputChange(e, "color")}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Material"
            value={curtainBatch[currentCurtainIndex].material}
            onChange={(e) => handleInputChange(e, "material")}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="w-full"
          />
          {curtainBatch[currentCurtainIndex].image && (
            <div className="my-4">
              <img
                src={
                  typeof curtainBatch[currentCurtainIndex].image === "string"
                    ? curtainBatch[currentCurtainIndex].image
                    : URL.createObjectURL(curtainBatch[currentCurtainIndex].image)
                }
                alt="Curtain Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          <div className="flex space-x-2">
            <button type="button" onClick={addNewCurtainToBatch} className="bg-green-500 text-white p-2 rounded">
              Add More Curtains
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Submit
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" onClick={handlePrev} className="bg-gray-500 text-white p-2 rounded">
              Prev
            </button>
            {renderPagination()}
            <button type="button" onClick={handleNext} className="bg-gray-500 text-white p-2 rounded">
              Next
            </button>
          </div>
        </form>
      </div>
      <h3 className="text-xl font-semibold mb-2">Curtain List</h3>
      <div className="grid grid-cols-4 gap-4">
        {curtains.map((curtain) => (
          <div key={curtain.id} className="border p-2 rounded shadow">
            <img
              src={curtain.image}
              alt={curtain.name}
              className="w-full h-32 object-cover rounded"
            />
            <h4 className="text-lg font-semibold">{curtain.name}</h4>
            <p className="text-gray-600">{curtain.description}</p>
            <p className="text-gray-600">${curtain.price}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => editCurtain(curtain)}
                className="bg-yellow-500 text-white p-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCurtain(curtain.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
