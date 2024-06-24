import  { useState } from "react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { modalAtomState } from "../atoms/modalAtom";
import { LuCrown } from "react-icons/lu";

export default function BlogCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberOnly,setMemberOnly] = useState(false)
  const [action, setAction] = useState("publish")
  const setMsg = useSetRecoilState(modalAtomState)
  const navigate = useNavigate();

  const createBlog = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    
    if (!form.checkValidity) {
      return form.reportValidity();
    } else {
      setLoading(true);
      //make the request to create the blog.
      fetch(`${BACKEND_URL}/blog/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          published: action == 'publish' ? true : false,
          memberOnly: memberOnly? true: false
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setMsg(data.message);
          navigate("/blogs");
        });

      3;
    }
  };

 
  
  return (
    <div className="min-h-screen flex items-center justify-start p-10 flex-col py-20">
      
      {loading && <Spinner />}
      <form
        className="writing-area  w-4/6 flex flex-col gap-5 h-1/2"
        onSubmit={(e) => {
          createBlog(e);
        }}
      >
        <Navbar
          actions={
            <>
              <LuCrown className="text-xl cursor-pointer" onClick={()=>{setMemberOnly(!memberOnly)}} style={{color:memberOnly ? 'rgb(252 211 77)': "gray"}}/>
              <button className="bg-blue-300 h-fit px-2 rounded py-1" onClick={()=>{setAction('draft')}}>
                Save Draft
              </button>
              <button className="bg-green-300 h-fit px-2 rounded py-1" onClick={()=>{setAction('publish')}}>
                Publish
              </button>
            </>
          }
        />
        <input
          type="text"
          placeholder="Title"
          className="text-6xl font-bold outline-none"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name=""
          id=""
          placeholder="Tell your story..."
          onChange={(e) => {
            setContent(e.target.value);
          }}
          required
          className="outline-none resize-none text-xl "
          rows={20}
        ></textarea>
      </form>
    </div>
  );
}
