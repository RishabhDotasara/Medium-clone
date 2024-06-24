import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import Card from "./Blogs/Card";


export default function Blogs() {
  
  const [bookmarkedBlogs, setBookmarkedBlogs]: any = useState(); //bookmarked blogs
  const [loading, setLoading] = useState(false);
 

  const addToListBookmark = (d: any)=>{
    setBookmarkedBlogs([...bookmarkedBlogs,d])
  }

  const removeBookmark = (d: any)=>{
    setBookmarkedBlogs(bookmarkedBlogs.filter((bookmark: any)=>bookmark != d))
  }
  
  const getBookmarks = async ()=>{
    setLoading(true);
    fetch(`${BACKEND_URL}/user/bookmarks`, {
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
        setBookmarkedBlogs(data.bookmarks);
        setLoading(false);
      });
  }
  useEffect(() => {
    //get the blogs here.
    getBookmarks();
  }, []);
  return (
    <div className="min-h-screen w-full flex items-center pt-20 justify-start flex-col">
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
    
      <div className="cards w-4/5 flex items-center justify-center flex-col">
         <h1 className="text-3xl font-bold my-2 text-gray-500">BookMarks</h1>
        {bookmarkedBlogs == "" && <h1 className="text-8xl font-bold text-gray-200 mt-20">No bookmarks to show</h1>}
        {bookmarkedBlogs &&
          bookmarkedBlogs.map((bookmark: any,index: number) => {
            const blog = bookmark.post;
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
                // author={blog.author.name}
                date={readableDate}
                key={index}
                id={blog.id}
                bookmarked={bookmarkedBlogs.includes(blog.id) || blog.bookmarked || bookmark.postID == blog.id}
                bookmark={addToListBookmark}
                memberOnly={blog.memberOnly}
                removeBookmark={removeBookmark}
                bookmarkID={bookmark.id}
                fetchBookmarks = {getBookmarks}
              />
            );
          })}
      </div>
    </div>
  );
}
