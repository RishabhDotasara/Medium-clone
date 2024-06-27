import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { BACKEND_URL } from "../../config";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";

export default function Blogs() {
  const [blogs, setBlogs]: any = useState();
  const [blogsToRender, setBlogsToRender]: any = useState()
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks]: any = useState([]);
  const [page, setPage] = useState("forYou");

  const addToListBookmark = (d: any) => {
    setBookmarks([...bookmarks, d]);
  };

  const removeFromBookmarksList = (d: any) => {
    setBookmarks(bookmarks.filter((item: any) => item.id != d));
  };

  useEffect(() => {
    //get the blogs here.
    setLoading(true);
    fetch(`${BACKEND_URL}/blog`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        setBlogs(data.blogsToSend);
        setBlogsToRender(data.blogsToSend);
        setLoading(false);
      });
  }, []);

  const loadFollowing = async ()=>{
    setPage("Following");
    setLoading(true)
    setBlogsToRender(await blogsToRender.filter((blog:any)=>blog.following))
    setLoading(false)
  }

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
        <div
          className="p-3 items-stretch cursor-pointer"
          style={{
            color: page == "forYou" ? "black" : "gray",
            borderBottom:page=="forYou" ? 1+"px solid":"none",
            borderColor: page == "forYou" ? "black" : "gray",
          }}
          onClick={() => {
            setPage("forYou");
            setBlogsToRender(blogs)
          }}
        >
          For you
        </div>
        <div
          className=" p-3 items-stretch text-gray-500 cursor-pointer "
          onClick={() => {
            loadFollowing()
          }}
          style={{
            color: page == "Following" ? "black" : "gray",
            borderBottom:page=="Following" ? 1+"px solid":"none",
            borderColor: page == "Following" ? "black" : "gray",
          }}
        >
          Following
        </div>
      </div>
      <div className="cards w-4/5 flex items-center justify-center flex-col">
        {blogs == "" && (
          <h1 className="text-8xl font-bold text-gray-200 mt-20">
            No blogs to show
          </h1>
        )}
        {blogsToRender &&
          blogsToRender.map((blog: any, index: number) => {
            const date = new Date(blog.publishedDate);
            const readableDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            return (
              <Card
                title={blog.title}
                link={blog.id}
                content={blog.content}
                author={blog.author.name}
                date={readableDate}
                key={index}
                id={blog.id}
                bookmarked={bookmarks.includes(blog.id) || blog.bookmarked}
                bookmark={addToListBookmark}
                removeBookmark={removeFromBookmarksList}
                memberOnly={blog.memberOnly}
              />
            );
          })}
      </div>
    </div>
  );
}
