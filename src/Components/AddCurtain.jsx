import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAddCurtainMutation } from '../Store/Api/CurtSlice';

function AddCurtain() {
  const [addCurtain, { isLoading }] = useAddCurtainMutation();
  const navigate = useNavigate();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Load initial values from local storage or set default
  const [initialValues, setInitialValues] = useState(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      products: [
        {
          name: '',
          id: '',
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
        id: Yup.string().required('ID is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        image: Yup.string().required('Image URL is required'),
        color: Yup.string().required('Color is required'),
        size: Yup.string().required('Size is required'),
        material: Yup.string().required('Material is required'),
      })
    ),
  });

  const handleSubmit = async (values) => {
    try {
      for (const product of values.products) {
        await addCurtain(product).unwrap();
      }
      // Clear local storage on successful submission
      localStorage.removeItem('formData');
      navigate('/'); // Redirect to the curtain list or desired page
    } catch (err) {
      console.error('Failed to add curtain:', err);
    }
  };

  // Save form data to local storage whenever values change
  const saveDataToLocalStorage = (values) => {
    localStorage.setItem('formData', JSON.stringify(values));
  };


  const renderPaginationNumbers = (totalProducts, currentIndex) => {
    const numbers = [];
    const limit = 5; // Limit the number of visible numbers

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
          enableReinitialize={true} // Reinitialize form with new initialValues
        >
          {({ values }) => {
            useEffect(() => {
              // Update local storage whenever form values change
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
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.name`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">ID</label>
                            <Field
                              type="text"
                              name={`products.${currentProductIndex}.id`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.id`}
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
                              placeholder = "price"
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
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.color`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Image URL
                            </label>
                            <Field
                              type="text"
                              name={`products.${currentProductIndex}.image`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.image`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Material</label>
                            <Field
                              type="text"
                              name={`products.${currentProductIndex}.material`}
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
                              placeholder = "insert the size in meters"
                            />
                            <ErrorMessage
                              name={`products.${currentProductIndex}.size`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                          <div className=" grid grid-col-2  gap-2 lg:flex justify-between space-x-2">
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
                                  id: '',
                                  price: '',
                                  image: '',
                                  color: '',
                                  size: '',
                                  material: '',
                                });
                                setCurrentProductIndex(values.products.length);
                                saveDataToLocalStorage(values);
                              }}
                            >
                              Add Another Product
                            </button>
                          </div>
                          <div className="   grid grid-col-2  gap-2  lg:flex justify-between mt-4">
                            <button
                              type="button"
                              className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
                              onClick={() =>
                                setCurrentProductIndex((prev) => Math.max(prev - 1, 0))
                              }
                              disabled={currentProductIndex === 0}
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
                              onClick={() =>
                                setCurrentProductIndex((prev) =>
                                  Math.min(prev + 1, values.products.length - 1)
                                )
                              }
                              disabled={currentProductIndex === values.products.length - 1}
                            >
                              Next
                            </button>
                          </div>

                          <div className="mt-4 flex justify-center">
                          {renderPaginationNumbers(values.products.length, currentProductIndex)}
                        </div>


                        </div>
                      )}
                      <div className="flex justify-end mt-4">
                        <span className="text-lg font-medium mr-4">
                          Total Products: {values.products.length}
                        </span>
                      </div>
                    </div>
                  )}
                </FieldArray>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                  >
                    {isLoading ? 'Adding...' : 'Add Products'}
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
