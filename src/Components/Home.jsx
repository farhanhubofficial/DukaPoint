import React from 'react'
import HomeImage from "../Images/ac16.jpg";
// import Hero from './Hero';
function Home() {
  return (
    <div className='  w-[97%] '>
        
            <img src= {HomeImage} alt="hry"  className='w-[150rem] h-[40rem]  ml-6 mr-6 max-[600px]:ml-0 max-[600px]:mr-0'/>
            {/* <Hero className = "absolute bottom-96"   /> */}
        
    </div>
  )
}

export default Home