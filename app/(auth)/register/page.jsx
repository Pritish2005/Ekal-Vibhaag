"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const department = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Create an Account</h1>
      <h2>Please sign up to see the dashboard.</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          required
        />
        <input
          type="text"
          placeholder="Department"
          required
        />
        <input
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
      <span>- OR -</span>
      <Link href="/dashboard/login">
        Login with an existing account
      </Link>
    </div>
  );
};

export default Register;
