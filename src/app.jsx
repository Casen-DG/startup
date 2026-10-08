import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Login } from './login/login';
import { Play } from './play/play';
import { Leaderboard } from './leaderboard/leaderboard';
import { Log } from './log/log';
import { Settings } from './settings/settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <nav className="navbar navbar-expand-md navbar-dark">
            <NavLink id="brand" className="navbar-brand" to="/">
              CellSim Live <span className="badge-crisis">BALANCE VS CRISIS</span>
            </NavLink>
            <ul className="navbar-nav ms-auto flex-row gap-3">
              <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/play">Play</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/log">Log</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/settings">Settings</NavLink></li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/log" element={<Log />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer>
          <span>Dingxi Gu</span>
          <a href="https://github.com/Casen-DG/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main>
      <section className="panel">
        <h2>404</h2>
        <p className="muted">This specimen could not be found.</p>
      </section>
    </main>
  );
}
