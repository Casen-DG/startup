import React, { useState, useEffect } from 'react';

// Third-party API: MyGene.info gene annotation service
const GENE_URL = 'https://mygene.info/v3/query?q=symbol:TP53&fields=name,symbol,summary&size=1';
const SUMMARY_LIMIT = 300;

function truncate(text, limit) {
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

function GeneCard({ gene }) {
  return (
    <article className="log-card">
      <div>
        <h3>{gene.symbol}</h3>
        <p className="muted">{gene.name}</p>
        <p>{truncate(gene.summary, SUMMARY_LIMIT) || 'No summary available.'}</p>
        <p className="muted mb-0">Source: MyGene.info</p>
      </div>
    </article>
  );
}

export function Log() {
  const [loading, setLoading] = useState(true);
  const [gene, setGene] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(GENE_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`MyGene.info returned error ${response.status}.`);
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        const hit = Array.isArray(data?.hits) ? data.hits[0] : null;
        if (!hit) {
          setError('No gene data found.');
          return;
        }
        setGene({
          symbol: hit.symbol || 'TP53',
          name: hit.name || '',
          summary: hit.summary || '',
        });
      })
      .catch((e) => {
        if (!cancelled) setError(`Could not load gene data. ${e.message || ''}`.trim());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <section className="panel wide-panel">
        <h2>Specimen Log</h2>
        {loading && <p className="muted">Loading gene facts...</p>}
        {!loading && error && <p className="text-danger" role="alert">{error}</p>}
        {!loading && gene && (
          <div className="log-grid">
            <GeneCard gene={gene} />
          </div>
        )}
      </section>
    </main>
  );
}
