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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/scores')
      .then((response) => {
        if (response.status === 401) throw new Error('Log in to see the leaderboard.');
        if (!response.ok) throw new Error(`Could not load scores (error ${response.status}).`);
        return response.json();
      })
      .then((list) => {
        if (cancelled) return;
        const safe = Array.isArray(list) ? list : [];
        setScores(
          safe
            .slice()
            .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
            .slice(0, 10)
        );
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Could not reach the server.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  let content;
  if (loading) {
    content = <p className="muted">Loading scores...</p>;
  } else if (error) {
    content = <p className="text-danger" role="alert">{error}</p>;
  } else if (scores.length === 0) {
    content = <p>No scores yet. Go play!</p>;
  } else {
    content = (
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
    );
  }

  return (
    <main>
      <section className="panel wide-panel">
        <h2>Leaderboard</h2>
        {content}
      </section>
    </main>
  );
}
