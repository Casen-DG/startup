import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAMES = ['Ana', 'Ben', 'Chen', 'Dara', 'Eli'];
const EVENTS = [
  'restored balance in 42s',
  'started a new simulation',
  'reached tick 500',
  'logged a new specimen',
  'climbed the leaderboard',
];
const QUOTES = [
  'Simplicity is the ultimate sophistication.',
  'Life finds a way.',
  'Small changes compound into big results.',
  'Stay curious.',
];

function ActivityItem({ text }) {
  return <li>{text}</li>;
}

export function Home() {
  const userName = localStorage.getItem('userName') || 'Guest';
  const [activities, setActivities] = useState([]);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const id = setInterval(() => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setActivities((prev) => [`${name} ${event}`, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <main>
      <a className="github-link" href="https://github.com/Casen-DG/startup" target="_blank" rel="noreferrer">
        View on GitHub
      </a>

      <div className="home-layout">
        {/* Left: user and menu */}
        <section className="panel">
          <p className="user-line">Welcome, <span id="player-name">{userName}</span></p>
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
          <p className="quote">"{quote}"</p>
        </section>

        <section className="panel">
          <h2>Live activity</h2>
          <ul className="activity">
            {activities.length === 0 ? (
              <li>Waiting for activity...</li>
            ) : (
              activities.map((text, i) => <ActivityItem key={i} text={text} />)
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
