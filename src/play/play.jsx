import React, { useState, useEffect } from 'react';
import { createGrid, nextGeneration, homeostasis } from './simulation.js';
import { CellGrid } from './cellGrid.jsx';
import { HomeostasisMeter } from './homeostasisMeter.jsx';

const DEFAULTS = { healthy: 60, pathogen: 20, duration: 60 };

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('cellsimSettings'));
    return { ...DEFAULTS, ...(saved || {}) };
  } catch (e) {
    return DEFAULTS;
  }
}

export function Play() {
  const [grid, setGrid] = useState([]);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULTS.duration);

  useEffect(() => {
    const { healthy, pathogen, duration } = loadSettings();
    setGrid(createGrid(20, 20, healthy, pathogen));
    setTimeLeft(duration);
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const gridId = setInterval(() => setGrid(g => nextGeneration(g)), 500);
    const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => {
      clearInterval(gridId);
      clearInterval(timerId);
    };
  }, [running]);

  useEffect(() => {
    if (timeLeft <= 0) setRunning(false);
  }, [timeLeft]);

  return (
    <main>
      <section className="status-bar">
        <HomeostasisMeter value={homeostasis(grid)} />
        <div className="timer">
          <span id="countdown">Time: {timeLeft}s</span>
        </div>
        <button className="btn btn-keeper" onClick={() => setRunning(r => !r)} disabled={timeLeft <= 0}>
          {running ? 'Pause' : 'Start'}
        </button>
      </section>

      {/* Main: two player panels around the cell grid */}
      <section className="game-layout">
        <div className="player-card keeper">
          <h3>Player 1</h3>
          <p className="role">Balance Keeper</p>
          <button className="btn btn-keeper w-100 mb-2">Boost Immunity</button>
          <button className="btn btn-outline-keeper w-100">Repair Tissue</button>
        </div>

        <CellGrid grid={grid} />

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
