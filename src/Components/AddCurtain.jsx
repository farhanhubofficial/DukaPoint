import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config';

function AddProducts() {
  const [selectedProduct, setSelectedProduct] = useState('select');
  const [curtains, setCurtains] = useState([
    { name: '', sellingPrice: '', buyingPrice: '', size: '', material: '', color: '', imageUrl: '', shop: '' }
  ]);
  const [currentCurtainIndex, setCurrentCurtainIndex] = useState(0);
  const [images, setImages] = useState([null]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shops, setShops] = useState([]); // State to hold shop names

  useEffect(() => {
    const fetchShops = async () => {
      const shopsCollection = collection(db, 'shopnames'); // Change to your shopnames collection
      const querySnapshot = await getDocs(shopsCollection);
      const shopsList = querySnapshot.docs.map(doc => doc.data().name); // Assuming shop document has a 'name' field
      setShops(shopsList);
    };

    fetchShops(); // Fetch shops when component mounts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedCurtains = [...curtains];
    updatedCurtains[currentCurtainIndex][name] = value;
    setCurtains(updatedCurtains);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const newImages = [...images];
      newImages[currentCurtainIndex] = file;
      setImages(newImages);

      const updatedCurtains = [...curtains];
      updatedCurtains[currentCurtainIndex].imageUrl = URL.createObjectURL(file);
      setCurtains(updatedCurtains);
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[currentCurtainIndex] = file;
      setImages(newImages);

      const updatedCurtains = [...curtains];
      updatedCurtains[currentCurtainIndex].imageUrl = URL.createObjectURL(file);
      setCurtains(updatedCurtains);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadPromises = curtains.map(async (curtain, index) => {
        let imageUrl = curtain.imageUrl;

        if (images[index]) {
          const imageRef = ref(storage, `curtains/${images[index].name}`);
          const uploadTask = uploadBytesResumable(imageRef, images[index]);
          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
              },
              (error) => {
                console.error('Error uploading image: ', error);
                reject('Failed to upload image');
              },
              async () => {
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(imageUrl);
              }
            );
          });
        }

        return { ...curtain, imageUrl };
      });

      const uploadedCurtains = await Promise.all(uploadPromises);

      const collectionName = selectedProduct.toLowerCase();
      const batch = collection(db, collectionName);

      for (const curtain of uploadedCurtains) {
        // Add to main collection
        await addDoc(batch, curtain);

        // Add to corresponding shop's subcollection
        const shopSubcollectionRef = collection(db, `/shops/${curtain.shop}/A${selectedProduct.toUpperCase()} SHOP`);
        await addDoc(shopSubcollectionRef, curtain); // Add the same curtain data to the shop's subcollection
      }

      setCurtains([{ name: '', sellingPrice: '', buyingPrice: '', size: '', material: '', color: '', imageUrl: '', shop: '' }]);
      setImages([null]);
      alert(`${selectedProduct} added successfully!`);
    } catch (error) {
      console.error(`Error adding ${selectedProduct}: `, error);
      alert(`Failed to add ${selectedProduct}`);
    }
  };

  const addMoreCurtains = () => {
    setCurtains([...curtains, { name: '', sellingPrice: '', buyingPrice: '', size: '', material: '', color: '', imageUrl: '', shop: '' }]);
    setImages([...images, null]);
    setCurrentCurtainIndex(curtains.length);
  };

  const handlePrevNext = (direction) => {
    if (direction === 'prev' && currentCurtainIndex > 0) {
      setCurrentCurtainIndex(currentCurtainIndex - 1);
    }
    if (direction === 'next' && currentCurtainIndex < curtains.length - 1) {
      setCurrentCurtainIndex(currentCurtainIndex + 1);
    }
  };

  const renderPaginationNumbers = () => {
    return curtains.map((_, index) => (
      <span
        key={index}
        className={`inline-block w-6 h-6 text-center rounded-full mx-1 cursor-pointer ${index === currentCurtainIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        onClick={() => setCurrentCurtainIndex(index)}
      >
        {index + 1}
      </span>
    ));
  };

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300">
      <h2 className="text-xl mb-4">Select Product to Add</h2>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="border p-2 mb-4"
        id="select"
      >
        <option value="select">Select (Default)</option>
        <option value="curtains">Curtains</option>
        <option value="shears">Shears</option>
        <option value="carpets">Carpets</option>
      </select>

      {selectedProduct !== 'select' && (
        <div>
          <h2 className="text-xl mb-4">Add {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)}</h2>
          <form onSubmit={handleSubmit}>
            {curtains[currentCurtainIndex] && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={curtains[currentCurtainIndex].name || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label>Selling Price:</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={curtains[currentCurtainIndex].sellingPrice || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label>Size:</label>
                  <input
                    type="number"
                    name="size"
                    value={curtains[currentCurtainIndex].size || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label>Buying Price:</label>
                  <input
                    type="number"
                    name="buyingPrice"
                    value={curtains[currentCurtainIndex].buyingPrice || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label>Material:</label>
                  <input
                    type="text"
                    name="material"
                    value={curtains[currentCurtainIndex].material || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label>Color:</label>
                  <input
                    type="text"
                    name="color"
                    value={curtains[currentCurtainIndex].color || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label>Shop:</label>
                  <select
                    name="shop"
                    value={curtains[currentCurtainIndex].shop || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  >
                    <option value="">Select Shop</option>
                    {shops.map(shop => (
                      <option key={shop} value={shop}>
                        {shop} {/* Assuming shop name is in the data */}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Image:</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="border p-2 w-full"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label>Take Photo:</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="border p-2 w-full"
                  />
                </div>

                {curtains[currentCurtainIndex].imageUrl && (
                  <div className="mt-4">
                    <img src={curtains[currentCurtainIndex].imageUrl} alt="Selected" className="max-w-xs" />
                  </div>
                )}
              </div>
            )}

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 mt-2">
                <div
                  className="bg-blue-500 h-2"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div className="mt-4">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Add {selectedProduct}
              </button>
              <button type="button" onClick={addMoreCurtains} className="bg-green-500 text-white py-2 px-4 rounded ml-2">
                Add More
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between">
            <button onClick={() => handlePrevNext('prev')} className="bg-gray-500 text-white py-2 px-4 rounded">
              Prev
            </button>
            <div className="flex">{renderPaginationNumbers()}</div>
            <button onClick={() => handlePrevNext('next')} className="bg-gray-500 text-white py-2 px-4 rounded">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProducts;

































































































// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
// import { db } from "../firebase-config"; // Import your Firebase configuration
// import { collection, addDoc } from "firebase/firestore"; // Import Firebase Firestore functions

// function AddCurtain() {
//   const navigate = useNavigate();
//   const [currentProductIndex, setCurrentProductIndex] = useState(0);

//   const [initialValues, setInitialValues] = useState(() => {
//     const savedData = localStorage.getItem('formData');
//     if (savedData) {
//       return JSON.parse(savedData);
//     }
//     return {
//       products: [
//         {
//           name: '',
//           price: '',
//           image: '',
//           color: '',
//           size: '',
//           material: '',
//         },
//       ],
//     };
//   });

//   const validationSchema = Yup.object({
//     products: Yup.array().of(
//       Yup.object({
//         name: Yup.string().required('Name is required'),
//         price: Yup.number().required('Price is required').positive('Price must be positive'),
//         image: Yup.string().required('Image is required'),
//         color: Yup.string().required('Color is required'),
//         size: Yup.string().required('Size is required'),
//         material: Yup.string().required('Material is required'),
//       })
//     ),
//   });

//   const handleSubmit = async (values) => {
//     try {
//       for (const product of values.products) {
//         const newProduct = { ...product, id: uuidv4() }; // Generate auto ID
//         await addDoc(collection(db, "curtains"), newProduct); // Add to Firestore
//       }
//       localStorage.removeItem('formData');
//       navigate('/');
//     } catch (err) {
//       console.error('Failed to add curtain:', err);
//     }
//   };

//   const saveDataToLocalStorage = (values) => {
//     localStorage.setItem('formData', JSON.stringify(values));
//   };

//   const handleImageChange = (event, setFieldValue) => {
//     const file = event.currentTarget.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setFieldValue(`products.${currentProductIndex}.image`, imageUrl);
//       setFieldValue(`products.${currentProductIndex}.file`, file); // Save the actual file
//     }
//   };

//   const renderPaginationNumbers = (totalProducts, currentIndex) => {
//     const numbers = [];
//     const limit = 5;

//     if (totalProducts <= limit) {
//       for (let i = 0; i < totalProducts; i++) {
//         numbers.push(
//           <span
//             key={i}
//             className={`inline-block w-6 h-6 text-center rounded-full mx-1 cursor-pointer ${i === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
//             onClick={() => setCurrentProductIndex(i)}
//           >
//             {i + 1}
//           </span>
//         );
//       }
//     } else {
//       if (currentIndex > 2) numbers.push(<span key="left-ellipsis" className="inline-block mx-1">...</span>);

//       const start = Math.max(currentIndex - 2, 0);
//       const end = Math.min(currentIndex + 2, totalProducts - 1);

//       for (let i = start; i <= end; i++) {
//         numbers.push(
//           <span
//             key={i}
//             className={`inline-block w-6 h-6 text-center rounded-full mx-1 cursor-pointer ${i === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
//             onClick={() => setCurrentProductIndex(i)}
//           >
//             {i + 1}
//           </span>
//         );
//       }

//       if (currentIndex < totalProducts - 3) numbers.push(<span key="right-ellipsis" className="inline-block mx-1">...</span>);
//     }

//     return numbers;
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Add New Curtains</h1>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize={true}
//         >
//           {({ values, setFieldValue }) => {
//             useEffect(() => {
//               saveDataToLocalStorage(values);
//             }, [values]);

//             return (
//               <Form className="space-y-4">
//                 <FieldArray name="products">
//                   {({ remove, push }) => (
//                     <div>
//                       {values.products.length > 0 && (
//                         <div className="grid grid-cols-3 gap-4 border p-4 rounded mb-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Name</label>
//                             <Field
//                               type="text"
//                               name={`products.${currentProductIndex}.name`}
//                               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                               placeholder="Enter curtain name"
//                             />
//                             <ErrorMessage
//                               name={`products.${currentProductIndex}.name`}
//                               component="div"
//                               className="text-red-500 text-xs"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Price</label>
//                             <Field
//                               type="number"
//                               name={`products.${currentProductIndex}.price`}
//                               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                               placeholder="Enter price"
//                             />
//                             <ErrorMessage
//                               name={`products.${currentProductIndex}.price`}
//                               component="div"
//                               className="text-red-500 text-xs"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Color</label>
//                             <Field
//                               type="text"
//                               name={`products.${currentProductIndex}.color`}
//                               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                               placeholder="Enter color"
//                             />
//                             <ErrorMessage
//                               name={`products.${currentProductIndex}.color`}
//                               component="div"
//                               className="text-red-500 text-xs"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Image</label>
//                             <input
//                               type="file"
//                               name={`products.${currentProductIndex}.image`}
//                               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                               onChange={(event) => handleImageChange(event, setFieldValue)}
//                             />
//                             <ErrorMessage
//                               name={`products.${currentProductIndex}.image`}
//                               component="div"
//                               className="text-red-500 text-xs"
//                             />
//                             {values.products[currentProductIndex].image && (
//                               <img
//                                 src={values.products[currentProductIndex].image}
//                                 alt="Curtain preview"
//                                 className="mt-2 w-full h-32 object-cover"
//                               />
//                             )}
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Material</label>
//                             <Field
//                               type="text"
//                               name={`products.${currentProductIndex}.material`}
//                               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                               placeholder="Enter material"
//                             />
//                             <ErrorMessage
//                               name={`products.${currentProductIndex}.material`}
//                               component="div"
//                               className="text-red-500 text-xs"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Size</label>
//                             <Field
//                               type="number"
//                               name={`products.${currentProductIndex}.size`}
//                               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                               placeholder="Size in meters"
//                             />
//                             <ErrorMessage
//                               name={`products.${currentProductIndex}.size`}
//                               component="div"
//                               className="text-red-500 text-xs"
//                             />
//                           </div>
//                           <div className="grid grid-col-2 gap-2 lg:flex justify-between space-x-2">
//                             <button
//                               type="button"
//                               className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600"
//                               onClick={() => {
//                                 remove(currentProductIndex);
//                                 setCurrentProductIndex((prev) => Math.max(prev - 1, 0));
//                                 saveDataToLocalStorage(values);
//                               }}
//                               disabled={values.products.length === 1}
//                             >
//                               Remove
//                             </button>
//                             <button
//                               type="button"
//                               className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-600"
//                               onClick={() => {
//                                 push({
//                                   name: '',
//                                   price: '',
//                                   image: '',
//                                   color: '',
//                                   size: '',
//                                   material: '',
//                                 });
//                                 setCurrentProductIndex(values.products.length);
//                                 saveDataToLocalStorage(values);
//                               }}
//                             >
//                               Add
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </FieldArray>

//                 <div className="flex justify-between">
//                   <button
//                     type="button"
//                     onClick={() => setCurrentProductIndex((prev) => Math.max(prev - 1, 0))}
//                     disabled={currentProductIndex === 0}
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                   >
//                     Prev
//                   </button>

//                   <div>{renderPaginationNumbers(values.products.length, currentProductIndex)}</div>

//                   <button
//                     type="button"
//                     onClick={() => setCurrentProductIndex((prev) => Math.min(prev + 1, values.products.length - 1))}
//                     disabled={currentProductIndex === values.products.length - 1}
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                   >
//                     Next
//                   </button>
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                 >
//                   Save Curtains
//                 </button>
//               </Form>
//             );
//           }}
//         </Formik>
//       </div>
//     </div>
//   );
// }

// export default AddCurtain;
