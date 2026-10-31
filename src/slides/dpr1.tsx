import {
  ArrowRight,
  Award,
  Banknote,
  Bird,
  Building,
  CalendarClock,
  Droplets,
  Eye,
  Factory,
  Globe,
  Handshake,
  Leaf,
  MapPin,
  Milk,
  Scale,
  School,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Target,
  TrendingUp,
  Users,
  Utensils,
  Wheat,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, XAxis, YAxis } from "recharts";
import { IMG } from "../assets/images";
import { useCapexMn, useMoney, usePalette, useSettings } from "../brand/BrandContext";
import { Logo } from "../components/Logo";
import { Bullets, Card, DataTable, Footer, H, IconItem, KPI, Note, Page, Photo, Pill } from "../components/ui";
import { JOBS, MASS, MILK, PRICES, REVENUE, SILO_T, TANK_T, UTIL, YEARS, nf } from "../data";
import { SEC, useAnim, useDeck, type SlideDef } from "../deck";
import { axisTick } from "./exec";

const ink = (a: number) => `color-mix(in srgb, var(--c-p-ink) ${a}%, transparent)`;
const PART_A_COUNT = 10;

/* ============================================================ 11 Contents */
function Contents() {
  const { slides, go } = useDeck();
  const { s } = useSettings();
  const partA = slides.filter((d) => d.part === "A").length || PART_A_COUNT;
  const sectionTitles: Record<string, string> = {
    [SEC.s1]: "Company Profile",
    [SEC.s2]: "Project Overview",
    [SEC.s3]: "Market Analysis",
    [SEC.s4]: "Products & Services",
    [SEC.s5]: "Technology & Operations",
    [SEC.s6]: "Infrastructure & Utilities",
    [SEC.s7]: "Organisation & Manpower",
    [SEC.s8]: "Financial Analysis",
    [SEC.s9]: "Strategy & Risk",
    [SEC.s10]: "Compliance & Implementation",
  };
  const groups: { sec: string; from: number; to: number; titles: string[] }[] = [];
  slides.forEach((sl, i) => {
    if (sl.part !== "B" || sl.section === SEC.toc) return;
    const g = groups[groups.length - 1];
    if (g && g.sec === sl.section) {
      g.to = i + 1;
      g.titles.push(sl.title);
    } else groups.push({ sec: sl.section, from: i + 1, to: i + 1, titles: [sl.title] });
  });
  return (
    <div className="resp-toc relative flex h-full w-full flex-col bg-white font-body">
      <div className="flex min-h-0 flex-1">
        <div className="relative w-[430px] shrink-0">
          <img src={IMG.silos} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${ink(55)}, ${ink(96)})` }}
          />
          <div className="relative flex h-full flex-col p-10 text-white">
            <Logo size={34} light />
            <div className="mt-auto">
              <div className="fs-11 font-bold tracking-[0.24em] text-s uppercase">{s.labels.partB}</div>
              <h2 className="mt-2 font-head fs-40 leading-[1.05] font-extrabold">{s.labels.partB}</h2>
              <p className="mt-3 fs-13 leading-relaxed text-white/75">
                Technical, commercial and financial assessment of the project, organised for
                department-wise review.
              </p>
              <div className="mt-6 h-[3px] w-16 bg-s" />
              <p className="mt-4 fs-11 text-white/60">{s.company.name}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-12 pt-10 pb-4">
          <div className="fs-10h font-bold tracking-[0.2em] text-s-dark uppercase">{s.labels.contents}</div>
          <h3 className="mt-1 font-head fs-26 font-bold text-p-ink">{s.labels.tocTitle}</h3>
          <div className="mt-5 grid grid-cols-2 gap-x-8">
            {groups.map((g, i) => (
              <button
                key={g.sec}
                onClick={() => go(g.from - 1)}
                className="group flex items-start gap-3 border-b border-line py-3 text-left"
              >
                <span className="w-9 font-head fs-24 leading-none font-extrabold text-s">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="fs-13 font-bold text-p-ink group-hover:text-p">
                    {sectionTitles[g.sec] ?? g.sec}
                  </div>
                  <div className="mt-0.5 truncate fs-10h text-mute">{g.titles.join(" · ")}</div>
                </div>
                <span className="rc-sm bg-p-wash px-2 py-0.5 fs-10h font-semibold tabular text-p-dark">
                  {g.from === g.to ? `p. ${g.from}` : `pp. ${g.from}–${g.to}`}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 rc bg-s-wash px-4 py-3">
            <Pill tone="s">
              {s.labels.partA} · {s.labels.pagesWord} 1–{partA}
            </Pill>
            <span className="fs-11 text-ink/80">
              {s.labels.highlightsLine} ({s.labels.pagesWord} 1–{partA}).
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ===================================================== 12 Company profile */
function CompanyProfile() {
  const { s } = useSettings();
  const rows: [string, string][] = [
    ["Name of the company", s.company.name],
    ["Brand", s.company.short],
    ["Constitution", s.company.constitution],
    ["Corporate Identity Number", s.company.cin],
    ["Registered office", s.company.regOffice],
    ["Proposed plant location", s.company.plantLocation],
    ["Line of activity", "Solvent extraction, protein food manufacturing, poultry & cattle feed"],
    ["Proposed capacity", "1,200 TPD — 700 TPD solvent extraction + 500 TPD feed"],
    ["Key raw materials", "Soybean, mustard seed, groundnut & sunflower cake, maize DDGS, grains"],
    ["Contact", `${s.contact.phone}  ·  ${s.contact.email}`],
    ["Website", s.contact.website],
  ];
  const legal = [
    { i: Building, t: "Separate legal entity", d: "Owns property, enters contracts, sues and is sued in its own name." },
    { i: ShieldCheck, t: "Limited liability", d: "Members' personal assets are shielded from the company's debts." },
    { i: CalendarClock, t: "Perpetual succession", d: "Continues irrespective of changes in shareholders or directors." },
    { i: Banknote, t: "Ability to raise capital", d: "Can issue shares and secure loans to fund growth and expansion." },
    { i: Users, t: "Restricted share transfer", d: "Ownership remains within a close-knit group of members." },
    { i: Scale, t: "Corporate governance", d: "Statutory compliance under the Companies Act ensures transparency." },
  ];
  return (
    <Page
      kicker="Company Profile"
      title="Corporate information & legal structure"
      subtitle="A private limited company incorporated under the Companies Act, 2013 — combining limited liability, operational flexibility and structured governance."
    >
      <div className="resp-2 grid h-full grid-cols-[1.3fr_1fr] gap-5">
        <div className="overflow-hidden rc border border-line">
          {rows.map(([k, v], i) => (
            <div key={k} className={`grid grid-cols-[210px_minmax(0,1fr)] ${i % 2 ? "bg-paper" : "bg-white"}`}>
              <div className="border-r border-line bg-p-wash px-4 py-[9px] fs-11 font-semibold text-p-dark">{k}</div>
              <div className="px-4 py-[9px] fs-12 text-ink">{v}</div>
            </div>
          ))}
        </div>
        <Card tone="paper" className="flex flex-col">
          <H icon={Scale}>Advantages of the legal structure</H>
          <div className="mt-3 flex flex-1 flex-col justify-between">
            {legal.map((l) => (
              <IconItem key={l.t} icon={l.i} title={l.t} text={l.d} />
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

/* =============================================== 13 Vision, mission, governance */
function VisionMission() {
  const { s } = useSettings();
  const objectives = [
    { i: Award, t: "Market Leadership", d: `Establish ${s.company.short} as a trusted brand for soya products and animal feed in India and abroad.` },
    { i: TrendingUp, t: "Sustainable Growth", d: "Grow by leveraging advanced technology and environmentally friendly practices." },
    { i: Handshake, t: "Community Impact", d: "Support local economies and promote sustainable agricultural practices." },
  ];
  const commitments = [
    { i: ShieldCheck, t: "Quality Excellence", d: "Products that consistently meet the highest standards of quality and reliability." },
    { i: Leaf, t: "Sustainability", d: "Eco-friendly practices that minimise the environmental footprint." },
    { i: Users, t: "Customer Satisfaction", d: "Lasting relationships built on integrity and dedication." },
  ];
  const gov = [
    "Board of seasoned professionals providing strategic oversight",
    "Robust corporate governance and effective operational management",
    "Statutory compliance under the Companies Act, 2013",
    "Transparent reporting, internal controls and independent audit",
  ];
  const Row = ({ label, items }: { label: string; items: typeof objectives }) => (
    <div className="grid flex-1 grid-cols-[130px_1fr_1fr_1fr] gap-3">
      <div className="flex items-center rc bg-p-ink px-4 fs-11 font-bold tracking-[0.14em] text-s uppercase">{label}</div>
      {items.map((o) => (
        <div key={o.t} className="flex items-center gap-3.5 rc border border-line bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-p-wash text-p">
            <o.i size={17} />
          </div>
          <div>
            <div className="fs-14 font-bold text-p-ink">{o.t}</div>
            <p className="mt-1 fs-11h leading-snug text-mute">{o.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <Page kicker="Vision, Mission & Governance" title="Purpose-led, professionally governed">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Card tone="solid" className="relative overflow-hidden">
            <Eye size={90} className="absolute -right-3 -bottom-4 text-white/10" />
            <div className="fs-10h font-bold tracking-[0.2em] text-s uppercase">Vision</div>
            <p className="mt-2 font-head fs-18 leading-snug font-semibold">
              To become a recognised leader in the manufacturing industry for feed and soybean products,
              renowned for our commitment to quality, sustainability and customer satisfaction.
            </p>
          </Card>
          <Card tone="s" className="relative overflow-hidden">
            <Target size={90} className="absolute -right-3 -bottom-4 text-s/20" />
            <div className="fs-10h font-bold tracking-[0.2em] text-s-dark uppercase">Mission</div>
            <p className="mt-2 font-head fs-18 leading-snug font-semibold text-p-ink">
              To deliver premium-quality crude soybean oil, soya meal and animal feed through sustainable
              and innovative practices.
            </p>
          </Card>
        </div>
        <Row label="Objectives" items={objectives} />
        <Row label="Commitments" items={commitments} />
        <Card tone="p" className="mt-auto">
          <div className="flex items-start gap-6">
            <div className="w-[200px] shrink-0">
              <H icon={Scale}>Governance</H>
              <p className="mt-1 fs-10h leading-snug text-mute">
                Steering the company towards sustainable growth and excellence.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1.5">
              <Bullets items={gov.slice(0, 2)} size="fs-11h" />
              <Bullets items={gov.slice(2)} size="fs-11h" />
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}

/* ============================================= 14 Background & parameters */
function Background() {
  const { s } = useSettings();
  const M = useMoney();
  const capexMn = useCapexMn();
  const rows: [string, string][] = [
    ["Project", "Integrated solvent extraction, protein food & feed complex"],
    ["Location", s.company.plantLocation],
    ["Land area", "20 acres"],
    ["Installed capacity", "1,200 TPD — 700 TPD solvent + 500 TPD feed"],
    ["Solvent plant rating", "750 TPD machinery with integrated boiler"],
    ["Raw-material intake", "≈ 3.81 lakh tonnes per annum (full capacity)"],
    ["Finished output", "≈ 3.84 lakh tonnes per annum (full capacity)"],
    ["Covered storage", "3,00,000 sq.ft of godowns"],
    ["Silo & tank storage", `${nf(SILO_T)} T silos · ${nf(TANK_T)} T tankage`],
    ["Power", "Grid + DG back-up + 3 MW captive solar (≈40%)"],
    ["Direct employment", `${JOBS} persons`],
    ["Project cost", M.m(capexMn, 0)],
    ["Implementation", "27 months to commercial production"],
  ];
  return (
    <Page
      kicker="Project Overview"
      title="Project background, rationale & key parameters"
      subtitle="Addressing growing demand for healthy, protein-rich food and quality animal feed through a single, technology-driven facility."
    >
      <div className="resp-2 grid h-full grid-cols-[1fr_1.08fr] gap-5">
        <div className="flex flex-col gap-3">
          <p className="fs-12h leading-relaxed text-ink/85">
            India's demand for edible oil, plant protein and compound feed is rising faster than domestic
            processing capacity. A large share of edible oil is imported, while livestock farmers — especially
            in Uttar Pradesh, the country's largest milk producer — lack access to consistent, scientifically
            formulated feed.
          </p>
          <p className="fs-12h leading-relaxed text-ink/85">
            {s.company.name} proposes a 1,200 TPD integrated complex that procures soybean, mustard, groundnut
            and sunflower cake and maize DDGS; extracts crude oil; produces food-grade soya protein (47–54%);
            and manufactures poultry and cattle feed using captive DOC and oil.
          </p>
          <Card tone="p" className="mt-1">
            <H icon={Target}>Project objectives</H>
            <Bullets
              className="mt-2"
              size="fs-11h"
              items={[
                "Create value-added processing capacity for oilseeds close to farms and markets",
                "Supply high-protein foods for households, food industry and nutrition programmes",
                "Provide balanced, affordable feed to improve milk yield and poultry productivity",
                "Generate 505 direct jobs and strengthen farmer incomes through assured procurement",
                "Operate sustainably with 3 MW captive solar and eco-conscious packaging",
              ]}
            />
          </Card>
          <div className="mt-auto grid grid-cols-3 gap-3">
            <KPI value="1,200" unit="TPD" label="Installed capacity" className="!p-3" />
            <KPI value={String(JOBS)} unit="Jobs" label="Direct employment" className="!p-3" />
            <KPI value="27" unit="Months" label="To commercial production" tone="gold" className="!p-3" />
          </div>
        </div>
        <DataTable
          head={["Parameter", "Details"]}
          widths={["34%", "66%"]}
          rows={rows.map(([k, v]) => [k, v])}
          size="fs-12"
          className="self-start"
        />
      </div>
    </Page>
  );
}

/* ================================================= 15 Location & site */
function Location() {
  const callouts = [
    { t: "Delhi-NCR market", x: 18, y: 10, i: ShoppingCart },
    { t: "Mustard belt", x: 6, y: 47, i: Sprout },
    { t: "Soybean — Madhya Pradesh", x: 14, y: 84, i: Leaf },
    { t: "Maize & DDGS (distilleries)", x: 66, y: 10, i: Wheat },
    { t: "Dairy & poultry clusters", x: 72, y: 47, i: Milk },
    { t: "Eastern UP & Bihar markets", x: 64, y: 84, i: Globe },
  ];
  const criteria: [string, string][] = [
    ["Land", "20 acres contiguous industrial land (UPSIDA / notified industrial area)"],
    ["Road", "Proximity to expressway / national highway for heavy vehicles"],
    ["Rail", "Access to goods shed or private siding for bulk inbound seed and outbound DOC"],
    ["Power", "Nearby 33/11 kV substation; space for 3 MW solar"],
    ["Water", "Assured groundwater / surface supply with statutory NOC"],
    ["Raw material", "Oilseed, maize & DDGS catchment within ~150–200 km"],
    ["Market", "Dairy & poultry clusters and consumption centres within reach"],
    ["Safety", "Adequate buffer for solvent-plant safety distances (PESO norms)"],
  ];
  return (
    <Page
      kicker="Location & Site"
      title="Site selection anchored on raw material, markets and connectivity"
      subtitle="Indicative catchment schematic — final site to be confirmed in consultation with UPSIDA and the District administration."
    >
      <div className="resp-2p grid h-full grid-cols-[560px_minmax(0,1fr)] gap-5">
        <Card tone="paper" className="relative overflow-hidden !p-0">
          <svg viewBox="0 0 560 470" className="absolute inset-0 h-full w-full">
            {[200, 140, 80].map((r, i) => (
              <circle
                key={r}
                cx="280"
                cy="235"
                r={r}
                fill={i === 2 ? "var(--c-p-light)" : i === 1 ? "var(--c-p-wash)" : "#fff"}
                stroke="var(--c-p)"
                strokeOpacity={0.35}
                strokeDasharray="5 5"
              />
            ))}
            {[
              [120, 60],
              [70, 235],
              [130, 410],
              [440, 60],
              [490, 235],
              [430, 410],
            ].map(([x, y], i) => (
              <line key={i} x1="280" y1="235" x2={x} y2={y} stroke="var(--c-s)" strokeWidth="1.5" strokeDasharray="3 4" />
            ))}
            <circle cx="280" cy="235" r="26" fill="var(--c-p)" />
            <circle cx="280" cy="235" r="34" fill="none" stroke="var(--c-s)" strokeWidth="2" />
          </svg>
          <div className="absolute right-3 bottom-2 flex items-center gap-3 fs-9 font-semibold text-p-dark">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-p/40 bg-p-light" /> Primary
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-p/40 bg-p-wash" /> Secondary
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-p/40 bg-white" /> Extended catchment
            </span>
          </div>
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <Factory size={22} className="text-white" />
          </div>
          <div className="absolute top-[57%] left-1/2 -translate-x-1/2 rc-sm bg-p-ink px-2 py-0.5 fs-10 font-bold text-white">
            Proposed plant
          </div>
          {callouts.map((c) => (
            <div
              key={c.t}
              className="absolute flex items-center gap-1.5 rounded-full border border-line bg-white py-1 pr-3 pl-1 shadow-sm"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translateY(-50%)" }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-s text-p-ink">
                <c.i size={12} />
              </span>
              <span className="fs-10h font-semibold whitespace-nowrap text-p-ink">{c.t}</span>
            </div>
          ))}
          <div className="absolute bottom-2 left-3 fs-9 text-mute italic">Schematic — not to scale</div>
        </Card>
        <div className="flex flex-col gap-3">
          <DataTable compact head={["Criterion", "Requirement"]} widths={["22%", "78%"]} rows={criteria} size="fs-11h" />
          <Photo src={IMG.truck} className="min-h-0 flex-1" shade="left">
            <div className="flex h-full flex-col justify-center p-5">
              <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Connectivity</div>
              <p className="mt-1 max-w-[260px] fs-13 leading-snug font-semibold text-white">
                Expressway and rail access to move ~7.6 lakh tonnes of inbound and outbound cargo every year.
              </p>
            </div>
          </Photo>
        </div>
      </div>
    </Page>
  );
}

/* ================================================= 16 Capacity & production */
function Production() {
  const pal = usePalette();
  const rows = REVENUE.map((r) => [r.name, ...UTIL.map((u) => nf(Math.round(r.qty * u)))]);
  const total = UTIL.map((u) => nf(Math.round(REVENUE.reduce((a, r) => a + r.qty, 0) * u)));
  const segColor = (k: number) => (k === 0 ? pal.p : k === 1 ? pal.s : "#9aa39e");
  return (
    <Page
      kicker="Capacity & Production Plan"
      title="Ramp-up from 60% to 100% capacity utilisation over five years"
      subtitle="Annual production volumes in tonnes, as per promoter projections; solvent plant mass balance derived from projected input–output volumes."
    >
      <div className="resp-2 grid h-full grid-cols-[1.05fr_1fr] gap-4">
        <div className="flex flex-col gap-3">
          <DataTable
            compact
            head={["Product (tonnes)", ...YEARS]}
            align={["l", "r", "r", "r", "r", "r"]}
            widths={["30%", "14%", "14%", "14%", "14%", "14%"]}
            rows={[["Capacity utilisation", ...UTIL.map((u) => `${Math.round(u * 100)}%`)], ...rows]}
            boldRows={[0]}
            foot={["Total output", ...total]}
          />
          <div className="grid grid-cols-3 gap-3">
            <KPI value="700" unit="TPD" label="Solvent extraction" sub="Machinery rated 750 TPD" className="!p-3" />
            <KPI value="500" unit="TPD" label="Feed manufacturing" sub="Pellet · mash · crumble" className="!p-3" />
            <KPI value="3.84" unit="Lakh T" label="Output at full capacity" sub="Year 5 onwards" tone="gold" className="!p-3" />
          </div>
        </div>
        <Card className="flex flex-col">
          <H icon={Factory}>Indicative mass balance — solvent plant (TPA, full capacity)</H>
          <div className="mt-3 flex flex-1 flex-col justify-around">
            {MASS.map((m) => (
              <div key={m.input} className="flex items-center gap-3">
                <div className="w-[118px] shrink-0 rc-sm bg-p-ink px-3 py-2 text-white">
                  <div className="fs-11 font-bold">{m.input}</div>
                  <div className="fs-10 text-white/70 tabular">{nf(m.qty)} T</div>
                </div>
                <ArrowRight size={16} className="shrink-0 text-s" />
                <div className="min-w-0 flex-1">
                  <div className="flex h-7 overflow-hidden rounded">
                    {m.outs.map((o) => (
                      <div
                        key={o.name}
                        className="flex items-center justify-center fs-9h font-bold text-white"
                        style={{ width: `${(o.qty / m.qty) * 100}%`, background: segColor(o.k) }}
                      >
                        {o.qty / m.qty > 0.12 ? `${((o.qty / m.qty) * 100).toFixed(0)}%` : ""}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {m.outs.map((o) => (
                      <span key={o.name} className="flex items-center gap-1 fs-10 text-ink/80">
                        <span className="h-2 w-2 rounded-sm" style={{ background: segColor(o.k) }} />
                        {o.name} <b className="tabular">{nf(o.qty)}</b>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between rc-sm bg-s-wash px-3 py-2">
            <span className="fs-11 font-semibold text-p-ink">Total crude oil output</span>
            <span className="font-head fs-16 font-extrabold text-p">43,450 T / year</span>
          </div>
          <Note className="mt-1.5">
            Implied oil yields: soybean ≈19%, mustard ≈39%, DDGS ≈11%. Final yields subject to seed quality and
            process guarantees.
          </Note>
        </Card>
      </div>
    </Page>
  );
}

/* ======================================================= 17 Edible oil sector */
function OilSector() {
  return (
    <Page
      kicker="Market Analysis"
      title="India's edible oil gap — a national priority for self-reliance"
      subtitle="Import dependence, a well-funded national mission and rising consumption create a strong, policy-backed market for domestic crushing capacity."
    >
      <div className="resp-2p grid h-full grid-cols-[400px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.oil} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="font-head fs-60 leading-none font-extrabold text-s">57%</div>
            <p className="mt-2 fs-13 leading-snug font-semibold text-white">
              Share of India's edible-oil demand currently met through imports
            </p>
            <p className="mt-2 fs-9h text-white/60">Source: Union Cabinet briefing on NMEO-Oilseeds, Oct 2024</p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <KPI icon={Banknote} value="₹10,103" unit="Cr" label="NMEO-Oilseeds outlay" sub="2024-25 to 2030-31" />
            <KPI icon={TrendingUp} value="39 → 69.7" unit="MT" label="Oilseed production target" sub="2022-23 → 2030-31" />
            <KPI icon={Sprout} value="+40" unit="Lakh ha" label="Additional oilseed area" sub="Targeted under the Mission" />
          </div>
          <Card className="flex-1">
            <H icon={Droplets}>Sector dynamics relevant to the project</H>
            <Bullets
              className="mt-3" size="fs-13" gap="space-y-3.5"
              items={[
                <>
                  <b>Self-reliance in edible oils</b> is a national priority — new crushing and extraction capacity
                  near producing regions directly supports the Mission's goals.
                </>,
                <>
                  <b>Rising consumption</b> with income growth and urbanisation sustains long-term demand for
                  edible oil and plant protein.
                </>,
                <>
                  <b>Solvent extraction maximises recovery</b> — residual oil in meal is typically below 1%, versus
                  6–10% in expeller cake, improving oil yield from every tonne of seed and cake.
                </>,
                <>
                  <b>Calibrated import-duty policy</b> and MSP support for oilseed farmers (PM-AASHA) strengthen the
                  domestic processing ecosystem.
                </>,
                <>
                  <b>De-oiled cake is a valuable co-product</b> — the backbone of India's feed industry and an export
                  commodity.
                </>,
              ]}
            />
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ====================================================== 18 Livestock & feed */
function FeedSector() {
  const { s } = useSettings();
  const pal = usePalette();
  const anim = useAnim();
  return (
    <Page
      kicker="Market Analysis"
      title={`${s.company.state} — India's largest livestock economy needs quality feed`}
      subtitle="The State leads national milk production and is a major meat producer, creating sustained, local demand for compound cattle and poultry feed."
    >
      <div className="resp-2 grid h-full grid-cols-[1.1fr_1fr] gap-4">
        <Card className="flex flex-col">
          <H icon={Milk}>Top milk-producing States — share of national output, 2023-24 (%)</H>
          <div className="mt-2">
            <BarChart width={600} height={250} data={MILK} layout="vertical" margin={{ left: 10, right: 46, top: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" horizontal={false} />
              <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} domain={[0, 18]} />
              <YAxis type="category" dataKey="st" tick={{ ...axisTick, fontSize: 11 }} width={108} axisLine={false} tickLine={false} />
              <Bar dataKey="v" radius={[0, 5, 5, 0]} barSize={26} isAnimationActive={anim}>
                {MILK.map((m, i) => (
                  <Cell key={m.st} fill={i === 0 ? pal.p : pal.pSoft} />
                ))}
                <LabelList dataKey="v" position="right" style={{ fontSize: 11, fontWeight: 700, fill: "#17201c" }} />
              </Bar>
            </BarChart>
          </div>
          <div className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-3">
            <div>
              <div className="font-head fs-22 font-extrabold text-p">239.30 MT</div>
              <div className="fs-10h text-mute">India's milk production, 2023-24</div>
            </div>
            <div>
              <div className="font-head fs-22 font-extrabold text-p">#1</div>
              <div className="fs-10h text-mute">UP's rank in milk production</div>
            </div>
            <div>
              <div className="font-head fs-22 font-extrabold text-p">12.29%</div>
              <div className="fs-10h text-mute">UP's share of national meat output</div>
            </div>
          </div>
          <Note className="mt-2">Source: Basic Animal Husbandry Statistics 2024, Ministry of Fisheries, Animal Husbandry & Dairying.</Note>
        </Card>
        <div className="flex flex-col gap-3">
          <Photo src={IMG.dairy} className="h-[170px] shrink-0" shade="left">
            <div className="flex h-full flex-col justify-center p-5">
              <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Feed = productivity</div>
              <p className="mt-1 max-w-[280px] fs-13 leading-snug font-semibold text-white">
                Balanced nutrition is the single biggest lever for milk yield and feed conversion.
              </p>
            </div>
          </Photo>
          <Card className="flex-1">
            <H icon={Bird}>Demand drivers for compound feed</H>
            <Bullets
              className="mt-2.5"
              size="fs-11h"
              gap="space-y-2"
              items={[
                "Feed is the largest component of livestock production cost — quality feed directly lifts farmer margins",
                "Large, fragmented dairy base with low compound-feed penetration offers wide headroom for branded feed",
                "Cooperatives, private dairies and poultry integrators seek consistent quality and assured supply",
                "Growth of organised broiler and layer farming needs stage-specific feeds close to farms",
              ]}
            />
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ======================================================= 19 Price trends */
function Prices() {
  const pal = usePalette();
  const anim = useAnim();
  const doc = PRICES.doc.map((d) => ({ name: d.name, "Nov 2023": d.nov23, "Nov 2024": d.nov24 }));
  const lblNum = ((v: unknown) => nf(Number(v))) as never;
  const lblPct = ((v: unknown) => `${v}%`) as never;
  return (
    <Page
      kicker="Market Analysis"
      title="Price signals point to a widening domestic supply gap"
      subtitle="Edible-oil inflation and rising de-oiled cake prices in late 2024 underline strong demand for both oil and protein meal."
    >
      <div className="flex h-full flex-col gap-3">
        <div className="resp-2 grid grid-cols-2 gap-3">
          <Card>
            <H>Edible-oil inflation, November 2024 (YoY %)</H>
            <BarChart width={540} height={230} data={PRICES.inflation} margin={{ top: 24, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
              <XAxis dataKey="name" tick={{ ...axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} unit="%" width={44} />
              <Bar dataKey="v" barSize={90} radius={[6, 6, 0, 0]} isAnimationActive={anim}>
                <Cell fill={pal.p} />
                <Cell fill={pal.s} />
                <LabelList dataKey="v" position="top" formatter={lblPct} style={{ fontSize: 13, fontWeight: 800, fill: "#17201c" }} />
              </Bar>
            </BarChart>
          </Card>
          <Card>
            <H>De-oiled cake prices (₹ per quintal)</H>
            <BarChart width={540} height={230} data={doc} margin={{ top: 24, right: 10, left: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
              <XAxis dataKey="name" tick={{ ...axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[0, 16000]} width={50} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Nov 2023" fill={pal.pSoft} barSize={60} radius={[5, 5, 0, 0]} isAnimationActive={anim}>
                <LabelList dataKey="Nov 2023" position="top" formatter={lblNum} style={{ fontSize: 10.5, fontWeight: 700, fill: "#5b6661" }} />
              </Bar>
              <Bar dataKey="Nov 2024" fill={pal.p} barSize={60} radius={[5, 5, 0, 0]} isAnimationActive={anim}>
                <LabelList dataKey="Nov 2024" position="top" formatter={lblNum} style={{ fontSize: 10.5, fontWeight: 800, fill: "#17201c" }} />
              </Bar>
            </BarChart>
          </Card>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-3">
          {[
            { t: "Sharp rise in Nov-2024", d: "WPI for soybean oil up 28.26% and CPI for refined oil up 16.67% year-on-year." },
            { t: "Wholesale outpacing retail", d: "WPI inflation has consistently exceeded CPI — processors and wholesalers capture the spread." },
            { t: "DOC prices up 11–12%", d: "Retail DOC at ₹14,226/qtl (+10.93%) and wholesale at ₹13,239/qtl (+12.23%), surging from Aug–Sep 2024." },
            { t: "Implication for the project", d: "Integrated extraction captures value in both oil and meal, hedging price swings across products." },
          ].map((o, i) => (
            <Card key={o.t} tone={i === 3 ? "solid" : "white"} className="!p-3.5">
              <div className={`fs-14 font-bold ${i === 3 ? "text-white" : "text-p-ink"}`}>{o.t}</div>
              <p className={`mt-1.5 fs-12 leading-snug ${i === 3 ? "text-white/80" : "text-mute"}`}>{o.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ================================================= 20 Demand & segments */
function Demand() {
  const { s } = useSettings();
  const drivers = [
    { i: School, t: "Government nutrition programmes", d: "PM-POSHAN and ICDS create steady institutional demand for soya chunks and fortified protein." },
    { i: Utensils, t: "Convenience & packaged foods", d: "Urbanisation and busier lifestyles drive demand for ready-to-cook protein foods." },
    { i: Leaf, t: "Plant-protein trend", d: "Health-conscious consumers are shifting towards affordable vegetarian protein." },
    { i: Milk, t: "Livestock intensification", d: "Organised dairy and poultry growth requires balanced, consistent feed." },
    { i: Globe, t: "Export demand", d: "Soya meal and plant protein demand in Asia-Pacific, the Middle East and Africa." },
  ];
  const seg: [string, string, string][] = [
    ["Edible-oil refiners", "Crude soybean, mustard, sunflower & groundnut oil", "Direct B2B contracts"],
    ["Feed millers & integrators", "Soya DOC, RSM, de-oiled DDGS", "B2B / brokers"],
    ["Dairy farmers & cooperatives", "Dairy, calf & specialty cattle feed", "Dealer network, cooperatives"],
    ["Poultry farmers & integrators", "Broiler, layer, breeder & chick feed", "Dealers, direct supply"],
    ["Food processors & bakeries", "Soya flour, Hi-Pro DOC", "B2B, customised specs"],
    ["Institutional & government", "Soya chunks, fortified protein", "Tenders, empanelment"],
    ["Retail consumers", "Soya chunks & flour packs", "Modern trade, e-commerce"],
    ["Export buyers", "Soya DOC, soya chunks", "Export distributors"],
  ];
  return (
    <Page
      kicker="Market Analysis"
      title="Demand drivers and target customer segments"
      subtitle="A diversified customer base across B2B, institutional, retail and export channels reduces concentration risk."
    >
      <div className="resp-2 grid h-full grid-cols-[400px_minmax(0,1fr)] gap-5">
        <Card tone="paper" className="flex flex-col">
          <H icon={TrendingUp}>Key demand drivers</H>
          <div className="mt-3 flex flex-1 flex-col justify-between">
            {drivers.map((d) => (
              <IconItem key={d.t} icon={d.i} title={d.t} text={d.d} />
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-3">
          <DataTable
            head={["Customer segment", "Products", "Channel"]}
            widths={["30%", "42%", "28%"]}
            rows={seg}
            size="fs-11h"
          />
          <div className="mt-auto flex items-center gap-3 rc bg-s-wash px-4 py-3">
            <MapPin size={18} className="shrink-0 text-s-dark" />
            <p className="fs-11h leading-snug text-ink/85">
              <b>Geographic focus:</b> {s.company.state} and adjoining States first, followed by pan-India institutional
              supply and exports to Asia-Pacific, the Middle East and Africa.
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}

export const DPR1: SlideDef[] = [
  { title: "Contents", part: "B", section: SEC.toc, C: Contents },
  { title: "Company Profile & Legal Structure", part: "B", section: SEC.s1, C: CompanyProfile },
  { title: "Vision, Mission & Governance", part: "B", section: SEC.s1, C: VisionMission },
  { title: "Project Background & Key Parameters", part: "B", section: SEC.s2, C: Background },
  { title: "Location & Site Advantages", part: "B", section: SEC.s2, C: Location },
  { title: "Capacity & Production Plan", part: "B", section: SEC.s2, C: Production },
  { title: "Edible Oil & Oilseed Sector", part: "B", section: SEC.s3, C: OilSector },
  { title: "Livestock & Feed Sector", part: "B", section: SEC.s3, C: FeedSector },
  { title: "Price Trends & Market Signals", part: "B", section: SEC.s3, C: Prices },
  { title: "Demand Drivers & Target Segments", part: "B", section: SEC.s3, C: Demand },
];
