import { useEffect, useState } from 'react'
import Spinner from '../../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../config';
import Navbar from '../../components/Navbar';
import { useSetRecoilState } from 'recoil';
import { modalAtomState } from '../../atoms/modalAtom';

export default function EditBlog() {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();
    const [action, setAction] = useState("publish");
    const setMsg = useSetRecoilState(modalAtomState)
    const {id} = useParams();
    
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    
    if (!form.checkValidity) {
      return form.reportValidity();
    } else {
      setLoading(true);
      //make the request to create the blog.
      fetch(`${BACKEND_URL}/blog/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          published: action == 'publish' ? true : false
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setMsg(data.message);
          navigate("/blogs");
        });

      ;
    }
  };

  const deleteBlog = async () => {
    
  
 
      setLoading(true);
      //make the request to create the blog.
      fetch(`${BACKEND_URL}/blog/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setMsg(data.message);
          navigate("/blogs");
        });

  }
    
    useEffect(()=>{
       
        setLoading(true);
        fetch(`${BACKEND_URL}/blog/${id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",  
                "Authorization":`Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setTitle(data.blog.title);
            setContent(data.blog.content);
            setLoading(false);
        }
        )
    },[])
  return (
    <div className="min-h-screen flex items-center justify-start p-10 flex-col py-20">
    {loading && <Spinner />}
    <form
      className="writing-area  w-4/6 flex flex-col gap-5 h-1/2"
      onSubmit={(e) => {
        // createBlog(e);
        handleSubmit(e)
      }}
    >
      <Navbar
        actions={   
          <>
            <button className="bg-blue-300 h-fit px-2 rounded py-1" onClick={()=>{setAction('draft')}}>
              Save
            </button>
            <button className="bg-green-300 h-fit px-2 rounded py-1" onClick={()=>{setAction('publish')}}>
              Publish
            </button>
            <button className="bg-red-300 h-fit px-2 rounded py-1" onClick={()=>{deleteBlog()}}>
              Delete
            </button>
          </>
        }
      />
      <input
        type="text"
        placeholder="Title"
        className="text-6xl font-bold outline-none"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        name=""
        id=""
        placeholder="Tell your story..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        required
        className="outline-none resize-none text-xl "
        rows={20}
      ></textarea>
    </form>
  </div>
  )
}
