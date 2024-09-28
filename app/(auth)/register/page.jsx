"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const department = e.target[2].value;
    const password = e.target[3].value;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          department,
        }),
      });

      if (res.status === 201) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  const departments = [
    "Ministry of Jal Shakti",
    "Ministry of Finance",
    "Ministry of Health",
    "Ministry of Education",
    "Ministry of Defence",
    "Ministry of Agriculture",
    "Ministry of Home Affairs",
    "Ministry of Transport",
    "Ministry of Labour and Employment",
    "Ministry of Environment",
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Create an Account
        </h1>
        <h2 className="text-gray-600 mb-6">
          Please sign up to access the dashboard.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <select
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500 transition-all duration-300"
          >
            Register
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <div className="flex flex-col items-center justify-between mt-3 gap-2">
          <span className="text-gray-500">- OR -</span>
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login with an existing account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
