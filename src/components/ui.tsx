import type { CSSProperties, ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";
import { useMeta } from "../deck";
import { useSettings } from "../brand/BrandContext";
import { Logo } from "./Logo";

/* ------------------------------------------------------------------ Page */
export function Page({
  kicker,
  title,
  subtitle,
  children,
  dark = false,
  bg = "white",
  bodyClass = "",
}: {
  kicker?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  dark?: boolean;
  bg?: "white" | "paper";
  bodyClass?: string;
}) {
  const meta = useMeta();
  const { s } = useSettings();
  const partA = meta.part === "A";
  return (
    <div
      className={
        "relative flex h-full w-full flex-col overflow-hidden font-body " +
        (dark ? "bg-p-ink text-white" : bg === "paper" ? "bg-paper text-ink" : "bg-white text-ink")
      }
    >
      <div className="flex h-[50px] shrink-0 items-end justify-between px-12 pb-2">
        <div className="flex items-center gap-2.5">
          {s.pres.showPartBadge && (
            <span
              className={
                "rc-sm px-2 py-[3px] fs-8 font-bold tracking-[0.18em] uppercase " +
                (partA ? "bg-s text-p-ink" : dark ? "bg-white/15 text-white" : "bg-p text-white")
              }
            >
              {partA ? s.labels.partA : s.labels.partB}
            </span>
          )}
          <span
            className={
              "fs-9h font-semibold tracking-[0.16em] uppercase " + (dark ? "text-white/55" : "text-mute")
            }
          >
            {meta.section}
          </span>
        </div>
        {s.brand.showLogoOnSlides && <Logo size={24} light={dark} />}
      </div>
      <div className={"mx-12 h-px shrink-0 " + (dark ? "bg-white/15" : "bg-line")} />
      {title && (
        <div className="shrink-0 px-12 pt-3.5">
          {kicker && (
            <div className="mb-1 flex items-center gap-2">
              <span className="h-[3px] w-6 rounded bg-s" />
              <span
                data-role="kicker"
                className={
                  "fs-10h font-bold tracking-[0.18em] uppercase " + (dark ? "text-s" : "text-s-dark")
                }
              >
                {kicker}
              </span>
            </div>
          )}
          <h2
            data-role="title"
            className={"font-head fs-26 leading-[1.18] " + (dark ? "text-white" : "text-p-ink")}
            style={{ fontWeight: s.type.headWeight }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              data-role="subtitle"
              className={
                "mt-1 max-w-[1120px] fs-13 leading-snug " + (dark ? "text-white/70" : "text-mute")
              }
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div data-body className={"relative min-h-0 flex-1 px-12 pt-4 pb-3 " + bodyClass}>{children}</div>
      {s.pres.showFooter && <Footer dark={dark} />}
    </div>
  );
}

export function Footer({ dark = false, transparent = false }: { dark?: boolean; transparent?: boolean }) {
  const meta = useMeta();
  const { s } = useSettings();
  return (
    <div className={"relative shrink-0 " + (transparent ? "" : "")}>
      <div
        className={
          "flex h-[28px] items-center justify-between px-12 fs-9 " + (dark ? "text-white/55" : "text-mute")
        }
      >
        <span className="truncate">
          {s.company.name}
          <span className="mx-2 opacity-40">|</span>
          {s.pres.confidentiality}
        </span>
        {s.pres.showPageNo && (
          <span className="font-semibold tabular">
            {String(meta.n).padStart(2, "0")} <span className="opacity-50">/ {meta.total}</span>
          </span>
        )}
      </div>
      <div className="flex h-[5px]">
        <div className="flex-1 bg-p" />
        <div className="w-[18%] bg-s" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Card */
type Tone = "white" | "paper" | "p" | "s" | "dark" | "solid" | "ink";
const toneCls: Record<Tone, string> = {
  white: "bg-white border border-line",
  paper: "bg-paper border border-line",
  p: "bg-p-wash border border-p/15",
  s: "bg-s-wash border border-s/35",
  dark: "bg-white/[0.06] border border-white/15 text-white",
  solid: "bg-p border border-p text-white",
  ink: "bg-p-ink border border-p-ink text-white",
};

export function Card({
  children,
  className = "",
  tone = "white",
  style,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  style?: CSSProperties;
}) {
  return (
    <div className={`rc p-4 ${toneCls[tone]} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function H({
  children,
  className = "",
  icon: Icon,
  light = false,
}: {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  light?: boolean;
}) {
  return (
    <h4
      className={`flex items-center gap-2 font-head fs-14 font-bold ${light ? "text-white" : "text-p-dark"} ${className}`}
    >
      {Icon && <Icon size={16} className={light ? "text-s" : "text-s-dark"} />}
      {children}
    </h4>
  );
}

/* ------------------------------------------------------------------- KPI */
export function KPI({
  icon: Icon,
  value,
  unit,
  label,
  sub,
  tone = "white",
  className = "",
  big = false,
}: {
  icon?: LucideIcon;
  value: ReactNode;
  unit?: string;
  label: string;
  sub?: ReactNode;
  tone?: "white" | "dark" | "gold" | "p";
  className?: string;
  big?: boolean;
}) {
  const dark = tone === "dark";
  const box =
    tone === "dark"
      ? "bg-white/[0.07] border border-white/15"
      : tone === "gold"
        ? "bg-s-wash border border-s/35"
        : tone === "p"
          ? "bg-p-wash border border-p/15"
          : "bg-white border border-line";
  return (
    <div className={`rc p-4 ${box} ${className}`}>
      {Icon && (
        <div
          className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-full ${dark ? "bg-s/20 text-s" : "bg-p text-white"}`}
        >
          <Icon size={16} />
        </div>
      )}
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-head font-extrabold leading-none tabular ${big ? "fs-36" : "fs-28"} ${dark ? "text-white" : "text-p"}`}
        >
          {value}
        </span>
        {unit && (
          <span className={`fs-11 font-bold uppercase ${dark ? "text-s" : "text-s-dark"}`}>{unit}</span>
        )}
      </div>
      <div className={`mt-1.5 fs-12 font-semibold leading-tight ${dark ? "text-white" : "text-ink"}`}>
        {label}
      </div>
      {sub && (
        <div className={`mt-1 fs-10h leading-snug ${dark ? "text-white/60" : "text-mute"}`}>{sub}</div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Photo */
export function Photo({
  src,
  className = "",
  children,
  shade = "bottom",
  pos = "center",
  style,
}: {
  src: string;
  className?: string;
  children?: ReactNode;
  shade?: "bottom" | "left" | "full" | "none" | "top";
  pos?: string;
  style?: CSSProperties;
}) {
  const ink = "color-mix(in srgb, var(--c-p-ink) 90%, transparent)";
  const bg =
    shade === "bottom"
      ? `linear-gradient(180deg, transparent 30%, ${ink})`
      : shade === "left"
        ? `linear-gradient(90deg, ${ink}, transparent 78%)`
        : shade === "top"
          ? `linear-gradient(0deg, transparent 40%, ${ink})`
          : shade === "full"
            ? "color-mix(in srgb, var(--c-p-ink) 62%, transparent)"
            : "transparent";
  return (
    <div className={`relative overflow-hidden rc ${className}`} style={style}>
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: pos }}
      />
      {shade !== "none" && <div className="absolute inset-0" style={{ background: bg }} />}
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------ DataTable */
export function DataTable({
  head,
  rows,
  foot,
  align = [],
  compact = false,
  widths,
  groupRows = [],
  boldRows = [],
  className = "",
  size = "fs-11h",
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  foot?: ReactNode[];
  align?: ("l" | "r" | "c")[];
  compact?: boolean;
  widths?: string[];
  groupRows?: number[];
  boldRows?: number[];
  className?: string;
  size?: string;
}) {
  const al = (i: number) =>
    align[i] === "r" ? "text-right tabular" : align[i] === "c" ? "text-center" : "text-left";
  const pad = compact ? "px-2.5 py-[4px]" : "px-3 py-[6px]";
  return (
    <div className={`overflow-hidden rc border border-line bg-white ${className}`}>
      <table className={`w-full border-collapse ${size}`}>
        {widths && (
          <colgroup>
            {widths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr className="bg-p text-white">
            {head.map((h, i) => (
              <th key={i} className={`${pad} fs-9h font-semibold tracking-wider uppercase ${al(i)}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) =>
            groupRows.includes(i) ? (
              <tr key={i} className="bg-s-wash">
                <td
                  colSpan={head.length}
                  className={`${pad} fs-9h font-bold tracking-wider text-s-dark uppercase`}
                >
                  {r[0]}
                </td>
              </tr>
            ) : (
              <tr
                key={i}
                className={
                  (boldRows.includes(i) ? "bg-p-wash font-semibold " : i % 2 ? "bg-paper " : "bg-white ") +
                  "border-t border-line/70"
                }
              >
                {r.map((c, j) => (
                  <td key={j} className={`${pad} ${al(j)} ${j === 0 ? "font-medium text-ink" : "text-ink/85"}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ),
          )}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="border-t-2 border-p bg-p-wash font-bold text-p-dark">
              {foot.map((c, i) => (
                <td key={i} className={`${pad} ${al(i)}`}>
                  {c}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/* --------------------------------------------------------------- Lists */
export function IconItem({
  icon: Icon,
  title,
  text,
  dark = false,
  className = "",
}: {
  icon: LucideIcon;
  title: ReactNode;
  text?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${dark ? "bg-white/10 text-s" : "bg-p-wash text-p"}`}
      >
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <div className={`fs-13 font-bold leading-tight ${dark ? "text-white" : "text-p-ink"}`}>{title}</div>
        {text && (
          <p className={`mt-1 fs-11h leading-snug ${dark ? "text-white/70" : "text-mute"}`}>{text}</p>
        )}
      </div>
    </div>
  );
}

export function Bullets({
  items,
  dark = false,
  className = "",
  size = "fs-12",
  gap = "space-y-1.5",
}: {
  items: ReactNode[];
  dark?: boolean;
  className?: string;
  size?: string;
  gap?: string;
}) {
  return (
    <ul className={`${gap} ${className}`}>
      {items.map((t, i) => (
        <li key={i} className={`flex gap-2 ${size} leading-snug ${dark ? "text-white/80" : "text-ink/85"}`}>
          <Check size={14} strokeWidth={2.6} className={`mt-[2px] shrink-0 ${dark ? "text-s" : "text-p"}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={`fs-9h leading-snug italic ${dark ? "text-white/50" : "text-mute"} ${className}`}>{children}</p>
  );
}

export function Pill({
  children,
  tone = "p",
  className = "",
}: {
  children: ReactNode;
  tone?: "p" | "s" | "red" | "amber" | "green" | "gray" | "dark";
  className?: string;
}) {
  const t = {
    p: "bg-p-wash text-p-dark border-p/20",
    s: "bg-s-wash text-s-dark border-s/35",
    red: "bg-[#fdecea] text-[#a3341f] border-[#f2c5bd]",
    amber: "bg-[#fff5e0] text-[#99630a] border-[#f4dba6]",
    green: "bg-[#e8f6ee] text-[#17663a] border-[#bfe3cd]",
    gray: "bg-paper text-mute border-line",
    dark: "bg-white/10 text-white border-white/20",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-[2px] fs-9h font-semibold ${t} ${className}`}>
      {children}
    </span>
  );
}

export function Meter({
  label,
  value,
  max,
  display,
  color = "var(--c-p)",
  dark = false,
  thick = 8,
}: {
  label: ReactNode;
  value: number;
  max: number;
  display: ReactNode;
  color?: string;
  dark?: boolean;
  thick?: number;
}) {
  return (
    <div>
      <div className={`mb-1 flex justify-between fs-11 ${dark ? "text-white/85" : "text-ink"}`}>
        <span className="font-medium">{label}</span>
        <span className="font-bold tabular">{display}</span>
      </div>
      <div className={`rounded-full ${dark ? "bg-white/10" : "bg-line/80"}`} style={{ height: thick }}>
        <div
          className="rounded-full"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color, height: thick }}
        />
      </div>
    </div>
  );
}

export function Stat({
  value,
  label,
  dark = false,
  className = "",
}: {
  value: ReactNode;
  label: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className={`font-head fs-22 font-extrabold leading-none tabular ${dark ? "text-s" : "text-p"}`}>{value}</div>
      <div className={`mt-1 fs-10h leading-snug ${dark ? "text-white/70" : "text-mute"}`}>{label}</div>
    </div>
  );
}

export function NumBadge({ n, tone = "s" }: { n: number | string; tone?: "s" | "p" }) {
  return (
    <span
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 fs-10 font-extrabold ${tone === "s" ? "bg-s text-p-ink" : "bg-p text-white"}`}
    >
      {n}
    </span>
  );
}
