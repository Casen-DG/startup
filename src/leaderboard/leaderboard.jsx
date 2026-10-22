import React, { useState, useEffect } from 'react';

function ScoreRow({ rank, entry }) {
  const isMe = entry.name === localStorage.getItem('userName');
  return (
    <tr className={isMe ? 'highlight' : ''}>
      <td>{rank}</td>
      <td>{entry.name}</td>
      <td>{entry.score}</td>
      <td>{entry.date}</td>
    </tr>
  );
}

export function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    let list = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('cellsimScores'));
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
    setScores(
      list
        .slice()
        .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
        .slice(0, 10)
    );
  }, []);

  return (
    <main>
      <section className="panel wide-panel">
        <h2>Leaderboard</h2>
        {scores.length === 0 ? (
          <p>No scores yet. Go play!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr><th>#</th><th>Name</th><th>Homeostasis</th><th>Date</th></tr>
              </thead>
              <tbody>
                {scores.map((entry, i) => (
                  <ScoreRow key={i} rank={i + 1} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
