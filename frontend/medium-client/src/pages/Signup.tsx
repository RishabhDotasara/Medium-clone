import React, { Context, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import { BACKEND_URL } from "../config";
import Spinner from "../components/Spinner";
import { useSetRecoilState } from "recoil";
import { modalAtomState } from "../atoms/modalAtom";


export default function Signup(props: any) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false)
  const setMsg = useSetRecoilState(modalAtomState);

  const navigate = useNavigate()

  const signup = async (e: any) => {
    setLoading(true)
    e.preventDefault();
    // Check the validity of the form
    const form = e.target;
    if (form.checkValidity() === false) {
      form.reportValidity();
    } else { 
      // Make a request to the server
      if (username.length < 1) {
       await setUsername(email.split("@")[0]);
      }
      console.log(username)
      fetch(`${BACKEND_URL}/user/signup`,{
        method:"POST",
        body:JSON.stringify({
          username:username,
          email: email,
          password: password
        })
      })
      .then(res=>{
        return res.json()
      })
      .then(data=>{
        console.log(data)
        if (data.error)
          {
            setMsg("Erro while logging in"+data.error)
          }
        else 
        {
          localStorage.setItem('token',data.jwt)
          setMsg("SignUp successful!")
          setLoading(false)
          navigate("/blogs")
        }
      })
    }
  };

  const signin = async (e: any)=>{
    setLoading(true)
    e.preventDefault();
    // Check the validity of the form
    const form = e.target;
    if (form.checkValidity() === false) {
      form.reportValidity();
    } else { 
      // Make a request to the server
      fetch(`${BACKEND_URL}/user/signin`,{
        method:"POST",
        body:JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(res=>{
        if (res.ok)
          {
            return res.json()
          }
        else 
        {
          setMsg("Error while signing in")
        }
      })
      .then(data=>{
        console.log(data)
        localStorage.setItem('token',data.jwt)
        setMsg("Logged in successfully!")
        setLoading(false)
        navigate("/blogs")
      })
    }
  }

  // Rest of your component...


  if (props.config == "signup") {
    return (
      <div className="flex w-full bg-white min-h-screen justify-center items-center ">
        {loading && <Spinner/>}
        <form
          className="card bg-white w-full sm:w-1/2 flex items-center justify-center flex-col gap-1 min-h-screen"
          onSubmit={(e) => {
            signup(e);
          }}
        >
          <h1 className="font-bold text-3xl">Create an account</h1>
          <h3 className="text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="hover:text-black">
              Login
            </Link>
          </h3>
          {/* INPUTS */}
          <div className="w-2/3">
            <h3 className="font-bold my-3">Username</h3>
            <input
              type="text" 
              placeholder={email === "" ? "John Doe | Optional | 5 character min" : email.split("@")[0]}
              className="p-3 px-5 w-full border-2 border-gray-200 rounded"
              onChange={(e) => {
                setUsername(e.target.value);
                console.log(username)
              }}
              value={username}
            />
          </div>
          <div className="w-2/3">
            <h3 className="font-bold my-3">Email</h3>
            <input
              type="email"
              placeholder="johndoe@email.com"
              className="p-3 px-5 w-full  border-2 border-gray-200 rounded"
              onChange={(e) => {
                setEmail(e.target.value);
                if (username.length < 5)
                  {

                    setUsername(e.target.value.split("@")[0])
                  }

                console.log(username) 
              }}
              value={email} 
              required
            />
          </div>
          <div className="w-2/3">
            <h3 className="font-bold my-3">Password</h3>
            <input
              type="password"
              placeholder="*********"
              className="p-3 px-5 w-full  border-2 border-gray-200 rounded"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required
            />
          </div>
          <button
            className="bg-black w-2/3 my-5 p-3 rounded text-white"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <div className=" flex-1/2 bg-gray-100 w-1/2  p-10 flex flex-col items-center justify-center min-h-screen hidden lg:flex">
          <h1 className="font-bold text-2xl my-3 w-3/4">
            "The customer service I recieved was exceptional. The support team
            went above and beyond to address my concerns."
          </h1>
          <h3 className="text-xl font-bold">Rishabh Dotasara</h3>
          <h3 className="text-gray-500">CEO, Apple Inc.</h3>
        </div>
      </div>
    );
  }
  else if (props.config == "signin") 
  {
    return (
      <div className="flex w-full bg-white min-h-screen justify-center items-center ">
          {loading && <Spinner/>}
        <form
          className="card bg-white w-full sm:w-1/2 flex items-center justify-center flex-col gap-1 min-h-screen"
          onSubmit={(e) => {
            signin(e);
          }}
        >
          <h1 className="font-bold text-3xl">Login to account</h1>
          <h3 className="text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="hover:text-black">
              Signup
            </Link>
          </h3>
          {/* INPUTS */}
          
          <div className="w-2/3">
            <h3 className="font-bold my-3">Email</h3>
            <input
              type="email"
              placeholder="johndoe@email.com"
              className="p-3 px-5 w-full  border-2 border-gray-200 rounded"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              required
            />
          </div>
          <div className="w-2/3">
            <h3 className="font-bold my-3">Password</h3>
            <input
              type="password"
              placeholder="*********"
              className="p-3 px-5 w-full  border-2 border-gray-200 rounded"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required
            />
          </div>
          <button
            className="bg-black w-2/3 my-5 p-3 rounded text-white"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <div className=" flex-1/2 bg-gray-100 w-1/2  p-10 flex flex-col items-center justify-center min-h-screen hidden lg:flex">
          <h1 className="font-bold text-2xl my-3 w-3/4">
            "The customer service I recieved was exceptional. The support team
            went above and beyond to address my concerns."
          </h1>
          <h3 className="text-xl font-bold">Rishabh Dotasara</h3>
          <h3 className="text-gray-500">CEO, Apple Inc.</h3>
        </div>
      </div>
    );
  }
}
