import React from 'react';

// Placeholder 8x6 grid; '' = empty cell. Pathogen cells are drawn as infected.
const grid = [
  'healthy', '', 'healthy', 'immune', 'toxin', 'pathogen', 'healthy', 'pathogen',
  '', 'healthy', 'toxin', 'pathogen', 'healthy', 'immune', 'pathogen', 'immune',
  'pathogen', 'immune', '', 'immune', 'pathogen', 'healthy', 'toxin', 'healthy',
  'healthy', 'healthy', 'toxin', 'healthy', 'immune', 'pathogen', 'pathogen', '',
  'healthy', 'pathogen', 'healthy', 'healthy', 'immune', 'pathogen', 'immune', 'toxin',
  '', 'pathogen', 'immune', 'healthy', 'pathogen', 'healthy', 'toxin', 'pathogen',
];

export function Play() {
  return (
    <main>
      {/* Top: homeostasis meter and countdown */}
      <section className="status-bar">
        <div className="meter">
          <div className="meter-label">
            <span>Homeostasis Level</span>
            <span className="text-danger">41%</span>
          </div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: '41%' }}></div>
          </div>
        </div>
        <div className="timer">
          <small>RESTABILIZE IN</small>
          <span id="countdown">00:32</span>
        </div>
      </section>

      {/* Main: two player panels around the cell grid */}
      <section className="game-layout">
        <div className="player-card keeper">
          <h3>Player 1</h3>
          <p className="role">Balance Keeper</p>
          <button className="btn btn-keeper w-100 mb-2">Boost Immunity</button>
          <button className="btn btn-outline-keeper w-100">Repair Tissue</button>
        </div>

        <div className="cell-grid">
          {grid.map((type, i) => (
            <div key={i} className={type === 'pathogen' ? 'cell infected' : 'cell'}>
              {type && <span className={type}></span>}
            </div>
          ))}
        </div>

        <div className="player-card invader">
          <h3>Player 2</h3>
          <p className="role">Invader</p>
          <button className="btn btn-invader w-100 mb-2">Release Pathogen</button>
          <button className="btn btn-outline-invader w-100">Spread Toxin</button>
        </div>
      </section>

      <p className="hint">Restore homeostasis before the timer runs out!</p>
    </main>
  );
}
