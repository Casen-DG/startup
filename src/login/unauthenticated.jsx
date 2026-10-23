import React, { useState } from 'react';

export function Unauthenticated({ userName, onLogin }) {
  const [email, setEmail] = useState(userName || '');
  const [password, setPassword] = useState('');

  function login(e) {
    if (e) e.preventDefault();
    localStorage.setItem('userName', email);
    onLogin(email);
  }

  const disabled = !email || !password;

  return (
    <form onSubmit={login}>
      <label htmlFor="email" className="form-label">Email</label>
      <input
        id="email"
        type="email"
        className="form-control mb-3"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password" className="form-label">Password</label>
      <input
        id="password"
        type="password"
        className="form-control mb-4"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-keeper flex-fill" disabled={disabled} onClick={login}>Log In</button>
        <button type="button" className="btn btn-outline-keeper flex-fill" disabled={disabled} onClick={login}>Create Account</button>
      </div>
    </form>
  );
}
