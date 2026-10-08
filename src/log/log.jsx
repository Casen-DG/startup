import React from 'react';

export function Log() {
  return (
    <main>
      <section className="panel wide-panel">
        <h2>Specimen Log</h2>
        <p className="muted">Facts will come from the MyGene.info API</p>
        <div className="log-grid">
          <article className="log-card">
            <span className="healthy"></span>
            <div><h3>Epithelial Cell</h3><p className="muted">placeholder gene fact…</p></div>
          </article>
          <article className="log-card">
            <span className="immune"></span>
            <div><h3>T Lymphocyte</h3><p className="muted">placeholder gene fact…</p></div>
          </article>
          <article className="log-card">
            <span className="pathogen"></span>
            <div><h3>Pathogen</h3><p className="muted">placeholder gene fact…</p></div>
          </article>
          <article className="log-card">
            <span className="toxin"></span>
            <div><h3>Toxin</h3><p className="muted">placeholder gene fact…</p></div>
          </article>
        </div>
      </section>
    </main>
  );
}
