import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  FONTS,
  fontStack,
  loadSettings,
  paperOptions,
  saveSettings,
  type Settings,
} from "./settings";
import { palette } from "./color";

type Ctx = { s: Settings; setS: Dispatch<SetStateAction<Settings>> };
const BrandCtx = createContext<Ctx | null>(null);

function ensureFont(role: string, name: string) {
  const def = FONTS.find((f) => f.name === name);
  const id = "gf-" + role;
  let el = document.getElementById(id) as HTMLLinkElement | null;
  if (!def || !def.w) {
    el?.remove();
    return;
  }
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(def.name).replace(
    /%20/g,
    "+",
  )}:wght@${def.w}&display=swap`;
  if (!el) {
    el = document.createElement("link");
    el.id = id;
    el.rel = "stylesheet";
    document.head.appendChild(el);
  }
  if (el.getAttribute("href") !== href) el.setAttribute("href", href);
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(loadSettings);

  useEffect(() => {
    saveSettings(s);
  }, [s]);

  const pal = useMemo(
    () => palette(s.brand.primary, s.brand.secondary),
    [s.brand.primary, s.brand.secondary],
  );

  useEffect(() => {
    const st = document.documentElement.style;
    const vars: Record<string, string> = {
      "--c-p": pal.p,
      "--c-p-dark": pal.pDark,
      "--c-p-deep": pal.pDeep,
      "--c-p-ink": pal.pInk,
      "--c-p-soft": pal.pSoft,
      "--c-p-light": pal.pLight,
      "--c-p-wash": pal.pWash,
      "--c-s": pal.s,
      "--c-s-dark": pal.sDark,
      "--c-s-soft": pal.sSoft,
      "--c-s-light": pal.sLight,
      "--c-s-wash": pal.sWash,
      "--f-head": fontStack(s.type.head),
      "--f-body": fontStack(s.type.body),
      "--fs": String(s.type.scale),
      "--r": `${s.type.radius}px`,
    };
    Object.entries(vars).forEach(([k, v]) => st.setProperty(k, v));
  }, [pal, s.type]);

  useEffect(() => {
    ensureFont("head", s.type.head);
    ensureFont("body", s.type.body);
  }, [s.type.head, s.type.body]);

  useEffect(() => {
    const paper = paperOptions(s.export.paper, s.export.orientation);
    const st = document.documentElement.style;
    st.setProperty("--paper-w", `${paper.w}px`);
    st.setProperty("--paper-h", `${paper.h}px`);
    st.setProperty("--pdf-margin", `${s.export.pdfMargin}mm`);

    // physical page size (mm) for the print dialog
    const mm = (px: number) => Math.round((px / 3.7795275591) * 10) / 10;
    let el = document.getElementById("paper-style") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "paper-style";
      document.head.appendChild(el);
    }
    el.textContent = `@media print{@page{size:${mm(paper.w)}mm ${mm(paper.h)}mm;margin:0}
      .print-page{width:${paper.w}px;height:${paper.h}px}}`;
  }, [s.export.paper, s.export.orientation, s.export.pdfMargin, s.export.fit]);

  return <BrandCtx.Provider value={{ s, setS }}>{children}</BrandCtx.Provider>;
}

export function useSettings() {
  const c = useContext(BrandCtx);
  if (!c) throw new Error("BrandProvider missing");
  return c;
}

export function usePalette() {
  const { s } = useSettings();
  return useMemo(
    () => palette(s.brand.primary, s.brand.secondary),
    [s.brand.primary, s.brand.secondary],
  );
}

/**
 * Money helper. All project data is stored in ₹ Million.
 * Capex figures are written in the source report's unit and converted through `cap()`,
 * so a single setting in Settings → Finance re-bases the whole deck.
 */
/** Project cost derived from the funding structure in Settings → so no figure is hard-coded in the slides */
export function useCapexMn() {
  const { s } = useSettings();
  return (s.finance.equity + s.finance.debt) / (s.finance.sourceUnit === "Lakh" ? 10 : 1);
}

export function useMoney() {
  const { s } = useSettings();
  const unit = s.finance.display;
  const src = s.finance.sourceUnit;
  return useMemo(() => {
    const conv = (mn: number) => (unit === "Cr" ? mn / 10 : unit === "Lakh" ? mn * 10 : mn);
    const autoDp = (v: number) => {
      const a = Math.abs(v);
      if (unit === "Lakh") return 0;
      if (unit === "Mn") return a >= 100 ? 0 : 1;
      return a >= 1000 ? 0 : a >= 100 ? 1 : 2;
    };
    const n = (mn: number, dp?: number) => {
      const v = conv(mn);
      const d = dp ?? autoDp(v);
      return v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
    };
    /** table format for revenue / RM, rounded to the precision of the display unit */
    const t = (mn: number) => n(mn, unit === "Cr" ? 2 : unit === "Lakh" ? 0 : 1);
    /** table format for capex figures */
    const tc = (mn: number) => n(mn, unit === "Cr" ? 2 : 1);
    const short = unit === "Cr" ? "Cr" : unit === "Lakh" ? "Lakh" : "Mn";
    const label = unit === "Cr" ? "₹ Crore" : unit === "Lakh" ? "₹ Lakh" : "₹ Million";
    const m = (mn: number, dp?: number) => `₹${n(mn, dp)} ${short}`;
    /** convert a value written in the report's source unit into ₹ Million */
    const cap = (raw: number) => (src === "Lakh" ? raw / 10 : raw);
    return { conv, n, t, tc, m, short, label, cap, unit };
  }, [unit, src]);
}
