import React from 'react'
import { IoMdClose } from "react-icons/io";
export default function Modal(props: any) {
    const [showModal, setShowModal] = React.useState(true)
    const color = {
        error:{
            bg: 'red',
            text: 'Error'
        },
        success:{
            bg: 'green',
            text: 'Success'
        },
        warning:{
            bg: 'yellow',
            text: 'Warning'
        }
    }
    if(!props.active){
        return null
    }
  return (
    <div className='bg-white bg-opacity-50 flex items-center justify-center z-30 w-full min-h-screen fixed top-0 left-0'>
      <div className="card w-1/4 p-3 shadow-lg border-2 bg-white">
        <div className={`header flex items-center justify-between cursor-pointer font-bold text-2xl mb-2 border-b-2 pb-2`}>Message<IoMdClose className='text-xl' onClick={()=>{props.setActive(!showModal)}}/></div>
        <p className='text-gray-700'>{props.msg}</p>
      </div>
    </div>
  )
}
