export function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Mix colour a towards colour b by weight t (0..1). */
export function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

export const shade = (c: string, t: number) => mix(c, "#000000", t);
export const tint = (c: string, t: number) => mix(c, "#ffffff", t);

export const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

export function palette(p: string, s: string) {
  return {
    p,
    s,
    pDark: shade(p, 0.3),
    pDeep: shade(p, 0.6),
    pInk: shade(p, 0.76),
    pSoft: tint(p, 0.5),
    pLight: tint(p, 0.84),
    pWash: tint(p, 0.93),
    sDark: shade(s, 0.3),
    sSoft: tint(s, 0.45),
    sLight: tint(s, 0.8),
    sWash: tint(s, 0.91),
    chart: [p, s, tint(p, 0.45), shade(s, 0.28), shade(p, 0.45), tint(s, 0.5), "#8c9590"],
  };
}

export type Palette = ReturnType<typeof palette>;
