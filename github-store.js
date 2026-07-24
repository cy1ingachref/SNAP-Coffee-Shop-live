/* =====================================================================
 * SNAP Coffee — shared GitHub storage layer
 * Reads/writes data/seats.json + data/menu.json in the repo via the
 * GitHub REST API. The owner's token is provided at runtime (admin),
 * or omitted (public read-only for customers).
 * ===================================================================== */
(function () {
  'use strict';

  var CFG = window.SNAP_CONFIG || { repo: "", branch: "main", folder: "data" };
  var API = "https://api.github.com";
  // Embedded write token (private repo keeps it hidden). Optional override via login.
  var EMBEDDED_PAT = window.SNAP_PAT || "";

  function authHeaders(token) {
    var h = { "Accept": "application/vnd.github+json", "Content-Type": "application/json" };
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
  }

  // PUBLIC read: same-origin Pages asset (works even when repo is private,
  // because GitHub Pages serves these files publicly).
  function readPublic(path) {
    return fetch(path + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) return { sha: null, data: null };
        return r.json().then(function (data) { return { sha: null, data: data }; });
      })
      .catch(function () { return { sha: null, data: null }; });
  }

  // WRITE: GitHub API (needs a token — the embedded PAT).
  function readFile(path, token) {
    return fetch(API + "/repos/" + CFG.repo + "/contents/" + path + "?ref=" + CFG.branch, {
      headers: authHeaders(token)
    }).then(function (r) {
      if (r.status === 404) return { sha: null, data: null };
      if (!r.ok) return r.json().then(function (e) { throw new Error(e.message || ("HTTP " + r.status)); });
      return r.json().then(function (j) {
        var data = j.content ? JSON.parse(decodeBase64(j.content)) : null;
        return { sha: j.sha, data: data };
      });
    });
  }

  function writeFile(path, contentObj, message, token, prevSha) {
    if (!token) return Promise.reject(new Error("Token required to write."));
    function buildBody(sha) {
      var b = {
        message: message,
        content: encodeBase64(JSON.stringify(contentObj, null, 2)),
        branch: CFG.branch
      };
      if (sha) b.sha = sha;
      return b;
    }
    // Retry once on 409: a PUT to an existing file without the current `sha`
    // (or with a stale one) is rejected by GitHub. Re-read the latest `sha`
    // and retry so a single click always succeeds.
    function attempt(sha, depth) {
      depth = depth || 0;
      return fetch(API + "/repos/" + CFG.repo + "/contents/" + path, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(buildBody(sha))
      }).then(function (r) {
        if (r.ok) return r.json();
        if (r.status === 409 && depth < 1) {
          return readFile(path, token).then(function (f) { return attempt(f.sha, depth + 1); });
        }
        return r.json().then(function (e) { throw new Error(e.message || ("HTTP " + r.status)); });
      });
    }
    return attempt(prevSha, 0).then(function (j) { return j.commit ? j.commit.sha : (j.content && j.content.sha); });
  }

  function encodeBase64(str) { return btoa(unescape(encodeURIComponent(str))); }
  function decodeBase64(b64) { return decodeURIComponent(escape(atob(b64.replace(/\s/g, "")))); }

  window.SNAP_STORE = {
    CFG: CFG,
    embeddedPat: EMBEDDED_PAT,
    // Customers: read same-origin Pages files (no token needed).
    readSeats: function () { return readPublic(CFG.folder + "/seats.json"); },
    readMenu: function () { return readPublic(CFG.folder + "/menu.json"); },
    // Owner: read via the authenticated API so we get the file's `sha`,
    // which GitHub requires to commit a change to an existing file.
    readSeatsAuth: function (token) { return readFile(CFG.folder + "/seats.json", token); },
    readMenuAuth: function (token) { return readFile(CFG.folder + "/menu.json", token); },
    // Owner writes: use provided token, else the embedded PAT.
    writeSeats: function (obj, sha, token) {
      return writeFile(CFG.folder + "/seats.json", obj, "SNAP: update available seats", token || EMBEDDED_PAT, sha);
    },
    writeMenu: function (obj, sha, token) {
      return writeFile(CFG.folder + "/menu.json", obj, "SNAP: update menu", token || EMBEDDED_PAT, sha);
    },
    // Validate a write token (used at login): API read of the data file.
    verifyToken: function (token) {
      return readFile(CFG.folder + "/seats.json", token).then(function () { return true; });
    }
  };
})();
