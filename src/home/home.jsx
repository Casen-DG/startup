import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main>
      <div className="home-layout">
        {/* Left: user and menu */}
        <section className="panel">
          <p className="user-line">Logged in as: <span id="player-name">Guest</span></p>
          <Link to="/login" className="btn btn-success w-100 mb-3">Log In</Link>

          <nav className="menu">
            <Link to="/play" className="menu-item active">
              Continue Simulation
              <small>Tissue Sample #12 · tick 214</small>
            </Link>
            <Link to="/play" className="menu-item">New Simulation</Link>
            <Link to="/play" className="menu-item">Load Simulation</Link>
            <Link to="/log" className="menu-item">Specimen Log</Link>
            <Link to="/leaderboard" className="menu-item">Leaderboard</Link>
            <Link to="/settings" className="menu-item">Settings</Link>
          </nav>
        </section>

        {/* Right: placeholder simulation radar */}
        <section className="radar-wrap">
          <div className="radar">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>
            <span className="dot" style={{ top: '40%', left: '55%' }}></span>
            <span className="dot" style={{ top: '60%', left: '45%' }}></span>
            <span className="dot" style={{ top: '35%', left: '40%' }}></span>
          </div>
        </section>
      </div>

      {/* Bottom: quote and live activity */}
      <div className="info-row">
        <section className="panel">
          <h2>Quote of the day</h2>
          <p className="quote">"Simplicity is the ultimate sophistication."</p>
          <p className="muted">placeholder — will come from a third-party quote API</p>
        </section>

        <section className="panel">
          <h2>Live activity</h2>
          <ul className="activity">
            <li><strong>128</strong> specimens simulating right now</li>
            <li>player123 started a new simulation</li>
            <li>player456 reached tick 500</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
