import {
  FileCheck,
  Gift,
  Globe,
  Handshake,
  HardHat,
  HeartHandshake,
  Landmark,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Recycle,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Store,
  TrendingUp,
  TriangleAlert,
  Tv,
  Flame,
  Scale,
  Sun,
  Milk,
  School,
  Sprout,
  Factory,
} from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, LabelList, Line, XAxis, YAxis } from "recharts";
import { IMG, backgroundFor } from "../assets/images";
import { useCapexMn, useMoney, usePalette, useSettings } from "../brand/BrandContext";
import { Logo } from "../components/Logo";
import { Bullets, Card, DataTable, Footer, H, KPI, Note, Page, Photo, Pill } from "../components/ui";
import { GANTT, JOBS, PHASES, REV_FEED, REV_SOLVENT, TOT, YEARS, cagr, nf } from "../data";
import { SEC, useAnim, type SlideDef } from "../deck";
import { axisTick } from "./exec";

const ink = (a: number) => `color-mix(in srgb, var(--c-p-ink) ${a}%, transparent)`;

/* ======================================== 41 Profitability & indicators */
function Profitability() {
  const M = useMoney();
  const pal = usePalette();
  const anim = useAnim();
  const capex = useCapexMn();
  const data = YEARS.map((y, i) => ({
    y,
    gm: +M.conv(TOT.margin[i]).toFixed(1),
    pct: +((TOT.margin[i] / TOT.revenue[i]) * 100).toFixed(1),
  }));
  const seg = [
    { t: "Solvent plant", rev: REV_SOLVENT[4], rm: TOT.rmSolvent[4] },
    { t: "Feed plant", rev: REV_FEED[4], rm: TOT.rmFeed[4] },
  ];
  const lbl = ((v: unknown) => nf(Number(v))) as never;
  return (
    <Page
      kicker="Financial Analysis"
      title="Profitability & key financial indicators"
      subtitle={`Gross margin (revenue less raw-material cost) by year and by plant. Amounts in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1.15fr_1fr] gap-4">
        <div className="flex flex-col gap-3">
          <Card>
            <H icon={TrendingUp}>Gross margin & margin %</H>
            <ComposedChart width={620} height={210} data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
              <XAxis dataKey="y" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" tick={axisTick} axisLine={false} tickLine={false} width={52} />
              <YAxis yAxisId="r" orientation="right" tick={axisTick} axisLine={false} tickLine={false} unit="%" domain={[0, 25]} width={36} />
              <Bar yAxisId="l" dataKey="gm" name="Gross margin" fill={pal.p} radius={[5, 5, 0, 0]} barSize={56} isAnimationActive={anim}>
                <LabelList dataKey="gm" position="top" formatter={lbl} style={{ fontSize: 10.5, fontWeight: 700, fill: "#17201c" }} />
              </Bar>
              <Line yAxisId="r" dataKey="pct" name="Margin %" stroke={pal.s} strokeWidth={3} dot={{ r: 4, fill: pal.s }} isAnimationActive={anim} />
            </ComposedChart>
          </Card>
          <DataTable
            compact
            head={["Year", "Revenue", "Raw material", "Gross margin", "Margin %"]}
            align={["l", "r", "r", "r", "r"]}
            rows={YEARS.map((y, i) => [y, M.t(TOT.revenue[i]), M.t(TOT.rm[i]), M.t(TOT.margin[i]), `${((TOT.margin[i] / TOT.revenue[i]) * 100).toFixed(1)}%`])}
            size="fs-11"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {seg.map((s, i) => (
              <Card key={s.t} tone={i ? "s" : "p"} className="!p-3.5">
                <div className="fs-10h font-bold tracking-wider text-s-dark uppercase">{s.t} · Year 5</div>
                <div className="mt-2 space-y-1 fs-11">
                  <div className="flex justify-between"><span className="text-mute">Revenue</span><b className="tabular">{M.n(s.rev, 0)}</b></div>
                  <div className="flex justify-between"><span className="text-mute">Raw material</span><b className="tabular">{M.n(s.rm, 0)}</b></div>
                  <div className="flex justify-between border-t border-line pt-1"><span className="font-semibold">Gross margin</span><b className="tabular text-p">{M.n(s.rev - s.rm, 0)}</b></div>
                </div>
                <div className="mt-2 font-head fs-24 font-extrabold text-p">{(((s.rev - s.rm) / s.rev) * 100).toFixed(1)}%</div>
              </Card>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3">
            <KPI value={(cagr(TOT.revenue[0], TOT.revenue[4]) * 100).toFixed(1) + "%"} label="Revenue CAGR (Y1–Y5)" className="!p-3.5" />
            <KPI value={((TOT.rm[4] / TOT.revenue[4]) * 100).toFixed(1) + "%"} label="Raw-material intensity (Y5)" className="!p-3.5" />
            <KPI value={(TOT.revenue[4] / capex).toFixed(2) + "×"} label="Asset turnover (Y5 revenue / project cost)" className="!p-3.5" />
            <KPI value={M.n(TOT.revenue[4] / JOBS, 2)} unit={M.short} label="Revenue per direct employee (Y5)" className="!p-3.5" />
          </div>
          <Note>Operating expenses, depreciation, interest and tax are covered in the CA-certified financial model (annexure).</Note>
        </div>
      </div>
    </Page>
  );
}

/* ============================================== 42 Sensitivity analysis */
function Sensitivity() {
  const M = useMoney();
  const steps = [-10, -5, 0, 5, 10];
  const rev = TOT.revenue[2];
  const rm = TOT.rm[2];
  const base = TOT.margin[2];
  const cell = (p: number, r: number) => rev * (1 + p / 100) - rm * (1 + r / 100);
  const color = (v: number) => {
    if (v < 0) return { bg: "#f6d5cd", fg: "#9d2f1b" };
    const k = Math.min(1, v / (base * 1.7));
    const pct = Math.round(8 + k * 82);
    return { bg: `color-mix(in srgb, var(--c-p) ${pct}%, white)`, fg: pct > 48 ? "#fff" : "#17201c" };
  };
  return (
    <Page
      kicker="Financial Analysis"
      title="Sensitivity of gross margin to prices and raw-material costs"
      subtitle={`Year-3 (80% utilisation) gross margin under simultaneous changes in selling price and raw-material cost. Amounts in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1.25fr_1fr] gap-5">
        <Card className="flex flex-col">
          <div className="flex">
            <div className="w-[120px]" />
            <div className="flex-1 pb-2 text-center fs-10h font-bold tracking-wider text-s-dark uppercase">
              Change in selling price →
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex w-[30px] items-center justify-center">
              <span className="-rotate-90 fs-10h font-bold tracking-wider whitespace-nowrap text-s-dark uppercase">
                Change in RM cost →
              </span>
            </div>
            <div className="grid flex-1 grid-cols-[90px_repeat(5,1fr)] grid-rows-[30px_repeat(5,1fr)] gap-1.5">
              <div />
              {steps.map((p) => (
                <div key={p} className="flex items-center justify-center rc-sm bg-p-ink fs-11 font-bold text-white">
                  {p > 0 ? `+${p}` : p}%
                </div>
              ))}
              {steps.map((r) => (
                <div key={r} className="contents">
                  <div className="flex items-center justify-center rc-sm bg-p-ink fs-11 font-bold text-white">
                    {r > 0 ? `+${r}` : r}%
                  </div>
                  {steps.map((p) => {
                    const v = cell(p, r);
                    const c = color(v);
                    const isBase = p === 0 && r === 0;
                    return (
                      <div
                        key={p}
                        className={`flex flex-col items-center justify-center rc-sm ${isBase ? "ring-[3px] ring-s" : ""}`}
                        style={{ background: c.bg, color: c.fg }}
                      >
                        <span className="font-head fs-14 font-extrabold tabular">{M.n(v, 0)}</span>
                        <span className="fs-9 opacity-80">{((v / rev / (1 + p / 100)) * 100).toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <Note className="mt-2">Base case outlined. Figure below each value shows gross margin as % of revenue.</Note>
        </Card>
        <div className="flex flex-col gap-3">
          <KPI value={M.m(rev / 100, 1)} label="Impact of a 1% change in selling price" sub={`${((rev / 100 / base) * 100).toFixed(1)}% of base-case gross margin`} className="!p-3.5" />
          <KPI value={M.m(rm / 100, 1)} label="Impact of a 1% change in raw-material cost" sub={`${((rm / 100 / base) * 100).toFixed(1)}% of base-case gross margin`} className="!p-3.5" />
          <Card tone="s" className="!p-3.5">
            <div className="fs-12 font-bold text-p-ink">Break-even thresholds (Year 3)</div>
            <p className="mt-1 fs-11 leading-snug text-ink/80">
              Gross margin stays positive unless raw-material costs rise by more than{" "}
              <b>{((base / rm) * 100).toFixed(1)}%</b> with prices unchanged, or selling prices fall by more than{" "}
              <b>{((base / rev) * 100).toFixed(1)}%</b> with costs unchanged.
            </p>
          </Card>
          <Card tone="p" className="flex-1 !p-3.5">
            <H icon={ShieldCheck}>Mitigation levers</H>
            <Bullets
              className="mt-2"
              size="fs-11"
              gap="space-y-1"
              items={[
                "Oil and meal prices move together, providing a natural hedge",
                "Multi-seed sourcing and 8,100 T buffer storage",
                "Value-added protein and feed improve margin mix",
                "Contracted institutional and B2B volumes",
              ]}
            />
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ============================================== 43 Marketing strategy */
function Marketing() {
  const { s } = useSettings();
  const cards = [
    { i: Tv, t: "Advertising", b: ["Regional & national TV on health, purity and quality", "Digital: Facebook, Instagram, YouTube, influencers", "Outdoor & transit media in urban and semi-urban areas"] },
    { i: Gift, t: "Promotions", b: ["Festive & seasonal offers to drive volumes", "Social-media contests and giveaways", "Loyalty programmes with points & exclusive deals"] },
    { i: ShoppingCart, t: "Retail & e-commerce", b: ["Supermarkets, grocery & health-food stores", "Amazon, Flipkart & dedicated health platforms", "D2C website for personalised marketing"] },
    { i: Handshake, t: "B2B & institutional", b: ["Refiners, wholesalers and feed millers", "Mid-day meal & ICDS supply of soya protein", "Custom solutions for food & bakery industry"] },
    { i: Store, t: "Feed dealer network", b: ["Dealers & distributors across UP districts", "Farmer meetings and veterinary advisory", "Tie-ups with dairy cooperatives & integrators"] },
    { i: Ship, t: "Export channels", b: ["Asia-Pacific, Middle East and Africa", "Plant protein & fortified products", "Distribution partnerships & trade fairs"] },
  ];
  return (
    <Page
      kicker="Marketing & Sales"
      title={`Go-to-market strategy for the ${s.company.short} brand`}
      subtitle="A multi-channel, consumer-centric strategy combining advertising, retail and institutional partnerships, dealer networks and exports."
    >
      <div className="flex h-full flex-col gap-3">
        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-3">
          {cards.map((c) => (
            <div key={c.t} className="flex flex-col rc border border-line bg-white p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-p text-white">
                  <c.i size={17} />
                </span>
                <span className="font-head fs-14 font-bold text-p-ink">{c.t}</span>
              </div>
              <Bullets items={c.b} size="fs-11" gap="space-y-1" className="mt-2.5" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card tone="s" className="!p-3.5">
            <H icon={HeartHandshake}>Community engagement & CSR</H>
            <p className="mt-1 fs-11 leading-snug text-ink/80">
              Health-awareness workshops on protein-rich diets, school and NGO partnerships, local sponsorships and
              promotion of sustainable farming practices.
            </p>
          </Card>
          <Card tone="p" className="!p-3.5">
            <H icon={ShieldCheck}>Differentiation as a marketing tool</H>
            <p className="mt-1 fs-11 leading-snug text-ink/80">
              Health & nutrition benefits — high protein, lower saturated fat, fortification — backed by transparent
              labelling and ISO / FSSAI certifications.
            </p>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ====================================================== 44 SWOT */
function Swot() {
  const q = [
    { k: "Strengths", c: "var(--c-p)", bg: "var(--c-p-wash)", items: ["1,200 TPD integrated oilseed-to-feed complex — among the largest proposed in the State", "Diversified portfolio: crude oils, 47–54% protein foods, cattle & poultry feed", "Promoters with 20+ years of raw-material procurement experience", "Captive DOC & oil for feed; shared utilities lower unit costs", "3 MW captive solar and eco-conscious packaging"] },
    { k: "Weaknesses", c: "#99630a", bg: "#fff6e3", items: ["New brand — market presence still to be built", "Margins exposed to oilseed price fluctuations", "Competitive, consolidated edible-oil market", "Multi-agency compliance (FSSAI, PESO, UPPCB, Factories, Boilers)"] },
    { k: "Opportunities", c: "var(--c-p-dark)", bg: "#eef7f1", items: ["NMEO-Oilseeds push and edible-oil import substitution", "UP's #1 dairy economy and growing poultry sector", "PM-POSHAN / ICDS demand for soya protein", "Plant-protein exports to Asia-Pacific, Middle East & Africa", "E-commerce & D2C channels for branded protein foods"] },
    { k: "Threats", c: "#a3341f", bg: "#fdeeea", items: ["Raw-material price volatility and monsoon variability", "Import-duty changes and global edible-oil price shocks", "Aggressive pricing by established players", "Economic slowdown or shifting consumer preferences"] },
  ];
  return (
    <Page kicker="Strategic Assessment" title="SWOT analysis" subtitle="A clear-eyed view of the opportunity and the risks — with mitigation built into the business model.">
      <div className="relative grid h-full grid-cols-2 grid-rows-2 gap-3">
        {q.map((x) => (
          <div key={x.k} className="flex flex-col overflow-hidden rc border border-line" style={{ background: x.bg }}>
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: x.c }}>
              <span className="font-head fs-24 font-extrabold text-white/40">{x.k[0]}</span>
              <span className="font-head fs-14 font-bold tracking-wide text-white uppercase">{x.k}</span>
            </div>
            <ul className="space-y-2 px-4 py-3.5">
              {x.items.map((it) => (
                <li key={it} className="flex gap-2 fs-12h leading-snug text-ink/85">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: x.c }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ============================================== 45 Risk & mitigation */
type Lvl = "High" | "Medium" | "Low";
function Risks() {
  const risks: { r: string; l: Lvl; i: Lvl; m: string }[] = [
    { r: "Raw-material price volatility", l: "High", i: "High", m: "Multi-seed sourcing, forward contracts, buffer storage, price pass-through" },
    { r: "Monsoon / supply variability", l: "Medium", i: "High", m: "Multi-State sourcing (MP soybean, UP–Rajasthan mustard), purchase of cakes" },
    { r: "Competition & price pressure", l: "High", i: "Medium", m: "Integration cost advantage, value-added protein, institutional contracts" },
    { r: "Approval & implementation delays", l: "Medium", i: "Medium", m: "Nivesh Mitra single window, experienced EPC partners, dedicated project team" },
    { r: "Fire & solvent safety", l: "Low", i: "High", m: "PESO-compliant design, flameproof equipment, detectors, trained crew, insurance" },
    { r: "Policy changes (import duty, taxes)", l: "Medium", i: "Medium", m: "Flexible product mix, export markets, proactive policy engagement" },
    { r: "Financing & interest-rate risk", l: "Medium", i: "Medium", m: "Balanced capital structure, subsidy-linked debt reduction, WC limits" },
    { r: "Technology & operations", l: "Low", i: "Medium", m: "Proven technology suppliers, AMCs, skilled operators, preventive maintenance" },
  ];
  const tone = (v: Lvl) => (v === "High" ? "red" : v === "Medium" ? "amber" : "green");
  const lv: Lvl[] = ["High", "Medium", "Low"];
  const iv: Lvl[] = ["Low", "Medium", "High"];
  const heat = (l: Lvl, i: Lvl) => {
    const score = (l === "High" ? 3 : l === "Medium" ? 2 : 1) * (i === "High" ? 3 : i === "Medium" ? 2 : 1);
    return score >= 6 ? "#f6d5cd" : score >= 3 ? "#fdf0d2" : "#e3f3e8";
  };
  return (
    <Page kicker="Risk Management" title="Risk assessment & mitigation" subtitle="Key project and business risks, their assessed likelihood and impact, and the mitigation measures built into the plan.">
      <div className="resp-2 grid h-full grid-cols-[1fr_300px] gap-5">
        <DataTable
          compact
          head={["#", "Risk", "Likelihood", "Impact", "Mitigation"]}
          align={["l", "l", "c", "c", "l"]}
          widths={["4%", "26%", "11%", "10%", "49%"]}
          rows={risks.map((x, k) => [k + 1, x.r, <Pill tone={tone(x.l)}>{x.l}</Pill>, <Pill tone={tone(x.i)}>{x.i}</Pill>, x.m])}
          size="fs-11"
          className="self-start"
        />
        <Card className="flex flex-col">
          <H icon={TriangleAlert}>Risk heat map</H>
          <div className="mt-3 grid grid-cols-[22px_minmax(0,1fr)] gap-1">
            <div className="flex items-center justify-center">
              <span className="-rotate-90 fs-9 font-bold tracking-wider whitespace-nowrap text-mute uppercase">Likelihood</span>
            </div>
            <div className="grid grid-cols-3 grid-rows-3 gap-1">
              {lv.map((l) =>
                iv.map((i) => (
                  <div key={l + i} className="flex h-[66px] flex-wrap content-center items-center justify-center gap-1 rc-sm p-1" style={{ background: heat(l, i) }}>
                    {risks.map((x, k) =>
                      x.l === l && x.i === i ? (
                        <span key={k} className="flex h-6 w-6 items-center justify-center rounded-full bg-p-ink fs-10 font-bold text-white">
                          {k + 1}
                        </span>
                      ) : null,
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
          <div className="mt-1 pl-[26px] text-center fs-9 font-bold tracking-wider text-mute uppercase">Impact →</div>
          <Note className="mt-auto">Numbers refer to risks in the table. Risks reviewed quarterly by management.</Note>
        </Card>
      </div>
    </Page>
  );
}

/* ====================================================== 46 EHS */
function EHS() {
  const cols = [
    { i: Leaf, t: "Environment", b: ["ETP with treated-water reuse", "Boiler emission control & stack monitoring", "Green belt and rainwater harvesting", "3 MW solar — 40% clean power", "Recyclable packaging; hull & ash reuse"] },
    { i: HardHat, t: "Occupational health & safety", b: ["PPE, safety induction & mock drills", "Occupational health centre & first aid", "Work permits, lock-out / tag-out", "10-member safety & compliance team", "EPF, ESI and statutory welfare"] },
    { i: Flame, t: "Process safety (solvent)", b: ["PESO-licensed hexane storage", "Flameproof electricals & earthing", "Gas detectors with alarms & interlocks", "Hydrant, sprinkler & foam systems", "HAZOP & safety audits at design stage"] },
  ];
  return (
    <Page kicker="Environment, Health & Safety" title="Safe, clean and compliant by design" subtitle="EHS is embedded from layout and equipment selection through to daily operating procedures.">
      <div className="resp-2p grid h-full grid-cols-[300px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.workers} className="h-full" shade="bottom" pos="center 35%">
          <div className="flex h-full flex-col justify-end p-5">
            <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Zero-harm culture</div>
            <p className="mt-1 fs-14 leading-snug font-semibold text-white">Every worker home safe, every day.</p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <div className="grid flex-1 grid-cols-3 gap-3">
            {cols.map((c, i) => (
              <div key={c.t} className="flex flex-col overflow-hidden rc border border-line bg-white">
                <div className={`flex items-center gap-2 px-4 py-3 text-white ${i === 0 ? "bg-p" : i === 1 ? "bg-p-dark" : "bg-p-ink"}`}>
                  <c.i size={18} className="text-s" />
                  <span className="fs-13 font-bold">{c.t}</span>
                </div>
                <div className="p-4">
                  <Bullets items={c.b} size="fs-11h" gap="space-y-2.5" />
                </div>
              </div>
            ))}
          </div>
          <Card tone="s" className="!p-3.5">
            <div className="flex items-center gap-3">
              <Scale size={20} className="shrink-0 text-s-dark" />
              <p className="fs-11 leading-snug text-ink/85">
                <b>Regulatory framework:</b> Air & Water Acts (UPPCB consents), Petroleum Rules (PESO), Factories Act, Boiler
                regulations, Fire Services norms, FSSAI and Legal Metrology.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ================================================== 47 Approvals */
function Approvals() {
  const rows: [string, string, string][] = [
    ["Company incorporation", "Ministry of Corporate Affairs", "Completed"],
    ["Investment registration (CAF)", "Invest UP / Nivesh Mitra", "Pre-construction"],
    ["Land allotment / purchase & land-use", "UPSIDA / Revenue Department", "Pre-construction"],
    ["Building plan approval", "UPSIDA / Development Authority", "Pre-construction"],
    ["Consent to Establish (Air & Water)", "UP Pollution Control Board", "Pre-construction"],
    ["Groundwater NOC", "UP Ground Water Department", "Pre-construction"],
    ["Factory plan approval & licence", "Directorate of Factories, UP", "Construction"],
    ["Power connection", "UPPCL / DISCOM", "Construction"],
    ["Petroleum (hexane) storage licence", "PESO", "Pre-commissioning"],
    ["Boiler registration", "Directorate of Boilers, UP", "Pre-commissioning"],
    ["Fire NOC", "UP Fire & Emergency Services", "Pre-commissioning"],
    ["Consent to Operate", "UP Pollution Control Board", "Pre-commissioning"],
    ["FSSAI licence (Central)", "FSSAI", "Pre-commissioning"],
    ["Legal Metrology, GST, IEC, EPF/ESI", "Respective authorities", "Pre-commissioning"],
    ["BIS certification (feeds)", "Bureau of Indian Standards", "Operations"],
  ];
  const tone = (s: string) => (s === "Completed" ? "green" : s === "Pre-construction" ? "s" : s === "Construction" ? "p" : s === "Operations" ? "gray" : "amber");
  return (
    <Page kicker="Statutory Compliance" title="Approvals & clearances roadmap" subtitle="Key statutory approvals, the responsible authority and the project stage at which each is required.">
      <div className="resp-2 grid h-full grid-cols-[1fr_300px] gap-5">
        <DataTable
          compact
          head={["#", "Approval / clearance", "Authority", "Stage"]}
          align={["l", "l", "l", "l"]}
          widths={["5%", "42%", "35%", "18%"]}
          rows={rows.map((r, i) => [i + 1, r[0], r[1], <Pill tone={tone(r[2]) as "green"}>{r[2]}</Pill>])}
          size="fs-11"
          className="self-start"
        />
        <div className="flex flex-col gap-3">
          <Card tone="p">
            <H icon={FileCheck}>Single-window facilitation</H>
            <p className="mt-1.5 fs-11 leading-snug text-ink/80">
              We request time-bound processing of all applications through Nivesh Mitra, with a nodal officer for
              the project.
            </p>
          </Card>
          <Card className="flex-1">
            <H>Critical-path approvals</H>
            <Bullets
              className="mt-2"
              size="fs-11"
              gap="space-y-1.5"
              items={["Land allotment & conversion", "UPPCB Consent to Establish", "PESO licence for hexane storage", "Power connection & solar approvals"]}
            />
            <div className="mt-3 rc-sm bg-s-wash p-2.5 fs-10h leading-snug text-ink/80">
              Civil works can start within <b>90 days</b> of in-principle approval if these are fast-tracked.
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ================================================ 48 Policy & incentives */
function Policy() {
  const align = [
    { i: Sprout, t: "NMEO-Oilseeds", d: "Domestic oilseed processing & self-reliance" },
    { i: Factory, t: "Atmanirbhar Bharat", d: "Edible-oil import substitution" },
    { i: School, t: "PM-POSHAN & ICDS", d: "Affordable protein for nutrition schemes" },
    { i: Milk, t: "Livestock missions", d: "Feed quality for Rashtriya Gokul & NLM goals" },
    { i: Landmark, t: "UP $1 trillion vision", d: "Large-scale manufacturing investment" },
    { i: Sun, t: "UP Solar Energy Policy 2022", d: "Captive renewable generation" },
  ];
  const inc: [string, string, string][] = [
    ["UP Food Processing Industry Policy 2023", "Capital subsidy of 35% on eligible plant, machinery & technical civil works (up to ₹5 Cr)", "New food-processing unit"],
    ["UP Food Processing Industry Policy 2023", "100% stamp-duty exemption on land purchased for food-processing units", "20-acre plant site"],
    ["UP Food Processing Industry Policy 2023", "Mandi-fee & development-fee relief on raw material (as notified)", "Oilseed & grain procurement"],
    ["UP Food Processing Industry Policy 2023", "25% freight subsidy on exports (excl. Nepal, Bangladesh, Bhutan)", "Soya protein exports"],
    ["UP Industrial Investment & Employment Promotion Policy 2022", "Investment-linked incentives by category — e.g. capital subsidy or net SGST reimbursement, stamp & electricity duty benefits", "Large-scale investment"],
  ];
  return (
    <Page kicker="Policy Alignment" title="Aligned with national missions and State policy" subtitle="The project advances multiple Government of India and Government of Uttar Pradesh priorities, and is eligible for policy incentives.">
      <div className="resp-6 flex h-full flex-col gap-3">
        <div className="grid grid-cols-6 gap-3">
          {align.map((a) => (
            <div key={a.t} className="rc border border-line bg-white p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-p text-white">
                <a.i size={16} />
              </span>
              <div className="mt-2 fs-11h leading-tight font-bold text-p-ink">{a.t}</div>
              <div className="mt-1 fs-10 leading-snug text-mute">{a.d}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: "35%", l: "Capital subsidy on plant, machinery & technical civil works", s: "Up to ₹5 Cr · UP FPIP 2023" },
            { v: "100%", l: "Stamp-duty exemption on land purchase", s: "UP FPIP 2023" },
            { v: "25%", l: "Freight subsidy on exports", s: "UP FPIP 2023" },
            { v: "90 days", l: "Target to start civil works after in-principle approval", s: "With single-window facilitation" },
          ].map((k) => (
            <div key={k.v} className="flex items-center gap-3 rc border border-s/35 bg-s-wash px-4 py-3">
              <span className="font-head fs-24 font-extrabold whitespace-nowrap text-p">{k.v}</span>
              <div>
                <div className="fs-11h leading-tight font-semibold text-p-ink">{k.l}</div>
                <div className="mt-0.5 fs-9h text-mute">{k.s}</div>
              </div>
            </div>
          ))}
        </div>
        <DataTable
          head={["Policy", "Incentive (indicative)", "Relevance to project"]}
          widths={["27%", "52%", "21%"]}
          rows={inc}
          size="fs-12"
        />
        <Note className="mt-auto">
          Final eligibility and quantum as per the notified policy guidelines and approvals; incentives under different
          policies may not be cumulative.
        </Note>
      </div>
    </Page>
  );
}

/* ================================================== 49 Gantt */
function Gantt() {
  const months = Array.from({ length: 27 }, (_, i) => i + 1);
  const phaseColor = ["var(--c-s)", "var(--c-p-soft)", "var(--c-p)", "var(--c-p-ink)"];
  return (
    <Page kicker="Implementation" title="Implementation schedule — commercial production in 27 months" subtitle="Phased execution plan from land allotment to commercial production; critical path depends on land and statutory approvals.">
      <div className="flex h-full flex-col">
        <div className="overflow-hidden rc border border-line">
          <div className="gantt-head grid grid-cols-[250px_minmax(0,1fr)] bg-p-ink text-white">
            <div className="px-3 py-1.5 fs-9h font-semibold tracking-wider uppercase">Activity</div>
            <div className="grid" style={{ gridTemplateColumns: "repeat(27, 1fr)" }}>
              {months.map((m) => (
                <div key={m} className={`py-1.5 text-center fs-9 font-semibold ${Math.ceil(m / 3) % 2 ? "bg-white/5" : ""}`}>
                  {m}
                </div>
              ))}
            </div>
          </div>
          {GANTT.map((g, i) => (
            <div key={g.task} className={`gantt-row grid grid-cols-[250px_minmax(0,1fr)] border-t border-line ${i % 2 ? "bg-paper" : "bg-white"}`}>
              <div className="truncate px-3 py-[7px] fs-10h font-medium text-ink">{g.task}</div>
              <div className="relative grid" style={{ gridTemplateColumns: "repeat(27, 1fr)" }}>
                {months.map((m) => (
                  <div key={m} className={`border-l border-line/60 ${Math.ceil(m / 3) % 2 ? "bg-p/[0.03]" : ""}`} />
                ))}
                {g.s === g.e && g.s === 27 ? (
                  <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-45 bg-s" style={{ left: `calc(${((g.s - 0.5) / 27) * 100}% - 7px)` }} />
                ) : (
                  <div
                    className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full"
                    style={{ left: `${((g.s - 1) / 27) * 100}%`, width: `${((g.e - g.s + 1) / 27) * 100}%`, background: phaseColor[g.ph] }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex gap-4">
            {PHASES.map((p, i) => (
              <span key={p} className="flex items-center gap-1.5 fs-10h text-ink">
                <span className="h-2.5 w-6 rounded-full" style={{ background: phaseColor[i] }} />
                {p}
              </span>
            ))}
            <span className="flex items-center gap-1.5 fs-10h text-ink">
              <span className="h-2.5 w-2.5 rotate-45 bg-s" /> Commercial production
            </span>
          </div>
          <span className="fs-10h text-mute">Months from land allotment / in-principle approval</span>
        </div>
      </div>
    </Page>
  );
}

/* ============================================= 50 Conclusion & contact */
function Conclusion() {
  const { s } = useSettings();
  const M = useMoney();
  const capexMn = useCapexMn();
  const bg = backgroundFor(s.brand.closingStyle, s.brand.customGraphic);
  const points = [
    `${M.m(capexMn, 0)} integrated investment with 1,200 TPD capacity`,
    `${JOBS} direct jobs and wide indirect livelihoods`,
    "≈3.81 lakh tonnes of farm produce procured every year",
    `Revenue of ${M.m(TOT.revenue[4], 0)} by Year 5 within ${s.company.state}`,
    "Protein for nutrition, feed for livestock, oil for self-reliance",
  ];
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-p-ink font-body text-white">
      {bg && <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="resp-close absolute inset-0" style={{ background: `linear-gradient(90deg, ${ink(97)} 0%, ${ink(90)} 55%, ${ink(60)} 100%)` }} />
      <div className="relative flex min-h-0 flex-1 gap-10 px-14 pt-12 pb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 bg-s" />
            <span className="fs-11 font-bold tracking-[0.24em] text-s uppercase">Conclusion</span>
          </div>
          <h2 className="mt-4 font-head fs-40 leading-[1.08] font-extrabold">
            Value added to the farmer.
            <br />
            Protein on the plate.
            <br />
            <span className="text-s">Jobs in the district.</span>
          </h2>
          <p className="mt-4 max-w-[600px] fs-13 leading-relaxed text-white/80">
            {s.company.name} seeks the partnership of the Government of {s.company.state} to establish this integrated
            agro-processing complex — a technically sound, commercially viable and socially impactful investment.
          </p>
          <div className="mt-5 grid max-w-[640px] grid-cols-1 gap-2">
            {points.map((p) => (
              <div key={p} className="flex items-center gap-2.5 fs-12h text-white/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-s fs-10 font-bold text-p-ink">✓</span>
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-[380px] shrink-0 flex-col justify-center">
          <div className="rc-lg bg-white p-6 text-ink shadow-2xl">
            <Logo size={40} />
            <div className="mt-4 fs-9h font-bold tracking-[0.2em] text-s-dark uppercase">{s.labels.contactHeading}</div>
            {s.labels.contactSub && <div className="fs-10h text-mute">{s.labels.contactSub}</div>}
            <div className="mt-1 fs-15 font-bold text-p-ink">{s.contact.person}</div>
            <div className="fs-11 text-mute">{s.contact.designation} · {s.company.name}</div>
            <div className="mt-4 space-y-2.5 fs-11h">
              <div className="flex items-start gap-2.5"><MapPin size={15} className="mt-[1px] shrink-0 text-p" />{s.contact.address}</div>
              {s.labels.showContactPhone && <div className="flex items-center gap-2.5"><Phone size={15} className="shrink-0 text-p" />{s.contact.phone}</div>}
              {s.labels.showContactEmail && <div className="flex items-center gap-2.5"><Mail size={15} className="shrink-0 text-p" />{s.contact.email}</div>}
              {s.labels.showContactWeb && <div className="flex items-center gap-2.5"><Globe size={15} className="shrink-0 text-p" />{s.contact.website}</div>}
            </div>
            <div className="mt-5 flex items-center gap-2 rc bg-p-wash px-3 py-2.5">
              <Recycle size={16} className="text-p" />
              <span className="fs-10h font-semibold text-p-dark">{s.labels.closingLine}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <Footer dark />
      </div>
    </div>
  );
}

export const DPR4: SlideDef[] = [
  { title: "Profitability & Key Indicators", part: "B", section: SEC.s8, C: Profitability },
  { title: "Sensitivity Analysis", part: "B", section: SEC.s8, C: Sensitivity },
  { title: "Marketing & Sales Strategy", part: "B", section: SEC.s9, C: Marketing },
  { title: "SWOT Analysis", part: "B", section: SEC.s9, C: Swot },
  { title: "Risk Assessment & Mitigation", part: "B", section: SEC.s9, C: Risks },
  { title: "Environment, Health & Safety", part: "B", section: SEC.s10, C: EHS },
  { title: "Statutory Approvals", part: "B", section: SEC.s10, C: Approvals },
  { title: "Policy Alignment & Incentives", part: "B", section: SEC.s10, C: Policy },
  { title: "Implementation Schedule", part: "B", section: SEC.s10, C: Gantt },
  { title: "Conclusion & Contact", part: "B", section: SEC.s10, C: Conclusion },
];
