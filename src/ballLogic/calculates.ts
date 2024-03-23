import { Ball } from "./ballLogic";

export const randomNumber = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const circlesInterceptUnitTime = (
  a: number,
  e: number,
  b: number,
  f: number,
  c: number,
  g: number,
  d: number,
  h: number,
  r1: number,
  r2: number
) => {
  // args (x1, y1, x2, y2, x3, y3, x4, y4, r1, r2)
  const A = a * a;
  const B = b * b;
  const C = c * c;
  const D = d * d;
  const E = e * e;
  const F = f * f;
  const G = g * g;
  const H = h * h;
  var R = (r1 + r2) ** 2;
  const AA =
    A +
    B +
    C +
    F +
    G +
    H +
    D +
    E +
    b * c +
    c * b +
    f * g +
    g * f +
    2 *
      (a * d -
        a * b -
        a * c -
        b * d -
        c * d -
        e * f +
        e * h -
        e * g -
        f * h -
        g * h);
  const BB =
    2 *
    (-A +
      a * b +
      2 * a * c -
      a * d -
      c * b -
      C +
      c * d -
      E +
      e * f +
      2 * e * g -
      e * h -
      g * f -
      G +
      g * h);
  const CC = A - 2 * a * c + C + E - 2 * e * g + G - R;
  return quadRoots(AA, BB, CC);
};

const quadRoots = (a: number, b: number, c: number) => {
  if (Math.abs(a) < 1e-6) {
    return b !== 0 ? [-c / b] : [];
  }
  b /= a;
  var d = b * b - 4 * (c / a);
  if (d > 0) {
    d = d ** 0.5;
    return [0.5 * (-b + d), 0.5 * (-b - d)];
  }
  return d === 0 ? [0.5 * -b] : [];
};

export const interceptLineBallTime = (
  x: number,
  y: number,
  vx: number,
  vy: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number
) => {
  const xx = x2 - x1;
  const yy = y2 - y1;
  const d = vx * yy - vy * xx;
  if (d > 0) {
    // only if moving towards the line
    const dd = radius / (xx * xx + yy * yy) ** 0.5;
    const nx = xx * dd;
    const ny = yy * dd;
    return (xx * (y - (y1 + nx)) - yy * (x - (x1 - ny))) / d;
  }
};
export const canAdd = (ball: Ball, balls: Ball[]) => {
  for (const b of balls) {
    if (ball.doesOverlap(b)) {
      return false;
    }
  }
  return true;
};
