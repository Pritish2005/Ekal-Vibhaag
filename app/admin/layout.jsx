'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiBox, FiUsers, FiClipboard } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleIconClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const menuItems = [
    { href: '/admin', icon: FiHome, label: 'Home' },
    { href: '/admin/showAdminInventory', icon: FiBox, label: 'Inventory' },
    { href: '/admin/showAdminPeople', icon: FiUsers, label: 'Employees' },
    { href: '/admin/showAdminTasks', icon: FiClipboard, label: 'Tasks' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } overflow-hidden`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <h2
            className={`text-xl font-bold text-gray-800 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            Admin Menu
          </h2>
          {isOpen && (
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5"
                />
              </svg>
            </button>
          )}
        </div>
        <nav className="mt-4 flex flex-col gap-3">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <button
                onClick={handleIconClick}
                className={`flex items-center w-full text-left py-2.5 px-4 text-gray-700 hover:bg-gray-200 transition-all duration-300`}
              >
                <item.icon className="w-6 h-6 min-w-[24px]" />
                <span
                  className={`ml-3 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;