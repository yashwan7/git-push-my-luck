// Minimal linear algebra for calibration regression.
// We solve (F^T F) w = F^T t via Gauss-Jordan elimination, i.e. classic
// least-squares fitting of a linear model from gaze features -> screen coords.
// Small (5x5) systems, so a hand-rolled solver is fine and dependency-free.

export function transpose(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const out: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) out[j][i] = m[i][j];
  return out;
}

export function matMul(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const inner = b.length;
  const cols = b[0].length;
  const out: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < inner; k++) {
      const aik = a[i][k];
      if (aik === 0) continue;
      for (let j = 0; j < cols; j++) out[i][j] += aik * b[k][j];
    }
  }
  return out;
}

export function matVec(a: number[][], v: number[]): number[] {
  return a.map((row) => row.reduce((s, x, i) => s + x * v[i], 0));
}

// Solves A x = b for x via Gauss-Jordan elimination with partial pivoting.
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > maxVal) {
        maxVal = Math.abs(M[r][col]);
        pivotRow = r;
      }
    }
    if (maxVal < 1e-10) continue; // near-singular; skip (ridge term below prevents this in practice)
    [M[col], M[pivotRow]] = [M[pivotRow], M[col]];

    const pivot = M[col][col];
    for (let j = col; j <= n; j++) M[col][j] /= pivot;

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      if (factor === 0) continue;
      for (let j = col; j <= n; j++) M[r][j] -= factor * M[col][j];
    }
  }
  return M.map((row) => row[n]);
}

// Ridge-regularized least squares: w = (F^T F + lambda*I)^-1 F^T t
export function ridgeRegression(F: number[][], t: number[], lambda = 0.5): number[] {
  const Ft = transpose(F);
  const FtF = matMul(Ft, F);
  for (let i = 0; i < FtF.length; i++) FtF[i][i] += lambda;
  const Ftt = matVec(Ft, t);
  return solveLinearSystem(FtF, Ftt);
}
