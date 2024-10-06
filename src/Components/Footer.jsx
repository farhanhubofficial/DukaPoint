import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import Logo from "../Images/Logo.jpg";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='bg-white border h-auto px-4 pt-6 w-full mt-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 font-roboto shadow-lg'>
      {/* Logo Section */}
      <div className='font-bold'>
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="rounded-full w-12 h-12 bg-black mr-2" />
          <h2 className="text-black text-3xl">
            <span className="text-yellow-800">Decor</span>
            <span className="text-black">Point</span>
          </h2>
        </div>
        <p className='font-bold text-xl mt-2'>Fulfilling your long run decorational needs</p>
        <div className='flex space-x-4 mt-4'>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className='text-2xl text-black hover:text-yellow-800' />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className='text-2xl text-black hover:text-yellow-800' />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className='text-2xl text-black hover:text-yellow-800' />
          </a>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className='font-bold'>
        <h3 className='text-2xl mb-2'>Quick Links</h3>
        <ul className='text-black'>
          <li><Link to="/about" className="hover:text-yellow-800">About</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-800">Contact Us</Link></li>
          <li><Link to="/faqs" className="hover:text-yellow-800">FAQs</Link></li>
          <li><Link to="/get-started" className="hover:text-yellow-800">Get Started</Link></li>
        </ul>
      </div>

      {/* Support Section */}
      <div className='font-bold'>
        <h3 className='text-2xl mb-2'>Support</h3>
        <p>Email: <FaEnvelope className='inline text-black' /> support@decorpoint.com</p>
      </div>

      {/* Get in Touch Section */}
      <div className='font-bold'>
        <h3 className='text-2xl mb-2'>Get in Touch</h3>
        <div className='flex items-start'>
          <FaLocationDot className='mt-1 text-xl text-black' />
          <div className='ml-2'>
            <p>Njewa Business Center, Nakuru CBD</p>
            <p>Ground Floor Opposite to Wagaguku Shopping</p>
          </div>
        </div>
        <div className='flex items-start mt-2'>
          <FaEnvelope className='mt-1 text-xl text-black' />
          <div className='ml-2'>
            <p>+254 757068601</p>
            <p>+254 788068601</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
