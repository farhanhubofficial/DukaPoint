import React, { useState } from 'react';
import HeroImage from "../Images/classic-curtains.jpg";
import { FaPlay } from "react-icons/fa";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { GrYoga } from "react-icons/gr";
import { GiGymBag } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa6";

const sliderRight = (duration) => ({
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration, delay: 0.1, stiffness: 100 },
  },
});

const slideLeft = (delay) => ({
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, delay: delay, stiffness: 100 },
  },
});

const BannerData = {
  image: HeroImage,
  tag: "CUSTOMIZE WITH YOUR SCHEDULE",
  title: "Personalized Professional Online Tutor on Your Schedule",
  subtitle: "Our scheduling system allows you to select based on your free time. Keep track of your students' class and tutoring schedules, and never miss your lectures. The best online class scheduling system with easy accessibility.",
  link: "#"
};

function Home1() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const handleCloseBanner = () => {
    setIsBannerVisible(false);
  };

  const whyChooseData = [
    {
      id: 1,
      title: "one-on-one serving",
      desc: "All of our products and materials have lasting quality with diverse color-appealing power",
      icon: <GrYoga />,
      bgColor: "#0063ff",
      delay: "0.3"
    },
    {
      id: 2,
      title: "12/7 service Availability",
      desc: "Our attendants are always available to respond as quickly as possible for you both physically and online",
      icon: <FaDumbbell />,
      link: '/',
      bgColor: "#73bc00",
      delay: "0.6"
    },
    {
      id: 3,
      title: "Interactive Online Store",
      desc: "Our digital online store is interactive and allows smooth running",
      icon: <GiGymBag />,
      bgColor: "#fa6400",
      delay: "0.9"
    },
    {
      id: 4,
      title: "Affordable prices",
      desc: "Choose a collective set of decorative items for your whole house to look smart",
      icon: <GiGymBag />,
      bgColor: "#fe6baa",
      delay: "0.9"
    }
  ];

  return (
    <>
      {isBannerVisible && (
        <motion.div
          className='bg-yellow-700 hidden lg:block text-white py-4 text-center relative'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className='text-lg'>
            Are you looking for good quality curtains, shears, carpets, pillows, and almost all interior house decorative materials?
            <span className='font-bold'> Talk to us!</span>
          </p>
          <button 
            onClick={handleCloseBanner} 
            className='absolute top-4 right-16 text-xl font-bold'
          >
            &times; {/* Close sign */}
          </button>
        </motion.div>
      )}

      <div>
        <div className="container mx-auto px-4 md:px-8 lg:px-16 h-auto mt-1 flex flex-col lg:flex-row items-start">
          <div className='flex flex-col justify-center w-full md:w-1/2 py-14'>
            <div className="text-center md:text-left space-y-6">
              <motion.p
                variants={sliderRight(0.4)}
                initial="hidden"
                animate="visible"
                className='text-orange-600 uppercase'
              >
                100% Satisfaction Guarantee
              </motion.p>
              <motion.h1
                variants={sliderRight(0.4)}
                initial="hidden"
                animate="visible"
                className='text-5xl font-semibold lg:text-6xl !leading-tight'
              >
                Find Your Perfect Decoration <span className='text-primary'>Shop</span>
              </motion.h1>
              <motion.p
                variants={sliderRight(0.4)}
                initial="hidden"
                animate="visible"
              >
                We will help you served in a 1-on-1 catch up. Asking about our services is completely free and confidential.
              </motion.p>

              <motion.div
                variants={sliderRight(0.4)}
                initial="hidden"
                animate="visible"
                className='flex gap-8 justify-center md:justify-start !mt-8'
              >
                <button className="primary-btn rounded-full bg-yellow-700 p-4 w-40 text-white text-lg font-semibold">Get Started</button>
                <button className='flex justify-end items-center gap-2 font-semibold'>
                  <span className="w-10 h-10 rounded-full flex justify-center items-center bg-black bg-opacity-10">
                    <FaPlay className='text-secondary text-blue-700 rounded-full text-sm' />
                  </span>
                  See how it works
                </button>
              </motion.div>
            </div>
          </div>
          <motion.div className='flex justify-center w-full md:w-1/2 lg:mt-11'>
            <motion.img
              src={HeroImage}
              alt=""
              className='w-full max-w-[350px] object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
            />
          </motion.div>
        </div>

        <div className='bg-yellow-800 text-white w-full py-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='flex flex-col items-center'>
              <p className='text-4xl font-bold'>
                <CountUp start={0} end={82} duration={3} />
              </p>
              <p className='mt-2 text-lg'>Expert Shop Attendants</p>
            </div>

            <div className='flex flex-col items-center'>
              <p className='text-4xl font-bold'>
                <CountUp end={800} separator=',' suffix='+' duration={3} />
              </p>
              <p className='mt-2 text-lg'>Expected Customers</p>
            </div>

            <div className='flex flex-col items-center'>
              <p className='text-4xl font-bold'>
                <CountUp end={298} separator=',' suffix='+' duration={3} />
              </p>
              <p className='mt-2 text-lg'>Trained Employees</p>
            </div>

            <div className='flex flex-col items-center'>
              <p className='text-4xl font-bold'>
                <CountUp end={73545} separator=',' suffix='+' duration={3} />
              </p>
              <p className='mt-2 text-lg'>Total Sales</p>
            </div>
          </div>
        </div>
        
        <div className='bg-white'>
          <div className='container py-24'>
            <div className='space-y-4 p-6 text-center'>
              <h1 className='uppercase font-semi-bold text-orange-600'>Why Choose Us</h1>
              <p className='font-semibold text-3xl max-w-[500px] mx-auto mb-5'>Benefits of shopping services with us</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
              {whyChooseData.map((item) => (
                <motion.div
                  variants={slideLeft(item.delay)}
                  initial="hidden"
                  whileInView={"visible"}
                  key={item.id} className='flex flex-col items-center space-y-4 p-6 rounded-xl shadow-md transition-transform transform hover:scale-105'>
                  <div
                    style={{ backgroundColor: item.bgColor }}
                    className='w-10 h-10 rounded-lg flex justify-center items-center text-white'
                  >
                    {item.icon}
                  </div>
                  <h3 className='font-semibold text-lg text-center'>{item.title}</h3>
                  <p className='text-sm text-gray-500 text-center'>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* New Flexbox Section for Tutoring Scheduling */}
        <div className='flex flex-col lg:flex-row items-center py-12'>
          <motion.img
            src={BannerData.image}
            alt=""
            className='w-[400px] object-cover rounded-lg shadow-lg'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
          />
          <div className='flex flex-col justify-center text-center md:text-left'>
            <motion.h2
              className='text-2xl font-bold text-yellow-700'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {BannerData.tag}
            </motion.h2>
            <motion.h1
              className='text-4xl font-semibold my-4'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {BannerData.title}
            </motion.h1>
            <motion.p
              className='text-lg text-gray-800 max-w-xl mx-auto'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {BannerData.subtitle}
            </motion.p>
            <motion.a
              href={BannerData.link}
              className='mt-6 inline-block bg-yellow-700 text-white py-2 px-6 rounded-full font-semibold'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Get Started
            </motion.a>
          </div>
        </div>

        <div className='bg-white'>
          <div className="container">
            <div className="grid">
              {/* You can add more content here if needed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home1;
