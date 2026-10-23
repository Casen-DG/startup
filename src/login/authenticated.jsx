import React from 'react';

export function Authenticated({ userName, onLogout }) {
  function logout() {
    localStorage.removeItem('userName');
    onLogout();
  }

  return (
    <div>
      <p>Logged in as: {userName}</p>
      <button type="button" className="btn btn-keeper" onClick={logout}>Log Out</button>
    </div>
  );
}
