import React from 'react';
import { Authenticated } from './authenticated';
import { Unauthenticated } from './unauthenticated';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main>
      <section className="panel auth-card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue your simulation</p>
        {authState === 'authenticated' ? (
          <Authenticated userName={userName} onLogout={() => onAuthChange('', 'unauthenticated')} />
        ) : (
          <Unauthenticated userName={userName} onLogin={(name) => onAuthChange(name, 'authenticated')} />
        )}
      </section>
    </main>
  );
}
