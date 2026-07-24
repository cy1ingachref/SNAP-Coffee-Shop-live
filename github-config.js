/* =====================================================================
 * SNAP Coffee — GitHub storage config
 * ---------------------------------------------------------------------
 * The site stores seats + menu as JSON files in this repo's `data/`
 * folder and updates them through the GitHub API.
 *
 * IMPORTANT: this is the PUBLIC "live" repo that GitHub Pages serves
 * (cy1ingachref/SNAP-Coffee-Shop-live). The private source repo
 * (cy1ingachref/SNAP-Coffee-Shop) just holds the code. Customers read
 * data/*.json from here; the owner writes here too (via their PAT).
 *
 *   repo:   "your-github-username/REPO-NAME"  (the Pages repo)
 *   branch: usually "main"
 *   folder: keep "data"
 * ===================================================================== */
window.SNAP_CONFIG = {
  repo: "cy1ingachref/SNAP-Coffee-Shop-live",
  branch: "main",
  folder: "data"
};

window.SNAP_CONFIG_READY = function () {
  var c = window.SNAP_CONFIG;
  return !!(c && c.repo && c.branch && !String(c.repo).startsWith("your-"));
};
