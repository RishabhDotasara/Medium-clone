import React from 'react'
import Navbar from '../components/Navbar'

export default function Blog() {
  return (
    <div className='bg-green-400 w-full min-h-screen flex items-center justify-center'>
      <Navbar/>
      <div className="content"></div>
      <div className="author-info"></div>
    </div>
  )
}
