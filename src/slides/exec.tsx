import {
  ArrowRight,
  Award,
  Bird,
  CalendarClock,
  Droplet,
  Factory,
  Handshake,
  IndianRupee,
  Landmark,
  Layers,
  Leaf,
  Mail,
  Milk,
  Phone,
  Recycle,
  Route,
  School,
  ShieldCheck,
  Sprout,
  Sun,
  Target,
  Tractor,
  TrendingUp,
  Users,
  Wheat,
  Globe,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IMG, backgroundFor } from "../assets/images";
import { useCapexMn, useMoney, usePalette, useSettings } from "../brand/BrandContext";
import { displayDate } from "../brand/settings";
import { Logo } from "../components/Logo";
import { Card, H, KPI, Meter, Note, Page, Photo, Pill } from "../components/ui";
import {
  GROUPS,
  JOBS,
  REVENUE,
  cagr,
  SILO_T,
  TANK_T,
  TOT,
  UTIL,
  YEARS,
  groupTotal,
  nf,
} from "../data";
import { useAnim, useMeta, type SlideDef } from "../deck";

export const axisTick = { fontSize: 10.5, fill: "#5b6661" };
export const tipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: "1px solid #e1e5df",
    fontSize: 11,
    boxShadow: "0 6px 18px rgba(0,0,0,.08)",
  },
};
const ink = (a: number) => `color-mix(in srgb, var(--c-p-ink) ${a}%, transparent)`;

/* ================================================================ 01 Cover */
function Cover() {
  const { s } = useSettings();
  const TOTAL = useMeta().total;
  const M = useMoney();
  const capex = useCapexMn();
  const bg = backgroundFor(s.brand.coverStyle, s.brand.customGraphic);
  const ov = Math.min(97, Math.max(20, s.brand.overlay));
  const stats = [
    { v: M.m(capex, 0), l: "Project Investment" },
    { v: "1,200 TPD", l: "Installed Capacity" },
    { v: String(JOBS), l: "Direct Jobs" },
    { v: "27 Months", l: "To Commissioning" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-p-ink font-body text-white">
      {bg && <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${ink(ov)} 0%, ${ink(ov - 8)} 36%, ${ink(ov - 62)} 68%, ${ink(Math.max(4, ov - 86))} 100%)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[270px]"
        style={{ background: `linear-gradient(0deg, ${ink(96)}, transparent)` }}
      />
      <div className="relative flex h-full flex-col px-16 pt-11 pb-12">
        <div className="flex items-center justify-between">
          <Logo size={46} light />
          <span className="rc-sm border border-white/25 bg-white/10 px-3 py-1 fs-9h font-semibold tracking-[0.2em] text-white/85 uppercase">
            {s.pres.confidentiality}
          </span>
        </div>
        <div className="mt-16 max-w-[720px]">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-s" />
            <span className="fs-12 font-bold tracking-[0.24em] text-s uppercase">{s.pres.eyebrow}</span>
          </div>
          <h1 className="font-head fs-54 leading-[1.05]" style={{ fontWeight: 800 }}>
            {s.pres.deckTitle}
          </h1>
          <p className="mt-4 fs-18 font-medium text-white/85">
            {s.company.tagline || "Solvent Extraction · High-Protein Foods · Poultry & Cattle Feed"}
          </p>
          <p className="mt-5 fs-14 text-white/70">
            A project by <span className="font-semibold text-white">{s.company.name}</span>
          </p>
        </div>
        <div className="resp-coverstats mt-auto flex items-end justify-between gap-6">
          <div className="flex gap-3">
            {stats.map((x) => (
              <div key={x.l} className="w-[170px] rc border border-white/20 bg-white/10 px-4 py-3">
                <div className="font-head fs-22 font-extrabold whitespace-nowrap text-white">{x.v}</div>
                <div className="mt-1 fs-9h font-semibold tracking-[0.12em] text-s uppercase">{x.l}</div>
              </div>
            ))}
          </div>
          <div className="max-w-[360px] text-right">
            <div className="fs-9h font-semibold tracking-[0.2em] text-white/50 uppercase">Submitted to</div>
            <div className="mt-1 fs-14 leading-snug font-semibold">{s.pres.preparedFor}</div>
            <div className="mt-1 fs-11 text-white/60">
              {displayDate(s)} <span className="mx-1.5 opacity-40">·</span> {s.labels.pagesWord} 1–{TOTAL}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-[6px]">
        <div className="flex-1 bg-p" />
        <div className="w-[18%] bg-s" />
      </div>
    </div>
  );
}

/* ====================================================== 02 Project at a glance */
function Glance() {
  const M = useMoney();
  const pal = usePalette();
  const capex = useCapexMn();
  const kpis = [
    { icon: IndianRupee, v: "₹" + M.n(capex, 0), u: M.short, l: "Total Project Investment", sub: "Land, civil, plant, storage, utilities & working capital" },
    { icon: Factory, v: "1,200", u: "TPD", l: "Installed Capacity", sub: "700 TPD solvent extraction + 500 TPD feed mill" },
    { icon: Users, v: String(JOBS), u: "Jobs", l: "Direct Employment", sub: "Across 14 skill categories, local hiring priority" },
    { icon: Wheat, v: "3.81", u: "Lakh T", l: "Annual Raw-Material Intake", sub: "Oilseeds, cakes, DDGS & grains at full capacity" },
    { icon: TrendingUp, v: "₹" + M.n(TOT.revenue[4], 0), u: M.short, l: "Year-5 Revenue", sub: `Gross margin ${M.m(TOT.margin[4], 0)} in Year 5` },
    { icon: Sun, v: "3", u: "MW", l: "Captive Solar Power", sub: "Meeting ≈40% of plant electricity demand" },
  ];
  const outs = [...REVENUE].sort((a, b) => b.qty - a.qty);
  return (
    <Page
      kicker="Project at a Glance"
      title="One of the largest integrated oilseed-to-feed complexes proposed in the State"
      subtitle="Converting agricultural raw materials into protein-rich food for people and scientifically formulated nutrition for livestock."
    >
      <div className="resp-6 flex h-full flex-col gap-3">
        <div className="grid grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KPI key={k.l} icon={k.icon} value={k.v} unit={k.u} label={k.l} sub={k.sub} className="!p-3.5" />
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.05fr_1fr] gap-3">
          <Card className="flex flex-col">
            <H icon={Factory}>Capacity Configuration</H>
            <div className="mt-3 flex h-12 overflow-hidden rc-sm">
              <div className="flex flex-col justify-center bg-p px-3 text-white" style={{ width: "58.3%" }}>
                <div className="font-head fs-16 font-extrabold">700 TPD</div>
                <div className="fs-9 text-white/80">Solvent extraction</div>
              </div>
              <div className="flex flex-col justify-center bg-s px-3 text-p-ink" style={{ width: "41.7%" }}>
                <div className="font-head fs-16 font-extrabold">500 TPD</div>
                <div className="fs-9 text-p-ink/80">Feed mill</div>
              </div>
            </div>
            <div className="mt-3 space-y-2.5">
              <div className="rc-sm bg-p-wash p-2.5">
                <div className="fs-12 font-bold text-p-ink">Solvent Extraction Plant</div>
                <div className="fs-10h leading-snug text-mute">
                  Soybean, mustard, groundnut & sunflower cake, maize DDGS → crude oil, DOC & protein foods
                </div>
              </div>
              <div className="rc-sm bg-s-wash p-2.5">
                <div className="fs-12 font-bold text-p-ink">Poultry & Cattle Feed Unit</div>
                <div className="fs-10h leading-snug text-mute">
                  Pellet, mash & crumble feeds for every life stage of cattle and poultry
                </div>
              </div>
            </div>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              <Pill>Machinery rated 750 TPD</Pill>
              <Pill tone="s">Utilisation 60% → 100%</Pill>
              <Pill>3-shift operation</Pill>
            </div>
          </Card>
          <Photo src={IMG.silosaerial} className="h-full" shade="bottom">
            <div className="flex h-full flex-col justify-end p-5">
              <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Single integrated site</div>
              <p className="mt-1.5 font-head fs-16 leading-snug font-semibold text-white">
                20 acres · {nf(SILO_T)} T silo storage · {nf(TANK_T)} T tankage · 3 lakh sq.ft of godowns
              </p>
            </div>
          </Photo>
          <Card className="flex flex-col">
            <H icon={Layers}>Annual Output at Full Capacity</H>
            <div className="mt-3 flex flex-1 flex-col justify-between">
              {outs.map((o, i) => (
                <Meter
                  key={o.name}
                  label={o.name}
                  value={o.qty}
                  max={outs[0].qty}
                  display={`${nf(o.qty)} T`}
                  color={i % 2 ? pal.s : pal.p}
                  thick={7}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ============================================================== 03 About */
function About() {
  const { s } = useSettings();
  const pillars = [
    { i: ShieldCheck, t: "Quality Excellence", d: "Consistent purity, safety & nutrition" },
    { i: Leaf, t: "Sustainability", d: "Solar power, eco-packaging" },
    { i: Handshake, t: "Customer First", d: "Integrity & long-term relationships" },
    { i: Users, t: "Community Impact", d: "Local jobs & farmer linkages" },
  ];
  const facts = [
    { k: "Constitution", v: "Private Limited Company" },
    { k: "Governing Law", v: "Companies Act, 2013" },
    { k: "CIN", v: s.company.cin },
    { k: "Brand", v: s.company.short },
  ];
  return (
    <Page
      kicker="About the Company"
      title={`${s.company.short} — building a trusted name in protein foods & animal nutrition`}
      subtitle="A new-generation agro-processing enterprise backed by deep procurement experience, modern technology and a sustainability-first approach."
    >
      <div className="resp-2p grid h-full grid-cols-[390px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.workers} className="h-full" shade="bottom" pos="center 30%">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Our Vision</div>
            <p className="mt-2 font-head fs-16 leading-snug font-semibold text-white">
              “To become a recognised leader in feed and soybean products — renowned for quality,
              sustainability and customer satisfaction.”
            </p>
          </div>
        </Photo>
        <div className="flex min-h-0 flex-col gap-3">
          <p className="fs-13 leading-relaxed text-ink/85">
            <span className="font-semibold text-p-ink">{s.company.name}</span> is a forward-looking
            enterprise in feed manufacturing, crude oil and food processing. Driven by modern technology,
            efficient processes and an uncompromising commitment to quality, the company is establishing an
            integrated facility in {s.company.state} to transform agricultural produce into high-value
            protein foods, edible oils and scientifically formulated animal feed.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Card tone="p">
              <H icon={Target}>Mission</H>
              <p className="mt-1.5 fs-11h leading-snug text-ink/80">
                Deliver premium-quality crude soybean oil, soya meal and animal feed through sustainable and
                innovative practices — consistently, safely and responsibly.
              </p>
            </Card>
            <Card tone="s">
              <H icon={Award}>Promoter Strength</H>
              <p className="mt-1.5 fs-11h leading-snug text-ink/80">
                20+ years of experience in oilseed and raw-material procurement, with long-standing supplier
                relationships that secure consistent, high-grade inputs.
              </p>
            </Card>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {pillars.map((p) => (
              <div key={p.t} className="rc border border-line bg-white p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-p text-white">
                  <p.i size={15} />
                </div>
                <div className="mt-2 fs-12 font-bold text-p-ink">{p.t}</div>
                <div className="mt-0.5 fs-10h leading-snug text-mute">{p.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-auto grid grid-cols-4 overflow-hidden rc border border-line bg-paper">
            {facts.map((f) => (
              <div key={f.k} className="border-r border-line px-3 py-2.5 last:border-r-0">
                <div className="fs-9 font-semibold tracking-wider text-mute uppercase">{f.k}</div>
                <div className="mt-0.5 truncate fs-12 font-semibold text-p-ink">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ============================================================= 04 Why UP */
function WhyUP() {
  const { s } = useSettings();
  const pts = [
    {
      i: Milk,
      t: "India's largest milk producer",
      d: `${s.company.state} contributes 16.21% of national milk output (2023-24) — a vast, under-served market for quality cattle feed.`,
    },
    { i: Bird, t: "Large meat & poultry economy", d: "The State accounts for 12.29% of India's meat production, with organised poultry farming expanding rapidly." },
    { i: Sprout, t: "Oilseed catchment", d: "A major rapeseed-mustard growing State that adjoins Madhya Pradesh — India's leading soybean-producing State." },
    { i: Wheat, t: "Maize & DDGS availability", d: "Expanding maize cultivation and grain-based distilleries assure steady supplies of maize and DDGS." },
    { i: Route, t: "Market & logistics access", d: "India's most populous State with expressway and rail links to Delhi-NCR, Bihar, MP and eastern markets." },
    { i: Landmark, t: "Investor-friendly policy", d: "Nivesh Mitra single window, UP Food Processing Industry Policy 2023 and Industrial Investment & Employment Promotion Policy 2022." },
  ];
  return (
    <Page
      kicker="Strategic Fit"
      title={`Why ${s.company.state} is the right home for this project`}
      subtitle="The plant sits where raw material, India's largest livestock economy and the country's biggest consumer market converge."
    >
      <div className="resp-2p grid h-full grid-cols-[350px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.mustard} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="font-head fs-60 leading-none font-extrabold text-s">16.21%</div>
            <p className="mt-2 fs-13 leading-snug font-semibold text-white">
              {s.company.state}'s share of India's milk production — the highest of any State (2023-24)
            </p>
            <p className="mt-2 fs-9h text-white/60">Source: Basic Animal Husbandry Statistics 2024, GoI</p>
          </div>
        </Photo>
        <div className="grid grid-cols-2 grid-rows-3 gap-3">
          {pts.map((p) => (
            <Card key={p.t} className="flex gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-p text-white">
                <p.i size={20} />
              </div>
              <div>
                <div className="font-head fs-14 font-bold text-p-ink">{p.t}</div>
                <p className="mt-1 fs-11h leading-snug text-mute">{p.d}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ======================================================== 05 Value chain */
function ValueChain() {
  const stages = [
    { img: IMG.farmers, t: "Farm & Mandi", d: "Soybean, mustard, groundnut & sunflower cake, maize DDGS and grains", n: "3.81 lakh TPA" },
    { img: IMG.silosaerial, t: "Receiving & Storage", d: "Weighbridge, cleaning, grading and lab testing; 8,100 T of silos", n: "Quality gate" },
    { img: IMG.pipes, t: "Solvent Extraction", d: "Continuous extraction yielding crude oil and de-oiled cake", n: "700 TPD" },
    { img: IMG.feed, t: "Value Addition & Feed", d: "Hi-Pro DOC, soya flour & chunks; cattle & poultry feed", n: "500 TPD feed" },
    { img: IMG.truck, t: "Markets", d: "Refiners, food processors, dairy & poultry farmers, nutrition schemes, exports", n: "3.84 lakh TPA" },
  ];
  const adv = [
    { i: Factory, t: "Captive inputs", d: "DOC and crude oil from the solvent plant flow straight into the feed mill." },
    { i: Layers, t: "Shared infrastructure", d: "Common utilities, storage, laboratory and logistics on one site." },
    { i: Recycle, t: "Zero-waste processing", d: "Every fraction of the seed becomes oil, protein food or feed." },
    { i: CalendarClock, t: "Year-round operation", d: "Multi-seed sourcing keeps the plant running across crop seasons." },
  ];
  return (
    <Page
      kicker="Integrated Value Chain"
      title="From farm gate to finished protein — on a single integrated site"
      subtitle="Integration of extraction, value addition and feed manufacturing lowers cost, improves quality control and maximises value captured in the State."
    >
      <div className="resp-chain flex h-full flex-col">
        <div className="flex flex-1 items-center justify-between pb-4">
          {stages.map((st, i) => (
            <div key={st.t} className="stage-box flex items-start">
              <div className="flex w-[200px] flex-col items-center text-center">
                <div className="relative">
                  <div className="h-[140px] w-[140px] overflow-hidden rounded-full border-[5px] border-p-wash shadow-[0_0_0_2px_var(--c-p)]">
                    <img src={st.img} alt="" className="h-full w-full object-cover" />
                  </div>
                  <span className="absolute -top-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-s font-head fs-13 font-extrabold text-p-ink">
                    {i + 1}
                  </span>
                </div>
                <div className="mt-3 font-head fs-14 font-bold text-p-ink">{st.t}</div>
                <p className="mt-1 min-h-[44px] fs-11 leading-snug text-mute">{st.d}</p>
                <Pill tone={i % 2 ? "s" : "p"} className="mt-2">
                  {st.n}
                </Pill>
              </div>
              {i < stages.length - 1 && (
                <div className="resp-arrow mt-[62px] flex w-[46px] items-center justify-center">
                  <div className="h-[2px] w-5 bg-s" />
                  <ArrowRight size={18} className="-ml-1 text-s" strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>
        <Card tone="p" className="mt-auto">
          <div className="mb-3 fs-10h font-bold tracking-[0.18em] text-p-dark uppercase">
            Integration advantages
          </div>
          <div className="grid grid-cols-4 gap-5">
            {adv.map((a) => (
              <div key={a.t} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-p text-white">
                  <a.i size={16} />
                </div>
                <div>
                  <div className="fs-12h font-bold text-p-ink">{a.t}</div>
                  <p className="mt-0.5 fs-10h leading-snug text-mute">{a.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

/* ========================================================== 06 Products */
function Products() {
  const cols = [
    { img: IMG.oil, i: Droplet, t: "Crude Edible Oils", items: ["Soybean oil", "Mustard / rapeseed oil", "Sunflower oil", "Groundnut oil", "DDGS & rice-bran crude oil"], buyers: "Refiners · Industrial users", vol: "43,450 TPA" },
    { img: IMG.soya, i: Sprout, t: "High-Protein Foods", items: ["Soya DOC — 47% protein", "Soya DOC Hi-Pro — 50% protein", "Soya flour — 54% (high / low fat)", "Soya chunks — 54% protein", "Sunflower & groundnut DOC"], buyers: "Food processors · Nutrition schemes · Exports", vol: "1.55 lakh TPA meals" },
    { img: IMG.dairy, i: Milk, t: "Cattle Feed", items: ["Dairy cattle feed", "Non-dairy (growth) feed", "Calf starter & grower", "Mineral premixes & rumen buffers", "Pellet & mash forms"], buyers: "Dairy farmers · Cooperatives", vol: "74,000 TPA" },
    { img: IMG.poultry, i: Bird, t: "Poultry Feed", items: ["Broiler starter / grower / finisher", "Layer feed", "Breeder feed", "Pre-starter / chick crumble", "Enzymes, probiotics & premixes"], buyers: "Poultry farmers · Integrators", vol: "1,11,000 TPA" },
  ];
  const { s } = useSettings();
  return (
    <Page
      kicker="Product Portfolio"
      title={`Four revenue pillars under the ${s.company.short} brand`}
      subtitle="Crude oils for refiners, food-grade protein for human nutrition, and scientifically formulated cattle and poultry feed."
    >
      <div className="resp-4 grid h-full grid-cols-4 gap-4">
        {cols.map((c) => (
          <div key={c.t} className="flex flex-col overflow-hidden rc border border-line bg-white">
            <div className="relative h-[200px] shrink-0">
              <img src={c.img} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${ink(85)})` }} />
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-s text-p-ink">
                  <c.i size={16} />
                </span>
                <span className="font-head fs-15 font-bold">{c.t}</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <ul className="space-y-[7px]">
                {c.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 fs-12 text-ink/85">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-p" />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-line pt-3">
                <div className="font-head fs-18 font-extrabold text-p">{c.vol}</div>
                <div className="mt-0.5 fs-10h text-mute">{c.buyers}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ======================================================== 07 Investment */
function Investment() {
  const M = useMoney();
  const pal = usePalette();
  const anim = useAnim();
  const { s } = useSettings();
  const capex = useCapexMn();
  const groups = GROUPS.map((g, i) => ({
    name: g.name,
    mn: M.cap(groupTotal(g.key)),
    v: M.conv(M.cap(groupTotal(g.key))),
    color: pal.chart[i],
  }));
  const eq = M.cap(s.finance.equity);
  const debt = M.cap(s.finance.debt);
  const fin = eq + debt || 1;
  const tiles = [
    { v: "20 Acres", l: "Industrial land" },
    { v: "3 Lakh sq.ft", l: "Covered godowns" },
    { v: `${nf(SILO_T)} T`, l: "Silo storage" },
    { v: `${nf(TANK_T)} T`, l: "Oil & molasses tankage" },
    { v: "3 MW", l: "Captive solar" },
    { v: "27 Months", l: "Implementation" },
  ];
  return (
    <Page
      kicker="Investment Highlights"
      title={`${M.m(capex, 0)} of committed, asset-backed investment`}
      subtitle={`Land, civil works, plant & machinery, storage, utilities and working capital — all figures in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1.12fr_1fr] gap-4">
        <Card className="flex flex-col">
          <H icon={IndianRupee}>Project cost by category</H>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative">
              <PieChart width={260} height={260}>
                <Pie
                  data={groups}
                  dataKey="v"
                  nameKey="name"
                  innerRadius={78}
                  outerRadius={120}
                  paddingAngle={1.5}
                  stroke="none"
                  isAnimationActive={anim}
                >
                  {groups.map((g) => (
                    <Cell key={g.name} fill={g.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="fs-9h font-semibold tracking-wider text-mute uppercase">Total</div>
                <div className="font-head fs-24 font-extrabold text-p-ink">{M.m(capex, 0)}</div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {groups.map((g) => (
                <div key={g.name} className="flex items-center gap-2.5 border-b border-line pb-2 last:border-0">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: g.color }} />
                  <span className="flex-1 fs-12 font-medium text-ink">{g.name}</span>
                  <span className="fs-12 font-bold tabular text-p-ink">{M.n(g.mn, 0)}</span>
                  <span className="w-12 text-right fs-10h tabular text-mute">
                    {((g.mn / capex) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <div className="flex flex-col gap-3">
          <Card tone="p">
            <H icon={Landmark}>Means of finance</H>
            <div className="mt-3 flex h-11 overflow-hidden rc-sm">
              <div
                className="flex items-center justify-center bg-s fs-11 font-bold text-p-ink"
                style={{ width: `${(eq / fin) * 100}%`, minWidth: 70 }}
              >
                Equity {((eq / fin) * 100).toFixed(0)}%
              </div>
              <div className="flex flex-1 items-center justify-center bg-p fs-11 font-bold text-white">
                Debt {((debt / fin) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rc-sm bg-white p-2.5">
                <div className="font-head fs-16 font-extrabold text-p">{M.m(eq, 0)}</div>
                <div className="fs-10 text-mute">Promoter equity</div>
              </div>
              <div className="rc-sm bg-white p-2.5">
                <div className="font-head fs-16 font-extrabold text-p">{M.m(debt, 0)}</div>
                <div className="fs-10 text-mute">Term debt</div>
              </div>
              <div className="rc-sm bg-white p-2.5">
                <div className="font-head fs-16 font-extrabold text-p">
                  {(debt / (eq || 1)).toFixed(2)} : 1
                </div>
                <div className="fs-10 text-mute">Debt : Equity</div>
              </div>
            </div>
          </Card>
          <div className="grid flex-1 grid-cols-3 gap-3">
            {tiles.map((t) => (
              <div key={t.l} className="flex flex-col justify-center rc border border-line bg-white px-3.5">
                <div className="font-head fs-18 font-extrabold text-p-ink">{t.v}</div>
                <div className="mt-0.5 fs-10h text-mute">{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ========================================================= 08 Financials */
function Financials() {
  const M = useMoney();
  const pal = usePalette();
  const anim = useAnim();
  const data = YEARS.map((y, i) => ({
    y,
    rev: +M.conv(TOT.revenue[i]).toFixed(1),
    rm: +M.conv(TOT.rm[i]).toFixed(1),
    gm: +M.conv(TOT.margin[i]).toFixed(1),
  }));
  const mix = [...REVENUE].sort((a, b) => b.y[4] - a.y[4]);
  const lbl = ((v: unknown) => nf(Number(v))) as never;
  return (
    <Page
      kicker="Financial Highlights"
      title={`Revenue scaling to ${M.m(TOT.revenue[4], 0)} by Year 5`}
      subtitle={`Capacity utilisation ramps from 60% to 100%; gross margin (revenue less raw material) grows from ${M.m(TOT.margin[0], 0)} to ${M.m(TOT.margin[4], 0)}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1fr_370px] gap-4">
        <Card className="flex flex-col">
          <H icon={TrendingUp}>Revenue, raw-material cost & gross margin ({M.label})</H>
          <div className="mt-2">
            <ComposedChart width={740} height={318} data={data} margin={{ top: 22, right: 10, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
              <XAxis dataKey="y" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} />
              <Tooltip {...tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="rev" name="Revenue" fill={pal.p} radius={[4, 4, 0, 0]} isAnimationActive={anim}>
                <LabelList dataKey="rev" position="top" style={{ fontSize: 10, fill: "#17201c", fontWeight: 700 }} formatter={lbl} />
              </Bar>
              <Bar dataKey="rm" name="Raw material cost" fill={pal.pSoft} radius={[4, 4, 0, 0]} isAnimationActive={anim} />
              <Line dataKey="gm" name="Gross margin" stroke={pal.s} strokeWidth={3} dot={{ r: 4, fill: pal.s }} isAnimationActive={anim} />
            </ComposedChart>
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-line pt-3">
            <span className="mr-1 fs-10h font-semibold tracking-wider text-mute uppercase">Utilisation</span>
            {UTIL.map((u, i) => (
              <div key={i} className="flex-1 rc-sm bg-p-wash px-2 py-1.5 text-center">
                <div className="fs-9 text-mute">{YEARS[i]}</div>
                <div className="font-head fs-14 font-extrabold text-p">{Math.round(u * 100)}%</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <KPI value={M.n(TOT.revenue[0], 0)} unit={M.short} label="Year-1 revenue" className="!p-3.5" />
            <KPI value={M.n(TOT.revenue[4], 0)} unit={M.short} label="Year-5 revenue" className="!p-3.5" />
            <KPI value={(cagr(TOT.revenue[0], TOT.revenue[4]) * 100).toFixed(1) + "%"} label="Revenue CAGR (Y1–Y5)" tone="gold" className="!p-3.5" />
            <KPI
              value={((TOT.margin[4] / TOT.revenue[4]) * 100).toFixed(1) + "%"}
              label="Year-5 gross margin"
              tone="gold"
              className="!p-3.5"
            />
          </div>
          <Card className="flex flex-1 flex-col">
            <H>Year-5 revenue mix</H>
            <div className="mt-3 flex h-4 overflow-hidden rounded-full">
              {mix.map((r, i) => (
                <div key={r.name} style={{ width: `${(r.y[4] / TOT.revenue[4]) * 100}%`, background: pal.chart[i] }} />
              ))}
            </div>
            <div className="mt-3 flex-1 space-y-1.5">
              {mix.map((r, i) => (
                <div key={r.name} className="flex items-center gap-2 fs-11">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: pal.chart[i] }} />
                  <span className="flex-1 text-ink">{r.name}</span>
                  <span className="font-semibold tabular text-p-ink">{M.n(r.y[4], 0)}</span>
                  <span className="w-11 text-right tabular text-mute">
                    {((r.y[4] / TOT.revenue[4]) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <Note>Source: promoter projections. Gross margin = revenue less raw-material cost.</Note>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ============================================================ 09 Impact */
function Impact() {
  const M = useMoney();
  const { s } = useSettings();
  const tiles = [
    { i: Users, v: String(JOBS), t: "Direct jobs", d: "Plus an estimated ~2,000 indirect livelihoods in transport, trade & services" },
    { i: Tractor, v: "3.81 L T", t: "Farm produce procured / year", d: "Soybean, mustard, cakes, DDGS & grains at full capacity" },
    { i: IndianRupee, v: M.m(TOT.rm[4], 0), t: "Annual raw-material purchase", d: `Rising from ${M.m(TOT.rm[0], 0)} in Year 1 — flowing to farmers & traders` },
    { i: Droplet, v: "43,450 T", t: "Domestic crude oil / year", d: "Import substitution — India imports ~57% of its edible-oil demand" },
    { i: School, v: "54%", t: "Protein for nutrition schemes", d: "Soya chunks & flour for PM-POSHAN, ICDS and institutional feeding" },
    { i: Milk, v: "1.85 L T", t: "Scientific feed / year", d: "Better milk yield and feed conversion for dairy & poultry farmers" },
    { i: Sun, v: "40%", t: "Green power share", d: "3 MW captive solar lowering grid demand and emissions" },
    { i: Landmark, v: "Recurring", t: "Revenue to the State", d: "GST, mandi fee, electricity duty and allied revenues" },
    { i: Globe, v: "Exports", t: "Global market reach", d: "Soya protein to Asia-Pacific, Middle East & Africa" },
  ];
  return (
    <Page
      kicker="Socio-Economic Impact"
      title={`What the project delivers for ${s.company.state}`}
      subtitle="Value addition, employment and farm incomes that stay within the State — with a measurable contribution to nutrition and self-reliance."
    >
      <div className="resp-2p grid h-full grid-cols-[320px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.farmers} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Inclusive growth</div>
            <p className="mt-2 font-head fs-18 leading-snug font-semibold text-white">
              Prosperity across the agri value chain — from the farm gate to the factory floor.
            </p>
          </div>
        </Photo>
        <div className="grid grid-cols-3 grid-rows-3 gap-3">
          {tiles.map((t) => (
            <div key={t.t} className="flex flex-col rc border border-line bg-white p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-p-wash text-p">
                  <t.i size={16} />
                </div>
                <span className="font-head fs-20 font-extrabold text-p">{t.v}</span>
              </div>
              <div className="mt-2 fs-12h font-bold text-p-ink">{t.t}</div>
              <p className="mt-0.5 fs-10h leading-snug text-mute">{t.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ============================================================== 10 Asks */
function Asks() {
  const { s } = useSettings();
  const asks = [
    { t: "Land Allotment", d: "20 acres of industrial land through UPSIDA at institutional rates, with clear title, conversion and stamp-duty exemption." },
    { t: "Capital & Interest Subsidy", d: "Incentives under UP Food Processing Industry Policy 2023 and IIEPP 2022, including capital and interest subsidy." },
    { t: "SGST Reimbursement", d: "Net SGST reimbursement and allied fiscal incentives commensurate with the committed investment." },
    { t: "Power Infrastructure", d: "Dedicated 33/11 kV feeder, electricity-duty exemption and approvals for the 3 MW captive solar plant." },
    { t: "Road & Rail Connectivity", d: "Approach-road strengthening and rail-siding / goods-shed linkage for bulk oilseed and DOC movement." },
    { t: "Single-Window Clearances", d: "Time-bound approvals via Nivesh Mitra — UPPCB, PESO, factory, boiler, fire and FSSAI." },
    { t: "Institutional Offtake", d: "Empanelment for fortified soya protein under PM-POSHAN / ICDS and feed supply to State dairy missions." },
    { t: "Farmer Linkage Support", d: "Facilitation of FPO tie-ups and oilseed & maize cluster development around the plant." },
  ];
  const way = [
    { m: "Month 0–3", t: "Land allotment & statutory approvals" },
    { m: "Month 3–9", t: "Financial closure & EPC award" },
    { m: "Month 9–18", t: "Civil works, godowns & silos" },
    { m: "Month 18–24", t: "Plant erection & solar installation" },
    { m: "Month 24–27", t: "Trial runs & commercial production" },
  ];
  return (
    <Page
      dark
      kicker="Support Sought & Way Forward"
      title={`Eight enabling actions to bring this investment to ${s.company.state}`}
      subtitle="All requests fall within the existing framework of State industrial and food-processing policy."
    >
      <div className="resp-2 grid h-full grid-cols-[1fr_330px] gap-5">
        <div className="grid grid-cols-2 grid-rows-4 gap-2.5">
          {asks.map((a, i) => (
            <div key={a.t} className="flex gap-3 rc border border-white/15 bg-white/[0.06] p-3.5">
              <span className="font-head fs-24 leading-none font-extrabold text-s">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="fs-13 font-bold text-white">{a.t}</div>
                <p className="mt-1 fs-10h leading-snug text-white/70">{a.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="rc border border-white/15 bg-white/[0.06] p-4">
            <div className="mb-3 fs-10h font-bold tracking-[0.18em] text-s uppercase">Way forward</div>
            <div className="relative space-y-3 pl-5">
              <div className="absolute top-1 bottom-1 left-[5px] w-[2px] bg-white/15" />
              {way.map((w) => (
                <div key={w.m} className="relative">
                  <span className="absolute top-1 -left-5 h-3 w-3 rounded-full border-2 border-s bg-p-ink" />
                  <div className="fs-9h font-bold tracking-wider text-s uppercase">{w.m}</div>
                  <div className="fs-12 font-medium text-white">{w.t}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto rc bg-s p-4 text-p-ink">
            <div className="fs-9h font-bold tracking-[0.18em] uppercase opacity-70">Contact</div>
            <div className="mt-1 fs-14 font-bold">{s.contact.person}</div>
            <div className="fs-11 opacity-80">{s.contact.designation}</div>
            <div className="mt-2 flex items-center gap-2 fs-11 font-medium">
              <Phone size={12} /> {s.contact.phone}
            </div>
            <div className="mt-1 flex items-center gap-2 fs-11 font-medium">
              <Mail size={12} /> {s.contact.email}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export const EXEC: SlideDef[] = [
  { title: "Cover", part: "A", section: "Cover", C: Cover },
  { title: "Project at a Glance", part: "A", section: "Project at a Glance", C: Glance },
  { title: "About the Company", part: "A", section: "About the Company", C: About },
  { title: (st) => `Why ${st.company.state}`, part: "A", section: "Strategic Fit", C: WhyUP },
  { title: "Integrated Value Chain", part: "A", section: "Value Chain", C: ValueChain },
  { title: "Product Portfolio", part: "A", section: "Products", C: Products },
  { title: "Investment Highlights", part: "A", section: "Investment", C: Investment },
  { title: "Financial Highlights", part: "A", section: "Financials", C: Financials },
  { title: "Socio-Economic Impact", part: "A", section: "Impact", C: Impact },
  { title: "Support Sought & Way Forward", part: "A", section: "Support Sought", C: Asks },
];
