# SNAP Coffee — Live Seats & Menu (GitHub Pages, private source + public live)

This adds a **live "available places" counter** and an **owner admin page** to
edit the menu (with photos). Data lives as JSON in this repo
(`data/seats.json`, `data/menu.json`). The site is on **GitHub Pages** (public),
while the **source code is in a PRIVATE repo** so it's hidden.

> **Two repos:**
> - `cy1ingachref/SNAP-Coffee-Shop` — **PRIVATE** source code (your vault).
> - `cy1ingachref/SNAP-Coffee-Shop-live` — **PUBLIC**, what GitHub Pages serves
>   (this repo). Customers read `data/*.json` here; the owner writes here.
>
> GitHub Free can't serve Pages from a private repo, so the live site lives in
> the public `SNAP-Coffee-Shop-live` repo while source stays private.

> Orders are NOT included yet (you said ignore Glovo orders for now — this build
> only does the seat counter + menu management).

---

## How the owner logs in (admin.html)
1. Open `https://cy1ingachref.github.io/SNAP-Coffee-Shop-live/admin.html`
   (or click **Owner sign-in** in the footer).
2. Username: **`adminsnap`**
3. Password: **`adminsnapmourad123`**
4. **First time only:** paste a GitHub PAT (with `repo` scope) in the token
   field. It's saved in your browser, so later logins are just user + password.

After login the owner can:
- **Available places**: − / + to change the live number, or set total seats + Save.
- **Menu**: Add / Edit / Delete items with photo upload (auto-resized).
- Click **Import current site menu** to re-pull the 16 dishes.

Customers see changes within ~20–40s (Pages rebuild + 20s browser poll).

---

## How the write token works (security)
- GitHub's **secret scanning BLOCKS** committing a real PAT into the repo, so the
  token is NOT stored in `github-token.js`. The owner pastes it **once**; it's
  saved in **that browser** (localStorage) and reused. Daily use = username + password.
- Token has `repo` scope. If leaked, revoke at GitHub → Settings → Developer
  settings → Tokens and make a new one.
- Username/password is a client-side gate ("keep casual visitors out"), not
  bank-grade. Rotate the PAT to a fine-grained token scoped to this repo for more
  isolation.

---

## Updating the site
Edit in the **private** `SNAP-Coffee-Shop` repo, then copy the files into the
**live** `SNAP-Coffee-Shop-live` repo and push. (Or just edit directly in the
live repo for quick changes.) No build step.

## Files
- `github-config.js` — points at `SNAP-Coffee-Shop-live` (the Pages repo).
- `github-token.js` — empty placeholder; owner pastes PAT in browser.
- `github-store.js` — reads (public Pages file) + writes (GitHub API).
- `customer-github.js` — public site reader (seats + menu, polls every 20s).
- `admin.html` / `admin-github.js` / `admin.css` — owner dashboard.
- `data/seats.json`, `data/menu.json` — the live data.
- `SETUP.md` — this file.
