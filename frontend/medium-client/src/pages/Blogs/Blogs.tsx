import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { BACKEND_URL } from "../../config";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";

export default function Blogs() {
  const [blogs, setBlogs]: any = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //get the blogs here.
    setLoading(true);
    fetch(`${BACKEND_URL}/blog`, {
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
      <div className="header w-4/5 p-5  flex gap-3 sticky top-14 mt-5 left-0 bg-white">
        <Link
          to=""
          className="border-b-2 p-3 items-stretch border-black text-black"
        >
          For you
        </Link>
        <Link to="" className=" p-3 items-stretch text-gray-500">
          Following
        </Link>
      </div>
      <div className="cards w-4/5 flex items-center justify-center flex-col">
        {blogs == "" && <h1 className="text-8xl font-bold text-gray-200 mt-20">No blogs to show</h1>}
        {blogs &&
          blogs.map((blog: any) => {
            const date = new Date(blog.publishedDate);
            const readableDate = date.toLocaleDateString("en-US", {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
             
            });
            return (
              <Card
                title={blog.title}
                link={blog.id}
                content={blog.content}
                author={blog.author.name}
                date={readableDate}
              />
            );
          })}
      </div>
    </div>
  );
}
