import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { LiaEditSolid } from "react-icons/lia";
import Spinner from '../components/Spinner';
import { BACKEND_URL } from '../config';
import { useNavigate, useParams } from 'react-router-dom';

export default function Blog() {

  const [blog, setBlog]: any = useState()
  const [loading, setLoading] = useState(false)
  const {id} = useParams()

  const navigate = useNavigate()
  //fetch the blog in useeffect block
  useEffect(()=>{
    setLoading(true)
    fetch(`${BACKEND_URL}/blog/${id}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${localStorage.getItem("token")}`,
        "Content-Type":"application/json"
      }
    }).then(res=>res.json())
    .then(data=>{
      
          console.log(data  )
          // setMsg(data.message)
          setBlog(data.blog)
       
      setLoading(false)
    
    })
  },[])

  return (
    <div className=' w-full min-h-screen flex items-start pt-20 justify-center'>
      <Navbar actions={<>
            <LiaEditSolid className='text-3xl cursor-pointer' onClick={()=>{navigate(`/blog/edit/${id}`)}}/>
        </>}/>
      <div className="content w-3/4 text-center flex flex-col gap-4 ">
        <div className="title text-6xl font-bold leading-tight  ">{blog && blog.title}</div>
          <p className='text-xl '>{blog && blog.content}</p>
      </div>
      <div className="author-info flex w-1/6 flex-col gap-4 items-start sticky top-10 right-10">
        <h3 className='font-bold text-xl '>Author</h3>
        <div className='flex gap-4 items-center justify-center'>
          <img src="#" alt="" className='w-10 h-10 bg-green-400 rounded-full'/>
          <h3 className='text-xl'>{blog && blog.author.name}</h3>
        </div>
      </div>
      {loading && <div className='text-3xl'><Spinner/></div>}
    </div>
  )
}
