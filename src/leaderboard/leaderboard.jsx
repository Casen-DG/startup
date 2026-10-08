import React from 'react';

export function Leaderboard() {
  return (
    <main>
      <section className="panel wide-panel">
        <h2>Fastest Recovery Leaderboard</h2>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr><th>#</th><th>Player</th><th>Recovery Time</th><th>Date</th></tr>
            </thead>
            <tbody>
              <tr className="rank-1"><td>1</td><td>cellmaster</td><td>00:14</td><td>Sep 27</td></tr>
              <tr><td>2</td><td>immuno_fan</td><td>00:19</td><td>Sep 26</td></tr>
              <tr><td>3</td><td>player456</td><td>00:23</td><td>Sep 25</td></tr>
              <tr><td>4</td><td>dingxi</td><td>00:28</td><td>Sep 24</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
