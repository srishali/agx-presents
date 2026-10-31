export type Person = { name: string; role: string };
export type MoneyUnit = "Cr" | "Mn" | "Lakh";

export type PaperKey = "16:9" | "4:3" | "16:10" | "a4l" | "a4p" | "letterl" | "letterp" | "a3l";
export type FontSetInS = "Set A" | "Set B";

export type Settings = {
  company: {
    name: string;
    short: string;
    tagline: string;
    cin: string;
    constitution: string;
    regOffice: string;
    plantLocation: string;
    state: string;
  };
  contact: {
    person: string;
    designation: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  people: Person[];
  brand: {
    primary: string;
    secondary: string;
    logo: string | null;
    showLogoOnSlides: boolean;
    showWordmark: boolean;
    shortAuto: boolean;
    customGraphic: string | null;
    coverStyle: string;
    closingStyle: string;
    overlay: number;
  };
  type: {
    head: string;
    body: string;
    scale: number;
    radius: number;
    headWeight: number;
  };
  pres: {
    deckTitle: string;
    eyebrow: string;
    preparedFor: string;
    audience: string;
    date: string;
    confidentiality: string;
    showPageNo: boolean;
    showFooter: boolean;
    showPartBadge: boolean;
  };
  finance: {
    display: MoneyUnit;
    sourceUnit: "Mn" | "Lakh";
    equity: number;
    debt: number;
    rate: number;
    tenure: number;
    moratorium: number;
  };
  labels: {
    submittedTo: string;
    contents: string;
    pagesWord: string;
    highlightsLine: string;
    reviewLine: string;
    partA: string;
    partB: string;
    execShort: string;
    dprShort: string;
    tocTitle: string;
    closingLine: string;
    contactHeading: string;
    contactSub: string;
    showContactPhone: boolean;
    showContactEmail: boolean;
    showContactWeb: boolean;
  };
  export: {
    paper: PaperKey;
    orientation: "auto" | "landscape" | "portrait";
    fit: "fit" | "fill";
    pdfMargin: 0 | 6 | 10;
    includeCover: boolean;
    imageFormat: "png" | "jpeg" | "webp";
  };
};

export const PAPERS: Record<PaperKey, { name: string; w: number; h: number; note: string; screen?: boolean }> = {
  "16:9": { name: "Widescreen 16:9", w: 1280, h: 720, note: "Screen standard · PowerPoint default · HD", screen: true },
  "16:10": { name: "Widescreen 16:10", w: 1280, h: 800, note: "Laptop-friendly screen ratio", screen: true },
  "4:3": { name: "Standard 4:3", w: 960, h: 720, note: "10 × 7.5 in · classic PowerPoint & projector format", screen: true },
  a4l: { name: "A4", w: 1123, h: 794, note: "210 × 297 mm · landscape · most common print size" },
  a4p: { name: "A4", w: 794, h: 1123, note: "210 × 297 mm · portrait" },
  letterl: { name: "US Letter", w: 1056, h: 816, note: "8.5 × 11 in · landscape" },
  letterp: { name: "US Letter", w: 816, h: 1056, note: "8.5 × 11 in · portrait" },
  a3l: { name: "A3", w: 1587, h: 1123, note: "297 × 420 mm · landscape · for large handouts" },
};

/** Options adjusted for the deck's native 16:9 canvas with the chosen paper */
export function paperOptions(key: PaperKey, orientation: Settings["export"]["orientation"]) {
  const base = PAPERS[key] ?? PAPERS["16:9"];
  const off = orientation === "portrait" ? { ...base, w: base.h, h: base.w, name: base.name } : base;
  if (orientation === "landscape" && off.w < off.h) return { ...off, w: off.h, h: off.w };
  return off;
}

export type FontDef = { name: string; kind: "sans" | "serif"; w: string };

export const FONTS: FontDef[] = [
  { name: "Montserrat", kind: "sans", w: "400;500;600;700;800" },
  { name: "Inter", kind: "sans", w: "400;500;600;700;800" },
  { name: "Poppins", kind: "sans", w: "400;500;600;700;800" },
  { name: "Open Sans", kind: "sans", w: "400;500;600;700;800" },
  { name: "Roboto", kind: "sans", w: "400;500;700;900" },
  { name: "Lato", kind: "sans", w: "400;700;900" },
  { name: "Source Sans 3", kind: "sans", w: "400;500;600;700;800" },
  { name: "Nunito Sans", kind: "sans", w: "400;600;700;800" },
  { name: "Raleway", kind: "sans", w: "400;500;600;700;800" },
  { name: "Work Sans", kind: "sans", w: "400;500;600;700;800" },
  { name: "IBM Plex Sans", kind: "sans", w: "400;500;600;700" },
  { name: "Manrope", kind: "sans", w: "400;500;600;700;800" },
  { name: "DM Sans", kind: "sans", w: "400;500;600;700;800" },
  { name: "Barlow", kind: "sans", w: "400;500;600;700;800" },
  { name: "Mukta", kind: "sans", w: "400;500;600;700;800" },
  { name: "Noto Sans", kind: "sans", w: "400;500;600;700;800" },
  { name: "Playfair Display", kind: "serif", w: "400;500;600;700;800" },
  { name: "Merriweather", kind: "serif", w: "400;700;900" },
  { name: "Lora", kind: "serif", w: "400;500;600;700" },
  { name: "Libre Baskerville", kind: "serif", w: "400;700" },
  { name: "Cormorant Garamond", kind: "serif", w: "400;500;600;700" },
  { name: "EB Garamond", kind: "serif", w: "400;500;600;700;800" },
  { name: "Source Serif 4", kind: "serif", w: "400;500;600;700" },
  { name: "Noto Serif", kind: "serif", w: "400;500;600;700" },
  { name: "Fraunces", kind: "serif", w: "400;500;600;700;800" },
  { name: "System Sans", kind: "sans", w: "" },
  { name: "System Serif", kind: "serif", w: "" },
];

export function fontStack(name: string) {
  const def = FONTS.find((f) => f.name === name);
  const sans = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", serif';
  if (!def) return sans;
  if (!def.w) return def.kind === "serif" ? serif : sans;
  return `"${def.name}", ${def.kind === "serif" ? serif : sans}`;
}

/** Derive a short wordmark from the legal name (first meaningful word, upper-cased) */
export function deriveShort(name: string): string {
  const stripped = name
    .replace(/\b(private limited|pvt\.?\s*ltd\.?|limited|llp|inc\.?|company|corporation|co\.)\b/gi, " ")
    .trim();
  const first = stripped.split(/\s+/).filter(Boolean)[0] || name.split(/\s+/)[0] || "";
  return first.toUpperCase().slice(0, 16);
}

/** Sub-line under the logo wordmark: legal name minus the short brand, tidied */
export function brandSubline(name: string, short: string): string {
  let out = name;
  if (short) {
    const re = new RegExp(short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    out = out.replace(re, " ");
  }
  out = out.replace(/\bprivate limited\b/gi, "Pvt. Ltd.").replace(/\b(pvt\.?\s*ltd\.?)\s*\1\b/gi, "Pvt. Ltd.");
  return out.replace(/\s{2,}/g, " ").replace(/^[\s,.\-]+|[\s,.\-]+$/g, "").trim();
}

export const PRESET_COLORS = [
  { name: "Pantone 356 C", hex: "#007A33" },
  { name: "Pantone 7563 C", hex: "#D69A2D" },
  { name: "Pantone 349 C", hex: "#046A38" },
  { name: "Pantone 342 C", hex: "#006747" },
  { name: "Pantone 7406 C", hex: "#F1C400" },
  { name: "Pantone 1235 C", hex: "#FFB81C" },
  { name: "Pantone 295 C", hex: "#002855" },
  { name: "Pantone 7427 C", hex: "#97272C" },
  { name: "Pantone 1505 C", hex: "#FF6900" },
  { name: "Pantone 3155 C", hex: "#006272" },
];

export const DEFAULTS: Settings = {
  company: {
    name: "AGROMAX Industries Private Limited",
    short: "AGROMAX",
    tagline: "Integrated Agro-Processing · Protein Foods · Animal Nutrition",
    cin: "To be updated",
    constitution: "Private Limited Company (Companies Act, 2013)",
    regOffice: "Registered Office — to be updated, Uttar Pradesh, India",
    plantLocation: "Uttar Pradesh — site to be finalised",
    state: "Uttar Pradesh",
  },
  contact: {
    person: "Name — to be updated",
    designation: "Managing Director",
    phone: "+91 00000 00000",
    email: "info@yourdomain.com",
    website: "www.yourdomain.com",
    address: "Registered Office, Uttar Pradesh, India",
  },
  people: [
    { name: "Name — to be updated", role: "Managing Director" },
    { name: "Name — to be updated", role: "Director — Operations & Projects" },
    { name: "Name — to be updated", role: "Director — Finance & Compliance" },
    { name: "Name — to be updated", role: "Director — Procurement & Marketing" },
  ],
  brand: {
    primary: "#007A33",
    secondary: "#D69A2D",
    logo: null,
    showLogoOnSlides: true,
    showWordmark: true,
    shortAuto: true,
    customGraphic: null,
    coverStyle: "hero",
    closingStyle: "hero",
    overlay: 92,
  },
  type: {
    head: "Montserrat",
    body: "Inter",
    scale: 1,
    radius: 10,
    headWeight: 700,
  },
  labels: {
    submittedTo: "Submitted to",
    contents: "Contents",
    pagesWord: "pages",
    highlightsLine: "Highlights for the Hon'ble Chief Minister and Chief Secretary",
    reviewLine: "Department-wise technical, commercial and financial review",
    partA: "Executive Brief",
    partB: "Detailed Project Report",
    execShort: "Exec Brief",
    dprShort: "DPR",
    tocTitle: "Structure of the report",
    closingLine: "Thank you for your time and consideration.",
    contactHeading: "Contact",
    contactSub: "For further information or a site visit",
    showContactPhone: true,
    showContactEmail: true,
    showContactWeb: true,
  },
  export: {
    paper: "a4l",
    orientation: "auto",
    fit: "fit",
    pdfMargin: 0,
    includeCover: true,
    imageFormat: "png",
  },
  pres: {
    deckTitle: "1,200 TPD Integrated Agro-Processing Complex",
    eyebrow: "Investment Proposal · Government of Uttar Pradesh",
    preparedFor: "Hon'ble Chief Minister, Government of Uttar Pradesh",
    audience:
      "Hon'ble Chief Minister · Chief Secretary · Infrastructure & Industrial Development Department",
    date: "",
    confidentiality: "Confidential · For Official Use Only",
    showPageNo: true,
    showFooter: true,
    showPartBadge: true,
  },
  finance: {
    display: "Cr",
    sourceUnit: "Mn",
    equity: 1540,
    debt: 13240,
    rate: 9.5,
    tenure: 8,
    moratorium: 2,
  },
};

const KEY = "agromax-deck-settings-v2";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    return mergeSettings(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function mergeSettings(p: Partial<Settings> | null | undefined): Settings {
  const d = structuredClone(DEFAULTS);
  if (!p || typeof p !== "object") return d;
  return {
    company: { ...d.company, ...(p.company || {}) },
    contact: { ...d.contact, ...(p.contact || {}) },
    people: Array.isArray(p.people) && p.people.length ? p.people : d.people,
    brand: { ...d.brand, ...(p.brand || {}) },
    type: { ...d.type, ...(p.type || {}) },
    pres: { ...d.pres, ...(p.pres || {}) },
    finance: { ...d.finance, ...(p.finance || {}) },
    labels: { ...d.labels, ...(p.labels || {}) },
    export: { ...d.export, ...(p.export || {}) },
  };
}

/** Coordinated theme presets — colours + fonts applied together */
export const TYPE_SETS: { k: FontSetInS; head: string; body: string; desc: string }[] = [
  { k: "Set A", head: "Montserrat", body: "Inter", desc: "Montserrat headings · Inter body — modern corporate" },
  { k: "Set B", head: "Playfair Display", body: "Source Sans 3", desc: "Playfair headings · Source Sans body — institutional" },
];

export const THEMES: { name: string; primary: string; secondary: string; set: FontSetInS }[] = [
  { name: "Pantone 356 / 7563 · default", primary: "#007A33", secondary: "#D69A2D", set: "Set A" },
  { name: "Institutional — navy & amber", primary: "#002855", secondary: "#FFB81C", set: "Set A" },
  { name: "Bharat — indigo & saffron", primary: "#1B3A6B", secondary: "#FF6900", set: "Set A" },
  { name: "Heritage — maroon & gold", primary: "#97272C", secondary: "#C8A24A", set: "Set B" },
  { name: "Agri — forest & maize", primary: "#046A38", secondary: "#F1C400", set: "Set A" },
  { name: "Tech — teal & copper", primary: "#006272", secondary: "#B96B3A", set: "Set A" },
  { name: "Minimal — charcoal & gold", primary: "#2E3A3F", secondary: "#C8A24A", set: "Set B" },
  { name: "Print-safe — green & grey", primary: "#006747", secondary: "#8C9590", set: "Set A" },
  { name: "Monochrome — deep green", primary: "#005524", secondary: "#9AA39E", set: "Set A" },
];

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage full or unavailable */
  }
}

export function displayDate(s: Settings) {
  if (s.pres.date.trim()) return s.pres.date;
  return new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}
