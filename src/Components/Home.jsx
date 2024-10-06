import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase-config"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Navigation styles
import 'swiper/css/autoplay'; // Autoplay styles (not mandatory but available)

// Import Swiper modules
import { Navigation, Autoplay } from 'swiper/modules'; // Use 'swiper/modules' in v11

function Home() {
  const [products, setProducts] = useState([]);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'curtains')); // Replace 'products' with your collection name
      const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products: ', error);
    }
  };

  // Function to randomly select a subset of products
  const selectRandomProducts = (productsArray, numOfProducts = 6) => {
    const shuffled = [...productsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numOfProducts);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    
    // Detect screen size to toggle navigation arrows
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Tailwind's 'lg' breakpoint
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize); // Update on window resize
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const randomProducts = products.length > 0 ? selectRandomProducts(products, 6) : [];

  return (
    <div className="max-w-screen-xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
      {randomProducts.length > 0 ? (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          speed={1000} // Adjust the transition speed (1000ms = 1 second)
          modules={[Navigation, Autoplay]} // Register modules for v11
          className="shadow-lg p-6"
          navigation={isLargeScreen} // Enable navigation only for large screens
        >
          {randomProducts.map((product) => (
            <SwiperSlide key={product.id} className="flex justify-center items-center">
              <div className="flex flex-col justify-between items-center bg-gray-100 border border-gray-300 rounded-lg text-center p-6 shadow-md">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full max-h-80 object-cover rounded-md shadow-lg"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">Price: ${product.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">No products available</p>
      )}
    </div>
  );
}

export default Home;
