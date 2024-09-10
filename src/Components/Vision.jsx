import React from 'react'
import AboutImage from '../Images/Vision.jpg'
import { Link } from 'react-router-dom'
import { FaChevronRight } from "react-icons/fa6";

function Vision() {
  return (
    <div className='w-[98%] bg-slate-200 mx-3 '>
    <div className='w-[100%] h-[36rem] relative'>
      <img src= {AboutImage} alt=""  className='w-[100%] h-[36rem] opacity '/>
      <h1 className='absolute bottom-5 left-9 text-7xl font-bold text-yellow-800'>Vission, Mission And Core Values</h1>
    </div>
    <div className='flex  w-80 h-24 justify-around items-center text-2xl text-yellow-800'>
      <Link to= '/'><h1>Home</h1>
      
    </Link>
    <FaChevronRight className='text-yellow-800'/>
    <h1 className='opacity-45'>Contact Us</h1>
    </div>
    <div className='w-[94%] ml-20 text-xl text-left leading-[10rem] '>
        <div className='leading-10 mb-12 '>  <h1 className='text-2xl border-b-2 border-yellow-800 w-44'>VISION</h1> 
To be the trusted linen partner with cutting-edge solutions and a passionate team to deliver distinct customer experience in our products and services.</div>
 <div className='leading-10 mb-12'><h1 className='2xl border-b-2 border-yellow-800 w-44'>MISSION</h1>
<li>Add-Value to the value chain of our customers business processes via strong partnerships with our distinct interior services.</li>
<li>Establish comprehensive business processes and methodologies to provide the highest customer satisfaction.</li>

<li>Create the best working environment to attract and retain talented and committed staff, to perform the best services in the interior design industry.</li>
</div>
<div className='leading-10 mt-12'><h1 className='text-2xl border-b-2 border-yellow-800 w-44'>CORE VALUES
</h1>
<li>Integrity: To act with honesty and to be truthful with our actions.</li>
<li>Service Excellence: To constantly strive to improve service quality and exceed
expectations.</li>
<li>Teamwork: Company before Group and Group before Self.
Responsibility and Dependability: To be accountable for one’s own decisions,
actions and results.</li>
<li>Communication: To communicate constantly, respectfully and openly with
customers, colleagues and partners.</li>
</div>

    </div>
        </div>
  )
}

export default Vision