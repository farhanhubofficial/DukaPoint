import React from 'react'
import AboutImage from '../Images/classic-curtains.jpg'
import { Link } from 'react-router-dom'
import { FaChevronRight } from "react-icons/fa6";

function About() {
  return (
    <div className='w-[100%] bg-slate-200 px-3'>
<div className='w-[100%] h-[36rem] relative'>
  <img src= {AboutImage} alt=""  className='w-[100%] h-[36rem] opacity-80'/>
  <h1 className='absolute bottom-14 left-9 text-7xl font-bold text-yellow-300'>About Us</h1>
</div>
<div className='flex  w-80 h-24 justify-around items-center text-2xl text-yellow-800'>
  <Link to= '/'><h1>Home</h1>
  
</Link>
<FaChevronRight className='text-yellow-800'/>
<h1 className='opacity-45'>Contact Us</h1>
</div>
<div className='w-[40%] ml-20 text-xl text-left leading-10 '>
  <h1 className='font-bold text-2xl'>   We are simply fabric lovers!
</h1>
<p>
DECORPOINT is the destination for the creative community looking for the right textures and feeling for their living spaces. We are also considered interior designer’s first choice in Nakuru Kenya for curtains and fabrics.

Offering a wide range of textiles coupled with an exceptional in-store experience and dedicated, passionate service. We deliver premium curtains and textiles combined with upholstery services into the market in Kenya.
<h1  className='font-bold text-2xl'>Established in 2017
</h1>

We have built on our experience year after year with the busy consumer in mind ending up with a client friendly environment providing several types of customer’s needs of curtains in Nakuru. We ensure a simple purchase procedure and an easy access to a wide range of the finest fabric brands and the best quality of fabrics in Kenya. We also combine our product range with the right sense of design and style. Whether it’s your home or office you can take the design to a new level of sophistication with our products, and at DECORPOINT Nakuru we will support you choosing Curtains and Upholstery services that compliment your design’s character.
<h1  className='font-bold text-2xl'>Community</h1>


We stand out among fabric wholesalers in Kenya as a community of passion driven retailers. Our store staff are friendly, helpful, enthusiastic, and passionate about what they do. They are our home experts who will know your needs and will help guiding you through our range of products and services according to your needs.
<h1  className='font-bold text-2xl'>Home décor knowledge in mind
</h1>

Whether moving into a new home, transforming your living space’s look, sharing space, interested in lowering your energy bills or building up a new nursery room! No matter what your experience is you can share it without home design experts, and we will walk you through a solution that suits your lifestyle.
</p>
</div>
    </div>
  )
}

export default About