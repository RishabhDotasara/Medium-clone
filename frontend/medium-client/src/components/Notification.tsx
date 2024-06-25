
import { IoCloseOutline } from "react-icons/io5";

export default function Notification() {
  return (
    <div className='flex gap-2 w-full justify-between items-center p-3 border-b-2'>
      <span className="font-bold">This is the msg.</span>
      <IoCloseOutline className="text-xl cursor-pointer"/>
    </div>
  )
}
