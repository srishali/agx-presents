// ---------------------------------------------------------------------------
// AGROMAX — project data (source: promoter project report)
// Revenue & raw-material values are in ₹ Million.
// Capex-table values are stored as given in the source and interpreted with the
// "source unit" chosen in Settings → Finance (default: ₹ Million).
// ---------------------------------------------------------------------------

export const UTIL = [0.6, 0.7, 0.8, 0.9, 1];
export const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
export const YRS = ["Y1", "Y2", "Y3", "Y4", "Y5"];

export const nf = (n: number, dp = 0) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp });

export type Seg = "solvent" | "feed";
export type Line5 = { name: string; qty: number; price: number; seg: Seg; y: number[] };

const L = (name: string, qty: number, price: number, seg: Seg): Line5 => ({
  name,
  qty,
  price,
  seg,
  y: UTIL.map((u) => (qty * price * u) / 1e6),
});

export const REVENUE: Line5[] = [
  L("Crude Oil", 43450, 135000, "solvent"),
  L("Soya DOC", 88000, 40000, "solvent"),
  L("Rapeseed Meal (RSM)", 27450, 25000, "solvent"),
  L("De-oiled DDGS", 40000, 14500, "solvent"),
  L("Poultry Feed", 111000, 27000, "feed"),
  L("Cattle Feed", 74000, 23000, "feed"),
];

export const RM: Line5[] = [
  L("Soya Beans", 110000, 46000, "solvent"),
  L("Mustard Seed", 45000, 60000, "solvent"),
  L("Maize DDGS", 45000, 16000, "solvent"),
  L("Grains", 54750, 23000, "feed"),
  L("Fillers", 76400, 13000, "feed"),
  L("Minerals / Vitamins / Premix", 8122, 18000, "feed"),
  L("Crude Oil (feed grade)", 5544, 110000, "feed"),
  L("DOC / De-oiled Cakes", 36500, 36000, "feed"),
];

/** Totals exactly as stated in the source report (₹ Mn) */
export const TOT = {
  revenue: [9210.6, 10745.7, 12280.8, 13815.9, 15351],
  rm: [7681, 8962, 10242, 11522, 12802],
  margin: [1529.6, 1783.7, 2038.8, 2293.9, 2549],
  rmSolvent: [5088, 5936, 6784, 7632, 8480],
  rmFeed: [2593, 3026, 3458, 3890, 4322],
};

const segSum = (lines: Line5[], seg: Seg) =>
  UTIL.map((_, i) => lines.filter((r) => r.seg === seg).reduce((a, r) => a + r.y[i], 0));

export const REV_SOLVENT = segSum(REVENUE, "solvent");
export const REV_FEED = segSum(REVENUE, "feed");

export const OUTPUT_T = REVENUE.reduce((a, r) => a + r.qty, 0); // 3,83,900
export const RM_T = { solvent: 200000, feed: 181316, total: 381316 };

export const cagr = (first: number, last: number, periods = 4) =>
  first > 0 ? Math.pow(last / first, 1 / periods) - 1 : 0;

// ------------------------------------------------------------------ Capex
export type GroupKey = "land" | "pm" | "storage" | "utilities" | "finance";
export type CostItem = { item: string; amt: number; grp: GroupKey };

export const COST: CostItem[] = [
  { item: "Land for manufacturing plant — 20 acres", amt: 2500, grp: "land" },
  { item: "Construction of godowns — 3,00,000 sq.ft", amt: 4500, grp: "land" },
  { item: "Solvent extraction plant with boiler (750 TPD rated)", amt: 1800, grp: "pm" },
  { item: "Poultry & cattle feed plant — 500 TPD", amt: 2000, grp: "pm" },
  { item: "Raw material storage silos — 2 × 500 T", amt: 450, grp: "storage" },
  { item: "Raw material storage silos — 2 × 3,000 T", amt: 250, grp: "storage" },
  { item: "Crude oil SS storage tanks — 2 × 100 T", amt: 200, grp: "storage" },
  { item: "Solvent plant oil tanks — 4 × 300 T", amt: 150, grp: "storage" },
  { item: "Molasses tanks — 2 × 1,100 T", amt: 200, grp: "storage" },
  { item: "Daily silos, solvent plant — 3 × 100 T", amt: 75, grp: "storage" },
  { item: "Daily silo, solvent plant — 1 × 800 T", amt: 75, grp: "storage" },
  { item: "Power equipment", amt: 150, grp: "utilities" },
  { item: "Security deposit — power connection", amt: 100, grp: "utilities" },
  { item: "Generator / DG set", amt: 180, grp: "utilities" },
  { item: "Solar power plant — 3 MW", amt: 400, grp: "utilities" },
  { item: "Working capital", amt: 1000, grp: "finance" },
  { item: "Term loan provision", amt: 750, grp: "finance" },
];

export const GROUPS: { key: GroupKey; name: string }[] = [
  { key: "land", name: "Land & Civil Works" },
  { key: "pm", name: "Plant & Machinery" },
  { key: "storage", name: "Storage Infrastructure" },
  { key: "utilities", name: "Power & Utilities" },
  { key: "finance", name: "Working Capital & Finance" },
];

export const COST_TOTAL = COST.reduce((a, c) => a + c.amt, 0); // 14,780 (source units)
export const groupTotal = (k: GroupKey) =>
  COST.filter((c) => c.grp === k).reduce((a, c) => a + c.amt, 0);

// --------------------------------------------------------------- Storage
export const SILOS = [
  { name: "Raw material silos", units: 2, cap: 3000, purpose: "Bulk oilseed & grain storage" },
  { name: "Raw material silos", units: 2, cap: 500, purpose: "Feed grains & ingredients" },
  { name: "Daily silos — solvent plant", units: 3, cap: 100, purpose: "Day bins to preparation" },
  { name: "Daily silo — solvent plant", units: 1, cap: 800, purpose: "Extraction buffer" },
];
export const TANKS = [
  { name: "Crude oil SS tanks", units: 2, cap: 100, purpose: "Finished crude oil (SS)" },
  { name: "Solvent plant oil tanks", units: 4, cap: 300, purpose: "Crude oil day & dispatch" },
  { name: "Molasses tanks", units: 2, cap: 1100, purpose: "Molasses for cattle feed" },
];
export const SILO_T = SILOS.reduce((a, s) => a + s.units * s.cap, 0); // 8,100
export const TANK_T = TANKS.reduce((a, s) => a + s.units * s.cap, 0); // 3,600

// -------------------------------------------------------------- Manpower
export type Fn = "ops" | "qa" | "scm" | "ehs" | "corp";
export type Skill = "pro" | "sup" | "skl" | "semi" | "uns";
export const MANPOWER: { cat: string; n: number; fn: Fn; skill: Skill }[] = [
  { cat: "Management & Administration", n: 25, fn: "corp", skill: "pro" },
  { cat: "Technical & Engineering (Mechanical, Electrical, Process)", n: 55, fn: "ops", skill: "pro" },
  { cat: "Quality Control & Laboratory", n: 18, fn: "qa", skill: "pro" },
  { cat: "Production Supervisors", n: 30, fn: "ops", skill: "sup" },
  { cat: "Skilled Operators (Solvent, Expeller, Feed Plant)", n: 95, fn: "ops", skill: "skl" },
  { cat: "Semi-Skilled Workers", n: 85, fn: "ops", skill: "semi" },
  { cat: "Unskilled Workers", n: 50, fn: "ops", skill: "uns" },
  { cat: "Stores, Inventory & Warehouse Staff", n: 22, fn: "scm", skill: "semi" },
  { cat: "Safety, Environment & Compliance Staff", n: 10, fn: "ehs", skill: "pro" },
  { cat: "Security & Housekeeping", n: 20, fn: "corp", skill: "uns" },
  { cat: "Transport & Logistics (Rail & Road)", n: 40, fn: "scm", skill: "uns" },
  { cat: "Contract Labour (Loading / Unloading)", n: 25, fn: "scm", skill: "uns" },
  { cat: "Raw Material Handling & Packaging", n: 15, fn: "scm", skill: "uns" },
  { cat: "Maintenance & Ancillary Services", n: 15, fn: "ops", skill: "skl" },
];
export const JOBS = MANPOWER.reduce((a, m) => a + m.n, 0); // 505
export const fnTotal = (f: Fn) => MANPOWER.filter((m) => m.fn === f).reduce((a, m) => a + m.n, 0);
export const SKILLS: { key: Skill; name: string }[] = [
  { key: "pro", name: "Managerial & Professional" },
  { key: "sup", name: "Supervisory" },
  { key: "skl", name: "Skilled" },
  { key: "semi", name: "Semi-Skilled" },
  { key: "uns", name: "Unskilled & Support" },
];
export const skillTotal = (k: Skill) =>
  MANPOWER.filter((m) => m.skill === k).reduce((a, m) => a + m.n, 0);

// ---------------------------------------------------------------- Market
export const PRICES = {
  inflation: [
    { name: "WPI — Soybean Oil", v: 28.26 },
    { name: "CPI — Refined Oil", v: 16.67 },
  ],
  doc: [
    { name: "Retail", nov23: 12824.5, nov24: 14226.23, chg: 10.93 },
    { name: "Wholesale", nov23: 11796.4, nov24: 13239.07, chg: 12.23 },
  ],
};

export const MILK = [
  { st: "Uttar Pradesh", v: 16.21 },
  { st: "Rajasthan", v: 14.51 },
  { st: "Madhya Pradesh", v: 8.91 },
  { st: "Gujarat", v: 7.65 },
  { st: "Maharashtra", v: 6.71 },
];

// ---------------------------------------------- Indicative mass balance
export const MASS = [
  {
    input: "Soybean",
    qty: 110000,
    outs: [
      { name: "Soya DOC", qty: 88000, k: 0 },
      { name: "Crude soybean oil", qty: 20900, k: 1 },
      { name: "Hulls / process loss", qty: 1100, k: 2 },
    ],
  },
  {
    input: "Mustard seed",
    qty: 45000,
    outs: [
      { name: "Rapeseed meal", qty: 27450, k: 0 },
      { name: "Crude mustard oil", qty: 17550, k: 1 },
    ],
  },
  {
    input: "Maize DDGS",
    qty: 45000,
    outs: [
      { name: "De-oiled DDGS", qty: 40000, k: 0 },
      { name: "Crude DDGS oil", qty: 5000, k: 1 },
    ],
  },
];

// ------------------------------------------------- Implementation plan
export const GANTT = [
  { task: "Land allotment & registration", s: 1, e: 3, ph: 0 },
  { task: "Statutory approvals (CTE, PESO, building plan)", s: 1, e: 6, ph: 0 },
  { task: "Financial closure", s: 2, e: 6, ph: 0 },
  { task: "Detailed engineering & EPC award", s: 3, e: 7, ph: 1 },
  { task: "Site development & boundary wall", s: 4, e: 8, ph: 1 },
  { task: "Civil works — process buildings", s: 7, e: 16, ph: 1 },
  { task: "Godowns — 3 lakh sq.ft", s: 7, e: 18, ph: 1 },
  { task: "Silos & tank farm", s: 10, e: 18, ph: 2 },
  { task: "Solvent plant supply & erection", s: 13, e: 23, ph: 2 },
  { task: "Feed plant supply & erection", s: 14, e: 22, ph: 2 },
  { task: "Boiler, power & utilities", s: 15, e: 23, ph: 2 },
  { task: "3 MW solar installation", s: 16, e: 22, ph: 2 },
  { task: "Recruitment & training", s: 18, e: 25, ph: 3 },
  { task: "Trial runs & certifications", s: 24, e: 26, ph: 3 },
  { task: "Commercial production", s: 27, e: 27, ph: 3 },
];
export const PHASES = ["Pre-project", "Engineering & Civil", "Plant & Machinery", "Commissioning"];
