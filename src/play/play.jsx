import React, { useState, useEffect, useRef } from 'react';
import { createGrid, nextGeneration, homeostasis, applyAction } from './simulation.js';
import { CellGrid } from './cellGrid.jsx';
import { HomeostasisMeter } from './homeostasisMeter.jsx';
import { PlayerPanel } from './playerPanel.jsx';

const KEEPER_ACTIONS = [
  { label: 'Boost Immunity', action: 'heal', count: 10 },
  { label: 'Repair Tissue', action: 'heal', count: 5 },
];
const INVADER_ACTIONS = [
  { label: 'Release Pathogen', action: 'infect', count: 8 },
  { label: 'Spread Toxin', action: 'infect', count: 8 },
];

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
  const [gameOver, setGameOver] = useState(false);
  const [events, setEvents] = useState([]);
  const savedRef = useRef(false);

  function resetGame() {
    const { healthy, pathogen, duration } = loadSettings();
    setGrid(createGrid(20, 20, healthy, pathogen));
    setTimeLeft(duration);
    setGameOver(false);
    setEvents([]);
    setRunning(false);
    savedRef.current = false;
  }

  useEffect(() => {
    resetGame();
  }, []);

  // Mock opponent (stand-in for a WebSocket player)
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setGrid(g => applyAction(g, 'infect', 8));
      setEvents(ev => [...ev, 'Invader released pathogens'].slice(-5));
    }, 2000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return undefined;
    const gridId = setInterval(() => setGrid(g => nextGeneration(g)), 3000);
    const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => {
      clearInterval(gridId);
      clearInterval(timerId);
    };
  }, [running]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setRunning(false);
      setGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!gameOver || savedRef.current) return;
    savedRef.current = true;
    let scores = [];
    try {
      scores = JSON.parse(localStorage.getItem('cellsimScores')) || [];
    } catch (e) {
      scores = [];
    }
    scores.push({
      name: localStorage.getItem('userName') || 'Guest',
      score: homeostasis(grid),
      date: new Date().toLocaleDateString(),
    });
    localStorage.setItem('cellsimScores', JSON.stringify(scores));
  }, [gameOver]);

  const handleAction = (action, count) => setGrid(g => applyAction(g, action, count));

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
        <PlayerPanel role="Balance Keeper" actions={KEEPER_ACTIONS} onAction={handleAction} disabled={gameOver} />

        <CellGrid grid={grid} />

        <PlayerPanel role="Invader" actions={INVADER_ACTIONS} onAction={() => {}} disabled={true} />
      </section>

      <ul className="event-log">
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>

      {gameOver && (
        <section className="game-over">
          <h2>{homeostasis(grid) >= 50 ? 'Balance restored!' : 'Crisis wins!'}</h2>
          <button className="btn btn-keeper" onClick={resetGame}>Play Again</button>
        </section>
      )}

      <p className="hint">Restore homeostasis before the timer runs out!</p>
    </main>
  );
}
