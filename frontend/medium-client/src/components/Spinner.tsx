import React from 'react'
import { CgSpinnerTwo } from "react-icons/cg";

export default function Spinner() {
  return (
    <div className='bg-white bg-opacity-50 z-10 fixed top-0 left-0 min-h-screen w-full flex items-center justify-center'>
      <CgSpinnerTwo className='text-5xl animate-spin'/>
    </div>
  )
}
