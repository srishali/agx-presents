import { createContext, useContext, type ComponentType } from "react";
import type { Settings } from "./brand/settings";

export type Part = "A" | "B";
export type SlideDef = {
  title: string | ((s: Settings) => string);
  part: Part;
  section: string;
  C: ComponentType;
};
export type Mode = "live" | "thumb" | "print";
export type Meta = {
  n: number;
  total: number;
  part: Part;
  section: string;
  title: string;
  mode: Mode;
};

export const MetaCtx = createContext<Meta>({
  n: 1,
  total: 50,
  part: "A",
  section: "",
  title: "",
  mode: "live",
});
export const useMeta = () => useContext(MetaCtx);
export const useAnim = () => useContext(MetaCtx).mode === "live";

export type DeckInfo = {
  slides: { title: string; part: Part; section: string }[];
  go: (i: number) => void;
};

export type DeckSlide = { title: string; part: Part; section: string };
export const DeckCtx = createContext<DeckInfo>({ slides: [], go: () => {} });
export const useDeck = () => useContext(DeckCtx);

/** Resolve a slide title, which may depend on settings (e.g. the State name) */
export const titleOf = (d: SlideDef, s: Settings) => (typeof d.title === "function" ? d.title(s) : d.title);

/** DPR section labels — used for headers and the table of contents */
export const SEC = {
  toc: "Contents",
  s1: "01 · Company Profile",
  s2: "02 · Project Overview",
  s3: "03 · Market Analysis",
  s4: "04 · Product Portfolio",
  s5: "05 · Technology & Operations",
  s6: "06 · Infrastructure & Utilities",
  s7: "07 · Organisation & Manpower",
  s8: "08 · Financial Analysis",
  s9: "09 · Strategy & Risk",
  s10: "10 · Compliance & Implementation",
};
