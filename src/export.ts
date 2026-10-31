import { toJpeg, toPng } from "html-to-image";
import JSZip from "jszip";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type PptxGenJSType from "pptxgenjs";
import type { Settings } from "./brand/settings";
import { PAPERS, paperOptions } from "./brand/settings";

export type SlideText = {
  n: number;
  part: "A" | "B";
  section: string;
  title: string;
  kicker: string;
  subtitle: string;
  bullets: string[];
};

/* --------------------------------------------------------------- helpers */
const clean = (t: string) => t.replace(/\s+/g, " ").trim();

/** Browser download without an extra dependency */
function saveAs(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** html-to-image has no webp writer — convert the PNG through a canvas */
async function pngToWebp(dataUrl: string): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  c.getContext("2d")?.drawImage(img, 0, 0);
  return c.toDataURL("image/webp", 0.92);
}

export function stripColor(hex: string) {
  return hex.replace("#", "").toUpperCase().slice(0, 6);
}

export function filename(s: Settings, ext: string) {
  const base = s.company.short.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "presentation"}-${new Date().toISOString().slice(0, 10)}.${ext}`;
}

/** Collect headline + supporting points from a rendered slide element */
export function readSlide(el: HTMLElement, n: number, part: "A" | "B", section: string): SlideText {
  const q = (sel: string) => el.querySelector(sel) as HTMLElement | null;
  const title =
    clean(q('[data-role="title"]')?.textContent || "") ||
    clean(q("h1")?.textContent || "") ||
    clean(q("h2")?.textContent || "") ||
    "Slide";
  const kicker = clean(q('[data-role="kicker"]')?.textContent || "");
  const subtitle = clean(q('[data-role="subtitle"]')?.textContent || "");
  const body = el.querySelector("[data-body]") as HTMLElement | null;
  const raw: string[] = [];
  body?.querySelectorAll("h4, li, p, td").forEach((node) => {
    const txt = clean(node.textContent || "");
    if (txt) raw.push(txt);
  });
  const bullets: string[] = [];
  for (const t of raw) {
    if (t.length < 22 || t.length > 260) continue;
    if (bullets.includes(t)) continue;
    if (bullets.length >= 14) break;
    bullets.push(t);
  }
  return { n, part, section, title: title.slice(0, 140), kicker: kicker.slice(0, 80), subtitle: subtitle.slice(0, 320), bullets };
}

export function readAll(root: HTMLElement): SlideText[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-export-page]")).map((el, i) =>
    readSlide(el, i + 1, (el.dataset.part as "A" | "B") || "A", el.dataset.section || ""),
  );
}

/* -------------------------------------------------------------- PowerPoint */
export async function exportPptx(pages: SlideText[], s: Settings, withNotes = true) {
  const mod = (await import("pptxgenjs")) as unknown as { default: typeof PptxGenJSType };
  const pptx = new mod.default();
  pptx.layout = "LAYOUT_WIDE"; // 13.333 × 7.5 in — industry standard for a 16:9 deck
  pptx.author = s.company.name;
  pptx.company = s.company.name;
  pptx.title = `${s.company.short} — Investment Proposal & Detailed Project Report`;
  pptx.subject = s.pres.preparedFor;

  const p = stripColor(s.brand.primary);
  const sec = stripColor(s.brand.secondary);
  const ink = stripColor(s.brand.primary === "#007A33" ? "#0B2418" : shadeHex(s.brand.primary, 0.82));
  const head = s.type.head;
  const body = s.type.body;

  pptx.defineSlideMaster({
    title: "AGROMAX_MASTER",
    background: { color: "FFFFFF" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: p } } },
      { rect: { x: 12.83, y: 0, w: 0.5, h: 0.06, fill: { color: sec } } },
      { rect: { x: 0, y: 7.4, w: "100%", h: 0.1, fill: { color: p } } },
      { rect: { x: 10.9, y: 7.4, w: 2.43, h: 0.1, fill: { color: sec } } },
      {
        text: {
          text: `${s.company.name}   ·   ${s.pres.confidentiality}`,
          options: { x: 0.45, y: 7.06, w: 9.2, h: 0.28, fontSize: 8, color: "7C8580", fontFace: body, charSpacing: 1 },
        },
      },
      { rect: { x: 0.45, y: 1.32, w: 11.0, h: 0.01, fill: { color: "E1E5DF" } } },
    ],
    slideNumber: { x: 12.35, y: 7.05, w: 0.6, h: 0.28, fontSize: 9, color: "55605B", fontFace: body, align: "right" },
  });

  for (const pg of pages) {
    const slide = pptx.addSlide({ masterName: "AGROMAX_MASTER" });
    slide.addText(`${pg.part === "A" ? s.labels.partA : s.labels.partB}   ·   ${pg.section}`.toUpperCase(), {
      x: 0.45, y: 0.28, w: 9.6, h: 0.24, fontSize: 9, bold: true, color: sec, fontFace: body, charSpacing: 2,
    });
    if (s.brand.showLogoOnSlides) {
      if (s.brand.logo) {
        slide.addImage({ data: s.brand.logo, x: 12.0, y: 0.2, h: 0.36, w: 0.9, sizing: { type: "contain", w: 0.9, h: 0.36 } });
      } else {
        slide.addShape("ellipse" as never, { x: 12.5, y: 0.2, w: 0.34, h: 0.34, fill: { color: p } });
        slide.addText(s.company.short.slice(0, 1), {
          x: 12.5, y: 0.2, w: 0.34, h: 0.34, align: "center", valign: "middle", fontSize: 12, bold: true, color: "FFFFFF", fontFace: head,
        });
      }
    }
    if (pg.kicker) {
      slide.addText(pg.kicker.toUpperCase(), {
        x: 0.5, y: 0.55, w: 11.6, h: 0.25, fontSize: 9.5, bold: true, color: sec, fontFace: body, charSpacing: 1.5,
      });
    }
    slide.addText(pg.title, {
      x: 0.5, y: 0.78, w: 11.9, h: 0.5, fontSize: 22, bold: true, color: ink, fontFace: head, valign: "top", fit: "shrink",
    });
    if (pg.subtitle) {
      slide.addText(pg.subtitle, {
        x: 0.5, y: 1.36, w: 12.1, h: 0.34, fontSize: 10.5, color: "55605B", fontFace: body, valign: "top", fit: "shrink",
      });
    }
    const half = Math.ceil(pg.bullets.length / 2);
    const cols = [pg.bullets.slice(0, half), pg.bullets.slice(half)];
    cols.forEach((col, ci) => {
      if (!col.length) return;
      slide.addText(
        col.map((t) => ({ text: t, options: { bullet: { code: "25AA" }, breakLine: true } })),
        {
          x: 0.55 + ci * 6.15,
          y: 1.85,
          w: 5.85,
          h: 4.95,
          fontSize: 11,
          color: "25312B",
          fontFace: body,
          lineSpacingMultiple: 1.15,
          valign: "top",
          fit: "shrink",
          paraSpaceAfter: 6,
        },
      );
    });
    if (!pg.bullets.length) {
      slide.addText("This page is a visual/graphic page in the interactive deck. Open the HTML deck or export PDF to view it in full design.", {
        x: 0.6, y: 2.2, w: 11.9, h: 1.2, fontSize: 13, italic: true, color: "7C8580", fontFace: body,
      });
    }
    if (withNotes) {
      slide.addNotes(
        `${pg.title}\n${pg.subtitle}\n\n${pg.bullets.map((b) => `• ${b}`).join("\n")}\n\n` +
          `All financial figures are promoter projections. Full design: export the PDF (${PAPERS[s.export.paper].name}).`,
      );
    }
  }

  const blob = (await pptx.write({ outputType: "blob" })) as Blob;
  saveAs(blob, filename(s, "pptx"));
}

/* -------------------------------------------------------------------- Word */
export async function exportDocx(pages: SlideText[], s: Settings) {
  const p = stripColor(s.brand.primary);
  const children: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: s.company.name, bold: true, size: 44, color: p, font: s.type.head })],
      spacing: { after: 80 },
    }),
    new Paragraph({ children: [new TextRun({ text: `${s.labels.partA} & ${s.labels.partB}`, size: 30, color: "333333", font: s.type.head })], spacing: { after: 60 } }),
    new Paragraph({ children: [new TextRun({ text: `Submitted to: ${s.pres.preparedFor}`, size: 22, color: "555555" })], spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: `${s.pres.audience}`, size: 20, color: "666666" })], spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: `${s.pres.confidentiality}  ·  ${new Date().toLocaleDateString("en-IN")}`, size: 18, color: "888888" })], spacing: { after: 240 } }),
    new Paragraph({ text: "Contents", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 120 } }),
  ];

  pages.forEach((pg) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${String(pg.n).padStart(2, "0")}  `, bold: true, color: p }),
          new TextRun({ text: pg.title }),
        ],
        spacing: { after: 20 },
      }),
    );
  });

  let lastPart = "";
  pages.forEach((pg) => {
    const partName = pg.part === "A" ? s.labels.partA : s.labels.partB;
    if (pg.part !== lastPart) {
      children.push(new Paragraph({ text: partName, heading: HeadingLevel.HEADING_1, pageBreakBefore: true, spacing: { after: 160 } }));
      lastPart = pg.part;
    }
    children.push(new Paragraph({ text: `${pg.n}. ${pg.title}`, heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 60 } }));
    if (pg.section) {
      children.push(new Paragraph({ children: [new TextRun({ text: pg.section.toUpperCase(), size: 16, color: "8A938E", bold: true })], spacing: { after: 40 } }));
    }
    if (pg.subtitle) {
      children.push(new Paragraph({ children: [new TextRun({ text: pg.subtitle, italics: true, size: 20, color: "555555" })], spacing: { after: 80 } }));
    }
    pg.bullets.forEach((b) =>
      children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { after: 30 } })),
    );
  });

  children.push(
    new Paragraph({ text: s.labels.closingLine, heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 80 } }),
    new Paragraph({ children: [new TextRun({ text: `${s.contact.person} · ${s.contact.designation}`, bold: true })] }),
    new Paragraph({ children: [new TextRun({ text: `${s.contact.phone} · ${s.contact.email} · ${s.contact.website}`, color: "555555" })] }),
  );

  const doc = new Document({
    creator: s.company.name,
    title: `${s.company.short} — ${s.labels.partA} & ${s.labels.partB}`,
    description: `Generated ${new Date().toISOString()}`,
    sections: [{ properties: {}, children }],
    styles: {
      default: {
        document: { run: { font: s.type.body, size: 21, color: "1F2A24" } },
      },
    },
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename(s, "docx"));
}

/* ------------------------------------------------------------ image files */
let fontCssCache: { key: string; css: string } | null = null;

/** Fetch the chosen Google fonts and inline the woff2 files, so html-to-image
 *  does not have to touch cross-origin stylesheets (which fail on file://). */
async function buildFontCss(head: string, body: string): Promise<string> {
  const fams = Array.from(new Set([head, body])).filter((f) => !/^System/.test(f));
  const key = fams.join("|");
  if (fontCssCache?.key === key) return fontCssCache.css;
  try {
    const families = fams.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700;800`).join("&");
    const css = await fetch(`https://fonts.googleapis.com/css2?${families}&display=swap`, { mode: "cors" }).then((r) => r.text());
    const urls = Array.from(new Set(Array.from(css.matchAll(/url\((https:[^)]+)\)/g)).map((m) => m[1])));
    const inlined = await Promise.all(
      urls.map(async (u) => {
        try {
          const buf = await fetch(u, { mode: "cors" }).then((r) => r.arrayBuffer());
          const bytes = new Uint8Array(buf);
          let bin = "";
          for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
          const mime = /woff2/.test(u) ? "font/woff2" : /woff/.test(u) ? "font/woff" : "font/ttf";
          return { u, data: `data:${mime};base64,${btoa(bin)}` };
        } catch {
          return { u, data: u };
        }
      }),
    );
    let out = css;
    inlined.forEach(({ u, data }) => {
      out = out.split(u).join(data);
    });
    fontCssCache = { key, css: out };
    return out;
  } catch {
    return "";
  }
}

export async function exportImages(
  s: Settings,
  total: number,
  getPage: (index: number) => Promise<HTMLElement>,
  onProgress?: (done: number, total: number) => void,
) {
  const opts = paperOptions(s.export.paper, s.export.orientation);
  const zip = new JSZip();
  const folderName = `${s.company.short.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "deck"}-slides`;
  const folder = zip.folder(folderName);
  const scale = opts.w >= 1500 ? 1.5 : opts.w >= 1000 ? 1.5 : 2;
  const fontCSS = await buildFontCss(s.type.head, s.type.body);
  for (let i = 0; i < total; i++) {
    onProgress?.(i + 1, total);
    const node = await getPage(i);
    const cfg = {
      width: opts.w,
      height: opts.h,
      pixelRatio: scale,
      backgroundColor: "#ffffff",
      fontEmbedCSS: fontCSS || undefined,
      cacheBust: false,
    };
    const fmt = s.export.imageFormat;
    const data = fmt === "jpeg" ? await toJpeg(node, { ...cfg, quality: 0.92 }) : await toPng(node, cfg);
    const finalData = fmt === "webp" ? await pngToWebp(data) : data;
    const ext = fmt === "jpeg" ? "jpg" : fmt;
    folder?.file(`slide-${String(i + 1).padStart(2, "0")}.${ext}`, finalData.split(",")[1], { base64: true });
    await new Promise((r) => setTimeout(r, 40));
  }
  folder?.file(
    "README.txt",
    `${s.company.name}\n${s.pres.preparedFor}\n\n${total} slides · ${PAPERS[s.export.paper]?.name} (${opts.w}×${opts.h}px) · ${s.export.imageFormat.toUpperCase()}\n\nSource: ${s.company.regOffice}\nContact: ${s.contact.person}, ${s.contact.phone}, ${s.contact.email}\n`,
  );
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, filename(s, "zip"));
}

/* --------------------------------------------------------------- settings */
export function exportSettingsJson(s: Settings) {
  saveAs(new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }), filename(s, "json"));
}

/* ----------------------------------------------------------------- colour */
function shadeHex(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const f = (v: number) => Math.round(v * (1 - amt)).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}
