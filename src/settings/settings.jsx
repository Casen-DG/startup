import React, { useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load this user's settings from the service.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then((response) => {
        if (response.status === 401) throw new Error('Log in to load your settings.');
        if (!response.ok) throw new Error(`Could not load settings (error ${response.status}).`);
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setHealthy(clamp(data.healthy, 0, 100, DEFAULTS.healthy));
        setPathogen(clamp(data.pathogen, 0, 100, DEFAULTS.pathogen));
        const d = Number(data.duration);
        setDuration(DURATIONS.includes(d) ? d : DEFAULTS.duration);
      })
      .catch((e) => {
        if (!cancelled) setError(`${e.message || 'Could not reach the server.'} Showing defaults.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!saved) return undefined;
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [saved]);

  const total = healthy + pathogen;

  async function handleSave(e) {
    e.preventDefault();
    if (total > 100) return;
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ healthy, pathogen, duration }),
      });
      if (response.ok) {
        setSaved(true);
      } else if (response.status === 401) {
        setError('Settings not saved: please log in again.');
      } else {
        const body = await response.json().catch(() => ({}));
        setError(body.msg || `Settings not saved (error ${response.status}).`);
      }
    } catch {
      setError('Settings not saved: could not reach the server.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <section className="panel auth-card">
        <h2>Simulation Settings</h2>
        {loading && <p className="muted">Loading your settings...</p>}
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
          <button type="submit" className="btn btn-keeper w-100" disabled={loading || saving || total > 100}>{saving ? 'Saving...' : 'Save'}</button>
          {saved && <p className="text-success mt-3">Settings saved</p>}
          {error && <p className="text-danger mt-3" role="alert">{error}</p>}
        </form>
      </section>
    </main>
  );
}
