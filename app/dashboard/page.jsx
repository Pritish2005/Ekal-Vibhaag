'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

function dashboard() {
  const userDetails={
    email:"priti@gmail.com",
    department:"water",
    role:"admin"
  }
  const router = useRouter()
  return (
    <div>
      <p>Welcome {userDetails.email}</p>
      <button className=' text-blue-600' onClick={()=>router.push('/dashboard/addtask')}>Add Task</button>
    </div>
  )
}

export default dashboard
