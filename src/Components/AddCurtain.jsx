import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config';

function AddProducts() {
  const [curtains, setCurtains] = useState([
    { name: '', sellingPrice: '', buyingPrice: '', material: '', color: '', imageUrl: '' }
  ]);
  const [currentCurtainIndex, setCurrentCurtainIndex] = useState(0);
  const [images, setImages] = useState([null]); // Store images for each curtain
  const [uploadProgress, setUploadProgress] = useState(0);

  // Add state to track image source type
  const [imageSource, setImageSource] = useState(''); // Can be 'file' or 'camera'

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
      setImageSource('file'); // Set image source as file

      // Update the current curtain with the file URL
      const updatedCurtains = [...curtains];
      updatedCurtains[currentCurtainIndex].imageUrl = URL.createObjectURL(file);
      setCurtains(updatedCurtains);
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSource('camera'); // Set image source as camera
      const newImages = [...images];
      newImages[currentCurtainIndex] = file;
      setImages(newImages);

      // Update the current curtain with the captured photo URL
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

      const batch = collection(db, 'curtains');
      for (const curtain of uploadedCurtains) {
        await addDoc(batch, curtain);
      }

      setCurtains([{ name: '', sellingPrice: '', buyingPrice: '', material: '', color: '', imageUrl: '' }]);
      setImages([null]);
      alert('Curtains added successfully!');
    } catch (error) {
      console.error('Error adding curtains: ', error);
      alert('Failed to add curtains');
    }
  };

  const addMoreCurtains = () => {
    setCurtains([...curtains, { name: '', sellingPrice: '', buyingPrice: '', material: '', color: '', imageUrl: '' }]);
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

  const [previewUrl, setPreviewUrl] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl mb-4">Add Curtains</h2>
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
            ></div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button type="button" onClick={() => handlePrevNext('prev')} className="bg-gray-500 text-white px-4 py-2 rounded">
            Prev
          </button>
          <button type="button" onClick={() => handlePrevNext('next')} className="bg-gray-500 text-white px-4 py-2 rounded">
            Next
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Curtains
          </button>
          <button type="button" onClick={addMoreCurtains} className="bg-green-500 text-white px-4 py-2 rounded">
            Add More Curtains
          </button>
        </div>

        <div className="flex justify-center mt-4">
          {renderPaginationNumbers()}
        </div>
      </form>
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
