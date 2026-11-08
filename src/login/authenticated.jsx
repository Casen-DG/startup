import React from 'react';

export function Authenticated({ userName, onLogout }) {
  function logout() {
    fetch('/api/auth/logout', { method: 'DELETE' })
      .catch(() => {
        // Even if the server can't be reached, still log out locally.
      })
      .finally(() => {
        localStorage.removeItem('userName');
        onLogout();
      });
  }

  return (
    <div>
      <p>Logged in as: {userName}</p>
      <button type="button" className="btn btn-keeper" onClick={logout}>Log Out</button>
    </div>
  );
}
