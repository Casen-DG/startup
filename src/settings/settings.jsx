import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'cellsimSettings';
const DEFAULTS = { healthy: 60, pathogen: 20, duration: 60 };
const DURATIONS = [30, 60, 90];

function clamp(n, min, max, fallback) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

function SettingSlider({ label, value, min, max, onChange }) {
  const id = 'slider-' + label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}: {value}</label>
      <input
        id={id}
        type="range"
        className="form-range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Settings() {
  const [healthy, setHealthy] = useState(DEFAULTS.healthy);
  const [pathogen, setPathogen] = useState(DEFAULTS.pathogen);
  const [duration, setDuration] = useState(DEFAULTS.duration);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cellsimSettings');
      if (raw) {
        const data = JSON.parse(raw);
        setHealthy(clamp(data.healthy, 0, 100, DEFAULTS.healthy));
        setPathogen(clamp(data.pathogen, 0, 100, DEFAULTS.pathogen));
        const d = Number(data.duration);
        setDuration(DURATIONS.includes(d) ? d : DEFAULTS.duration);
      }
    } catch (e) {
      setHealthy(DEFAULTS.healthy);
      setPathogen(DEFAULTS.pathogen);
      setDuration(DEFAULTS.duration);
    }
  }, []);

  useEffect(() => {
    if (!saved) return undefined;
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [saved]);

  const total = healthy + pathogen;

  function handleSave(e) {
    e.preventDefault();
    if (total > 100) return;
    localStorage.setItem('cellsimSettings', JSON.stringify({ healthy, pathogen, duration }));
    setSaved(true);
  }

  return (
    <main>
      <section className="panel auth-card">
        <h2>Simulation Settings</h2>
        <form onSubmit={handleSave}>
          <SettingSlider label="Healthy" value={healthy} min={0} max={100} onChange={setHealthy} />
          <SettingSlider label="Pathogen" value={pathogen} min={0} max={100} onChange={setPathogen} />
          <label htmlFor="duration" className="form-label">Duration (seconds)</label>
          <select
            id="duration"
            className="form-select mb-3"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {total > 100 && <p className="text-danger">Total must be ≤ 100</p>}
          <button type="submit" className="btn btn-keeper w-100" disabled={total > 100}>Save</button>
          {saved && <p className="text-success mt-3">Settings saved</p>}
        </form>
      </section>
    </main>
  );
}
