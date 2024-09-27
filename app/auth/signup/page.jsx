'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, department }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/auth/login');  // Redirect to login page after signup
    } else {
      console.log('Error:', data.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          {/* Add more departments */}
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
