import React from 'react'
import L_JHUAPL from "../images/L_jhuapl.png"

export default function JHUAPL() {
  return (
    <div className='flex text-white flex-col justify-center items-center align-middle'>
      <img className='w-12 md:w-24' src={L_JHUAPL.src} alt='JHUAPL Logo' />
      <div className='flex flex-col justify-center items-center align-middle'>
        <h2 className='text-base md:text-xl'>Johns Hopkins University</h2>
        <p className='text-sm'>Applied Physics Laboratory</p>
      </div>
    </div>
  )
}
