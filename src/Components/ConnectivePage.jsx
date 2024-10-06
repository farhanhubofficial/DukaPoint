import React from 'react';
import Header from './Header';
import Home from './Home';
import { Route, Routes, useLocation } from 'react-router-dom';
import Curtains from './Curtains';
import About from './About';
import Footer from './Footer';
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
import Users from './Users';
import Orders from './Orders';
import SalesOverview from './SalesOverview';
import AdminCategories from './AdminCategories';
import AddProducts from './AddProducts';
import Sales from './Sales';

function ConnectivePage() {
  const location = useLocation();

  // Check if the current path is an admin-related route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/users');
  const showHeader = isAdminRoute || isUserRoute;

  return (
    <div className='relative min-h-screen flex flex-col'>
      {/* Conditionally render Header and Footer based on the current route */}
      {!showHeader && (
        <div className='sticky top-0 z-50'>
          <Header />
        </div>
      )}

      {/* Main content area that fills available height */}
      <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/curtains' element={<Curtains />} />
          <Route path='/vision' element={<Vision />} />
          <Route path='/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path='/managesalespage' element={<ManageSalesPage />} />
          <Route path='/approach' element={<Approach />} />
          <Route path='/curtains/addcurtains' element={<AddCurtain />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/subproducts/:productId' element={<SubproductsPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/addproducts' element={<AddProducts />} />
          <Route path='sales' element={<Sales />} />
          {/* Admin Route with Nested Orders Route */}
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>}>
            <Route path='orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path='AdminCurtainsPage' element={<AdminCurtainsPage />} />
            <Route path='editcurtain/:id' element={<EditCurtain />} />
            <Route path='salesOverview' element={<SalesOverview />} />
            <Route path='adminCategories' element={<AdminCategories />} />
            <Route path='saleshistory' element={<SalesHistory />} />
           
            {/* Add more admin nested routes as needed */}
          </Route>
        </Routes>
      </main>

      {/* Conditionally render Footer based on the current route */}
      {!showHeader && (
        <footer className='bg-white'>
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default ConnectivePage;
