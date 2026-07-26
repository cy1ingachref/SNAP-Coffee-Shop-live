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

  // PUBLIC read: used by the customer site + the live mirror fieldset.
  // Primary path = the GitHub Contents API with ?ref=<branch>. It returns the
  // FRESH file (no CDN cache), so a seat change the admin makes shows up on the
  // public site within seconds instead of the ~minutes Pages CDN lag. Falls
  // back to the same-origin Pages asset if the API call fails (rate limit,
  // offline, etc.). Both read the SAME data/seats.json the admin writes to.
  function readPublic(path) {
    var apiUrl = API + "/repos/" + CFG.repo + "/contents/" + path + "?ref=" + CFG.branch;
    function fromApi() {
      return fetch(apiUrl, { headers: { "Accept": "application/vnd.github+json" } }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (j) {
        var data = j.content ? JSON.parse(decodeBase64(j.content)) : null;
        return { sha: j.sha || null, data: data };
      });
    }
    function fromPages() {
      return fetch(path + "?t=" + Date.now(), { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) return { sha: null, data: null };
          return r.json().then(function (data) { return { sha: null, data: data }; });
        })
        .catch(function () { return { sha: null, data: null }; });
    }
    return fromApi().catch(function () { return fromPages(); });
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
    // GitHub rejects a PUT whose `sha` is stale with HTTP 409 ("...does not
    // match <sha>"). This happens if the file was just changed OR — more
    // commonly — because the contents API has read-after-write lag and a
    // re-read still returns the old sha moments after a commit. So we LOOP:
    // re-read the latest sha and retry, with a short backoff to clear the lag
    // window. Up to 10 tries makes a single click effectively always succeed.
    function attempt(sha, depth) {
      depth = depth || 0;
      var MAX = 10;
      return fetch(API + "/repos/" + CFG.repo + "/contents/" + path, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(buildBody(sha))
      }).then(function (r) {
        if (r.ok) return r.json();
        if (r.status === 409 && depth < MAX) {
          return readFile(path, token).then(function (f) {
            return new Promise(function (res) {
              setTimeout(function () { res(attempt(f.sha, depth + 1)); }, 250);
            });
          });
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
