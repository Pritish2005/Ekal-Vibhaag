'use client';
import Image from 'next/image';
import React from 'react';
import Logo from '../assets/Logo.png'

function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {/* Logo */}
      <Image
        src={Logo}
        width={256}
        height={256}
        alt="EkalVibhaag Logo"
        className="w-32 h-32 mb-8"
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">EkalVibhaag</h1>

      {/* Description */}
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-12">
        Welcome to EkalVibhaag, the official platform for managing government departmental tasks and ensuring transparent budget handling. Please select your option to proceed.
      </p>

      {/* Options */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md justify-center">
        <button
          className="py-3 px-6 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all"
          onClick={() => alert('Employee Login/Signup')}
        >
          Login/Signup as Employee
        </button>
        <button
          className="py-3 px-6 bg-gray-200 text-gray-800 text-lg font-semibold rounded-md shadow-md hover:bg-gray-300 transition-all"
          onClick={() => alert('Continue as Guest')}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default Page;
