import React from 'react'
import CurtApproach from '../Images/Approach.jpg'
import { Link } from 'react-router-dom'
import { FaChevronRight } from "react-icons/fa6";

function Approach() {
  return (
    <div className='w-[100%] bg-slate-300 '>
<div className='w-[100%] h-[36rem] relative'>
  <img src= {CurtApproach} alt=""  className='w-[100%] h-[36rem]  '/>
  <h1 className='absolute bottom-1 left-16 text-7xl font-bold text-yellow-800'>Our Approach</h1>
</div>
<div className='border-b-2 border-slate-400'>
<div className='flex  w-80 h-24 justify-around items-center text-2xl text-yellow-800'>
  <Link to= '/'><h1>Home</h1>
  
</Link>
<FaChevronRight className='text-yellow-800'/>
<h1 className='opacity-45'>Our Approach</h1>
</div>
</div>
<div className='flex max-[1228px]:flex-col max-[1228px]:gap-80  gap-7 '>
<div className='w-[40%] ml-20 text-xl text-left leading-10 h-[60rem] '>
    <h1 className='text-4xl mb-20 mt-14'>Our Approach</h1>
    <p className='mb-12'>At House of Linen, we have a proven track record in delivering client projects to the most demanding of timescales, within budget and with the lowest possible client risk.</p>
    <p className='mb-12'>
All our projects are led by a highly experienced Director and a team with a passion for delivering high quality line supply and (fix) solutions alongside an excellent level of service.</p>

<p className='mb-12'>We adopt a collaborative approach working with the client, interested stakeholders and our design teams to define a clear brief, which sets out the aims and objectives of the project or client needs; and a programme and budget that is specific and realistic.</p>
<p>

Our approach is to achieve the best balance of quality, cost, function, efficiency, maintainability and project delivery.
</p>




</div>


<img src= {CurtApproach} alt="" className='h-[40rem]  w-[30rem]  mt-28 mr-10 ' />
</div>


    </div>
  )
}

export default Approach