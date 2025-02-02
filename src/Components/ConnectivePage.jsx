import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase-config'; // Import Firebase auth and Firestore
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth listener
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore to fetch user data
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import User from './User';
import Curtains from './Curtains';
import About from './About';
import Vision from './Vision';
import Approach from './Approach';
import AddCurtain from './AddCurtain';
import Cart from './Cart';
import SubproductsPage from './SubproductsPage';
import LoginPage from './LoginPage';
import SignupPage from './SignUpPage';
import Admin from './Admin';
import ProtectedRoute from './ProtectedRoute';
import AdminCurtainsPage from './AdminCurtainsPage';
import EditCurtain from './EditCurtain';
import ManageSalesPage from './ManageSalesPage';
import SalesHistory from './SalesHistory';
import Users from './User';
import Orders from './Orders';
import SalesOverview from './SalesOverview';
import AdminCategories from './AdminCategories';
import AddProducts from './AddProducts';
import Sales from './Sales';
import UserDashboard from './UserDashboard';
import UserSalesOverview from './UserSalesOverview';
import UserCategory from './UserCategory';
import ManageUsers from './ManageUsers';
import ShopSelection from './ShopSelection';
import ManageShops from './ManageShops';
import Home1 from './Home1';

function ConnectivePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false); // Track if the redirect has already happened

  // Check if user is logged in and if they are an admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !hasRedirected) { // Only redirect if user is logged in and hasn't been redirected yet
        try {
          // Fetch role from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
              setIsAdmin(true); // User is admin
              navigate('/admin/orders'); // Redirect to admin panel
              setHasRedirected(true); // Mark that the redirect has happened
              sessionStorage.setItem('hasRedirected', 'true'); // Store the redirect state in sessionStorage
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setIsLoading(false); // Stop loading
    });

    // Restore the redirect state from sessionStorage (this makes sure it only happens once)
    if (sessionStorage.getItem('hasRedirected')) {
      setHasRedirected(true);
    }

    return () => unsubscribe();
  }, [navigate, hasRedirected]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user');
  const showHeader = isAdminRoute || isUserRoute;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-container">
          <div className="spinner"></div> {/* The spinner */}
          <div className="decor-point">DecorPoint</div> {/* The blinking "DecorPoint" */}
        </div>
      </div>
    ); // Show loading spinner while checking authentication
  }

  return (
    <div className='relative min-h-screen flex flex-col'>
      {/* Conditionally render Header and Footer based on the current route */}
      {!showHeader && (
        <div className='sticky z-50 top-0'>
          <Header />
        </div>
      )}

      <main className='flex-grow'>
        <Routes>
          <Route path='user' element={<User />}>
            <Route path='dashboard' element={<UserDashboard />} />
            <Route path='salesOverview' element={<UserSalesOverview />} />
            <Route path='categories' element={<UserCategory />} />
          </Route>
          
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/curtains' element={<Curtains />} />
          <Route path='/vision' element={<Vision />} />
          <Route path='/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path='/managesalespage' element={<ManageSalesPage />} />
          <Route path='/approach' element={<Approach />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/subproducts/:productId' element={<SubproductsPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/addproducts' element={<AddProducts />} />
          <Route path='sales' element={<Sales />} />
          <Route path='shopselection' element={<ShopSelection />} />

          {/* Admin Route with Nested Orders Route */}
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>}>
            <Route path='orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path='AdminCurtainsPage' element={<AdminCurtainsPage />} />
            <Route path='editcurtain/:id' element={<EditCurtain />} />
            <Route path='salesOverview' element={<SalesOverview />} />
            <Route path='adminCategories' element={<AdminCategories />} />
            <Route path='saleshistory' element={<SalesHistory />} />
            <Route path='addcurtains' element={<AddCurtain />} />
            <Route path='manageusers' element={<ManageUsers />} />
            {/* Add more admin nested routes as needed */}
            <Route path='manageshops' element={<ManageShops />} />
          </Route>

        </Routes>
      </main>

      {!showHeader && (
        <footer className='bg-white'>
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default ConnectivePage;
