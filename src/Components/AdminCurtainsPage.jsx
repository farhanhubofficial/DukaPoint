import React, {useEffect} from 'react'
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import { Link } from 'react-router-dom'
import AdminCurtainTilePage from './AdminCurtainTilePage'
function AdminCurtainsPage() {
   
  const { data: allcurtains = [] } = useFetchCurtainsQuery();    


  return (
    <div className='relative'>
      <Link to = '/curtains/Addcurtains'> <button className=' fixed bottom-0 right-0 text-white  bg-black font-bold text-xl mt-9 ml-36  p-1 rounded-lg h-24'>Add More + </button> </Link>
     
 <div className='grid grid-cols-2 lg:grid-cols-4 '>
            {allcurtains && allcurtains.length
              ? allcurtains.map((productItem) => ( <AdminCurtainTilePage product={productItem} />

              ))
              : null}
          </div>
    </div>
  )
}

export default AdminCurtainsPage