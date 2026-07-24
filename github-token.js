/* =====================================================================
 * SNAP Coffee — write token (GitHub PAT)
 * ---------------------------------------------------------------------
 * NOTE: GitHub's secret scanning BLOCKS committing a real PAT here, so
 * this file ships EMPTY. The owner pastes their PAT once in the admin
 * page; it is saved in THAT browser (localStorage) and reused on later
 * logins, so daily use is just username + password.
 *
 * To make it fully "no token ever": generate a fine-grained PAT scoped
 * to this repo, paste it below between the quotes, and push.
 *   window.SNAP_PAT = "github_pat_xxx";
 * (If you do that on a private repo, GitHub may still flag it — see SETUP.md.)
 * ===================================================================== */
window.SNAP_PAT = "";
