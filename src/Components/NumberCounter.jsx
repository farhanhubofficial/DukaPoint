import React from 'react';
import CountUp from 'react-countup';

function NumberCounter() {
  return (
    <div className='container grid grid-cols-2 md:grid-cols-4 gap-8 bg-blue-700 text-white w-[100%]'>
    <div className='flex flex-col items-center justify-center'>
      <p>
        <CountUp start={0} end={82} duration={3} />
      </p>
      <p>Expert Shop Attendants</p>
    </div>
    
    <div className='flex flex-col items-center justify-center'>
      <p>
        <CountUp end={800} separator=',' suffix='+' duration={3} />
      </p>
      <p>Expected Customers</p>
    </div>
    
    <div className='flex flex-col items-center justify-center'>
      <p>
        <CountUp end={298} separator=',' suffix='+' duration={3} />
      </p>
      <p>Trained Employees</p>
    </div>
    
    <div className='flex flex-col items-center justify-center'>
      <p>
        <CountUp end={73545} separator=',' suffix='+' duration={3} />
      </p>
      <p>Total Sales</p>
    </div>
  </div>
  );
}

export default NumberCounter;
