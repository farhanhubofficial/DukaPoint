import React from 'react'
import Header from './Header'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import Curtains from './Curtains'
import About from './About'
import Footer from './Footer'
import Vision from './Vision'
import Approach from './Approach'
import Navbar from './Navbar'
import AddCurtain from './AddCurtain'
import Cart from './Cart'
import SubproductsPage from './SubproductsPage';
import LoginPage from './LoginPage'
// import SignupPage from "./components/SignupPage"; 
import SignupPage from './SignUpPage'// Import the SignupPage component
import AdminPanel from './AdminPanel'
import ProtectedRoute from './ProtectedRoute'
import Admin from './Admin'
import AdminCurtainsPage from './AdminCurtainsPage'
import EditCurtain from './EditCurtain'
import Orders from './Orders'

function ConnectivePage() {
  return (
    <div className='relative'>
        <div className='sticky top-0 z-50 '>
         <Header/> 
{/* <Navbar/> */}
        </div>
        {/* <Home/> */}
        <Routes>
          <Route path='/' element ={<Home/>}/>
          <Route path="/About" element = {<About/> } />
          <Route path='/curtains' element ={
            
            
            <Curtains/>}/>
          <Route path='/vision' element = {<Vision/>}/>
          <Route path='/orders' element = {<Orders/>}/>

          <Route path='/Approach' element = {<Approach/>}/>
          <Route path = '/curtains/Addcurtains' element = {<AddCurtain className = "absolute"/>}/>
          <Route path='/Cart' element = {<Cart/>}/>
          <Route path="/subproducts/:productId" element={<SubproductsPage />} />
          <Route path='/Login' element = {<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>} />
          <Route path='/admin' element =
          
          {
          //   <ProtectedRoute>
         
          // </ProtectedRoute>
           <Admin/>
          
          } />
          <Route path = "/AdminCurtainsPage" element = {<AdminCurtainsPage/>} />
          <Route path="/editcurtain/:id" element={<EditCurtain />} />


        </Routes>
        <Footer/>
    </div>
  )
}

export default ConnectivePage