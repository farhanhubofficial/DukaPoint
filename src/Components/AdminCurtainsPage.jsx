import React, {useEffect} from 'react'
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import { Link } from 'react-router-dom'
import AdminCurtainTilePage from './AdminCurtainTilePage'
function AdminCurtainsPage() {
   
  const { data: allcurtains = [] } = useFetchCurtainsQuery();    


  return (
    <div className='relative'>
      
     
 <div >
  
 {allcurtains && allcurtains.length ? (
  <div className='relative'>
    <div className='grid grid-cols-2 lg:grid-cols-4 '>
    {allcurtains.map((productItem) => (
      <AdminCurtainTilePage key={productItem.id} product={productItem} />
    ))}
    </div>
  
    <Link to = '/curtains/Addcurtains'> <button className=' fixed bottom-0 right-0 text-white  bg-black font-bold text-xl mt-9 ml-36  p-1 rounded-lg h-24'>Add More + </button> </Link>
  </div>
) : null}

              
              
              <h1>hhh</h1>
          </div>
    </div>
  )
}

export default AdminCurtainsPage