import React, { useState, useEffect } from 'react';

const SPECIMENS = [
  { id: 1, cellType: 'T cell', gene: 'CD4', fact: 'CD4 is a co-receptor on helper T cells that helps them recognize antigens.' },
  { id: 2, cellType: 'Macrophage', gene: 'CD68', fact: 'CD68 is a glycoprotein enriched in macrophage lysosomes.' },
  { id: 3, cellType: 'Epithelial cell', gene: 'EPCAM', fact: 'EPCAM mediates cell-to-cell adhesion in epithelial tissues.' },
];

function SpecimenCard({ specimen, expanded, onToggle }) {
  return (
    <article className="log-card">
      <div>
        <h3>{specimen.cellType}</h3>
        <p className="muted">Gene: {specimen.gene}</p>
        {expanded && <p className="muted">{specimen.fact}</p>}
        <button type="button" onClick={onToggle}>
          {expanded ? 'Hide fact' : 'Show fact'}
        </button>
      </div>
    </article>
  );
}

export function Log() {
  const [loading, setLoading] = useState(true);
  const [specimens, setSpecimens] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpecimens(SPECIMENS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <section className="panel wide-panel">
        <h2>Specimen Log</h2>
        {loading && <p className="muted">Loading gene facts...</p>}
        {!loading && (
          <div className="log-grid">
            {specimens.map((s) => (
              <SpecimenCard
                key={s.id}
                specimen={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
