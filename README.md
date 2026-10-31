# AGROMAX — Investment Proposal & Detailed Project Report

A 50-page interactive presentation (React + Vite + Tailwind). The build produces a **single self-contained `dist/index.html`** with all images inside it, so it can be hosted on any static host.

---

## 1. Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # creates dist/index.html
npm run preview    # serve the production build
```

Requires **Node.js 20 or 22** (pinned in `.nvmrc` and `package.json → engines`).

---

## 2. Push to GitHub (free)

> ⚠️ **Do NOT upload `node_modules/` or `dist/`.** They are excluded by `.gitignore`.
> Uploading `node_modules` from Windows/Mac is the #1 cause of failed Vercel builds.

**Option A — command line**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

**Option B — GitHub website upload:** drag in everything **except** `node_modules` and `dist`.
Make sure these are included: `src/` (with `src/assets/img/` — 17 photos), `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `vercel.json`, `.gitignore`, `.nvmrc`.

The repo can be **private** — Vercel's free Hobby plan can deploy private repos.

---

## 3. Deploy on Vercel (free Hobby plan)

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. **Import** your repository.
3. Settings are read from `vercel.json` automatically — leave the defaults:

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `./` *(change only if the project sits in a sub-folder of the repo)* |
   | Install Command | `npm install --no-audit --no-fund` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Node.js Version | 20.x or 22.x *(Project → Settings → Build & Deployment)* |

4. Click **Deploy**. Every `git push` to `main` then redeploys automatically.

---

## 4. Troubleshooting Vercel errors

| Error in the build log | Cause | Fix |
|---|---|---|
| `Cannot find module @rollup/rollup-linux-x64-gnu` / `@tailwindcss/oxide-linux-x64-gnu` / `lightningcss.linux-x64-gnu.node` | `node_modules` was committed, or `package-lock.json` was created on Windows/Mac without Linux binaries | Delete `node_modules` from the repo (`git rm -r --cached node_modules`), then on your PC: delete `node_modules` **and** `package-lock.json`, run `npm install`, commit the new lock file, push |
| `Could not resolve "./img/hero.jpg"` | Image folder not uploaded | Make sure `src/assets/img/` with all 17 `.jpg` files is in the repo |
| `No Output Directory named "dist" found` | Wrong Output Directory or Root Directory | Output Directory = `dist`; Root Directory = the folder containing `package.json` |
| `sh: vite: command not found` / `vite: Permission denied` | `node_modules` committed from another OS | Remove `node_modules` from the repo (see first row) |
| `Unsupported engine` / syntax errors in Vite | Old Node version | Set Node.js to 20.x or 22.x in Vercel project settings |
| `404: NOT_FOUND` after a successful build | Output Directory points to the wrong folder | Set Output Directory to `dist` and redeploy |
| Build works locally but import fails on Vercel | File-name case mismatch (Linux is case-sensitive) | File names must match imports exactly, e.g. `hero.jpg` not `Hero.JPG` |

**Fastest recovery:** Vercel → Project → Deployments → ⋯ → **Redeploy** with "Use existing Build Cache" **unchecked**.

---

## 5. Notes

- Free-plan limits are not an issue: one ~4.3 MB HTML file, build time ≈ 10 seconds.
- Customisation (company, logo, colours, fonts, paper size) is done in the hidden **⋮** menu at the top-right of the app and is saved in the viewer's browser. To share a configuration, use **Settings → Admin → Export** and **Import** the `.json` file on the other machine.
