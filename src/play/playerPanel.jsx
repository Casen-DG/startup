import React from 'react';

export function PlayerPanel({ role, actions, onAction, disabled }) {
  const isKeeper = role === 'Balance Keeper';
  return (
    <div className={`player-card ${isKeeper ? 'keeper' : 'invader'}`}>
      <h3>{isKeeper ? 'Player 1' : 'Player 2'}</h3>
      <p className="role">{role}</p>
      {actions.map(({ label, action, count }) => (
        <button
          key={label}
          className={`btn ${isKeeper ? 'btn-keeper' : 'btn-invader'} w-100 mb-2`}
          disabled={disabled}
          onClick={() => onAction(action, count)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
