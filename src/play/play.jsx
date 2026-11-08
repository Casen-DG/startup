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

function sanitizeSettings(data) {
  const pick = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
  return {
    healthy: pick(data?.healthy, DEFAULTS.healthy),
    pathogen: pick(data?.pathogen, DEFAULTS.pathogen),
    duration: pick(data?.duration, DEFAULTS.duration),
  };
}

export function Play() {
  const [grid, setGrid] = useState([]);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULTS.duration);
  const [gameOver, setGameOver] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const savedRef = useRef(false);
  const settingsRef = useRef(DEFAULTS);

  function resetGame() {
    const { healthy, pathogen, duration } = settingsRef.current;
    setGrid(createGrid(20, 20, healthy, pathogen));
    setTimeLeft(duration);
    setGameOver(false);
    setEvents([]);
    setRunning(false);
    setSaveStatus('');
    savedRef.current = false;
  }

  // Load this user's settings from the service, falling back to the defaults on error.
  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Log in to use your saved settings.' : `Request failed (${response.status}).`);
        }
        settingsRef.current = sanitizeSettings(await response.json());
      } catch (e) {
        settingsRef.current = DEFAULTS;
        if (!cancelled) setSettingsError(`Could not load your settings, using defaults. ${e.message || ''}`.trim());
      } finally {
        if (!cancelled) {
          resetGame();
          setLoadingSettings(false);
        }
      }
    }
    loadSettings();
    return () => {
      cancelled = true;
    };
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

  // Submit the final score to the service when the game ends.
  useEffect(() => {
    if (!gameOver || savedRef.current) return;
    savedRef.current = true;
    const newScore = {
      name: localStorage.getItem('userName') || 'Guest',
      score: homeostasis(grid),
      date: new Date().toLocaleDateString(),
    };
    setSaveStatus('Saving score...');
    fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(newScore),
    })
      .then((response) => {
        if (response.ok) {
          setSaveStatus('Score saved to the leaderboard.');
        } else if (response.status === 401) {
          setSaveStatus('Score not saved: please log in again.');
        } else {
          setSaveStatus(`Score not saved (error ${response.status}).`);
        }
      })
      .catch(() => setSaveStatus('Score not saved: could not reach the server.'));
  }, [gameOver]);

  const handleAction = (action, count) => setGrid(g => applyAction(g, action, count));

  return (
    <main>
      <section className="status-bar">
        <HomeostasisMeter value={homeostasis(grid)} />
        <div className="timer">
          <span id="countdown">Time: {timeLeft}s</span>
        </div>
        <button className="btn btn-keeper" onClick={() => setRunning(r => !r)} disabled={loadingSettings || timeLeft <= 0}>
          {running ? 'Pause' : 'Start'}
        </button>
      </section>

      {loadingSettings && <p className="muted">Loading your settings...</p>}
      {settingsError && <p className="text-warning" role="alert">{settingsError}</p>}

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
          {saveStatus && <p role="status">{saveStatus}</p>}
          <button className="btn btn-keeper" onClick={resetGame}>Play Again</button>
        </section>
      )}

      <p className="hint">Restore homeostasis before the timer runs out!</p>
    </main>
  );
}
