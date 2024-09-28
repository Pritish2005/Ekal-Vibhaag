'use client'; // This marks the file as a Client Component

import React from 'react';
import { usePathname } from 'next/navigation';
import { FaTasks, FaLock, FaProjectDiagram } from 'react-icons/fa';
import { MdNotifications, MdAccountCircle, MdLogout } from 'react-icons/md';
import { TfiLayoutListPost } from "react-icons/tfi";
import Logo from '../assets/Logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Header = () => {
    const currentPath = usePathname();
    const { data: session } = useSession(); // Access session data

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' }); // Redirect to login after logout
    };

    return (
        <header className="flex items-center justify-between p-4 bg-gray-100 border-b-2 border-gray-300">
            <Link href="/dashboard">
                <div className="flex items-center space-x-2 cursor-pointer">
                    <Image src={Logo} alt="EkalVibhaag Logo" width={50} height={50} className="w-10" />
                    <h1 className="text-xl font-bold">EkalVibhaag</h1>
                </div>
            </Link>

            {/* Center Section - Navigation Links */}
            <nav className="flex items-center space-x-8">
                {session ? (
                    <Link 
                        href="/dashboard" 
                        className={`flex items-center space-x-1 ${currentPath === '/dashboard' ? 'text-blue-600 font-bold' : 'hover:text-blue-600 text-gray-700'}`}
                    >
                        <FaTasks /> <span>Tasks</span>
                    </Link>
                ) : (
                    <div className={`flex items-center space-x-1 text-gray-700`}>
                        <FaLock /> <span>Locked</span>
                    </div>
                )}
                <Link href="/blogs" className={`flex items-center space-x-1 ${currentPath === '/blogs' ? 'text-blue-600 font-bold' : 'hover:text-blue-600 text-gray-700'}`}>
                    <TfiLayoutListPost /> <span>Blogs</span>
                </Link>
                <Link href="/project-details" className={`flex items-center space-x-1 ${currentPath === '/project-details' ? 'text-blue-600 font-bold' : 'hover:text-blue-600 text-gray-700'}`}>
                    <FaProjectDiagram /> <span>Project Details</span>
                </Link>
            </nav>

            {/* Right Section - Notification, User Details, and Logout */}
            <div className="flex items-center space-x-4">
                <Link href="/notifications" className={`text-gray-700 ${currentPath === '/notifications' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
                    <MdNotifications size={24} />
                </Link>
                <Link href="/user-details" className={`text-gray-700 ${currentPath === '/user-details' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
                    <MdAccountCircle size={24} />
                </Link>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    <MdLogout size={20} /> <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
