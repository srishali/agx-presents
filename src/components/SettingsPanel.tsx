import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Building,
  Check,
  Download,
  FileImage,
  FileText,
  Landmark,
  Palette,
  Phone,
  Presentation,
  Printer,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
  TriangleAlert,
  Type,
  Upload,
  X,
  Braces,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { useSettings } from "../brand/BrandContext";
import { isHex } from "../brand/color";
import {
  DEFAULTS,
  FONTS,
  PAPERS,
  PRESET_COLORS,
  THEMES,
  TYPE_SETS,
  brandSubline,
  deriveShort,
  mergeSettings,
  paperOptions,
  type PaperKey,
  type Settings,
} from "../brand/settings";
import { COST_TOTAL } from "../data";
import { SLIDES } from "../slides";
import { exportSettingsJson } from "../export";
import { LogoMark } from "./Logo";

const input =
  "w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[12.5px] text-neutral-900 outline-none transition focus:border-[var(--c-p)] focus:ring-2 focus:ring-[var(--c-p)]/15";
const btnGhost =
  "flex items-center justify-center gap-1.5 rounded-md border border-neutral-300 px-3 py-2 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-50";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold tracking-wide text-neutral-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10.5px] leading-snug text-neutral-400">{hint}</span>}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-left text-[12.5px] text-neutral-800 hover:bg-neutral-50"
    >
      {label}
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-[var(--c-p)]" : "bg-neutral-300"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [txt, setTxt] = useState(value);
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHex(value) ? value : "#000000"}
          onChange={(e) => {
            onChange(e.target.value.toUpperCase());
            setTxt(e.target.value.toUpperCase());
          }}
          className="h-8 w-11 cursor-pointer rounded-md border border-neutral-300 bg-white p-0.5"
        />
        <input
          className={input + " font-mono uppercase"}
          value={txt}
          onChange={(e) => {
            setTxt(e.target.value);
            if (isHex(e.target.value)) onChange(e.target.value.toUpperCase());
          }}
        />
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((c) => (
          <button
            key={c.name}
            type="button"
            title={`${c.name} · ${c.hex}`}
            onClick={() => {
              onChange(c.hex);
              setTxt(c.hex);
            }}
            className={`h-5 w-5 rounded-full shadow ring-1 transition ${value.toUpperCase() === c.hex ? "ring-2 ring-neutral-900 ring-offset-1" : "ring-neutral-200"}`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </Field>
  );
}

function UploadBox({
  label,
  hint,
  value,
  onChange,
  small = false,
}: {
  label: string;
  hint: string;
  value: string | null;
  onChange: (v: string | null) => void;
  small?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 p-3">
      <div className="flex items-center gap-3">
        <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-50 ${small ? "h-11 w-16" : "h-16 w-24"}`}>
          {value ? <img src={value} alt="" className="max-h-full max-w-full object-contain" /> : <ImageIcon size={18} className="text-neutral-400" />}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <button type="button" onClick={() => ref.current?.click()} className="rounded-md bg-[var(--c-p)] px-3 py-1.5 text-[12px] font-semibold text-white">
            {value ? "Replace" : "Upload"} {label}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="rounded-md border border-neutral-300 px-3 py-1 text-[11.5px] text-neutral-600">
              Remove
            </button>
          )}
        </div>
      </div>
      <div className="mt-1.5 text-[10.5px] leading-snug text-neutral-400">{hint}</div>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > (small ? 1.5 : 3) * 1024 * 1024) {
            alert(`Please use a file smaller than ${small ? "1.5" : "3"} MB.`);
            return;
          }
          const r = new FileReader();
          r.onload = () => onChange(String(r.result));
          r.readAsDataURL(f);
        }}
      />
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div>
        <div className="text-[10.5px] font-bold tracking-[0.16em] text-neutral-400 uppercase">{title}</div>
        {desc && <div className="mt-0.5 text-[11px] leading-snug text-neutral-500">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

type Tab = "company" | "contact" | "content" | "brand" | "type" | "export" | "finance" | "advanced";

const TABS: Record<Tab, { label: string; icon: typeof Building; hint: string }> = {
  company: { label: "Company", icon: Building, hint: "Identity & statutory details" },
  contact: { label: "Contact", icon: Phone, hint: "People & reachability" },
  content: { label: "Content", icon: FileText, hint: "Labels, headings & dates" },
  brand: { label: "Brand", icon: Palette, hint: "Logo, colours & images" },
  type: { label: "Type", icon: Type, hint: "Fonts & formatting" },
  export: { label: "Export", icon: Download, hint: "Paper size & formats" },
  finance: { label: "Finance", icon: Landmark, hint: "Currency & funding" },
  advanced: { label: "Admin", icon: Braces, hint: "Backup, JSON & reset" },
};

const GROUPS: { label: string; items: Tab[] }[] = [
  { label: "Content", items: ["company", "contact", "content"] },
  { label: "Branding", items: ["brand", "type"] },
  { label: "Output", items: ["export", "finance"] },
  { label: "System", items: ["advanced"] },
];

export function SettingsPanel({
  open,
  onClose,
  onExport,
  onPrint,
}: {
  open: boolean;
  onClose: () => void;
  onExport: (kind: "pptx" | "docx" | "images") => void;
  onPrint: () => void;
}) {
  const { s, setS } = useSettings();
  const [tab, setTab] = useState<Tab>("company");
  const [msg, setMsg] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [json, setJson] = useState(() => JSON.stringify(s, null, 2));

  const totalPages = SLIDES.length;
  const partAPages = SLIDES.filter((x) => x.part === "A").length;

  useEffect(() => {
    if (open && tab === "advanced") setJson(JSON.stringify(s, null, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab]);

  const up =
    <K extends keyof Settings>(sec: K) =>
    (patch: Partial<Settings[K]>) =>
      setS((p) => ({ ...p, [sec]: { ...(p[sec] as object), ...patch } }) as Settings);

  const contact = up("contact");
  const brand = up("brand");
  const type = up("type");
  const pres = up("pres");
  const finance = up("finance");
  const labels = up("labels");
  const exp = up("export");

  /* the legal name also drives the logo wordmark, unless the user overrides it */
  const setName = (v: string) =>
    setS((p) => ({
      ...p,
      company: { ...p.company, name: v, short: p.brand.shortAuto ? deriveShort(v) : p.company.short },
    }) as Settings);
  const setShort = (v: string) =>
    setS((p) => ({ ...p, company: { ...p.company, short: v }, brand: { ...p.brand, shortAuto: false } }) as Settings);
  const syncShort = () =>
    setS((p) => ({ ...p, company: { ...p.company, short: deriveShort(p.company.name) }, brand: { ...p.brand, shortAuto: true } }));
  const setField =
    (key: keyof Settings["company"]) =>
    (v: string) =>
      setS((p) => {
        const next = { ...p, company: { ...p.company, [key]: v } } as Settings;
        // keep the cover eyebrow in step with the State, unless it was customised
        if (key === "state" && p.pres.eyebrow === `Investment Proposal · Government of ${p.company.state}`) {
          next.pres = { ...p.pres, eyebrow: `Investment Proposal · Government of ${v}` };
        }
        return next;
      });

  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 3200);
  };

  const paper = paperOptions(s.export.paper, s.export.orientation);
  const finTotal = s.finance.equity + s.finance.debt;
  const gap = finTotal - COST_TOTAL;
  const subline = useMemo(() => brandSubline(s.company.name, s.company.short), [s.company.name, s.company.short]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <aside className="relative flex h-full w-[860px] max-w-[97vw] flex-col bg-neutral-50 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--c-p)] text-white">
              <Settings2 size={17} />
            </span>
            <div>
              <div className="text-[14px] font-bold text-neutral-900">Presentation settings</div>
              <div className="text-[11px] text-neutral-500">Every change applies instantly and is saved in this browser</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100" aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* ------------------------------------------------ left dashboard nav */}
          <nav className="thin-scroll w-[218px] shrink-0 overflow-y-auto border-r border-neutral-200 bg-white px-2.5 py-3">
            {GROUPS.map((g) => (
              <div key={g.label} className="mb-4 last:mb-0">
                <div className="px-2 pb-1 text-[9.5px] font-bold tracking-[0.16em] text-neutral-400 uppercase">{g.label}</div>
                <div className="space-y-0.5">
                  {g.items.map((k) => {
                    const t = TABS[k];
                    const active = tab === k;
                    return (
                      <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${active ? "bg-[var(--c-p-wash)] ring-1 ring-[var(--c-p)]/25" : "hover:bg-neutral-50"}`}
                      >
                        <span className={`mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${active ? "bg-[var(--c-p)] text-white" : "bg-neutral-100 text-neutral-500"}`}>
                          <t.icon size={15} />
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-[12.5px] font-semibold ${active ? "text-[var(--c-p)]" : "text-neutral-800"}`}>{t.label}</span>
                          <span className="block truncate text-[10px] text-neutral-400">{t.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-[9.5px] font-bold tracking-[0.16em] text-neutral-400 uppercase">Live preview</div>
              <div className="mt-2 flex items-center gap-2">
                {s.brand.logo ? <img src={s.brand.logo} alt="" className="h-8 max-w-16 object-contain" /> : <LogoMark size={30} p={s.brand.primary} s={s.brand.secondary} />}
                <div className="min-w-0 leading-tight">
                  <div className="truncate font-head text-[13px] font-extrabold text-p-ink" style={{ fontFamily: "var(--f-head)" }}>
                    {s.company.short}
                  </div>
                  <div className="truncate text-[9px] tracking-[0.14em] text-neutral-500 uppercase">{subline}</div>
                </div>
              </div>
              <div className="mt-2 flex gap-1">
                <span className="h-4 flex-1 rounded-sm" style={{ background: s.brand.primary }} />
                <span className="h-4 w-4 rounded-sm" style={{ background: s.brand.secondary }} />
              </div>
            </div>
          </nav>

          {/* ------------------------------------------------------- tab body */}
          <div className="thin-scroll min-w-0 flex-1 overflow-y-auto px-6 py-5">
            {tab === "company" && (
              <div className="space-y-6">
                <Section title="Company identity" desc="Shown on the cover, every page header, the footer, and written into PowerPoint, Word and image exports.">
                  <Field label="Legal company name" hint="Editing this also updates the logo wordmark, unless you have set a custom short name.">
                    <input className={input} value={s.company.name} onChange={(e) => setName(e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Short name / wordmark">
                      <div className="flex gap-1.5">
                        <input className={input} value={s.company.short} onChange={(e) => setShort(e.target.value)} />
                        <button
                          title="Sync with company name"
                          onClick={syncShort}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-neutral-500 hover:bg-neutral-50"
                        >
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </Field>
                    <Field label="State addressed">
                      <input className={input} value={s.company.state} onChange={(e) => setField("state")(e.target.value)} />
                    </Field>
                  </div>
                  {s.brand.shortAuto ? (
                    <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--c-p)]">
                      <Check size={12} /> Wordmark follows the company name automatically
                    </div>
                  ) : (
                    <button onClick={syncShort} className="text-[11px] font-semibold text-[var(--c-p)]">
                      Re-link wordmark to the company name
                    </button>
                  )}
                  <Field label="Tagline" hint="Appears on the cover page and in document metadata.">
                    <input className={input} value={s.company.tagline} onChange={(e) => setField("tagline")(e.target.value)} />
                  </Field>
                </Section>
                <Section title="Statutory details">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="CIN">
                      <input className={input} value={s.company.cin} onChange={(e) => setField("cin")(e.target.value)} />
                    </Field>
                    <Field label="Constitution">
                      <input className={input} value={s.company.constitution} onChange={(e) => setField("constitution")(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Registered office">
                    <textarea className={input + " min-h-[54px]"} value={s.company.regOffice} onChange={(e) => setField("regOffice")(e.target.value)} />
                  </Field>
                  <Field label="Proposed plant location">
                    <input className={input} value={s.company.plantLocation} onChange={(e) => setField("plantLocation")(e.target.value)} />
                  </Field>
                </Section>
              </div>
            )}

            {tab === "contact" && (
              <div className="space-y-6">
                <Section title="Primary contact" desc="Shown on the closing page and in every export.">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Contact person">
                      <input className={input} value={s.contact.person} onChange={(e) => contact({ person: e.target.value })} />
                    </Field>
                    <Field label="Designation">
                      <input className={input} value={s.contact.designation} onChange={(e) => contact({ designation: e.target.value })} />
                    </Field>
                    <Field label="Phone">
                      <input className={input} value={s.contact.phone} onChange={(e) => contact({ phone: e.target.value })} />
                    </Field>
                    <Field label="Email">
                      <input className={input} value={s.contact.email} onChange={(e) => contact({ email: e.target.value })} />
                    </Field>
                    <Field label="Website">
                      <input className={input} value={s.contact.website} onChange={(e) => contact({ website: e.target.value })} />
                    </Field>
                    <Field label="Address (short)">
                      <input className={input} value={s.contact.address} onChange={(e) => contact({ address: e.target.value })} />
                    </Field>
                  </div>
                  <Toggle label="Show phone on closing page" checked={s.labels.showContactPhone} onChange={(v) => labels({ showContactPhone: v })} />
                  <Toggle label="Show email on closing page" checked={s.labels.showContactEmail} onChange={(v) => labels({ showContactEmail: v })} />
                  <Toggle label="Show website on closing page" checked={s.labels.showContactWeb} onChange={(v) => labels({ showContactWeb: v })} />
                </Section>
                <Section title="Key management" desc="The first person heads the organisation chart on page 35.">
                  {s.people.map((p, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 rounded-md border border-neutral-200 bg-white p-2">
                      <input
                        className={input}
                        value={p.name}
                        placeholder="Name"
                        onChange={(e) => setS((prev) => ({ ...prev, people: prev.people.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))}
                      />
                      <input
                        className={input}
                        value={p.role}
                        placeholder="Role"
                        onChange={(e) => setS((prev) => ({ ...prev, people: prev.people.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)) }))}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => setS((p) => ({ ...p, people: [...p.people, { name: "New director", role: "Director" }] }))} className={btnGhost}>
                      + Add a director
                    </button>
                    {s.people.length > 1 && (
                      <button
                        onClick={() => setS((p) => ({ ...p, people: p.people.slice(0, -1) }))}
                        className="flex items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                      >
                        Remove last
                      </button>
                    )}
                  </div>
                </Section>
              </div>
            )}

            {tab === "content" && (
              <div className="space-y-6">
                <Section title="Section labels" desc="Rename the two parts of the deck; used in navigation, page badges and exports.">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Part A label">
                      <input className={input} value={s.labels.partA} onChange={(e) => labels({ partA: e.target.value })} />
                    </Field>
                    <Field label="Part B label">
                      <input className={input} value={s.labels.partB} onChange={(e) => labels({ partB: e.target.value })} />
                    </Field>
                    <Field label="Part A short (navigation)">
                      <input className={input} value={s.labels.execShort} onChange={(e) => labels({ execShort: e.target.value })} />
                    </Field>
                    <Field label="Part B short (navigation)">
                      <input className={input} value={s.labels.dprShort} onChange={(e) => labels({ dprShort: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Overview line — Part A">
                      <input className={input} value={s.labels.highlightsLine} onChange={(e) => labels({ highlightsLine: e.target.value })} />
                    </Field>
                    <Field label="Overview line — Part B">
                      <input className={input} value={s.labels.reviewLine} onChange={(e) => labels({ reviewLine: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Contents page heading">
                    <input className={input} value={s.labels.tocTitle} onChange={(e) => labels({ tocTitle: e.target.value })} />
                  </Field>
                </Section>
                <Section title="Cover & closing">
                  <Field label="Cover headline">
                    <input className={input} value={s.pres.deckTitle} onChange={(e) => pres({ deckTitle: e.target.value })} />
                  </Field>
                  <Field label="Eyebrow line" hint="Shown on the cover and in the browser title.">
                    <input className={input} value={s.pres.eyebrow} onChange={(e) => pres({ eyebrow: e.target.value })} />
                  </Field>
                  <Field label="Closing sentence">
                    <input className={input} value={s.labels.closingLine} onChange={(e) => labels({ closingLine: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Contact heading">
                      <input className={input} value={s.labels.contactHeading} onChange={(e) => labels({ contactHeading: e.target.value })} />
                    </Field>
                    <Field label="Contact sub-heading">
                      <input className={input} value={s.labels.contactSub} onChange={(e) => labels({ contactSub: e.target.value })} />
                    </Field>
                  </div>
                </Section>
                <Section title="Presentation details">
                  <Field label="Submitted to (cover)">
                    <textarea className={input + " min-h-[48px]"} value={s.pres.preparedFor} onChange={(e) => pres({ preparedFor: e.target.value })} />
                  </Field>
                  <Field label="Audience">
                    <textarea className={input + " min-h-[48px]"} value={s.pres.audience} onChange={(e) => pres({ audience: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Date" hint="Blank = current month & year">
                      <input className={input} value={s.pres.date} placeholder="November 2026" onChange={(e) => pres({ date: e.target.value })} />
                    </Field>
                    <Field label="Confidentiality marking">
                      <input className={input} value={s.pres.confidentiality} onChange={(e) => pres({ confidentiality: e.target.value })} />
                    </Field>
                  </div>
                  <Toggle label="Show page numbers" checked={s.pres.showPageNo} onChange={(v) => pres({ showPageNo: v })} />
                  <Toggle label="Show footer" checked={s.pres.showFooter} onChange={(v) => pres({ showFooter: v })} />
                  <Toggle label="Show part badge" checked={s.pres.showPartBadge} onChange={(v) => pres({ showPartBadge: v })} />
                </Section>
              </div>
            )}

            {tab === "brand" && (
              <div className="space-y-6">
                <Section title="Theme presets" desc="Apply a coordinated colour pair and font set in one click.">
                  <div className="grid grid-cols-3 gap-2">
                    {THEMES.map((t) => {
                      const active = s.brand.primary === t.primary && s.brand.secondary === t.secondary;
                      return (
                        <button
                          key={t.name}
                          onClick={() => {
                            const set = TYPE_SETS.find((x) => x.k === t.set)!;
                            setS((p) => ({ ...p, brand: { ...p.brand, primary: t.primary, secondary: t.secondary }, type: { ...p.type, head: set.head, body: set.body } }));
                          }}
                          className={`rounded-lg border p-2 text-left transition ${active ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"}`}
                        >
                          <div className="flex gap-1">
                            <span className="h-5 flex-1 rounded-sm" style={{ background: t.primary }} />
                            <span className="h-5 w-5 rounded-sm" style={{ background: t.secondary }} />
                          </div>
                          <div className="mt-1.5 text-[10px] leading-tight font-semibold text-neutral-700">{t.name}</div>
                          <div className="text-[9.5px] text-neutral-400">{t.set}</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>
                <Section title="Brand colours">
                  <ColorField label="Primary colour" value={s.brand.primary} onChange={(v) => brand({ primary: v })} />
                  <ColorField label="Secondary colour" value={s.brand.secondary} onChange={(v) => brand({ secondary: v })} />
                  <button
                    onClick={() => brand({ primary: DEFAULTS.brand.primary, secondary: DEFAULTS.brand.secondary })}
                    className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--c-p)]"
                  >
                    <RotateCcw size={12} /> Restore Pantone 356 C / Pantone 7563 C
                  </button>
                </Section>
                <Section title="Logo" desc="PNG, JPEG, SVG or WebP. Transparent PNG or SVG recommended; max 1.5 MB.">
                  <UploadBox label="logo" hint="Appears in the top-right corner of content pages and on the cover and closing pages." value={s.brand.logo} onChange={(v) => brand({ logo: v })} small />
                  <div className="flex items-center gap-3 rounded-md bg-white p-2">
                    <span className="text-[10.5px] font-semibold text-neutral-500">Default mark</span>
                    <LogoMark size={30} p={s.brand.primary} s={s.brand.secondary} />
                  </div>
                  <Toggle label="Show logo on content pages" checked={s.brand.showLogoOnSlides} onChange={(v) => brand({ showLogoOnSlides: v })} />
                  <Toggle label="Show brand name next to the logo" checked={s.brand.showWordmark} onChange={(v) => brand({ showWordmark: v })} />
                </Section>
                <Section title="Photography & graphics" desc="Background images for the cover and closing pages, or upload your own.">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Cover background">
                      <select className={input} value={s.brand.coverStyle} onChange={(e) => brand({ coverStyle: e.target.value })}>
                        {BG_OPTIONS.map((o) => (
                          <option key={o.k} value={o.k}>
                            {o.l}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Closing background">
                      <select className={input} value={s.brand.closingStyle} onChange={(e) => brand({ closingStyle: e.target.value })}>
                        {BG_OPTIONS.map((o) => (
                          <option key={o.k} value={o.k}>
                            {o.l}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <UploadBox label="graphic" hint="Used when 'Uploaded graphic' is selected. Landscape images work best (1600 px wide or more)." value={s.brand.customGraphic} onChange={(v) => brand({ customGraphic: v })} />
                  <Field label={`Image overlay — ${s.brand.overlay}%`} hint="Higher values darken the photograph so text stays legible.">
                    <input type="range" min={40} max={97} value={s.brand.overlay} onChange={(e) => brand({ overlay: Number(e.target.value) })} className="w-full accent-[var(--c-p)]" />
                  </Field>
                </Section>
              </div>
            )}

            {tab === "type" && (
              <div className="space-y-6">
                <Section title="Font sets" desc="Curated pairings used in consulting and government decks.">
                  <div className="grid grid-cols-2 gap-2">
                    {TYPE_SETS.map((t) => (
                      <button
                        key={t.k}
                        onClick={() => type({ head: t.head, body: t.body })}
                        className={`rounded-lg border p-2.5 text-left ${s.type.head === t.head && s.type.body === t.body ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"}`}
                      >
                        <div className="text-[16px] text-neutral-900" style={{ fontFamily: `"${t.head}", sans-serif` }}>
                          Aa Heading
                        </div>
                        <div className="text-[11.5px] text-neutral-500" style={{ fontFamily: `"${t.body}", sans-serif` }}>
                          Body text · 54% protein
                        </div>
                        <div className="mt-1 text-[9.5px] font-semibold text-neutral-400">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </Section>
                <Section title="Typography">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Heading font">
                      <select className={input} value={s.type.head} onChange={(e) => type({ head: e.target.value })}>
                        {FONTS.map((f) => (
                          <option key={f.name} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Body font">
                      <select className={input} value={s.type.body} onChange={(e) => type({ body: e.target.value })}>
                        {FONTS.map((f) => (
                          <option key={f.name} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Heading weight">
                    <select className={input} value={s.type.headWeight} onChange={(e) => type({ headWeight: Number(e.target.value) })}>
                      <option value={500}>Medium — 500</option>
                      <option value={600}>Semi-bold — 600</option>
                      <option value={700}>Bold — 700</option>
                      <option value={800}>Extra-bold — 800</option>
                    </select>
                  </Field>
                  <Field label={`Text size — ${Math.round(s.type.scale * 100)}%`} hint="88–106% is the safe range for the densest pages.">
                    <input type="range" min={0.88} max={1.12} step={0.01} value={s.type.scale} onChange={(e) => type({ scale: Number(e.target.value) })} className="w-full accent-[var(--c-p)]" />
                  </Field>
                  <Field label={`Corner radius — ${s.type.radius}px`}>
                    <input type="range" min={0} max={22} step={1} value={s.type.radius} onChange={(e) => type({ radius: Number(e.target.value) })} className="w-full accent-[var(--c-p)]" />
                  </Field>
                </Section>
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="text-[22px] text-neutral-900" style={{ fontWeight: s.type.headWeight, fontFamily: "var(--f-head)" }}>
                    Integrated agro-processing
                  </div>
                  <p className="mt-1 text-[12.5px] text-neutral-600" style={{ fontFamily: "var(--f-body)" }}>
                    Live preview — 1,200 TPD capacity, 505 direct jobs and a 3 MW captive solar plant, all in {s.company.state}.
                  </p>
                </div>
              </div>
            )}

            {tab === "export" && (
              <div className="space-y-6">
                <Section title="Paper size" desc="The deck is designed at 16:9 and is fitted to whichever format you choose. PowerPoint export always uses widescreen 16:9.">
                  <Field label="Page format">
                    <select className={input} value={s.export.paper} onChange={(e) => exp({ paper: e.target.value as PaperKey })}>
                      {(Object.keys(PAPERS) as PaperKey[]).map((k) => (
                        <option key={k} value={k}>
    {PAPERS[k].name} — {PAPERS[k].note}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Orientation">
                      <select className={input} value={s.export.orientation} onChange={(e) => exp({ orientation: e.target.value as Settings["export"]["orientation"] })}>
                        <option value="auto">Follow format</option>
                        <option value="landscape">Landscape</option>
                        <option value="portrait">Portrait</option>
                      </select>
                    </Field>
                    <div className="flex items-start gap-2 rounded-md bg-white p-2.5 text-[11px] leading-snug text-neutral-600 ring-1 ring-neutral-200">
                      <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm bg-[var(--c-p)]" />
                      <span><b>Adaptive layout:</b> the deck is designed at 16:9 and reflows to the chosen page — portrait pages stack sections, type and charts scale, and the screen view adapts to your window.</span>
                    </div>
                    <Field label="Margin">
                      <select className={input} value={s.export.pdfMargin} onChange={(e) => exp({ pdfMargin: Number(e.target.value) as 0 | 6 | 10 })}>
                        <option value={0}>None</option>
                        <option value={6}>6 mm</option>
                        <option value={10}>10 mm</option>
                      </select>
                    </Field>
                  </div>
                  <div className="flex items-start gap-2 rounded-md bg-white p-2.5 text-[11px] leading-snug text-neutral-600 ring-1 ring-neutral-200">
                    <Printer size={14} className="mt-0.5 shrink-0 text-[var(--c-p)]" />
                    <span>
                      Output: <b>{paper.name}</b> · {paper.w} × {paper.h} px · {Math.round((paper.w / 96) * 25.4)} × {Math.round((paper.h / 96) * 25.4)} mm. Use{" "}
                      <b>Page view</b> in the header to preview exactly what prints.
                    </span>
                  </div>
                  <Toggle label="Include cover & closing pages in exports" checked={s.export.includeCover} onChange={(v) => exp({ includeCover: v })} />
                  <Field label="Slide image format">
                    <select className={input} value={s.export.imageFormat} onChange={(e) => exp({ imageFormat: e.target.value as "png" | "jpeg" | "webp" })}>
                      <option value="png">PNG — best quality, larger files</option>
                      <option value="jpeg">JPEG — smaller files</option>
                      <option value="webp">WebP — smallest files</option>
                    </select>
                  </Field>
                </Section>

                <Section title="Export the deck" desc="Every export uses the company name, colours and fonts set above.">
                  <button onClick={onPrint} className="flex w-full items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left hover:border-[var(--c-p)]">
                    <FileText size={18} className="mt-0.5 shrink-0 text-[var(--c-p)]" />
                    <span>
                      <span className="block text-[12.5px] font-bold text-neutral-900">PDF — print-ready, exact paper size</span>
                      <span className="block text-[11px] leading-snug text-neutral-500">Opens the print dialog with {paper.name}. Choose "Save as PDF" and keep "Background graphics" on.</span>
                    </span>
                  </button>
                  <button onClick={() => onExport("pptx")} className="flex w-full items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left hover:border-[var(--c-p)]">
                    <Presentation size={18} className="mt-0.5 shrink-0 text-[var(--c-p)]" />
                    <span>
                      <span className="block text-[12.5px] font-bold text-neutral-900">PowerPoint (.pptx) — editable</span>
                      <span className="block text-[11px] leading-snug text-neutral-500">Widescreen 16:9, branded master, section titles, key points and full speaker notes on every slide.</span>
                    </span>
                  </button>
                  <button onClick={() => onExport("docx")} className="flex w-full items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left hover:border-[var(--c-p)]">
                    <FileText size={18} className="mt-0.5 shrink-0 text-[var(--c-p)]" />
                    <span>
                      <span className="block text-[12.5px] font-bold text-neutral-900">Word (.docx) — report format</span>
                      <span className="block text-[11px] leading-snug text-neutral-500">Title page, contents and all {totalPages} pages as a structured, editable document for departmental notes.</span>
                    </span>
                  </button>
                  <button onClick={() => onExport("images")} className="flex w-full items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left hover:border-[var(--c-p)]">
                    <FileImage size={18} className="mt-0.5 shrink-0 text-[var(--c-p)]" />
                    <span>
                      <span className="block text-[12.5px] font-bold text-neutral-900">Slide images (.zip)</span>
                      <span className="block text-[11px] leading-snug text-neutral-500">All {totalPages} slides as {s.export.imageFormat.toUpperCase()} at {paper.w} × {paper.h} px, for WhatsApp, email or portals.</span>
                    </span>
                  </button>
                  <button onClick={() => { exportSettingsJson(s); flash("Settings file downloaded."); }} className={btnGhost + " w-full"}>
                    <Download size={13} /> Download settings file (.json)
                  </button>
                </Section>
                <div className="rounded-md bg-amber-50 p-3 text-[11px] leading-snug text-amber-800 ring-1 ring-amber-200">
                  <b>About 13.33 × 7.5 in:</b> that is the standard PowerPoint widescreen slide size, not a paper size. For printing or official handouts choose A4 (210 × 297 mm) above — the design is fitted to each sheet automatically.
                </div>
              </div>
            )}

            {tab === "finance" && (
              <div className="space-y-6">
                <Section title="Currency display" desc="Applies to every financial page, chart label and export.">
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["Cr", "₹ Crore"],
                      ["Mn", "₹ Million"],
                      ["Lakh", "₹ Lakh"],
                    ] as const).map(([u, l]) => (
                      <button
                        key={u}
                        onClick={() => finance({ display: u })}
                        className={`rounded-md border px-2 py-2 text-[12px] font-semibold ${s.finance.display === u ? "border-[var(--c-p)] bg-[var(--c-p)] text-white" : "border-neutral-300 bg-white text-neutral-700"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <Field label="Unit of the project-cost table" hint="The source report labels the cost table 'Amounts in Millions'. If those figures are actually in Lakhs, switch here and every page and chart recalculates.">
                    <select className={input} value={s.finance.sourceUnit} onChange={(e) => finance({ sourceUnit: e.target.value as "Mn" | "Lakh" })}>
                      <option value="Mn">₹ Million — as labelled in the report</option>
                      <option value="Lakh">₹ Lakh — if the table was mislabelled</option>
                    </select>
                  </Field>
                </Section>
                <Section title="Means of finance" desc="Project cost is derived from this structure — no figure is hard-coded in the slides.">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Promoter equity">
                      <input type="number" className={input} value={s.finance.equity} onChange={(e) => finance({ equity: Number(e.target.value) })} />
                    </Field>
                    <Field label="Term debt">
                      <input type="number" className={input} value={s.finance.debt} onChange={(e) => finance({ debt: Number(e.target.value) })} />
                    </Field>
                  </div>
                  <div className={`flex gap-2 rounded-md p-2.5 text-[11.5px] leading-snug ${Math.abs(gap) < 0.5 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                    {Math.abs(gap) < 0.5 ? <Check size={15} className="shrink-0" /> : <TriangleAlert size={15} className="shrink-0" />}
                    <span>
                      {Math.abs(gap) < 0.5
                        ? `Equity + debt matches the itemised project cost of ${COST_TOTAL.toLocaleString("en-IN")} (${s.finance.sourceUnit === "Lakh" ? "₹ Lakh" : "₹ Million"}).`
                        : `Equity + debt (${finTotal.toLocaleString("en-IN")}) ${gap > 0 ? "exceeds" : "falls short of"} the itemised cost (${COST_TOTAL.toLocaleString("en-IN")}) by ${Math.abs(gap).toLocaleString("en-IN")}. The source report lists debt of 17,500 — please reconcile. Slides show the funding total as the project cost.`}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Interest % p.a.">
                      <input type="number" step={0.1} className={input} value={s.finance.rate} onChange={(e) => finance({ rate: Number(e.target.value) })} />
                    </Field>
                    <Field label="Tenure (yrs)">
                      <input type="number" min={1} max={12} className={input} value={s.finance.tenure} onChange={(e) => finance({ tenure: Math.max(1, Math.min(12, Number(e.target.value))) })} />
                    </Field>
                    <Field label="Moratorium (yrs)">
                      <input type="number" min={0} max={11} className={input} value={s.finance.moratorium} onChange={(e) => finance({ moratorium: Math.max(0, Math.min(11, Number(e.target.value))) })} />
                    </Field>
                  </div>
                </Section>
              </div>
            )}

            {tab === "advanced" && (
              <div className="space-y-6">
                <Section title="Settings file" desc="Move this configuration to another computer, or keep a backup.">
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => exportSettingsJson(s)} className={btnGhost}>
                      <Download size={13} /> Export
                    </button>
                    <button onClick={() => importRef.current?.click()} className={btnGhost}>
                      <Upload size={13} /> Import
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Reset all settings to the original defaults?")) {
                          setS(structuredClone(DEFAULTS));
                          flash("Settings reset to defaults.");
                        }
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                    >
                      <RotateCcw size={13} /> Reset
                    </button>
                  </div>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = () => {
                        try {
                          setS(mergeSettings(JSON.parse(String(r.result))));
                          flash("Settings imported successfully.");
                        } catch {
                          flash("That file could not be read as a settings file.");
                        }
                      };
                      r.readAsText(f);
                    }}
                  />
                </Section>
                <Section title="Advanced JSON" desc="For IT administrators: edit the complete settings object and apply it.">
                  <textarea className={input + " min-h-[280px] font-mono text-[10.5px] leading-relaxed"} value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        try {
                          setS(mergeSettings(JSON.parse(json)));
                          flash("Configuration applied.");
                        } catch {
                          flash("Invalid JSON — please check the syntax.");
                        }
                      }}
                      className="rounded-md bg-[var(--c-p)] px-3 py-2 text-[12px] font-semibold text-white"
                    >
                      Apply JSON
                    </button>
                    <button onClick={() => setJson(JSON.stringify(s, null, 2))} className={btnGhost}>
                      Reload current
                    </button>
                  </div>
                </Section>
                <Section title="Deck statistics">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      [String(totalPages), "Pages"],
                      [String(partAPages), s.labels.partA],
                      [String(totalPages - partAPages), s.labels.partB],
                    ].map(([v, l]) => (
                      <div key={l} className="rounded-lg border border-neutral-200 bg-white p-2.5 text-center">
                        <div className="text-[18px] font-extrabold text-[var(--c-p)]">{v}</div>
                        <div className="truncate text-[10px] text-neutral-500">{l}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-neutral-200 bg-white px-5 py-2.5">
          <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-400">
            <SlidersHorizontal size={12} /> Saved automatically in this browser
          </div>
          <div className="flex items-center gap-2">
            {msg && <span className="rounded-md bg-neutral-900 px-2 py-1 text-[10.5px] text-white">{msg}</span>}
            <button onClick={onClose} className="rounded-md bg-[var(--c-p)] px-4 py-1.5 text-[12px] font-semibold text-white">
              Done
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

const BG_OPTIONS = [
  { k: "hero", l: "Integrated plant — aerial" },
  { k: "silosaerial", l: "Silos & sunlight" },
  { k: "soyfield", l: "Soybean fields" },
  { k: "mustard", l: "Mustard fields" },
  { k: "pipes", l: "Process plant pipes" },
  { k: "solar", l: "Solar rooftop" },
  { k: "warehouse", l: "Warehousing" },
  { k: "farmers", l: "Farmers & fields" },
  { k: "custom", l: "Uploaded graphic" },
  { k: "none", l: "No graphic (flat colour)" },
];
