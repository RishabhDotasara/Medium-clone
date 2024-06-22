import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { BACKEND_URL } from "../../config";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import DraftCard from "./DraftCard";

export default function Blogs() {
  const [blogs, setBlogs]: any = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //get the blogs here.
    setLoading(true);
    fetch(`${BACKEND_URL}/blog?drafts=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
     
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        console.log(data);
        setBlogs(data.blogs);
        setLoading(false);
      });
  }, []);
  return (
    <div className="min-h-screen w-full flex items-center p-10 justify-start flex-col">
      {loading && <Spinner />}
      <Navbar
        actions={
          <Link
            to="/blog/create"
            className="bg-black text-white px-3 py-1 rounded"
          >
            Write
          </Link>
        }
      />
      
      <div className="cards w-4/5 mt-10">
        
        {blogs &&
          blogs.map((blog: any) => {
            return (
              <DraftCard
                title={blog.title}
                link={blog.id}
                content={blog.content}
                author={blog.author.name}
              />
            );
          })}
      </div>
    </div>
  );
}
