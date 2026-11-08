import React, { useState } from 'react';

export function Unauthenticated({ userName, onLogin }) {
  const [email, setEmail] = useState(userName || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loginOrCreate(endpoint, method) {
    setError('');
    setBusy(true);
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ email: email, password: password }),
      });
      if (response.ok) {
        localStorage.setItem('userName', email);
        onLogin(email);
        return;
      }
      if (response.status === 409) {
        setError('An account with that email already exists. Try logging in.');
      } else if (response.status === 401) {
        setError('Incorrect email or password.');
      } else {
        const body = await response.json().catch(() => ({}));
        setError(body.msg || `Request failed (${response.status}).`);
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function login(e) {
    if (e) e.preventDefault();
    loginOrCreate('/api/auth/login', 'PUT');
  }

  function create() {
    loginOrCreate('/api/auth/create', 'POST');
  }

  const disabled = !email || !password || busy;

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
        <button type="submit" className="btn btn-keeper flex-fill" disabled={disabled}>Log In</button>
        <button type="button" className="btn btn-outline-keeper flex-fill" disabled={disabled} onClick={create}>Create Account</button>
      </div>
      {error && <p className="text-danger mt-3 mb-0" role="alert">{error}</p>}
    </form>
  );
}
