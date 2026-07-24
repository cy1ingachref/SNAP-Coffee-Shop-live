# SNAP Coffee — Live Seats & Menu (GitHub-hosted, private repo)

This adds a **live "available places" counter** and an **owner admin page** to
edit the menu (with photos). Data lives as JSON in this repo
(`data/seats.json`, `data/menu.json`). The site is on **GitHub Pages** (public),
while the **repo itself is private** — so your source code is hidden but the
live site still works for anyone with the URL.

> Orders are NOT included yet (you said ignore Glovo orders for now — this build
> only does the seat counter + menu management).

---

## How the owner logs in (admin.html)
1. Open `admin.html` (or click **Owner sign-in** in the footer).
2. Username: **`adminsnap`**
3. Password: **`adminsnapmourad123`**
4. A GitHub token is embedded in the repo (`github-token.js`) so the owner
   doesn't paste one — but a token can be pasted in the optional field to
   override it (e.g. if you rotate the token).

After login the owner can:
- **Available places**: − / + to change the live number, or set total seats + Save.
- **Menu**: Add / Edit / Delete items with photo upload (auto-resized).
- Click **Import current site menu** to re-pull the 16 dishes.

How customers see it: the public site reads `data/seats.json` + `data/menu.json`
as **same-origin Pages files** (served publicly even though the repo is private),
and refreshes every 20s. So when the owner saves, customers see the change
within ~20–40 seconds (Pages rebuild + browser poll).

---

## How the write token works (security)
- GitHub's **secret scanning BLOCKS** committing a real PAT into the repo, so the
  token is NOT stored in `github-token.js`. Instead, the owner pastes their PAT
  **once** in the admin page; it's saved in **that browser** (localStorage) and
  reused on later logins. So daily use is just **username + password**.
- The token has `repo` scope. If it ever leaks, revoke it at GitHub → Settings →
  Developer settings → Tokens and make a new one.
- For stronger isolation, generate a **fine-grained PAT** scoped to only this
  repo (Contents: Read and write) and paste it into `github-token.js` (private
  repo). Note GitHub may still flag a hardcoded PAT on push — the browser-save
  approach avoids that entirely.

---

## Deploy / update
```bash
git add -A
git commit -m "your message"
git push
```
GitHub Pages rebuilds automatically. No build step.

## Files
- `github-config.js` — repo + branch.
- `github-token.js` — embedded write token (private repo; do NOT share).
- `github-store.js` — reads (public Pages file) + writes (GitHub API).
- `customer-github.js` — public site reader (seats + menu, polls every 20s).
- `admin.html` / `admin-github.js` / `admin.css` — owner dashboard.
- `data/seats.json`, `data/menu.json` — the live data.
- `SETUP.md` — this file.
