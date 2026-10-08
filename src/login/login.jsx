import React from 'react';

export function Login() {
  return (
    <main>
      <section className="panel auth-card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue your simulation</p>
        <form>
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" type="email" className="form-control mb-3" placeholder="you@example.com" />
          <label htmlFor="password" className="form-label">Password</label>
          <input id="password" type="password" className="form-control mb-4" placeholder="••••••••" />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-keeper flex-fill">Log In</button>
            <button type="button" className="btn btn-outline-keeper flex-fill">Create Account</button>
          </div>
        </form>
      </section>
    </main>
  );
}
