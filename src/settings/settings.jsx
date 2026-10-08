import React from 'react';

export function Settings() {
  return (
    <main>
      <section className="panel auth-card">
        <h2>Simulation Settings</h2>
        <form>
          <label htmlFor="healthy" className="form-label">Healthy cells</label>
          <input id="healthy" type="range" className="form-range mb-3" defaultValue="60" />
          <label htmlFor="immune" className="form-label">Immune cells</label>
          <input id="immune" type="range" className="form-range mb-3" defaultValue="30" />
          <label htmlFor="speed" className="form-label">Tick speed</label>
          <select id="speed" className="form-select mb-4" defaultValue="Normal">
            <option>Slow</option>
            <option>Normal</option>
            <option>Fast</option>
          </select>
          <button type="submit" className="btn btn-keeper w-100">Save Configuration</button>
        </form>
      </section>
    </main>
  );
}
