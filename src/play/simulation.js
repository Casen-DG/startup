// Pure ES module: cell simulation engine for the play grid.
// Cell values: 0 = empty, 1 = healthy, 2 = pathogen.
// Standalone logic, no framework or external dependencies.

// Build a rows x cols grid. Each cell draws one rng() value (row-major):
//   r <= healthyPct/100                -> 1 (healthy)
//   else r < (healthyPct+pathogenPct)/100 -> 2 (pathogen)
//   else                               -> 0 (empty)
export function createGrid(rows, cols, healthyPct, pathogenPct, rng = Math.random) {
  const grid = [];
  const healthyBound = healthyPct / 100;
  const pathogenBound = (healthyPct + pathogenPct) / 100;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const v = rng();
      let cell;
      if (v <= healthyBound) cell = 1;
      else if (v < pathogenBound) cell = 2;
      else cell = 0;
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
}

// Count, in the 8-neighborhood of (r, c), the cells whose value equals `value`.
// Out-of-bounds neighbours are skipped (no wrapping); the cell itself is excluded.
export function countNeighbors(grid, r, c, value) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === value) count++;
    }
  }
  return count;
}

// Advance the grid one step, returning a fresh array (the input is untouched).
// Every cell is resolved from the old grid simultaneously:
//   1 with >= 2 pathogen neighbours -> 2
//   2 with >= 3 healthy neighbours   -> 1
//   0 with exactly 3 healthy         -> 1
//   otherwise unchanged
export function nextGeneration(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const next = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell === 1) {
        row.push(countNeighbors(grid, r, c, 2) >= 2 ? 2 : 1);
      } else if (cell === 2) {
        row.push(countNeighbors(grid, r, c, 1) >= 3 ? 1 : 2);
      } else {
        row.push(countNeighbors(grid, r, c, 1) === 3 ? 1 : 0);
      }
    }
    next.push(row);
  }
  return next;
}

// Homeostasis ratio: round(100 * healthy / (healthy + pathogen)).
// When there are no living cells, return 100.
export function homeostasis(grid) {
  let healthy = 0;
  let pathogen = 0;
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === 1) healthy++;
      else if (row[c] === 2) pathogen++;
    }
  }
  const total = healthy + pathogen;
  if (total === 0) return 100;
  return Math.round((100 * healthy) / total);
}

// Apply an action to a fresh copy of the grid.
// 'heal'   : turn the first `count` random pathogen cells into healthy.
// 'infect' : turn `count` random healthy cells into pathogen.
// Any other action throws an Error.
//
// Candidates are collected row-major from the original grid; then for
// min(count, candidates) iterations we pick index floor(rng() * remaining)
// from the shrinking candidate list, splice it out, and apply the change.
// If there are fewer candidates than `count`, all of them are changed.
export function applyAction(grid, action, count, rng = Math.random) {
  let target;
  let replacement;
  if (action === 'heal') {
    target = 2;
    replacement = 1;
  } else if (action === 'infect') {
    target = 1;
    replacement = 2;
  } else {
    throw new Error('Unknown action: ' + action);
  }

  // Fresh grid with freshly copied rows so the input is never mutated.
  const next = [];
  for (let r = 0; r < grid.length; r++) {
    next.push(grid[r].slice());
  }

  // Gather candidate coordinates row-major from the original grid.
  const candidates = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === target) candidates.push([r, c]);
    }
  }

  const steps = Math.min(count, candidates.length);
  for (let i = 0; i < steps; i++) {
    const idx = Math.floor(rng() * candidates.length);
    const [cr, cc] = candidates.splice(idx, 1)[0];
    next[cr][cc] = replacement;
  }

  return next;
}
