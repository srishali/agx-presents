import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutGrid,
  Maximize,
  Minimize,
  MoreVertical,
  Printer,
  Settings2,
  Share2,
  X,
  Download,
} from "lucide-react";
import { BrandProvider, useSettings } from "./brand/BrandContext";
import { PAPERS, paperOptions } from "./brand/settings";
import { SLIDES } from "./slides";
import { DeckCtx, MetaCtx, titleOf, type DeckSlide, type Mode } from "./deck";
import { SettingsPanel } from "./components/SettingsPanel";
import { Logo } from "./components/Logo";
import { exportDocx, exportImages, exportPptx, readAll } from "./export";

const W = 1280;
const H = 720;
const TOTAL = SLIDES.length;
const PART_A = SLIDES.filter((s) => s.part === "A").length;

function SlideFrame({ i, mode }: { i: number; mode: Mode }) {
  const d = SLIDES[i];
  const { s } = useSettings();
  return (
    <MetaCtx.Provider value={{ n: i + 1, total: TOTAL, part: d.part, section: d.section, title: titleOf(d, s), mode }}>
      <div data-slide={mode} className="deck-frame h-full w-full">
        <div className="deck-canvas h-full w-full overflow-hidden bg-white">
          <d.C />
        </div>
      </div>
    </MetaCtx.Provider>
  );
}

function Stage({ i, fullscreen, go, pageView }: { i: number; fullscreen: boolean; go: (d: number) => void; pageView: boolean }) {
  const { s } = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1200, h: 700 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setBox({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height });
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* presentation mode keeps the classic fixed 16:9 artboard, scaled to fit */
  if (fullscreen) {
    const scale = Math.min(box.w / W, box.h / H);
    return (
      <div ref={ref} className="relative h-full w-full">
        <div className="absolute top-1/2 left-1/2" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
          <SlideFrame key={i} i={i} mode="live" />
        </div>
        <button aria-label="Previous" onClick={() => go(-1)} className="absolute inset-y-0 left-0 w-[10%] cursor-w-resize" />
        <button aria-label="Next" onClick={() => go(1)} className="absolute inset-y-0 right-0 w-[10%] cursor-e-resize" />
      </div>
    );
  }

  /* page view: a true-to-size sheet of the selected paper with adaptive content */
  if (pageView) {
    const paper = paperOptions(s.export.paper, s.export.orientation);
    const fit = Math.min(box.w / paper.w, box.h / paper.h);
    /* layout at true paper size, then transform-scale to fit the window —
       identical layout to the printed page */
    const marginCss = s.export.pdfMargin * 3.7795275591;
    return (
      <div ref={ref} className="relative h-full w-full">
        <div
          className="absolute top-1/2 left-1/2 overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,.55)] ring-1 ring-white/15"
          style={{ width: paper.w * fit, height: paper.h * fit, transform: "translate(-50%, -50%)" }}
        >
          <div
            style={{
              width: paper.w,
              height: paper.h,
              transform: `scale(${fit})`,
              transformOrigin: "top left",
            }}
          >
            <div className="absolute" style={{ left: marginCss, top: marginCss, width: paper.w - marginCss * 2, height: paper.h - marginCss * 2 }}>
              <SlideFrame key={i} i={i} mode="live" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] tracking-wide whitespace-nowrap text-white/45">
          {paper.name} · {Math.round((paper.w / 96) * 25.4)} × {Math.round((paper.h / 96) * 25.4)} mm · content adapts to the page
        </div>
      </div>
    );
  }

  /* normal screen: the deck fills the window and adapts to its size */
  return (
    <div ref={ref} className="relative h-full w-full">
      <div className="h-full w-full overflow-hidden rounded-[6px] bg-white shadow-[0_20px_60px_rgba(0,0,0,.55)] ring-1 ring-white/10">
        <SlideFrame key={i} i={i} mode="live" />
      </div>
    </div>
  );
}

function Thumb({ i, active, onPick }: { i: number; active: boolean; onPick: () => void }) {
  const { s } = useSettings();
  const k = 0.17;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => e.key === "Enter" && onPick()}
      className={`group cursor-pointer rounded-lg p-1.5 transition ${active ? "bg-[var(--c-s)]/25 ring-2 ring-[var(--c-s)]" : "hover:bg-white/10"}`}
    >
      <div className="relative overflow-hidden rounded-[4px] ring-1 ring-white/10" style={{ width: W * k, height: H * k }}>
        <div className="pointer-events-none origin-top-left" style={{ width: W, height: H, transform: `scale(${k})` }}>
          <SlideFrame i={i} mode="thumb" />
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-2 px-0.5 text-[11px] text-white/80">
        <span className="font-bold text-[var(--c-s)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
        <span className="truncate">{titleOf(SLIDES[i], s)}</span>
      </div>
    </div>
  );
}

function Deck() {
  const { s } = useSettings();
  const [i, setI] = useState(() => {
    const h = parseInt(window.location.hash.replace("#", ""), 10);
    return Number.isFinite(h) && h >= 1 && h <= TOTAL ? h - 1 : 0;
  });
  const [grid, setGrid] = useState(false);
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [job, setJob] = useState<null | "pptx" | "docx" | "images">(null);
  const [progress, setProgress] = useState("");
  const [hint, setHint] = useState(false);
  const [fs, setFs] = useState(false);
  const [pageView, setPageView] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const capHostRef = useRef<HTMLDivElement>(null);
  const [capIdx, setCapIdx] = useState<number | null>(null);
  const capWaiter = useRef<((el: HTMLElement) => void) | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const go = useCallback((d: number) => setI((p) => Math.min(TOTAL - 1, Math.max(0, p + d))), []);
  const jump = useCallback((n: number) => {
    setI(Math.min(TOTAL - 1, Math.max(0, n)));
    setGrid(false);
    setMenu(false);
  }, []);

  const pages = useCallback(() => {
    const idx = SLIDES.map((_, k) => k);
    return s.export.includeCover ? idx : idx.filter((k) => k !== 0 && k !== TOTAL - 1);
  }, [s.export.includeCover]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${i + 1}`);
  }, [i]);

  useEffect(() => {
    const onHash = () => {
      const h = parseInt(window.location.hash.replace("#", ""), 10);
      if (Number.isFinite(h) && h >= 1 && h <= TOTAL) setI(h - 1);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = `${s.company.short} — ${s.labels.partA} & ${s.labels.partB}`;
  }, [s.company.short, s.labels.partA, s.labels.partB]);

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const doPrint = useCallback(() => {
    setMenu(false);
    setSettings(false);
    setPrinting(true);
    setHint(true);
    window.setTimeout(() => setHint(false), 12000);
  }, []);

  useEffect(() => {
    if (!printing) return;
    const t = window.setTimeout(() => window.print(), 900);
    const after = () => setPrinting(false);
    window.addEventListener("afterprint", after);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("afterprint", after);
    };
  }, [printing]);

  /* one-at-a-time page render for image export (keeps memory flat) */
  const requestPage = useCallback(
    (idx: number) =>
      new Promise<HTMLElement>((resolve) => {
        capWaiter.current = resolve;
        setCapIdx(idx);
      }),
    [],
  );

  useEffect(() => {
    if (capIdx === null) return;
    let alive = true;
    const t = window.setTimeout(() => {
      const el = capHostRef.current?.querySelector<HTMLElement>(".export-page");
      if (alive && el && capWaiter.current) {
        capWaiter.current(el);
        capWaiter.current = null;
      }
    }, 320);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [capIdx]);

  /* exports that need a rendered copy of every page */
  const doExport = useCallback((kind: "pptx" | "docx" | "images") => {
    setMenu(false);
    setSettings(false);
    setProgress("Preparing pages…");
    setJob(kind);
  }, []);

  useEffect(() => {
    if (!job) return;
    let cancelled = false;
    (async () => {
      try {
        await document.fonts.ready;
        await new Promise((r) => setTimeout(r, 900));
        if (job === "images") {
          const list = pages();
          await exportImages(s, list.length, (k) => requestPage(list[k]), (done, total) => setProgress(`Rendering slide ${done} of ${total}…`));
        } else {
          if (!hostRef.current) throw new Error("render host unavailable");
          const data = readAll(hostRef.current);
          if (job === "pptx") await exportPptx(data, s);
          else await exportDocx(data, s);
        }
      } catch (err) {
        console.error(err);
        window.alert(`The ${job === "images" ? "image" : job.toUpperCase()} export could not be completed. Please try again, or use Print / PDF.`);
      } finally {
        if (!cancelled) {
          setJob(null);
          setCapIdx(null);
          setProgress("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [job, s, pages, requestPage]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (settings || job || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) {
        if (e.key === "Escape") setSettings(false);
        return;
      }
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(TOTAL - 1);
      else if (e.key.toLowerCase() === "g") setGrid((g) => !g);
      else if (e.key.toLowerCase() === "f") toggleFs();
      else if (e.key === "Escape") {
        setGrid(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, settings, job, toggleFs]);

  const cur = SLIDES[i];
  const curTitle = titleOf(cur, s);
  void curTitle;
  const inA = cur.part === "A";
  const paper = paperOptions(s.export.paper, s.export.orientation);
  const printList = pages();

  return (
    <DeckCtx.Provider
      value={{ slides: SLIDES.map((d): DeckSlide => ({ title: titleOf(d, s), part: d.part, section: d.section })), go: jump }}
    >
      <div className="screen-root flex h-screen flex-col bg-[#0b1410] text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {!fs && (
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <Logo size={26} light text={false} />
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[12.5px] font-semibold">{s.company.name}</div>
                <div className="truncate text-[10.5px] text-white/45">{s.pres.eyebrow}</div>
              </div>
            </div>
            <div className="hidden items-center gap-1 rounded-full bg-white/5 p-1 md:flex">
              <button
                onClick={() => jump(0)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${inA ? "bg-[var(--c-s)] text-[#111]" : "text-white/60 hover:text-white"}`}
              >
                A · {s.labels.execShort} <span className="opacity-60">1–{PART_A}</span>
              </button>
              <button
                onClick={() => jump(PART_A)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${!inA ? "bg-[var(--c-p)] text-white" : "text-white/60 hover:text-white"}`}
              >
                B · {s.labels.dprShort} <span className="opacity-60">{PART_A + 1}–{TOTAL}</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setGrid((g) => !g)} className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-white/10">
                {grid ? <X size={13} /> : <LayoutGrid size={13} />} <span className="hidden sm:inline">{grid ? "Close" : "Overview"}</span>
              </button>
              <button
                onClick={() => setPageView((v) => !v)}
                title="Preview the printed page"
                className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] ${pageView ? "border-[var(--c-s)] bg-[var(--c-s)]/20 text-white" : "border-white/15 hover:bg-white/10"}`}
              >
                <FileText size={13} /> <span className="hidden lg:inline">{pageView ? "Slide view" : "Page view"}</span>
              </button>
              <button onClick={toggleFs} className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-white/10">
                <Maximize size={13} /> <span className="hidden sm:inline">Present</span>
              </button>
              <button onClick={doPrint} className="hidden items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-white/10 sm:flex">
                <Printer size={13} /> <span className="hidden lg:inline">Print / PDF</span>
              </button>
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setMenu((m) => !m)}
                  aria-label="More options"
                  title="More options"
                  className="flex h-7 w-5 items-center justify-center text-white/30 transition hover:text-white/75"
                >
                  <MoreVertical size={14} strokeWidth={2.4} />
                </button>
                {menu && (
                  <div className="absolute top-8 right-0 z-50 w-64 overflow-hidden rounded-lg border border-white/10 bg-[#12211b] py-1 shadow-2xl">
                    {[
                      { icon: Settings2, label: "Presentation settings", note: "Company, brand, fonts, export", fn: () => { setSettings(true); setMenu(false); } },
                      { icon: Download, label: "Export deck", note: "PowerPoint, Word, images", fn: () => { setSettings(true); setMenu(false); } },
                      { icon: Printer, label: `Print / Save as PDF`, note: `${paper.name} · ${paper.w}×${paper.h} px`, fn: doPrint },
                      { icon: Share2, label: "Present full screen", note: "Press F", fn: () => { toggleFs(); setMenu(false); } },
                    ].map((m) => (
                      <button key={m.label} onClick={m.fn} className="flex w-full items-start gap-2.5 px-3 py-2 text-left hover:bg-white/5">
                        <m.icon size={14} className="mt-0.5 shrink-0 text-[var(--c-s)]" />
                        <span>
                          <span className="block text-[11.5px] font-semibold text-white/90">{m.label}</span>
                          <span className="block text-[10px] text-white/40">{m.note}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        <main className={`relative min-h-0 flex-1 ${fs ? "" : "p-3 sm:p-5"}`}>
          {grid ? (
            <div className="thin-scroll h-full overflow-y-auto px-2">
              {(["A", "B"] as const).map((p) => (
                <div key={p} className="mb-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold tracking-widest uppercase ${p === "A" ? "bg-[var(--c-s)] text-[#111]" : "bg-[var(--c-p)] text-white"}`}>
                      {p === "A" ? s.labels.partA : s.labels.partB}
                    </span>
                    <span className="text-[13px] font-semibold text-white/85">
                      {p === "A"
                        ? `${s.labels.highlightsLine} (${s.labels.pagesWord} 1–${PART_A})`
                        : `${s.labels.reviewLine} (${s.labels.pagesWord} ${PART_A + 1}–${TOTAL})`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SLIDES.map((d, k) => (d.part === p ? <Thumb key={k} i={k} active={k === i} onPick={() => jump(k)} /> : null))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Stage i={i} fullscreen={fs} go={go} pageView={pageView} />
          )}
          {fs && (
            <button onClick={toggleFs} className="absolute top-3 right-3 rounded-md bg-black/40 p-1.5 text-white/60 opacity-0 transition hover:opacity-100">
              <Minimize size={16} />
            </button>
          )}
        </main>

        {!fs && (
          <footer className="shrink-0 border-t border-white/10">
            <div className="flex h-[3px] w-full">
              <div className="relative bg-white/10" style={{ width: `${(PART_A / TOTAL) * 100}%` }}>
                <div className="absolute inset-y-0 left-0 bg-[var(--c-s)] transition-all" style={{ width: `${Math.min(1, (i + 1) / PART_A) * 100}%` }} />
              </div>
              <div className="relative flex-1 bg-white/5">
                <div className="absolute inset-y-0 left-0 bg-[var(--c-p)] transition-all" style={{ width: `${Math.max(0, (i + 1 - PART_A) / (TOTAL - PART_A)) * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-2">
              <button onClick={() => go(-1)} disabled={i === 0} className="flex items-center gap-1 rounded-md border border-white/15 px-3 py-1 text-[12px] hover:enabled:bg-white/10 disabled:opacity-30">
                <ChevronLeft size={14} /> Prev
              </button>
              <div className="min-w-0 truncate text-center text-[11.5px] text-white/60">
                <span className="font-semibold text-white tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {TOTAL}
                </span>
                <span className="mx-2 text-white/20">|</span>
                <span className={inA ? "text-[var(--c-s)]" : "text-white/80"}>{titleOf(cur, s)}</span>
                <span className="ml-3 hidden text-[10.5px] text-white/30 lg:inline">
                  ← → navigate · G overview · F present · print page: {PAPERS[s.export.paper].name}
                </span>
              </div>
              <button onClick={() => go(1)} disabled={i === TOTAL - 1} className="flex items-center gap-1 rounded-md border border-white/15 px-3 py-1 text-[12px] hover:enabled:bg-white/10 disabled:opacity-30">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </footer>
        )}
      </div>

      {/* hidden rendered copy used for PPTX / Word / image exports */}
      {(job === "pptx" || job === "docx") && (
        <div ref={hostRef} aria-hidden className="pointer-events-none fixed top-0 left-[-20000px] z-[-1]" style={{ width: W }}>
          {pages().map((idx) => (
            <div
              key={idx}
              className="export-page"
              data-export-page
              data-part={SLIDES[idx].part}
              data-section={SLIDES[idx].section}
              style={{ width: W, height: H, overflow: "hidden", background: "#fff" }}
            >
              <SlideFrame i={idx} mode="print" />
            </div>
          ))}
        </div>
      )}

      {/* single-page render target used by the image exporter */}
      {job === "images" && capIdx !== null && (
        <div ref={capHostRef} aria-hidden className="pointer-events-none fixed top-0 left-[-20000px] z-[-1]">
          <div
            className="export-page"
            data-export-page
            data-part={SLIDES[capIdx].part}
            data-section={SLIDES[capIdx].section}
            style={{ width: paper.w, height: paper.h, overflow: "hidden", background: "#fff" }}
          >
            <SlideFrame i={capIdx} mode="print" />
          </div>
        </div>
      )}

      {/* print / save-as-PDF pages */}
      {printing && (
        <div className="print-root">
          {printList.map((idx) => (
            <div key={idx} className="print-page">
              <div className="print-stage">
                <SlideFrame i={idx} mode="print" />
              </div>
            </div>
          ))}
        </div>
      )}

      {job && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          <div className="w-[340px] rounded-xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-[3px] border-neutral-200 border-t-[var(--c-p)]" />
            <div className="text-[13px] font-bold text-neutral-900">
              {job === "pptx" ? "Building PowerPoint" : job === "docx" ? "Building Word document" : "Exporting slide images"}
            </div>
            <div className="mt-1 text-[11.5px] text-neutral-500">{progress || "Applying branding and layout…"}</div>
            <div className="mt-2 text-[10.5px] text-neutral-400">Keep this tab open — the download starts automatically.</div>
          </div>
        </div>
      )}

      {hint && !fs && (
        <div className="print-hide fixed top-3 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-[#12211b] px-4 py-2.5 text-[11.5px] text-white shadow-2xl ring-1 ring-white/15">
          <b className="text-[var(--c-s)]">Print tip:</b> choose <b>Save as PDF</b> · paper <b>{PAPERS[s.export.paper].name}</b> · margins{" "}
          <b>{s.export.pdfMargin === 0 ? "None" : `${s.export.pdfMargin} mm`}</b> · enable <b>Background graphics</b>
        </div>
      )}

      <SettingsPanel open={settings} onClose={() => setSettings(false)} onExport={doExport} onPrint={doPrint} />
    </DeckCtx.Provider>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <Deck />
    </BrandProvider>
  );
}
