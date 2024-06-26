
import { IoCloseOutline } from "react-icons/io5";
import { BACKEND_URL } from "../config";

export default function Notification(props: any) {

  const deleteNotification = async ()=>{
    props.remove(props.notification.id)
    fetch(`${BACKEND_URL}/user/notification/${props.notification.id}`,{
      method:"DELETE",
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res=>res.json())
    .then(data=>{
      console.log(data)
    })
  }

  return (
    <div className='flex gap-2 w-full justify-between items-center p-3 hover:bg-gray-100 rounded cursor-pointer'>
      <span className="font">{props.notification.message}</span>
      <IoCloseOutline className="text-xl cursor-pointer" onClick={deleteNotification}/>
    </div>
  )
}
