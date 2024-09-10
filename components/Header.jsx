'use client'
import Image from 'next/image'
import React from 'react'
import IndiaFlag from '../assets/IndiaFlag.png'
import { useRouter } from 'next/navigation';

function Header() {
    const userDetails={
        email:"priti@gmail.com",
        department:"water",
        role:"admin"
      }
    const router = useRouter();
  return (
    <div className='flex justify-between border-b border-slate-200 py-4 px-8 items-center'>
      <div className='flex items-center gap-4 cursor-pointer' onClick={()=>router.push('/dashboard')}> 
      <span>
        <Image src={IndiaFlag} alt="India Flag" width={50} height={50} />
      </span>
      <h1 className='text-2xl font-bold text-slate-800'>EkalVibhaag</h1>
      </div>
      <h2>Access Type: <span className='text-slate-800 font-bold'>{userDetails.role}</span></h2>
      <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
    </div>  
  )
}

export default Header
