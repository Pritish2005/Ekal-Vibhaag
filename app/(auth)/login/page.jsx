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

    // Check if the user is approved before sign in
    const checkApproved = await fetch("/api/admin/check-approved", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Sending email to the backend to check approval
    });

    const data = await checkApproved.json();

    if (!data.isApproved) {
      setError("Your account has not been approved yet.");
      setLoading(false);
      return;
    }

    // Proceed with signIn after approval check
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Disable automatic redirect
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard"); // Redirect on successful login
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>{success ? success : "Welcome Back"}</h1>
      <h2>Please sign in to see the dashboard.</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="text" placeholder="Department" required />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        {error && <p>{error}</p>}
      </form>
      <span>- OR -</span>
      <Link href="/register">Create new account</Link>
    </div>
  );
};

export default Login;
