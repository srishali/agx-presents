import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bird,
  Boxes,
  Check,
  ClipboardCheck,
  Cog,
  Droplet,
  Droplets,
  Egg,
  Factory,
  Flame,
  FlaskConical,
  Gauge,
  Handshake,
  Layers,
  Leaf,
  MapPin,
  Microscope,
  Milk,
  Package,
  Recycle,
  Scale,
  Scan,
  ShieldCheck,
  Sprout,
  Thermometer,
  Truck,
  Warehouse,
  Wheat,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { IMG } from "../assets/images";
import { usePalette, useSettings } from "../brand/BrandContext";
import { Bullets, Card, DataTable, H, Note, Page, Photo, Pill } from "../components/ui";
import { RM, nf } from "../data";
import { SEC, useAnim, type SlideDef } from "../deck";

const Yes = () => <Check size={16} strokeWidth={3} className="mx-auto text-p" />;
const No = () => <X size={15} strokeWidth={3} className="mx-auto text-[#b4402a]/70" />;

/* ================================================== 21 Competitive landscape */
function Competition() {
  const { s } = useSettings();
  const rows: ReactNode[][] = [
    ["Multi-seed raw-material flexibility", "Partial", <No />, <Yes />],
    ["Captive DOC & oil for feed production", <No />, <No />, <Yes />],
    ["Product range", "Oil + meal", "Feed only", "Oil, protein foods & feed"],
    ["Shared utilities, storage & laboratory", <No />, <No />, <Yes />],
    ["Food-grade value-added protein (flour, chunks)", "Limited", <No />, <Yes />],
    ["Captive renewable power", "Rare", "Rare", "3 MW solar"],
    ["Institutional & export readiness", "Partial", "Limited", <Yes />],
  ];
  const diff = [
    { i: ShieldCheck, t: "Quality assurance", d: "Top-grade raw material, rigorous testing and advanced technology build credibility over less consistent brands." },
    { i: Handshake, t: "Brand trust & loyalty", d: "Consistent DOC, feed and protein quality drives repeat purchase and word-of-mouth." },
    { i: Leaf, t: "Sustainability practices", d: "Energy-efficient technology, solar power and recyclable packaging appeal to eco-aware buyers." },
    { i: MapPin, t: "Location & supply chain", d: "Proximity to raw material and markets lowers logistics cost and speeds delivery." },
  ];
  return (
    <Page
      kicker="Competitive Analysis"
      title="Differentiated through integration in a competitive industry"
      subtitle="The edible-oil and feed industries are intensely competitive; integration, quality and location give the project a structural edge."
    >
      <div className="flex h-full flex-col gap-3">
        <DataTable
          head={["Parameter", "Standalone solvent plant", "Standalone feed mill", `${s.company.short} integrated complex`]}
          align={["l", "c", "c", "c"]}
          widths={["34%", "20%", "20%", "26%"]}
          rows={rows}
          size="fs-12h"
        />
        <div className="resp-4 grid flex-1 grid-cols-4 gap-3">
          {diff.map((d) => (
            <Card key={d.t} tone="p" className="!p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-p text-white">
                  <d.i size={15} />
                </span>
                <span className="fs-13 font-bold text-p-ink">{d.t}</span>
              </div>
              <p className="mt-2.5 fs-12 leading-snug text-ink/75">{d.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ========================================================= 22 Crude oils */
function CrudeOils() {
  const oils: [string, string, string, string][] = [
    ["Soybean oil", "Soybean", "Rich in omega-3 and essential fatty acids; supports heart and brain health", "Cooking, frying and baking via refiners"],
    ["Mustard / rapeseed oil", "Mustard seed", "Pungent, MUFA-rich traditional North-Indian cooking medium", "Refiners, blenders, regional brands"],
    ["Sunflower oil", "Sunflower cake", "Light, neutral flavour; high in Vitamin E", "High-heat cooking, deep frying"],
    ["Groundnut oil", "Groundnut cake", "Natural aroma; MUFA-rich; long shelf life", "Frying, sautéing, dressings"],
    ["DDGS / rice-bran crude oil", "Maize DDGS, rice bran", "Industrial and feed-grade crude oil", "Industrial users, feed, biofuel"],
  ];
  return (
    <Page
      kicker="Product Portfolio"
      title="Crude edible oils — supplied in bulk to refiners and industry"
      subtitle="Oil recovered by solvent extraction is stored in stainless-steel tanks and dispatched by tanker to refiners and industrial consumers."
    >
      <div className="resp-2p grid h-full grid-cols-[340px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.pipes} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="font-head fs-48 leading-none font-extrabold text-s">43,450 T</div>
            <p className="mt-2 fs-13 leading-snug font-semibold text-white">
              Crude oil output per year at full capacity
            </p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <DataTable
            head={["Oil", "Source", "Key characteristics", "Applications / buyers"]}
            widths={["19%", "17%", "38%", "26%"]}
            rows={oils}
            size="fs-12"
          />
          <Card tone="paper" className="!p-3.5">
            <div className="flex items-center justify-between">
              <H icon={Droplets}>Crude oil output by source (TPA, full capacity)</H>
              <span className="font-head fs-14 font-extrabold text-p">43,450 T</span>
            </div>
            <div className="mt-3 flex h-8 overflow-hidden rounded">
              {[
                { n: "Soybean oil", v: 20900, c: "var(--c-p)" },
                { n: "Mustard oil", v: 17550, c: "var(--c-s)" },
                { n: "DDGS oil", v: 5000, c: "var(--c-p-soft)" },
              ].map((x) => (
                <div key={x.n} className="flex items-center justify-center fs-10h font-bold text-white" style={{ width: `${(x.v / 43450) * 100}%`, background: x.c }}>
                  {nf(x.v)} T
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-5 fs-11 text-ink/80">
              <span>Soybean oil ≈48%</span>
              <span>Mustard oil ≈40%</span>
              <span>DDGS oil ≈12%</span>
            </div>
          </Card>
          <div className="mt-auto grid grid-cols-4 gap-3">
            {[
              { i: Droplets, t: "Bulk tanker dispatch", d: "Food-grade SS tankers" },
              { i: Warehouse, t: "1,400 T oil tankage", d: "SS & solvent-plant tanks" },
              { i: FlaskConical, t: "Tested every batch", d: "FFA, moisture, colour" },
              { i: Factory, t: "Captive use in feed", d: "5,544 TPA feed-grade oil" },
            ].map((x) => (
              <div key={x.t} className="rc border border-line bg-white p-3">
                <x.i size={18} className="text-s-dark" />
                <div className="mt-1.5 fs-12 font-bold text-p-ink">{x.t}</div>
                <div className="fs-10h text-mute">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ==================================================== 23 High-protein foods */
function ProteinFoods() {
  const items: { n: string; p: number | null; d: string; a: string }[] = [
    { n: "Soya DOC", p: 47, d: "Defatted soya meal", a: "Food fortification, health supplements, premium feed" },
    { n: "Soya DOC Hi-Pro", p: 50, d: "Premium dehulled soya meal", a: "High-protein diets, food fortification" },
    { n: "Soya Flour", p: 54, d: "Fine flour from defatted soybean (high- & low-fat)", a: "Bread, biscuits, snacks; binding agent" },
    { n: "Soya Chunks", p: 54, d: "Textured soy protein", a: "Plant-based meat substitute; mid-day meals" },
    { n: "Untoasted Soya DOC", p: null, d: "Low-heat processed white flakes", a: "Feedstock for food-grade flour & protein" },
    { n: "Sunflower DOC", p: null, d: "By-product of sunflower extraction", a: "Protein ingredient for specialty diets & feed" },
    { n: "Groundnut DOC", p: null, d: "By-product of groundnut extraction", a: "High-protein health foods & feed" },
  ];
  return (
    <Page
      kicker="Product Portfolio"
      title="High-protein foods — 47% to 54% protein for human nutrition"
      subtitle="Protein-rich soya and seed-based products crafted from top-grade raw material for households, food industry and nutrition programmes."
    >
      <div className="resp-2p grid h-full grid-cols-[1fr_1.45fr] gap-5">
        <div className="flex flex-col gap-3">
          <Photo src={IMG.soya} className="min-h-0 flex-1" shade="bottom">
            <div className="flex h-full flex-col justify-end p-5">
              <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">Plant protein, made in UP</div>
              <p className="mt-1 fs-14 leading-snug font-semibold text-white">
                Affordable vegetarian protein for a nation that needs more of it.
              </p>
            </div>
          </Photo>
          <Card tone="s" className="!p-3.5">
            <div className="fs-12 font-bold text-p-ink">Mid-day meal & ICDS relevance</div>
            <p className="mt-1 fs-10h leading-snug text-ink/75">
              Soya chunks and soya flour are cost-effective protein sources for school feeding and supplementary
              nutrition programmes.
            </p>
          </Card>
        </div>
        <div className="overflow-hidden rc border border-line">
          <div className="grid grid-cols-[150px_150px_1fr] bg-p px-4 py-2 fs-9h font-semibold tracking-wider text-white uppercase">
            <span>Product</span>
            <span>Protein</span>
            <span>Description & applications</span>
          </div>
          {items.map((it, i) => (
            <div
              key={it.n}
              className={`grid grid-cols-[150px_150px_1fr] items-center border-t border-line px-4 py-[9px] ${i % 2 ? "bg-paper" : "bg-white"}`}
            >
              <span className="fs-12h font-bold text-p-ink">{it.n}</span>
              <span className="pr-4">
                {it.p ? (
                  <span className="flex items-center gap-2">
                    <span className="h-2 flex-1 rounded-full bg-line">
                      <span className="block h-2 rounded-full bg-p" style={{ width: `${(it.p / 60) * 100}%` }} />
                    </span>
                    <b className="w-9 fs-12 tabular text-p">{it.p}%</b>
                  </span>
                ) : (
                  <Pill tone="gray">Protein-rich</Pill>
                )}
              </span>
              <span>
                <span className="block fs-11h font-medium text-ink">{it.d}</span>
                <span className="block fs-10h text-mute">{it.a}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ========================================================== 24 Cattle feed */
function CattleFeed() {
  const cards = [
    {
      t: "Dairy Cattle Feed",
      p: "High milk yield, reproductive health and body condition",
      c: ["Energy: maize, barley, rice bran", "Protein: soybean meal, groundnut cake", "Minerals: Ca, P; vitamins A, D, E", "Additives: probiotics, enzymes"],
      b: ["Higher milk production", "Better fertility", "Stronger immunity"],
      f: "Pellet · Mash",
    },
    {
      t: "Non-Dairy Cattle Feed",
      p: "Weight gain and muscle development",
      c: ["Energy: maize, sorghum", "Protein: soybean meal, sunflower cake", "Growth & mineral supplements"],
      b: ["Faster growth", "Efficient feed conversion", "Healthy muscle & bone"],
      f: "Pellet · Mash",
    },
    {
      t: "Calf Starter & Grower",
      p: "Strong growth and immunity in young calves",
      c: ["Balanced protein & energy", "Vitamins for early development", "Highly digestible ingredients"],
      b: ["Healthy early growth", "Strong immune system", "Smooth transition to adult feed"],
      f: "Pellet",
    },
    {
      t: "Specialty Supplements",
      p: "Targeted nutrition for specific needs",
      c: ["Vitamin-mineral premixes", "Rumen buffers", "Probiotics"],
      b: ["Better rumen health", "Improved nutrient utilisation", "Corrects deficiencies"],
      f: "Powder · Granules",
    },
  ];
  return (
    <Page
      kicker="Product Portfolio"
      title="Cattle feed — nutrition for every stage of the dairy lifecycle"
      subtitle="Formulated with soya DOC, sunflower DOC, maize DDGS, maize and balanced micronutrients to improve milk output, growth and health."
    >
      <div className="flex h-full flex-col gap-3">
        <Photo src={IMG.feed} className="h-[118px] shrink-0" shade="left" pos="center 60%">
          <div className="flex h-full items-center justify-between px-6">
            <div>
              <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">74,000 TPA at full capacity</div>
              <p className="mt-1 font-head fs-18 font-bold text-white">Scientifically formulated · Pellet & mash</p>
            </div>
          </div>
        </Photo>
        <div className="grid flex-1 grid-cols-4 gap-3">
          {cards.map((c) => (
            <div key={c.t} className="flex flex-col rc border border-line bg-white p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-p text-white">
                  <Milk size={15} />
                </span>
                <span className="font-head fs-13 font-bold text-p-ink">{c.t}</span>
              </div>
              <p className="mt-2 fs-10h leading-snug font-medium text-ink/80">{c.p}</p>
              <div className="mt-2 fs-9 font-bold tracking-wider text-s-dark uppercase">Composition</div>
              <ul className="mt-1 space-y-0.5">
                {c.c.map((x) => (
                  <li key={x} className="fs-10h leading-snug text-mute">• {x}</li>
                ))}
              </ul>
              <div className="mt-2 fs-9 font-bold tracking-wider text-s-dark uppercase">Benefits</div>
              <Bullets items={c.b} size="fs-10h" gap="space-y-0.5" className="mt-1" />
              <div className="mt-auto pt-2">
                <Pill tone="s">{c.f}</Pill>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ========================================================= 25 Poultry feed */
function PoultryFeed() {
  const stages = [
    { t: "Starter", w: "0–3 weeks", d: "High protein 22–24% for rapid early growth" },
    { t: "Grower", w: "3–5 weeks", d: "Balanced energy & protein 20–22%" },
    { t: "Finisher", w: "5 weeks +", d: "Energy-rich for efficient weight gain" },
  ];
  const others = [
    { i: Egg, t: "Layer Feed", d: "Balanced protein, calcium, phosphorus & vitamins — higher egg output, stronger shells." },
    { i: Bird, t: "Breeder Feed", d: "Protein-rich, vitamin-mineral balanced — better fertility, hatchability & progeny." },
    { i: Sprout, t: "Pre-Starter / Chick Crumble", d: "Easily digestible nutrition — higher survival, early weight gain, immunity." },
    { i: FlaskConical, t: "Poultry Supplements", d: "Premixes, enzymes & probiotics — better feed utilisation and bird health." },
  ];
  return (
    <Page
      kicker="Product Portfolio"
      title="Poultry feed — stage-specific nutrition for broilers, layers & breeders"
      subtitle="Formulated for optimal growth, egg production and bird health, in pellet, mash and crumble forms."
    >
      <div className="resp-2p resp-2p grid h-full grid-cols-[320px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.poultry} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-6">
            <div className="font-head fs-44 leading-none font-extrabold text-s">1,11,000 T</div>
            <p className="mt-2 fs-13 leading-snug font-semibold text-white">Poultry feed per year at full capacity</p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <Card>
            <H icon={Bird}>Broiler feed programme</H>
            <div className="mt-3 flex">
              {stages.map((st, i) => (
                <div
                  key={st.t}
                  className="relative flex-1 py-3 pr-6 pl-7 text-white"
                  style={{
                    background: i === 1 ? "var(--c-p-dark)" : i === 2 ? "var(--c-p-ink)" : "var(--c-p)",
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)",
                    marginLeft: i ? -8 : 0,
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-head fs-15 font-bold">{st.t}</span>
                    <span className="fs-10 font-semibold text-s">{st.w}</span>
                  </div>
                  <div className="fs-10h text-white/80">{st.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Fast, uniform growth</Pill>
              <Pill>Strong immunity</Pill>
              <Pill>Improved FCR</Pill>
            </div>
          </Card>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {others.map((o) => (
              <div key={o.t} className="flex gap-3 rc border border-line bg-white p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-s-wash text-s-dark">
                  <o.i size={17} />
                </span>
                <div>
                  <div className="fs-12h font-bold text-p-ink">{o.t}</div>
                  <p className="mt-0.5 fs-10h leading-snug text-mute">{o.d}</p>
                </div>
              </div>
            ))}
          </div>
          <Card tone="p" className="!py-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 fs-10h font-semibold text-p-dark">
              <span className="font-bold tracking-wider text-s-dark uppercase">Key advantages</span>
              <span>✓ Scientifically formulated</span>
              <span>✓ Quality ingredients & additives</span>
              <span>✓ Immunity & growth</span>
              <span>✓ Pellet · mash · crumble</span>
              <span>✓ Life-stage specific</span>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ====================================================== 26 Specifications */
function Specs() {
  const meals: string[][] = [
    ["Soya DOC (47%)", "47.0", "12.0", "1.0", "6.0", "2.0"],
    ["Soya DOC Hi-Pro (50%)", "50.0", "12.0", "1.0", "3.5", "1.5"],
    ["Soya flour (54%, low-fat)", "54.0", "8.0", "1.0", "3.5", "0.5"],
    ["Soya chunks (54%)", "54.0", "8.0", "1.0", "3.5", "—"],
    ["Rapeseed meal", "36.0", "10.0", "1.0", "12.0", "2.5"],
  ];
  const feeds: string[][] = [
    ["Compound cattle feed", "BIS IS 2052", "Protein, fat, fibre, acid-insoluble ash, minerals by type"],
    ["Poultry feeds", "BIS IS 1374", "Protein, energy, calcium, phosphorus by stage"],
    ["Broiler starter (0–3 wks)", "Promoter spec", "Crude protein 22–24%"],
    ["Broiler grower (3–5 wks)", "Promoter spec", "Crude protein 20–22%"],
    ["Broiler finisher (5 wks +)", "Promoter spec", "Energy-dense for weight gain"],
  ];
  const certs = ["FSSAI Licence", "ISO 22000 / FSSC 22000", "ISO 9001", "HACCP", "BIS Certification", "GMP+ (feed exports)"];
  return (
    <Page
      kicker="Product Portfolio"
      title="Product specifications & quality standards"
      subtitle="Indicative specifications aligned with trade norms, FSSAI and BIS standards; final specifications as per buyer contracts."
    >
      <div className="flex h-full flex-col gap-3">
        <div className="resp-2 grid grid-cols-[1.15fr_1fr] gap-4">
          <div>
            <H icon={Scale} className="mb-2">Protein meals & foods (% , indicative)</H>
            <DataTable
              head={["Product", "Protein min", "Moisture max", "Oil max", "Fibre max", "Sand/silica max"]}
              align={["l", "r", "r", "r", "r", "r"]}
              widths={["30%", "14%", "14%", "13%", "13%", "16%"]}
              rows={meals}
            />
          </div>
          <div>
            <H icon={ClipboardCheck} className="mb-2">Compound feeds</H>
            <DataTable
              head={["Feed", "Standard", "Key parameters"]}
              widths={["32%", "22%", "46%"]}
              rows={feeds}
            />
          </div>
        </div>
        <Card tone="paper" className="mt-auto">
          <H icon={Award}>Certifications targeted</H>
          <div className="mt-3 grid grid-cols-6 gap-3">
            {certs.map((c) => (
              <div key={c} className="flex flex-col items-center rc border border-line bg-white px-2 py-3 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-s bg-s-wash text-s-dark">
                  <BadgeCheck size={20} />
                </span>
                <span className="mt-2 fs-11 leading-tight font-semibold text-p-ink">{c}</span>
              </div>
            ))}
          </div>
          <Note className="mt-3">
            Clear labelling and certifications (ISO, FSSAI) reassure customers about safety and authenticity; export
            consignments to follow importing-country norms.
          </Note>
        </Card>
      </div>
    </Page>
  );
}

/* ---------------------------------------------------------- flow helpers */
type StepT = { i: LucideIcon; t: string; d?: string };
function Chain({ steps, tone = "p", w }: { steps: StepT[]; tone?: "p" | "s" | "dark"; w?: number }) {
  const box =
    tone === "s"
      ? "bg-s-wash border-s/40"
      : tone === "dark"
        ? "bg-p-ink border-p-ink text-white"
        : "bg-white border-p/25";
  return (
    <div className="proc-chain flex items-stretch">
      {steps.map((st, i) => (
        <div key={st.t} className="flex items-stretch">
          <div className={`flex flex-col rc-sm border px-3 py-2.5 ${box}`} style={{ width: w }}>
            <st.i size={16} className={tone === "dark" ? "text-s" : tone === "s" ? "text-s-dark" : "text-p"} />
            <div className={`mt-1.5 fs-12 leading-tight font-bold ${tone === "dark" ? "text-white" : "text-p-ink"}`}>
              {st.t}
            </div>
            {st.d && (
              <div className={`mt-0.5 fs-10 leading-snug ${tone === "dark" ? "text-white/65" : "text-mute"}`}>{st.d}</div>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="flex w-5 items-center justify-center">
              <ArrowRight size={14} className="text-s" strokeWidth={2.6} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================================== 27 Solvent extraction */
function SolventProcess() {
  const meal: StepT[] = [
    { i: Truck, t: "Receiving", d: "Weighbridge, sampling" },
    { i: Wind, t: "Cleaning", d: "Destoning, magnets" },
    { i: Cog, t: "Cracking & dehulling", d: "Hulls for Hi-Pro" },
    { i: Thermometer, t: "Conditioning & flaking", d: "Uniform thin flakes" },
    { i: Droplet, t: "Solvent extraction", d: "Counter-current, hexane" },
    { i: Flame, t: "Desolventiser-toaster", d: "DTDC, dry & cool" },
    { i: Package, t: "Grinding & bagging", d: "Soya DOC 47 / 50%" },
  ];
  const oil: StepT[] = [
    { i: Droplets, t: "Miscella", d: "Oil + solvent" },
    { i: Flame, t: "Distillation & stripping", d: "Evaporators, stripper" },
    { i: Droplet, t: "Crude oil", d: "Cooled & filtered" },
    { i: Warehouse, t: "SS storage & dispatch", d: "Tankers to refiners" },
  ];
  const solv: StepT[] = [
    { i: Wind, t: "Vapour recovery", d: "Condensers, absorber" },
    { i: Recycle, t: "Hexane recycled", d: "Back to extractor" },
  ];
  const va: StepT[] = [
    { i: Layers, t: "White flakes", d: "Flash desolventising" },
    { i: Cog, t: "Milling & sifting", d: "Soya flour 54%" },
    { i: Zap, t: "Extrusion", d: "Texturisation" },
    { i: Package, t: "Drying & packing", d: "Soya chunks 54%" },
  ];
  const tech = [
    { v: "< 1%", l: "Residual oil in meal (design)" },
    { v: "≤ 2 L/T", l: "Hexane loss target" },
    { v: "PLC / DCS", l: "Automated process control" },
    { v: "Heat recovery", l: "Economiser & vapour re-use" },
  ];
  return (
    <Page
      kicker="Technology & Process"
      title="Solvent extraction — maximum oil recovery, food-grade protein"
      subtitle="Continuous counter-current extraction with integrated desolventising, oil distillation, solvent recovery and a value-added protein line."
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-1.5 fs-9h font-bold tracking-[0.16em] text-s-dark uppercase">A · Seed preparation & meal line</div>
          <Chain steps={meal} w={146} />
        </div>
        <div className="grid grid-cols-[auto_auto] justify-start gap-8">
          <div>
            <div className="mb-1.5 fs-9h font-bold tracking-[0.16em] text-s-dark uppercase">B · Oil line (from extractor)</div>
            <Chain steps={oil} tone="s" w={128} />
          </div>
          <div>
            <div className="mb-1.5 fs-9h font-bold tracking-[0.16em] text-s-dark uppercase">C · Solvent recovery loop</div>
            <Chain steps={solv} tone="s" w={128} />
          </div>
        </div>
        <div>
          <div className="mb-1.5 fs-9h font-bold tracking-[0.16em] text-s-dark uppercase">D · Value-added protein line</div>
          <Chain steps={va} tone="dark" w={146} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {tech.map((t) => (
            <div key={t.l} className="rc border border-line bg-paper px-3.5 py-2.5">
              <div className="font-head fs-18 font-extrabold text-p">{t.v}</div>
              <div className="fs-10h text-mute">{t.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ================================================== 28 Feed manufacturing */
function FeedProcess() {
  const pal = usePalette();
  const anim = useAnim();
  const r1: StepT[] = [
    { i: Truck, t: "Intake & storage", d: "Silos, bins" },
    { i: Cog, t: "Grinding", d: "Hammer mill" },
    { i: Scale, t: "Batching", d: "Auto dosing" },
    { i: Recycle, t: "Mixing", d: "Paddle mixer" },
    { i: Droplets, t: "Liquid addition", d: "Oil, molasses" },
    { i: Thermometer, t: "Conditioning", d: "Steam" },
  ];
  const r2: StepT[] = [
    { i: Gauge, t: "Pelleting", d: "Ring-die mill" },
    { i: Wind, t: "Cooling", d: "Counter-flow" },
    { i: Layers, t: "Crumbling", d: "Poultry feeds" },
    { i: Scan, t: "Screening", d: "Fines recycled" },
    { i: Package, t: "Packing", d: "25 / 50 kg bags" },
    { i: Truck, t: "Dispatch", d: "Dealers, farms" },
  ];
  const feedRM = RM.filter((r) => r.seg === "feed").sort((a, b) => b.qty - a.qty);
  const tot = feedRM.reduce((a, r) => a + r.qty, 0);
  return (
    <Page
      kicker="Technology & Process"
      title="Feed manufacturing — 500 TPD of precision-formulated feed"
      subtitle="Automated batching, steam conditioning and pelleting deliver consistent nutrition, hygiene and pellet durability."
    >
      <div className="resp-2 grid h-full grid-cols-[1fr_330px] gap-4">
        <div className="flex flex-col gap-3">
          <Card tone="paper" className="!p-3.5">
            <div className="mb-2 fs-9h font-bold tracking-[0.16em] text-s-dark uppercase">Process flow</div>
            <Chain steps={r1} w={110} />
            <div className="my-1.5 flex justify-end pr-10">
              <span className="fs-14 text-s">↓</span>
            </div>
            <Chain steps={r2} w={110} tone="s" />
          </Card>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {[
              { i: FlaskConical, t: "Least-cost formulation", d: "Software-driven recipes balance nutrition and cost for every life stage." },
              { i: Boxes, t: "Automated batching (PLC)", d: "Accurate micro-dosing of premixes, minerals and additives." },
              { i: Gauge, t: "Pellet quality control", d: "Moisture, hardness and pellet durability index checked every shift." },
              { i: ShieldCheck, t: "Segregated lines", d: "Separate cattle and poultry lines prevent cross-contamination." },
            ].map((x) => (
              <div key={x.t} className="flex gap-3 rc border border-line bg-white p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-p-wash text-p">
                  <x.i size={17} />
                </span>
                <div>
                  <div className="fs-12 font-bold text-p-ink">{x.t}</div>
                  <p className="mt-0.5 fs-10h leading-snug text-mute">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card className="flex flex-col">
          <H icon={Wheat}>Feed input mix (TPA)</H>
          <div className="relative mx-auto">
            <PieChart width={220} height={200}>
              <Pie data={feedRM} dataKey="qty" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={1.5} stroke="none" isAnimationActive={anim}>
                {feedRM.map((r, i) => (
                  <Cell key={r.name} fill={pal.chart[i]} />
                ))}
              </Pie>
            </PieChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-head fs-18 font-extrabold text-p-ink">{nf(tot)}</div>
              <div className="fs-9 text-mute">tonnes / year</div>
            </div>
          </div>
          <div className="mt-1 space-y-1.5">
            {feedRM.map((r, i) => (
              <div key={r.name} className="flex items-center gap-2 fs-10h">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: pal.chart[i] }} />
                <span className="flex-1 text-ink">{r.name}</span>
                <span className="font-semibold tabular text-p-ink">{nf(r.qty)}</span>
                <span className="w-10 text-right tabular text-mute">{((r.qty / tot) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

/* ================================================ 29 Raw-material sourcing */
function Sourcing() {
  const src: Record<string, string> = {
    "Soya Beans": "MP, Maharashtra, Rajasthan, UP",
    "Mustard Seed": "UP, Rajasthan, MP, Haryana",
    "Maize DDGS": "Grain-based distilleries",
    Grains: "UP & Bihar maize belts",
    Fillers: "Rice & wheat mills (bran)",
    "Minerals / Vitamins / Premix": "Approved suppliers",
    "Crude Oil (feed grade)": "Captive / market",
    "DOC / De-oiled Cakes": "Captive / market",
  };
  return (
    <Page
      kicker="Raw Material & Procurement"
      title="Assured raw-material supply with strong farmer linkages"
      subtitle="About 3.81 lakh tonnes of oilseed, cake, DDGS, grain and feed ingredients procured each year at full capacity."
    >
      <div className="resp-2p grid h-full grid-cols-[300px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.soyfield} className="h-full" shade="bottom">
          <div className="flex h-full flex-col justify-end p-5">
            <div className="font-head fs-40 leading-none font-extrabold text-s">20+ yrs</div>
            <p className="mt-2 fs-12h leading-snug font-semibold text-white">
              Promoter experience in oilseed procurement with trusted supplier networks
            </p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <DataTable
            compact
            head={["Raw material", "Plant", "Qty (TPA)", "Price (₹/T)", "Likely sourcing"]}
            align={["l", "l", "r", "r", "l"]}
            widths={["28%", "12%", "14%", "14%", "32%"]}
            rows={RM.map((r) => [r.name, r.seg === "solvent" ? "Solvent" : "Feed", nf(r.qty), nf(r.price), src[r.name] ?? "—"])}
            foot={["Total", "", nf(RM.reduce((a, r) => a + r.qty, 0)), "", ""]}
          />
          <div className="grid flex-1 grid-cols-4 gap-3">
            {[
              { i: Handshake, t: "Direct & FPO procurement", d: "Mandi, FPO and aggregator tie-ups in the catchment" },
              { i: Microscope, t: "Quality gate", d: "Moisture, oil, protein & purity tested at intake" },
              { i: Warehouse, t: "Buffer storage", d: "8,100 T silos absorb seasonal arrivals" },
              { i: Scale, t: "Price-risk management", d: "Multi-seed sourcing and forward contracts" },
            ].map((x) => (
              <div key={x.t} className="rc border border-line bg-white p-3">
                <x.i size={18} className="text-p" />
                <div className="mt-1.5 fs-11h leading-tight font-bold text-p-ink">{x.t}</div>
                <p className="mt-1 fs-10 leading-snug text-mute">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ===================================================== 30 Quality assurance */
function Quality() {
  const stages = [
    { t: "Inward", i: Truck, items: ["Moisture & foreign matter", "Oil content & protein", "Free fatty acids", "Aflatoxin screening", "Sand & silica"] },
    { t: "In-process", i: Cog, items: ["Residual oil in meal", "Residual hexane", "Urease activity / PDI", "Pellet durability", "Steam & temperature logs"] },
    { t: "Finished product", i: Package, items: ["Protein, fibre, moisture", "Microbiology (food grade)", "Packaging integrity", "Labelling & batch coding", "Retention samples"] },
  ];
  const lab = ["NIR analyser", "Kjeldahl protein", "Soxhlet oil extraction", "Moisture analysers", "Aflatoxin test kits", "Microbiology section"];
  return (
    <Page
      kicker="Quality Assurance"
      title="Quality built in — from inward lot to finished bag"
      subtitle="An in-house laboratory with 18 QC professionals governs every stage, targeting FSSAI, ISO and export-grade food-safety compliance."
    >
      <div className="grid h-full grid-cols-[320px_minmax(0,1fr)] gap-5">
        <Photo src={IMG.lab} className="h-full" shade="bottom" pos="60% center">
          <div className="flex h-full flex-col justify-end p-5">
            <div className="fs-10 font-bold tracking-[0.2em] text-s uppercase">In-house laboratory</div>
            <p className="mt-1 fs-14 leading-snug font-semibold text-white">
              Only materials meeting strict parameters are approved for processing.
            </p>
          </div>
        </Photo>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {stages.map((s, idx) => (
              <div key={s.t} className="overflow-hidden rc border border-line bg-white">
                <div className={`flex items-center gap-2 px-3.5 py-2.5 text-white ${idx === 0 ? "bg-p" : idx === 1 ? "bg-p-dark" : "bg-p-ink"}`}>
                  <s.i size={16} className="text-s" />
                  <span className="fs-12h font-bold">
                    {idx + 1}. {s.t}
                  </span>
                </div>
                <div className="p-3.5">
                  <Bullets items={s.items} size="fs-11" gap="space-y-1" />
                </div>
              </div>
            ))}
          </div>
          <Card tone="paper">
            <H icon={Microscope}>Laboratory infrastructure</H>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {lab.map((l) => (
                <div key={l} className="flex items-center gap-2 rc-sm border border-line bg-white px-2.5 py-2 fs-11 font-medium text-ink">
                  <FlaskConical size={13} className="text-s-dark" /> {l}
                </div>
              ))}
            </div>
          </Card>
          <Card tone="p" className="mt-auto !py-3">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="shrink-0 text-p" />
              <p className="fs-11h leading-snug text-ink/85">
                <b>Food-safety system:</b> GMP, HACCP-based controls, pest management, traceability by batch and
                periodic third-party audits towards ISO 22000 / FSSC 22000 certification.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

export const DPR2: SlideDef[] = [
  { title: "Competitive Landscape", part: "B", section: SEC.s3, C: Competition },
  { title: "Crude Edible Oils", part: "B", section: SEC.s4, C: CrudeOils },
  { title: "High-Protein Food Products", part: "B", section: SEC.s4, C: ProteinFoods },
  { title: "Cattle Feed Range", part: "B", section: SEC.s4, C: CattleFeed },
  { title: "Poultry Feed Range", part: "B", section: SEC.s4, C: PoultryFeed },
  { title: "Specifications & Standards", part: "B", section: SEC.s4, C: Specs },
  { title: "Solvent Extraction Process", part: "B", section: SEC.s5, C: SolventProcess },
  { title: "Feed Manufacturing Process", part: "B", section: SEC.s5, C: FeedProcess },
  { title: "Raw-Material Sourcing", part: "B", section: SEC.s5, C: Sourcing },
  { title: "Quality Assurance", part: "B", section: SEC.s5, C: Quality },
];
