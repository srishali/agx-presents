import { usePalette, useSettings } from "../brand/BrandContext";
import { brandSubline } from "../brand/settings";

export function LogoMark({
  size = 32,
  p,
  s,
  light = false,
}: {
  size?: number;
  p: string;
  s: string;
  light?: boolean;
}) {
  const bg = light ? "#ffffff" : p;
  const leaf = light ? p : "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="24" cy="24" r="23" fill={bg} />
      <circle cx="24" cy="24" r="20.4" fill="none" stroke={s} strokeWidth="1.1" />
      <path d="M12.5 35.5C12.5 22 21.5 12.5 36 11.5C35 26 26 35.5 12.5 35.5Z" fill={leaf} />
      <path d="M13.5 34.5L28.5 19.5" stroke={bg} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M34.5 26.5C34.5 26.5 39.5 32 39.5 35.2A5 5 0 0 1 29.5 35.2C29.5 32 34.5 26.5 34.5 26.5Z"
        fill={s}
        stroke={bg}
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function Logo({
  size = 28,
  light = false,
  text = true,
  className = "",
}: {
  size?: number;
  light?: boolean;
  text?: boolean;
  className?: string;
}) {
  const { s } = useSettings();
  const pal = usePalette();
  const custom = s.brand.logo;
  const sub = brandSubline(s.company.name, s.company.short);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {custom ? (
        <span className={light ? "rounded-md bg-white px-1.5 py-1" : ""}>
          <img
            src={custom}
            alt=""
            style={{ height: size, width: "auto", maxWidth: size * 5 }}
            className="block object-contain"
          />
        </span>
      ) : (
        <LogoMark size={size} p={pal.p} s={pal.s} light={light} />
      )}
      {text && s.brand.showWordmark && (
        <div className="leading-none">
          <div
            className={`font-head font-extrabold tracking-[0.06em] ${light ? "text-white" : "text-p-ink"}`}
            style={{ fontSize: size * 0.52 }}
          >
            {s.company.short}
          </div>
          {sub && (
            <div
              className={`mt-[3px] font-semibold tracking-[0.18em] uppercase ${light ? "text-white/60" : "text-mute"}`}
              style={{ fontSize: Math.max(6, size * 0.21) }}
            >
              {sub}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
