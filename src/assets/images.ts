import hero from "./img/hero.jpg";
import soya from "./img/soya.jpg";
import feed from "./img/feed.jpg";
import dairy from "./img/dairy.jpg";
import poultry from "./img/poultry.jpg";
import oil from "./img/oil.jpg";
import mustard from "./img/mustard.jpg";
import soyfield from "./img/soyfield.jpg";
import silos from "./img/silos.jpg";
import silosaerial from "./img/silosaerial.jpg";
import solar from "./img/solar.jpg";
import lab from "./img/lab.jpg";
import warehouse from "./img/warehouse.jpg";
import pipes from "./img/pipes.jpg";
import farmers from "./img/farmers.jpg";
import workers from "./img/workers.jpg";
import truck from "./img/truck.jpg";

/** Selectable background graphics for cover and closing pages */
export const GRAPHIC_CHOICES = [
  { key: "hero", label: "Integrated plant — aerial (generated)" },
  { key: "silosaerial", label: "Silos & sunlight" },
  { key: "soyfield", label: "Soybean fields" },
  { key: "mustard", label: "Mustard fields" },
  { key: "pipes", label: "Process plant pipes" },
  { key: "solar", label: "Solar rooftop" },
  { key: "warehouse", label: "Warehousing" },
  { key: "farmers", label: "Farmers & fields" },
  { key: "custom", label: "Uploaded graphic" },
  { key: "none", label: "No background graphic" },
];

export function backgroundFor(style: string, custom: string | null): string | null {
  if (!style || style === "none") return null;
  if (style === "custom") return custom || null;
  return (IMG as Record<string, string>)[style] || IMG.hero;
}

export const IMG = {
  hero,
  soya,
  feed,
  dairy,
  poultry,
  oil,
  mustard,
  soyfield,
  silos,
  silosaerial,
  solar,
  lab,
  warehouse,
  pipes,
  farmers,
  workers,
  truck,
};
