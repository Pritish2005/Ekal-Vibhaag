"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);

    const checkApproved = await fetch("/api/admin/check-approved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await checkApproved.json();

    if (!data.isApproved) {
      setError("Your account has not been approved yet.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      setError(result.error);
    } else {
      if(data.isAdmin===true){
        router.push("/admin");
      }
      else{
        router.push("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {success ? success : "Welcome Back"}
        </h1>
        <h2 className="text-gray-600 mb-6">
          Please sign in to access the dashboard.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500 transition-all duration-300"
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <div className="flex flex-col items-center justify-between mt-3 gap-2">
          <span className="text-gray-500">- OR -</span>
          <Link href="/register" className="text-indigo-600 hover:underline">
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
