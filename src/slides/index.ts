import type { SlideDef } from "../deck";
import { EXEC } from "./exec";
import { DPR1 } from "./dpr1";
import { DPR2 } from "./dpr2";
import { DPR3 } from "./dpr3";
import { DPR4 } from "./dpr4";

/** 50 pages: 1–10 Executive Brief (Part A), 11–50 Detailed Project Report (Part B) */
export const SLIDES: SlideDef[] = [...EXEC, ...DPR1, ...DPR2, ...DPR3, ...DPR4];
