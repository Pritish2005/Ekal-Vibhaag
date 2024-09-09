import React from 'react'

function Header() {
    const userDetails={
        email:"priti@gmail.com",
        department:"water",
        role:"admin"
      }
  return (
    <div className='flex justify-between border-b border-slate-200 py-4 px-8 items-center'>
      <h1 className='text-2xl font-bold text-slate-800'>EkalVibhaag 🫂</h1>
      <h2>Access Type: {userDetails.role}</h2>
      <button>Logout</button>
    </div>  
  )
}

export default Header
