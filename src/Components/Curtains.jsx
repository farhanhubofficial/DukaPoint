import React, {useEffect} from 'react'
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import CurtainTile from './CurtainTile'
import { Link } from 'react-router-dom'

function Curtains() {
   
  const { data: allcurtains = [] } = useFetchCurtainsQuery();                            

function Curtains() {
   
  const { data: allcurtains = [] } = useFetchCurtainsQuery();    


  return (
    <div className='relative'>
     
     
 <div className='grid grid-cols-2 lg:grid-cols-4 '>
            {allcurtains && allcurtains.length
              ? allcurtains.map((productItem) => ( <CurtainTile product={productItem} />

              ))
              : null}
          </div>
    </div>
  )
}



  return (
    <div className='relative'>
     
     
 <div className='grid grid-cols-2 lg:grid-cols-4 '>
            {allcurtains && allcurtains.length
              ? allcurtains.map((productItem) => ( <CurtainTile product={productItem} />

              ))
              : null}
          </div>
    </div>
  )
}

export default Curtains 