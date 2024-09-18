import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAddCurtainMutation } from '../Store/Api/CurtSlice';
import { v4 as uuidv4 } from 'uuid';

function AddCurtain() {
  const [addCurtain, { isLoading }] = useAddCurtainMutation();
  const navigate = useNavigate();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const [initialValues, setInitialValues] = useState(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      products: [
        {
          name: '',
          price: '',
          image: '',
          color: '',
          size: '',
          material: '',
        },
      ],
    };
  });

  const validationSchema = Yup.object({
    products: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Name is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        image: Yup.string().required('Image is required'),
        color: Yup.string().required('Color is required'),
        size: Yup.string().required('Size is required'),
        material: Yup.string().required('Material is required'),
      })
    ),
  });

  const handleSubmit = async (values) => {
    try {
      for (const product of values.products) {
        const newProduct = { ...product, id: uuidv4() }; // Generate auto ID
        await addCurtain(newProduct).unwrap();
      }
      localStorage.removeItem('formData');
      navigate('/');
    } catch (err) {
      console.error('Failed to add curtain:', err);
    }
  };

  const saveDataToLocalStorage = (values) => {
    localStorage.setItem('formData', JSON.stringify(values));
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFieldValue(`products.${currentProductIndex}.image`, imageUrl);
      setFieldValue(`products.${currentProductIndex}.file`, file); // Save the actual file
    }
  };

  const renderPaginationNumbers = (totalProducts, currentIndex) => {
    const numbers = [];
    const limit = 5;

    if (totalProducts <= limit) {
      for (let i = 0; i < totalProducts; i++) {
        numbers.push(
          <span
            key={i}
            className={`inline-block w-6 h-6 text-center rounded-full mx-1 cursor-pointer ${i === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setCurrentProductIndex(i)}
          >
            {i + 1}
          </span>
        );
      }
    } else {
      if (currentIndex > 2) numbers.push(<span key="left-ellipsis" className="inline-block mx-1">...</span>);

      const start = Math.max(currentIndex - 2, 0);
      const end = Math.min(currentIndex + 2, totalProducts - 1);

      for (let i = start; i <= end; i++) {
        numbers.push(
          <span
            key={i}
            className={`inline-block w-6 h-6 text-center rounded-full mx-1 cursor-pointer ${i === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setCurrentProductIndex(i)}
          >
            {i + 1}
          </span>
        );
      }

      if (currentIndex < totalProducts - 3) numbers.push(<span key="right-ellipsis" className="inline-block mx-1">...</span>);
    }

    return numbers;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Curtains</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              saveDataToLocalStorage(values);
            }, [values]);

            return (
              <Form className="space-y-4">
                <FieldArray name="products">
                  {({ remove, push }) => (
                    <div>
                      {values.products.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 border p-4 rounded mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <Field
                              type="text"
                              name={`products.${currentProductIndex}.name`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Enter curtain name"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.name`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <Field
                              type="number"
                              name={`products.${currentProductIndex}.price`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Enter price"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.price`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Color</label>
                            <Field
                              type="text"
                              name={`products.${currentProductIndex}.color`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Enter color"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.color`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                              type="file"
                              name={`products.${currentProductIndex}.image`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              onChange={(event) => handleImageChange(event, setFieldValue)}
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.image`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                            {values.products[currentProductIndex].image && (
                              <img
                                src={values.products[currentProductIndex].image}
                                alt="Curtain preview"
                                className="mt-2 w-full h-32 object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Material</label>
                            <Field
                              type="text"
                              name={`products.${currentProductIndex}.material`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Enter material"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.material`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Size</label>
                            <Field
                              type="number"
                              name={`products.${currentProductIndex}.size`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Size in meters"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.size`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div className="grid grid-col-2 gap-2 lg:flex justify-between space-x-2">
                            <button
                              type="button"
                              className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600"
                              onClick={() => {
                                remove(currentProductIndex);
                                setCurrentProductIndex((prev) => Math.max(prev - 1, 0));
                                saveDataToLocalStorage(values);
                              }}
                              disabled={values.products.length === 1}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-600"
                              onClick={() => {
                                push({
                                  name: '',
                                  price: '',
                                  image: '',
                                  color: '',
                                  size: '',
                                  material: '',
                                });
                                setCurrentProductIndex(values.products.length);
                              }}
                            >
                              Add More Curtains
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-center mt-4">
                        {renderPaginationNumbers(values.products.length, currentProductIndex)}
                      </div>
                    </div>
                  )}
                </FieldArray>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Curtains'}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default AddCurtain;
