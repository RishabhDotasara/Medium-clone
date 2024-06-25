import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { LiaEditSolid } from "react-icons/lia";
import Spinner from "../components/Spinner";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { modalAtomState } from "../atoms/modalAtom";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";

export default function Blog() {
  const [blog, setBlog]: any = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const setMsg = useSetRecoilState(modalAtomState);

  const navigate = useNavigate();

  const [bookmarkAddLoading, setBAL] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [folLoading, setFolLoading] = useState(false);

  //bookmark functions
  const getBookmark = async () => {
    // setBAL(true);
    await fetch(`${BACKEND_URL}/user/bookmark/post/${blog.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setBlog({ ...blog, bookmarkID: data.bookmark.id });
        // console.log("New bookmark id sent!")
        // console.log(blog)
        setBookmarked(true);
        setBAL(false);
      });
  };

  const addBookmark = async () => {
    //make the request
    setBAL(true);
    await fetch(`${BACKEND_URL}/user/bookmark/${blog.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async () => {
        // console.log(data);
        await getBookmark();
        await setBAL(false);
        await setBookmarked(true);
      });
  };

  const removeBookmark = async () => {
    //make the request
    setBAL(true);
    await fetch(`${BACKEND_URL}/user/bookmark/${blog.bookmarkID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setBAL(false);
        setBookmarked(false);
      });
  };

  //following function
  const addFollower = async () => {
    setFolLoading(true)
    const followeeId = blog.author.id;
    //create a request to make a follow request
    fetch(`${BACKEND_URL}/user/follow/${followeeId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        // console.log(data);
        getFollow()
        setFollowing(true);
        setFolLoading(false)
      });
  };

  const removeFollower = async () => {
    setFolLoading(true)
    const requestID = blog.followRequestID;
    fetch(`${BACKEND_URL}/user/follow/${requestID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setFolLoading(false)
        setFollowing(false)
      });
  };

  const getFollow = async () => {
    await fetch(`${BACKEND_URL}/user/follow/followee/${blog.author.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setBlog({ ...blog, followRequestID: data.request.id});
        // console.log("New bookmark id sent!")
        // console.log(blog)
        // setBookmarked(true);
        // setBAL(false);
      });
  
  };

  //fetching function for initial load
  const getBlog = async () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/blog/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: any) => {
        // console.log(data);
        // setMsg(data.message)
        if (data.blog) {
          setBlog(data.blog);
          setBookmarked(data.blog.bookmarked);
          setFollowing(data.blog.following);
        } else {
          setMsg(data.message);
          navigate("/blogs");
        }

        setLoading(false);
      });
  };

  //fetch the blog in useeffect block
  useEffect(() => {
    getBlog();
  }, []);

  return (
    <div className=" w-full min-h-screen flex items-start pt-20 justify-center">
      <Navbar
        actions={
          <>
            <LiaEditSolid
              className="text-3xl cursor-pointer"
              onClick={() => {
                navigate(`/blog/edit/${id}`);
              }}
            />
          </>
        }
      />
      <div className="content w-3/4 text-center flex flex-col gap-4 ">
        <div className="title text-6xl font-bold leading-tight  ">
          {blog && blog.title}
        </div>
        <p className="text-xl ">{blog && blog.content}</p>
      </div>
      <div className="author-info flex w-1/6 flex-col gap-4 items-start sticky top-10 right-10">
        <h3 className="font-bold text-xl ">Author</h3>
        <div className="flex gap-4 items-center justify-between w-full">
          <div className="flex gap-2 items-center">
            <img
              src="#"
              alt=""
              className="w-10 h-10 bg-green-400 rounded-full"
            />
            <h3 className="text-xl">{blog && blog.author.name}</h3>
          </div>
          {!following && (
            <button
              className="bg-black text-white p-2 rounded-full px-3 flex gap-2 items-center justify-center transition-1"
              onClick={() => {
                addFollower();
              }}
              
            >
              Follow
              {folLoading && <ImSpinner8 className="text-xl animate-spin transition duration-500" />}
            </button>
          )}
          {following && (
            <button
              className="bg-white border-2 border-black text-black p-2 rounded-full px-3 flex gap-2 items-center justify-center"
              
              onClick={removeFollower}
            >
              Following
              {folLoading && <ImSpinner8 className="text-xl animate-spin" />}
            </button>
          )}
        </div>
        <div className="actions w-full border-t-2 p-3 flex gap-2 items-center justify-start">
          {bookmarked && !bookmarkAddLoading && (
            <IoBookmark
              className="text-3xl cursor-pointer"
              onClick={() => {
                removeBookmark();
                setBookmarked(false);
              }}
            />
          )}
          {!bookmarked && !bookmarkAddLoading && (
            <CiBookmarkPlus
              className="text-3xl cursor-pointer"
              onClick={() => {
                addBookmark();
              }}
            />
          )}
          {bookmarkAddLoading && (
            <ImSpinner8 className="text-xl animate-spin" />
          )}
        </div>
      </div>
      {loading && (
        <div className="text-3xl">
          <Spinner />
        </div>
      )}
    </div>
  );
}
