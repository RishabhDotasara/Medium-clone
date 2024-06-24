
import { BsThreeDots } from "react-icons/bs";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";
import { Link } from "react-router-dom";
import { LuCrown } from "react-icons/lu";
import { BACKEND_URL } from "../../config";
import { useSetRecoilState } from "recoil";
import { modalAtomState } from "../../atoms/modalAtom";
import { ImSpinner3 } from "react-icons/im";
import { useState } from "react";

export default function Card(props: any) {


  const [bookmarkAddLoading, setBAL] = useState(false)
  

  const addBookmark = async ()=>{
    //make the request
    setBAL(true)
    await fetch(`${BACKEND_URL}/user/bookmark/${props.id}`,{
      method:"POST",
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }

    }).then((res)=>res.json()) 
    .then(data=>{
      console.log(data)
      props.bookmark(props.id)
      setBAL(false)
    })
  }

  const removeBookmark = async ()=>{
    //make the request
    setBAL(true)
    await fetch(`${BACKEND_URL}/user/bookmark/${props.bookmarkID}`,{
      method:"DELETE",
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }

    }).then((res)=>res.json()) 
    .then(data=>{
      console.log(data)
     
      props.fetchBookmarks()
      setBAL(false)
    })
  }

 
  
  return (
    <div className="card p-6 rounded w-full  gap-4 flex flex-col min-h-[200] ">
      <div className="author-info flex items-center justify-start gap-3">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABAIDBQEGB//EADoQAAIBAwEDBwkGBwAAAAAAAAECAwAEERIFITETQUJRcZGxFCIjMmGBocHRBhUkUmJyM0RTY4KSwv/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAFBP/EACERAAICAgIDAAMAAAAAAAAAAAABAhMRUQMhEjFBIjJh/9oADAMBAAIRAxEAPwD6+UFGkVjja0vOm73UHbA5yoHXkfWtaTqejZ0CjQKyl2mWIClWPsqbbRZPXwO0ULls1L0aJjFR0YrNO1kG4vHq6gwoG1FY4BT/AHX60blsFL0aOgHiKg0Cmk/K3PBh2ZBqJvWzgOO7f3Vr1s1EtDTQAc2aKWF1KeZj2oRRRvWwUSPHS7et7aQvLYPG2P4gj+dFv9oopzqWK4dVPnclFq795rJmvLOwkj5eedn5vxEjj34Yjvpq12pbOA8cdlHjpSMFINcqUWl6Z0FJbRsQ/aO3mOLeJ9WcEELnuG+iba0kbaza3OCcAKox8aqjAnxI/Ib9+pVLfHNXeSW8zHW8z5GGUHzce0VHzSY7i2ih7/lVJlju0U/2osD4VJL+LoTT5HNmMf8ANFzbWrOpVJAE3AvrAA9m/FXQwWpGXEbDx99MuRYAoSJxX6nUDcKrA9N1Hyq0zhl33lr73LfKqmsdlFtTWkRbnyM1xLXZoYYs4Ru4gGg+SI9cy0PbocreWg6xybA0V0JYAY5CBCOoZ8aKFiNXM8jNa3O1oDLZ2VwrDg8U67u1c7vGpbJg+0FkwR4ICpOnTeDBPYeOe+hLW0ydAzkb9TUNsu3Iy4ChuBXqprfjFqfs0bx5rxuTu7HYiBelczA5PPjAzS4gtVyZrzYaMPV8nYjHVvGM1Wuy7EqBh39obHhUTsy3B9FMV1cVnXOP8qn5x+CTU494K/K0lIjiwzA4wk0i57MmrQbyJfMFyrrublIhKM8eIx4UvLbtaOBoKdTDn+VMQbQltm0xnWuMecp31nJP0iMeXD/LoegudqpvcWRXPFlZada4vUCh7aE54gBvofCkItrRO+bm3GSNOpACcUzbzWwz5PMZB+QgKV7sVKT/AIezinGXqRpNNMqD0Bz+VW3jvxRSjXF7yB5JUQ9HUCynu4VylXZZs86kkjfyEBI6YYgeNMxT3SozeTgK3H0pwfjWUs+nGBj2jjVyXLmUSBjq4bzw+lUaZzvI02vJZ483EAIX1SZcDNVaFK5lWPP733fHdSfLyTN56qOJ1smrT2VeugrkhnLD1iQD3c1I8oPk2MSfiEEI5NVHqhgSR2HPZVybAZlH4kZI4FceJpJboRKyxqx/S2CAKYtdvXNqwiZw8P8ATzvHfRWQ4g/2GBsaNMcqJ3I6O5c0z93WhIElpNu4HPD405BffeMGLeUoeoEZX3VVcSbQjiVTIJADzAZNLmSZ6o8cMdF0MdsF8zCEHpNgjtBorMl2oLIDyu1do2xltHA/Wiim38N5JdHlEhuGGIkLA7yfyjuqSw3LHzFY55vV8TXaKtGWSFSL47C8Vtc9tksMDVIGC+0e3fVtvauZwrAxueLaC2ffRRSuWWUqijQ+7UI9LJI7fpAFXQbNtlBzGx/cT8q7RU3JpFFxx0MxRRRn0FvEhAxkLvq/lplUaozLnjpG8UUUucjpA0fLISqZVuK9VFFFMgNI/9k="
          alt=""
          className="bg-blue-400 w-10 h-10 rounded-full"
        />
        <h3 className="author-name font-600 items-stretch">{props.author || "Unknown"}</h3>
        <li className="date text-gray-500">Posted on {props.date}</li>
        
        {props.memberOnly && <li className="tag text-gray-500 flex items-center justify-center gap-2"><LuCrown className="text-amber-300 text-xl"/></li>}
      </div>
      <div className="content flex mb-8 py-4 justify-between">
        <div className="flex flex-col gap-5 w-3/4">
          <Link to={`/blog/${props.link}`} className="font-bold text-4xl ">{props.title}</Link>
          <p>{props.content}</p>
          <div className="descriptors flex justify-between mt-8">
            <div>
              <span className="bg-gray-200 px-4 py-2 rounded-full mr-3">
                Side Hustle
              </span>
              <span className="text-gray-500">3 min read</span>
            </div>
            <div className="actions flex p-4 gap-4">
              <CiCircleMinus className="text-2xl cursor-pointer" />
              {!bookmarkAddLoading && !props.bookmarked && <CiBookmarkPlus className="text-2xl cursor-pointer" onClick={addBookmark}/>}
              {bookmarkAddLoading && <ImSpinner3 className="text-2xl cursor-pointer animate-spin"/>}
              {!bookmarkAddLoading && props.bookmarked && <IoBookmark className="text-2xl cursor-pointer" onClick={removeBookmark}/>}
              <BsThreeDots className="text-2xl cursor-pointer " />
              
            </div>
          </div>
        </div>
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABAIDBQEGB//EADoQAAIBAwEDBwkGBwAAAAAAAAECAwAEERIFITETQUJRcZGxFCIjMmGBocHRBhUkUmJyM0RTY4KSwv/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAFBP/EACERAAICAgIDAAMAAAAAAAAAAAABAhMRUQMhEjFBIjJh/9oADAMBAAIRAxEAPwD6+UFGkVjja0vOm73UHbA5yoHXkfWtaTqejZ0CjQKyl2mWIClWPsqbbRZPXwO0ULls1L0aJjFR0YrNO1kG4vHq6gwoG1FY4BT/AHX60blsFL0aOgHiKg0Cmk/K3PBh2ZBqJvWzgOO7f3Vr1s1EtDTQAc2aKWF1KeZj2oRRRvWwUSPHS7et7aQvLYPG2P4gj+dFv9oopzqWK4dVPnclFq795rJmvLOwkj5eedn5vxEjj34Yjvpq12pbOA8cdlHjpSMFINcqUWl6Z0FJbRsQ/aO3mOLeJ9WcEELnuG+iba0kbaza3OCcAKox8aqjAnxI/Ib9+pVLfHNXeSW8zHW8z5GGUHzce0VHzSY7i2ih7/lVJlju0U/2osD4VJL+LoTT5HNmMf8ANFzbWrOpVJAE3AvrAA9m/FXQwWpGXEbDx99MuRYAoSJxX6nUDcKrA9N1Hyq0zhl33lr73LfKqmsdlFtTWkRbnyM1xLXZoYYs4Ru4gGg+SI9cy0PbocreWg6xybA0V0JYAY5CBCOoZ8aKFiNXM8jNa3O1oDLZ2VwrDg8U67u1c7vGpbJg+0FkwR4ICpOnTeDBPYeOe+hLW0ydAzkb9TUNsu3Iy4ChuBXqprfjFqfs0bx5rxuTu7HYiBelczA5PPjAzS4gtVyZrzYaMPV8nYjHVvGM1Wuy7EqBh39obHhUTsy3B9FMV1cVnXOP8qn5x+CTU494K/K0lIjiwzA4wk0i57MmrQbyJfMFyrrublIhKM8eIx4UvLbtaOBoKdTDn+VMQbQltm0xnWuMecp31nJP0iMeXD/LoegudqpvcWRXPFlZada4vUCh7aE54gBvofCkItrRO+bm3GSNOpACcUzbzWwz5PMZB+QgKV7sVKT/AIezinGXqRpNNMqD0Bz+VW3jvxRSjXF7yB5JUQ9HUCynu4VylXZZs86kkjfyEBI6YYgeNMxT3SozeTgK3H0pwfjWUs+nGBj2jjVyXLmUSBjq4bzw+lUaZzvI02vJZ483EAIX1SZcDNVaFK5lWPP733fHdSfLyTN56qOJ1smrT2VeugrkhnLD1iQD3c1I8oPk2MSfiEEI5NVHqhgSR2HPZVybAZlH4kZI4FceJpJboRKyxqx/S2CAKYtdvXNqwiZw8P8ATzvHfRWQ4g/2GBsaNMcqJ3I6O5c0z93WhIElpNu4HPD405BffeMGLeUoeoEZX3VVcSbQjiVTIJADzAZNLmSZ6o8cMdF0MdsF8zCEHpNgjtBorMl2oLIDyu1do2xltHA/Wiim38N5JdHlEhuGGIkLA7yfyjuqSw3LHzFY55vV8TXaKtGWSFSL47C8Vtc9tksMDVIGC+0e3fVtvauZwrAxueLaC2ffRRSuWWUqijQ+7UI9LJI7fpAFXQbNtlBzGx/cT8q7RU3JpFFxx0MxRRRn0FvEhAxkLvq/lplUaozLnjpG8UUUucjpA0fLISqZVuK9VFFFMgNI/9k="
          alt=""
          className="w-1/6 h-full bg-green-400 items-stretch mx-4"
        />
      </div>
    </div>
  );
}
