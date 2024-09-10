import React from 'react'
import curtains from './data'
import Hero2 from './Hero2'
import { GlobalContext } from "../Context/Index";
import { useDispatch } from "react-redux";
import { Circles } from "react-loader-spinner";
import CurtainTile from "./CurtainTile";
import { useContext } from "react";


function Hero() {
  const { logos, loading, setLoading, setLogos} = useContext(GlobalContext);

  return (
    <div>
    {loading ? (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Circles
          height={"120"}
          width={"120"}
          color="rgb(127,29,29)"
          visible={true}
        />
      </div>
    ) : (
      <div>
        <div className="flex items-center justify-center p-2">
         
        </div>
        <div className="min-h-[80vh] grid sm: grid-cols-2 md:grid-cols-3 space-x-5 lg:grid-cols-4 max-w-6xl mx-auto p-3">
          {curtains && curtains.length
            ? curtains.map((productItem) => (
                <Hero2 product={productItem} />
              ))
            : null}
        </div>
      </div>
    )}
  </div>
  )
}

export default Hero