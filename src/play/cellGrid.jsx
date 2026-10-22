import React from 'react';

const CLASS_NAMES = ['cell empty', 'cell healthy', 'cell pathogen'];

export function CellGrid({ grid }) {
  const cols = grid.length ? grid[0].length : 0;
  return (
    <div className="cell-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {grid.map((row, r) =>
        row.map((value, c) => <div key={`${r}-${c}`} className={CLASS_NAMES[value]}></div>)
      )}
    </div>
  );
}
