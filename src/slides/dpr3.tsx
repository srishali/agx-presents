import {
  Building,
  Droplets,
  Factory,
  Flame,
  Leaf,
  Package,
  ShieldCheck,
  Sun,
  Truck,
  Users,
  Warehouse,
  Zap,
  GraduationCap,
  IndianRupee,
  Landmark,
  Wheat,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { IMG } from "../assets/images";
import { useCapexMn, useMoney, usePalette, useSettings } from "../brand/BrandContext";
import { Bullets, Card, DataTable, H, KPI, Note, Page, Photo, Pill } from "../components/ui";
import {
  COST,
  COST_TOTAL,
  GROUPS,
  JOBS,
  MANPOWER,
  REVENUE,
  RM,
  SILOS,
  SILO_T,
  SKILLS,
  TANKS,
  TANK_T,
  TOT,
  YEARS,
  fnTotal,
  groupTotal,
  nf,
  skillTotal,
  REV_FEED,
  REV_SOLVENT,
} from "../data";
import { SEC, useAnim, type SlideDef } from "../deck";
import { axisTick, tipStyle } from "./exec";

/* ============================================ 31 Packaging & logistics */
function Logistics() {
  return (
    <Page
      kicker="Operations"
      title="Packaging, warehousing & logistics"
      subtitle="Hygienic packing, 3 lakh sq.ft of covered storage and multimodal logistics to move ≈7.65 lakh tonnes of cargo every year."
    >
      <div className="resp-2p grid h-full grid-cols-[330px_minmax(0,1fr)] gap-5">
        <div className="flex flex-col gap-3">
          <Photo src={IMG.warehouse} className="min-h-0 flex-1" shade="bottom">
            <div className="flex h-full flex-col justify-end p-4">
              <div className="font-head fs-28 font-extrabold text-s">3,00,000 sq.ft</div>
              <div className="fs-11 text-white/85">Covered godowns</div>
            </div>
          </Photo>
          <Photo src={IMG.truck} className="min-h-0 flex-1" shade="bottom">
            <div className="flex h-full flex-col justify-end p-4">
              <div className="font-head fs-28 font-extrabold text-s">≈ 90 / day</div>
              <div className="fs-11 text-white/85">Truck-loads at full capacity (if all by road)</div>
            </div>
          </Photo>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              i: Package,
              t: "Packaging",
              b: [
                "Hygienic, controlled packing areas to prevent contamination",
                "HDPE / PP woven bags (25–50 kg) for DOC and feed",
                "Consumer packs for soya chunks and soya flour",
                "Recyclable & biodegradable materials wherever feasible",
                "Batch coding, FSSAI & Legal Metrology compliant labels",
              ],
            },
            {
              i: Warehouse,
              t: "Warehousing",
              b: [
                "3 lakh sq.ft godowns for raw material and finished goods",
                "FIFO rotation, palletised stacking, moisture control",
                "Scheduled fumigation and integrated pest management",
                "Digital inventory & warehouse management system",
                "22-member stores, inventory & warehouse team",
              ],
            },
            {
              i: Truck,
              t: "Logistics",
              b: [
                "≈3.81 lakh T inbound and ≈3.84 lakh T outbound per year",
                "Rail for bulk inbound oilseed and outbound DOC",
                "Road distribution of feed to dealers and farms",
                "Food-grade SS tankers for crude-oil dispatch",
                "40-member transport team, truck yard & weighbridges",
              ],
            },
          ].map((c, i) => (
            <div key={c.t} className="flex flex-col overflow-hidden rc border border-line bg-white">
              <div className={`flex items-center gap-2 px-4 py-3 text-white ${i === 0 ? "bg-p" : i === 1 ? "bg-p-dark" : "bg-p-ink"}`}>
                <c.i size={18} className="text-s" />
                <span className="font-head fs-15 font-bold">{c.t}</span>
              </div>
              <div className="flex-1 p-4">
                <Bullets items={c.b} size="fs-11h" gap="space-y-2.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ================================================== 32 Plant layout */
function Layout() {
  const z = (x: number, y: number, w: number, h: number, label: string, fill: string, sub?: string, dark = false) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={fill} stroke="rgba(0,0,0,.12)" />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 4 : -3)} textAnchor="middle" fontSize="10" fontWeight="700" fill={dark ? "#fff" : "#17201c"}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" fontSize="8.5" fill={dark ? "rgba(255,255,255,.75)" : "#5b6661"}>
          {sub}
        </text>
      )}
    </g>
  );
  const land: [string, number][] = [
    ["Godowns & warehousing", 6.9],
    ["Process plants (solvent, preparation, feed, boiler)", 2.5],
    ["Silos & tank farm", 1.5],
    ["Roads, parking & truck yard", 2.2],
    ["Admin, laboratory, utilities & ETP", 0.9],
    ["Green belt & open area", 6.0],
  ];
  return (
    <Page
      kicker="Infrastructure"
      title="Land use & indicative plant layout — 20 acres"
      subtitle="Zoned for safe, efficient material flow: receiving → silos → processing → storage → dispatch, with the solvent plant in an isolated safety zone."
    >
      <div className="resp-2p grid h-full grid-cols-[640px_minmax(0,1fr)] gap-5">
        <Card tone="paper" className="!p-2">
          <svg viewBox="0 0 640 470" className="h-full w-full">
            <defs>
              <pattern id="solarHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="var(--c-p-light)" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="var(--c-p)" strokeOpacity=".35" strokeWidth="3" />
              </pattern>
            </defs>
            <rect x="10" y="8" width="620" height="454" rx="8" fill="#cfe5c9" />
            <rect x="30" y="26" width="580" height="418" rx="6" fill="#eef0eb" />
            {z(42, 38, 160, 96, "Godown A", "url(#solarHatch)", "Rooftop solar")}
            {z(42, 142, 160, 96, "Godown B", "url(#solarHatch)", "Rooftop solar")}
            {z(42, 246, 160, 96, "Godown C", "url(#solarHatch)", "Rooftop solar")}
            {z(42, 352, 160, 80, "Truck yard & parking", "#dfe2dc")}
            <rect x="218" y="38" width="150" height="80" rx="4" fill="#fff" stroke="rgba(0,0,0,.12)" />
            {[
              [252, 72, 24],
              [302, 72, 24],
              [342, 62, 12],
              [342, 94, 12],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="var(--c-s-light)" stroke="var(--c-s-dark)" strokeWidth="1.2" />
            ))}
            <text x="293" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#17201c">
              Silos · 7,000 T
            </text>
            {z(218, 128, 150, 110, "Feed Mill", "var(--c-p)", "500 TPD", true)}
            {z(380, 38, 48, 120, "Prep.", "var(--c-p-soft)", "Day silos")}
            <rect x="436" y="30" width="166" height="140" rx="6" fill="none" stroke="#b4402a" strokeDasharray="5 4" />
            {z(446, 40, 146, 92, "Solvent Extraction", "var(--c-p-ink)", "700 TPD", true)}
            <text x="519" y="160" textAnchor="middle" fontSize="8.5" fill="#b4402a" fontWeight="700">
              SAFETY ZONE (PESO)
            </text>
            {z(540, 180, 62, 46, "Hexane", "#f6d8d0", "PESO store")}
            {z(446, 180, 84, 46, "Boiler house", "#e9e3d3")}
            <rect x="380" y="240" width="222" height="70" rx="4" fill="#fff" stroke="rgba(0,0,0,.12)" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <circle key={i} cx={402 + i * 25} cy={268} r="10" fill="var(--c-s-soft)" stroke="var(--c-s-dark)" />
            ))}
            <text x="491" y="300" textAnchor="middle" fontSize="9" fontWeight="700" fill="#17201c">
              Tank farm · 3,600 T
            </text>
            {z(218, 252, 82, 58, "ETP", "#d7e8ef", "& water")}
            {z(308, 252, 60, 58, "Fire", "#f6d8d0", "pump house")}
            {z(380, 322, 222, 56, "Admin & Laboratory", "#fff")}
            {z(218, 322, 150, 56, "Packing & dispatch", "var(--c-s-wash)")}
            <rect x="290" y="392" width="160" height="40" rx="4" fill="var(--c-s)" />
            <text x="370" y="410" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--c-p-ink)">
              MAIN GATE
            </text>
            <text x="370" y="423" textAnchor="middle" fontSize="8.5" fill="var(--c-p-ink)">
              2 weighbridges · security
            </text>
            <text x="20" y="455" fontSize="9" fill="#2f6b3b" fontWeight="700">
              GREEN BELT
            </text>
          </svg>
        </Card>
        <div className="flex flex-col gap-3">
          <DataTable
            compact
            head={["Zone", "Acres", "Share"]}
            align={["l", "r", "r"]}
            widths={["64%", "16%", "20%"]}
            rows={land.map(([k, a]) => [k, a.toFixed(1), `${((a / 20) * 100).toFixed(1)}%`])}
            foot={["Total plot area", "20.0", "100%"]}
            size="fs-11h"
          />
          <Card tone="p" className="flex-1">
            <H icon={Sun}>Layout highlights</H>
            <Bullets
              className="mt-2"
              size="fs-11"
              gap="space-y-1.5"
              items={[
                "3 lakh sq.ft of godown roofs can host the full 3 MW solar plant (≈100 sq.ft per kWp)",
                "Solvent plant and hexane store in an isolated zone with statutory safety distances",
                "One-way truck circulation from gate → weighbridge → unloading → dispatch",
                "Green belt along the boundary as per UPPCB norms",
              ]}
            />
          </Card>
          <Note>Indicative layout — subject to detailed engineering, statutory approvals and final site geometry.</Note>
        </div>
      </div>
    </Page>
  );
}

/* ============================================ 33 Storage, power & utilities */
function Utilities() {
  const M = useMoney();
  const rows = [
    ["Silos"],
    ...SILOS.map((s) => [s.name, `${s.units} × ${nf(s.cap)} T`, nf(s.units * s.cap), s.purpose]),
    ["Tanks"],
    ...TANKS.map((s) => [s.name, `${s.units} × ${nf(s.cap)} T`, nf(s.units * s.cap), s.purpose]),
  ];
  const util = [
    { i: Zap, t: "Power", d: `Grid connection with power equipment (${M.m(M.cap(150), 0)}) and security deposit (${M.m(M.cap(100), 0)}); 3 MW captive solar.` },
    { i: Factory, t: "Standby power", d: `DG set (${M.m(M.cap(180), 0)}) for critical loads, solvent-plant safety systems and process continuity.` },
    { i: Flame, t: "Steam", d: "Boiler integrated with the solvent plant; agro-residue / biomass firing preferred, with emission-control equipment." },
    { i: Droplets, t: "Water", d: "Process, boiler-feed and cooling-tower make-up; rainwater harvesting and ETP with treated-water reuse." },
    { i: ShieldCheck, t: "Fire & safety", d: "Hydrant network, foam system for hexane area, gas detectors and flameproof electricals." },
  ];
  return (
    <Page
      kicker="Infrastructure"
      title="Storage infrastructure, power & utilities"
      subtitle={`${nf(SILO_T)} tonnes of silo capacity and ${nf(TANK_T)} tonnes of tankage, supported by reliable power, steam and water systems.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1.25fr_1fr] gap-5">
        <div className="flex flex-col gap-3">
          <DataTable
            head={["Facility", "Configuration", "Total (T)", "Purpose"]}
            align={["l", "l", "r", "l"]}
            widths={["30%", "18%", "14%", "38%"]}
            rows={rows}
            groupRows={[0, SILOS.length + 1]}
            size="fs-12"
          />
          <div className="grid grid-cols-3 gap-3">
            <KPI value={nf(SILO_T)} unit="T" label="Silo storage" className="!p-3" />
            <KPI value={nf(TANK_T)} unit="T" label="Oil & molasses tankage" className="!p-3" />
            <KPI value="3 Lakh" unit="sq.ft" label="Covered godowns" tone="gold" className="!p-3" />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2.5">
          {util.map((u) => (
            <div key={u.t} className="flex gap-3 rc border border-line bg-white p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-p text-white">
                <u.i size={16} />
              </span>
              <div>
                <div className="fs-12h font-bold text-p-ink">{u.t}</div>
                <p className="mt-0.5 fs-10h leading-snug text-mute">{u.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ====================================================== 34 Solar */
function Solar() {
  const M = useMoney();
  const gen: [string, string][] = [
    ["Installed capacity", "3,000 kWp"],
    ["Specific yield (assumed)", "≈ 4.5 kWh / kWp / day"],
    ["Annual generation", "≈ 4.9 million units"],
    ["Share of plant demand", "≈ 40%"],
    ["CO₂ avoided (at ≈0.71 t/MWh)", "≈ 3,500 tonnes / year"],
  ];
  return (
    <Page
      kicker="Renewable Energy"
      title="3 MW captive solar — 40% of plant electricity from the sun"
      subtitle="Lower energy cost, greater energy security and a cleaner footprint, with a modular design that scales as the plant grows."
    >
      <div className="resp-2p grid h-full grid-cols-[360px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.solar} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="font-head fs-60 leading-none font-extrabold text-s">3 MW</div>
            <p className="mt-2 fs-13 leading-snug font-semibold text-white">
              Grid-interactive solar on godown roofs and open areas
            </p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-3">
            <KPI icon={Sun} value="40%" label="Of plant power demand" className="!p-3.5" />
            <KPI icon={IndianRupee} value={M.n(M.cap(400), 0)} unit={M.short} label="Solar investment" className="!p-3.5" />
            <KPI icon={Zap} value="≈4 yrs" label="Expected payback" sub="Promoter estimate" className="!p-3.5" />
            <KPI icon={Leaf} value="3,500" unit="t CO₂" label="Avoided every year" sub="Indicative" tone="gold" className="!p-3.5" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3">
            <Card>
              <H icon={Zap}>Technology & configuration</H>
              <Bullets
                className="mt-2.5"
                size="fs-11h"
                gap="space-y-2"
                items={[
                  "High-efficiency PV modules with grid-tied string inverters",
                  "Net-metering / surplus export to the grid where permitted",
                  "Rooftop on godowns plus ground-mount in open areas",
                  "Modular design — add panels as demand grows",
                  "Battery-storage ready for night & low-sunlight periods",
                ]}
              />
            </Card>
            <Card tone="paper">
              <H icon={Sun}>Indicative generation</H>
              <div className="mt-2.5 overflow-hidden rc-sm border border-line bg-white">
                {gen.map(([k, v], i) => (
                  <div key={k} className={`flex justify-between px-3 py-[7px] fs-11h ${i % 2 ? "bg-paper" : ""}`}>
                    <span className="text-mute">{k}</span>
                    <span className="font-semibold text-p-ink">{v}</span>
                  </div>
                ))}
              </div>
              <Note className="mt-2">Generation estimates indicative; final values per detailed solar resource assessment.</Note>
            </Card>
          </div>
          <div className="flex gap-2">
            <Pill>Lower electricity bills</Pill>
            <Pill>Energy security</Pill>
            <Pill>Green-standard compliance</Pill>
            <Pill tone="s">UP Solar Energy Policy 2022 alignment</Pill>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ================================================= 35 Organisation */
function Org() {
  const { s } = useSettings();
  const fns = [
    { t: "Plant Operations & Maintenance", n: fnTotal("ops"), sub: ["Solvent plant", "Feed mill", "Utilities & boiler", "Maintenance"] },
    { t: "Quality Assurance & Lab", n: fnTotal("qa"), sub: ["Inward QC", "In-process QC", "Food-safety systems"] },
    { t: "Supply Chain & Logistics", n: fnTotal("scm"), sub: ["Procurement", "Stores & warehouse", "Rail & road logistics", "Packaging"] },
    { t: "EHS & Compliance", n: fnTotal("ehs"), sub: ["Safety", "Environment", "Statutory compliance"] },
    { t: "Finance, HR, Admin & Sales", n: fnTotal("corp"), sub: ["Finance & accounts", "HR & administration", "Sales & marketing", "Security"] },
  ];
  return (
    <Page
      kicker="Organisation"
      title="Organisation structure"
      subtitle="A lean, professionally managed structure with clear accountability across operations, quality, supply chain, compliance and corporate functions."
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-col items-center">
          <div className="rc bg-p-ink px-8 py-2.5 text-center text-white">
            <div className="fs-9h font-bold tracking-[0.18em] text-s uppercase">Board of Directors</div>
            <div className="fs-11 text-white/75">Strategic oversight & governance</div>
          </div>
          <div className="h-4 w-px bg-p" />
          <div className="rc bg-p px-8 py-2.5 text-center text-white">
            <div className="fs-13 font-bold">{s.people[0]?.role || "Managing Director"}</div>
            <div className="fs-10h text-white/80">{s.people[0]?.name}</div>
          </div>
          <div className="h-4 w-px bg-p" />
        </div>
        <div className="relative grid grid-cols-5 gap-3 pt-4">
          <div className="absolute top-0 right-[10%] left-[10%] h-px bg-p" />
          {fns.map((f) => (
            <div key={f.t} className="relative flex flex-col">
              <div className="absolute -top-4 left-1/2 h-4 w-px bg-p" />
              <div className="rc border-2 border-p bg-white p-3 text-center">
                <div className="fs-12 leading-tight font-bold text-p-ink">{f.t}</div>
                <div className="mt-1.5 inline-block rounded-full bg-s px-2.5 py-0.5 fs-10h font-extrabold text-p-ink">
                  {f.n} people
                </div>
              </div>
              <div className="mt-2 space-y-1">
                {f.sub.map((x) => (
                  <div key={x} className="rc-sm border border-line bg-paper px-2 py-1 text-center fs-10h text-ink/80">
                    {x}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto grid grid-cols-4 gap-3">
          {s.people.slice(0, 4).map((p, i) => (
            <div key={i} className="flex items-center gap-3 rc border border-line bg-white p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-s-wash font-head fs-14 font-extrabold text-s-dark">
                {(p.name.match(/[A-Za-z]/)?.[0] || "?").toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="truncate fs-12 font-bold text-p-ink">{p.name}</div>
                <div className="truncate fs-10h text-mute">{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ================================================== 36 Manpower */
function Manpower() {
  const pal = usePalette();
  const anim = useAnim();
  const mix = SKILLS.map((k, i) => ({ name: k.name, v: skillTotal(k.key), color: pal.chart[i] }));
  return (
    <Page
      kicker="Manpower"
      title={`${JOBS} direct jobs across the full skill spectrum`}
      subtitle="Round-the-clock operations in three shifts, with priority to local recruitment and structured skilling."
    >
      <div className="resp-2 grid h-full grid-cols-[1.3fr_1fr] gap-5">
        <DataTable
          compact
          head={["#", "Category", "Persons"]}
          align={["l", "l", "r"]}
          widths={["7%", "78%", "15%"]}
          rows={MANPOWER.map((m, i) => [i + 1, m.cat, m.n])}
          foot={["", "Total direct employment", JOBS]}
          size="fs-11"
          className="self-start"
        />
        <div className="flex flex-col gap-3">
          <Card>
            <H icon={Users}>Skill composition</H>
            <div className="flex items-center gap-2">
              <PieChart width={170} height={170}>
                <Pie data={mix} dataKey="v" nameKey="name" innerRadius={46} outerRadius={78} paddingAngle={1.5} stroke="none" isAnimationActive={anim}>
                  {mix.map((m) => (
                    <Cell key={m.name} fill={m.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-1.5">
                {mix.map((m) => (
                  <div key={m.name} className="flex items-center gap-2 fs-11">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: m.color }} />
                    <span className="flex-1">{m.name}</span>
                    <b className="tabular">{m.v}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card tone="s" className="flex-1">
            <H icon={GraduationCap}>Local hiring & skilling</H>
            <Bullets
              className="mt-2"
              size="fs-11"
              gap="space-y-1.5"
              items={[
                "Priority recruitment from the host district and nearby villages",
                "In-house operator training for solvent, expeller and feed-plant roles",
                "ITI & polytechnic partnerships for a technician pipeline",
                "Statutory welfare: EPF, ESI, safety training and PPE",
                "Indirect livelihoods in transport, trade and services",
              ]}
            />
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ================================================== 37 Project cost */
function ProjectCost() {
  const M = useMoney();
  const pal = usePalette();
  const total = useCapexMn();
  const gi = (k: string) => GROUPS.findIndex((g) => g.key === k);
  return (
    <Page
      kicker="Financial Analysis"
      title={`Project cost estimate — ${M.m(total, 0)}`}
      subtitle={`Detailed break-up of capital outlay as per promoter estimates. Amounts in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1.55fr_1fr] gap-5">
        <DataTable
          compact
          head={["#", "Particulars", "Category", M.label, "Share"]}
          align={["l", "l", "l", "r", "r"]}
          widths={["5%", "51%", "20%", "13%", "11%"]}
          rows={COST.map((c, i) => [
            i + 1,
            c.item,
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ background: pal.chart[gi(c.grp)] }} />
              <span className="truncate">{GROUPS[gi(c.grp)].name.split(" ")[0]}</span>
            </span>,
            M.tc(M.cap(c.amt)),
            `${((c.amt / COST_TOTAL) * 100).toFixed(1)}%`,
          ])}
          foot={["", "Total project cost", "", M.tc(total), "100%"]}
          size="fs-11"
          className="self-start"
        />
        <div className="flex flex-col gap-3">
          <Card className="flex-1">
            <H icon={IndianRupee}>Cost by category</H>
            <div className="mt-3 space-y-3">
              {GROUPS.map((g, i) => {
                const v = M.cap(groupTotal(g.key));
                return (
                  <div key={g.key}>
                    <div className="mb-1 flex justify-between fs-11h">
                      <span className="font-semibold text-ink">{g.name}</span>
                      <span className="font-bold tabular text-p-ink">
                        {M.m(v, 0)} <span className="font-medium text-mute">· {((v / total) * 100).toFixed(1)}%</span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-line/70">
                      <div className="h-3 rounded-full" style={{ width: `${(v / total) * 100}%`, background: pal.chart[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card tone="p" className="!p-3.5">
            <div className="flex items-center gap-3">
              <Building size={20} className="shrink-0 text-p" />
              <p className="fs-10h leading-snug text-ink/80">
                Land & civil works form the largest component, reflecting 20 acres of land and 3 lakh sq.ft of
                godowns — durable, asset-backed investment.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ============================================ 38 Means of finance */
function Finance() {
  const M = useMoney();
  const pal = usePalette();
  const anim = useAnim();
  const { s } = useSettings();
  const eq = M.cap(s.finance.equity);
  const debt = M.cap(s.finance.debt);
  const fin = eq + debt || 1;
  const total = useCapexMn();
  const rate = s.finance.rate / 100;
  const tenure = Math.max(1, Math.min(12, Math.round(s.finance.tenure)));
  const mor = Math.max(0, Math.min(tenure - 1, Math.round(s.finance.moratorium)));
  const inst = debt / (tenure - mor);
  let open = debt;
  const chartData: { y: string; os: number; ds: number }[] = [];
  const sched = Array.from({ length: tenure }, (_, i) => {
    const interest = open * rate;
    const principal = i < mor ? 0 : inst;
    const close = Math.max(0, open - principal);
    const row = [`Year ${i + 1}`, M.t(open), M.t(interest), M.t(principal), M.t(principal + interest), M.t(close)];
    chartData.push({ y: `Y${i + 1}`, os: +M.conv(close).toFixed(1), ds: +M.conv(principal + interest).toFixed(1) });
    open = close;
    return row;
  });
  const pie = [
    { name: "Promoter equity", v: eq, c: pal.s },
    { name: "Term debt", v: debt, c: pal.p },
  ];
  return (
    <Page
      kicker="Financial Analysis"
      title="Means of finance & indicative debt servicing"
      subtitle={`Funding structure and an illustrative repayment profile at ${s.finance.rate}% p.a. over ${tenure} years including ${mor}-year moratorium. Amounts in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[400px_minmax(0,1fr)] gap-5">
        <div className="flex flex-col gap-3">
          <Card>
            <H icon={Landmark}>Means of finance</H>
            <div className="flex items-center">
              <PieChart width={150} height={150}>
                <Pie data={pie} dataKey="v" innerRadius={42} outerRadius={70} stroke="none" isAnimationActive={anim}>
                  {pie.map((p) => (
                    <Cell key={p.name} fill={p.c} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2">
                {pie.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center gap-2 fs-11 text-mute">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.c }} />
                      {p.name}
                    </div>
                    <div className="font-head fs-18 font-extrabold text-p-ink">
                      {M.m(p.v, 0)} <span className="fs-11 font-semibold text-mute">{((p.v / fin) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <div className="overflow-hidden rc border border-line">
            {[
              ["Total means of finance", M.m(fin, 0)],
              ["Total project cost", M.m(total, 0)],
              ["Debt : Equity", `${(debt / (eq || 1)).toFixed(2)} : 1`],
              ["Promoter contribution", `${((eq / fin) * 100).toFixed(1)}%`],
              ["Interest rate (assumed)", `${s.finance.rate}% p.a.`],
            ].map(([k, v], i) => (
              <div key={k} className={`flex justify-between px-3.5 py-2 fs-11h ${i % 2 ? "bg-paper" : "bg-white"}`}>
                <span className="text-mute">{k}</span>
                <span className="font-bold text-p-ink">{v}</span>
              </div>
            ))}
          </div>
          <Note>Indicative only — final structure, tenor and pricing as per lender sanction. Subsidies, if any, will reduce debt.</Note>
        </div>
        <div className="flex flex-col gap-2">
          <H>Indicative term-loan repayment schedule (annual, simplified)</H>
          <DataTable
            compact
            head={["Year", "Opening", "Interest", "Principal", "Debt service", "Closing"]}
            align={["l", "r", "r", "r", "r", "r"]}
            rows={sched}
            boldRows={Array.from({ length: mor }, (_, i) => i)}
            size="fs-11"
          />
          <Note>
            Shaded rows denote moratorium (interest only). DSCR, IRR and cash-flow statements to be appended from the
            CA-certified financial model.
          </Note>
          {tenure <= 9 && (
            <Card className="!p-3">
              <H>Debt profile ({M.label})</H>
              <BarChart width={730} height={150} data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
                <XAxis dataKey="y" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} />
                <Legend wrapperStyle={{ fontSize: 10.5 }} />
                <Bar dataKey="os" name="Outstanding (closing)" fill={pal.pSoft} radius={[3, 3, 0, 0]} isAnimationActive={anim} />
                <Bar dataKey="ds" name="Annual debt service" fill={pal.s} radius={[3, 3, 0, 0]} isAnimationActive={anim} />
              </BarChart>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}

/* ============================================ 39 Raw-material projections */
function RMProjection() {
  const M = useMoney();
  const pal = usePalette();
  const anim = useAnim();
  const sol = RM.filter((r) => r.seg === "solvent");
  const feed = RM.filter((r) => r.seg === "feed");
  const line = (r: (typeof RM)[number]) => [r.name, nf(r.qty), nf(r.price), ...r.y.map((v) => M.t(v))];
  const rows = [
    ["Solvent plant"],
    ...sol.map(line),
    ["Sub-total — solvent plant", "2,00,000", "", ...TOT.rmSolvent.map((v) => M.t(v))],
    ["Feed plant"],
    ...feed.map(line),
    ["Sub-total — feed plant", "1,81,316", "", ...TOT.rmFeed.map((v) => M.t(v))],
  ];
  const chart = YEARS.map((y, i) => ({ y: y.replace("Year ", "Y"), Solvent: +M.conv(TOT.rmSolvent[i]).toFixed(1), Feed: +M.conv(TOT.rmFeed[i]).toFixed(1) }));
  return (
    <Page
      kicker="Financial Analysis"
      title="Raw-material cost projections"
      subtitle={`Volumes scale with capacity utilisation (60% → 100%); prices held constant at base-year levels. Amounts in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1fr_300px] gap-4">
        <DataTable
          compact
          head={["Particulars", "Qty (T)", "₹ / T", ...YEARS]}
          align={["l", "r", "r", "r", "r", "r", "r", "r"]}
          widths={["24%", "10%", "9%", "11.4%", "11.4%", "11.4%", "11.4%", "11.4%"]}
          rows={rows}
          groupRows={[0, sol.length + 2]}
          boldRows={[sol.length + 1, rows.length - 1]}
          foot={["Total raw-material cost", "3,81,316", "", ...TOT.rm.map((v) => M.t(v))]}
          size="fs-11"
          className="self-start"
        />
        <Card className="flex flex-col">
          <H icon={Wheat}>RM cost by plant</H>
          <BarChart width={268} height={300} data={chart} margin={{ top: 10, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
            <XAxis dataKey="y" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Solvent" stackId="a" fill={pal.p} isAnimationActive={anim} />
            <Bar dataKey="Feed" stackId="a" fill={pal.s} radius={[4, 4, 0, 0]} isAnimationActive={anim} />
          </BarChart>
          <Note className="mt-auto">Source: promoter projections; totals as per project report.</Note>
        </Card>
      </div>
    </Page>
  );
}

/* ============================================== 40 Revenue projections */
function RevenueProjection() {
  const M = useMoney();
  const pal = usePalette();
  const anim = useAnim();
  const sol = REVENUE.filter((r) => r.seg === "solvent");
  const feed = REVENUE.filter((r) => r.seg === "feed");
  const line = (r: (typeof REVENUE)[number]) => [r.name, nf(r.qty), nf(r.price), ...r.y.map((v) => M.t(v))];
  const rows = [
    ["Solvent plant products"],
    ...sol.map(line),
    ["Sub-total — solvent plant", nf(sol.reduce((a, r) => a + r.qty, 0)), "", ...REV_SOLVENT.map((v) => M.t(v))],
    ["Feed plant products"],
    ...feed.map(line),
    ["Sub-total — feed plant", nf(feed.reduce((a, r) => a + r.qty, 0)), "", ...REV_FEED.map((v) => M.t(v))],
  ];
  const chart = YEARS.map((y, i) => ({ y: y.replace("Year ", "Y"), Solvent: +M.conv(REV_SOLVENT[i]).toFixed(1), Feed: +M.conv(REV_FEED[i]).toFixed(1) }));
  return (
    <Page
      kicker="Financial Analysis"
      title="Revenue projections"
      subtitle={`Sales volumes follow capacity utilisation (60% → 100%) at base-year realisations. Amounts in ${M.label}.`}
    >
      <div className="resp-2 grid h-full grid-cols-[1fr_300px] gap-4">
        <DataTable
          compact
          head={["Product", "Qty (T)", "₹ / T", ...YEARS]}
          align={["l", "r", "r", "r", "r", "r", "r", "r"]}
          widths={["24%", "10%", "9%", "11.4%", "11.4%", "11.4%", "11.4%", "11.4%"]}
          rows={rows}
          groupRows={[0, sol.length + 2]}
          boldRows={[sol.length + 1, rows.length - 1]}
          foot={["Total revenue", "3,83,900", "", ...TOT.revenue.map((v) => M.t(v))]}
          size="fs-11"
          className="self-start"
        />
        <Card className="flex flex-col">
          <H icon={IndianRupee}>Revenue by plant</H>
          <BarChart width={268} height={300} data={chart} margin={{ top: 10, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e9e2" vertical={false} />
            <XAxis dataKey="y" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Solvent" stackId="a" fill={pal.p} isAnimationActive={anim} />
            <Bar dataKey="Feed" stackId="a" fill={pal.s} radius={[4, 4, 0, 0]} isAnimationActive={anim} />
          </BarChart>
          <Note className="mt-auto">Crude oil contributes ≈38% of revenue at full capacity.</Note>
        </Card>
      </div>
    </Page>
  );
}

export const DPR3: SlideDef[] = [
  { title: "Packaging, Warehousing & Logistics", part: "B", section: SEC.s5, C: Logistics },
  { title: "Land Use & Plant Layout", part: "B", section: SEC.s6, C: Layout },
  { title: "Storage, Power & Utilities", part: "B", section: SEC.s6, C: Utilities },
  { title: "Solar Power Integration", part: "B", section: SEC.s6, C: Solar },
  { title: "Organisation Structure", part: "B", section: SEC.s7, C: Org },
  { title: "Manpower Plan", part: "B", section: SEC.s7, C: Manpower },
  { title: "Project Cost Estimate", part: "B", section: SEC.s8, C: ProjectCost },
  { title: "Means of Finance", part: "B", section: SEC.s8, C: Finance },
  { title: "Raw-Material Cost Projections", part: "B", section: SEC.s8, C: RMProjection },
  { title: "Revenue Projections", part: "B", section: SEC.s8, C: RevenueProjection },
];
