import React from 'react'
import { IoIosSearch } from "react-icons/io";

export default function search() {
  return (
    <div>
      <input
        type="text"
        placeholder="Search subjects..."
        className="pl-10 pr-10 py-1 border-2 border-[#1F252D] rounded-2xl mt-1 placeholder:text-[13px] placeholder:text-black"
    />
    <IoIosSearch className='absolute left-3 top-2.5 text-2xl'/>
    </div>
  )
}
