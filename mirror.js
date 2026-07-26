/* =====================================================================
 * SNAP Coffee — owner mirror (live site)
 * Reads the SAME data/seats.json the admin panel writes, and shows that
 * live seat count inside the <fieldset id="mirrorFieldset"> on the public
 * page. Seats can ONLY be changed in the admin; this is a read-only mirror.
 * No inline script (CSP) — kept as an external file loaded by index.html.
 * ===================================================================== */
(function () {
  'use strict';
  if (!window.SNAP_CONFIG_READY || !window.SNAP_CONFIG_READY()) return;
  var STORE = window.SNAP_STORE;

  var availEl = document.getElementById('mirrorAvail');
  var totalEl = document.getElementById('mirrorTotal');

  function render(data) {
    var d = data || {};
    var total = (typeof d.total === 'number') ? d.total : 20;
    var avail = (typeof d.available === 'number') ? d.available : total;
    avail = Math.max(0, Math.min(avail, total));
    if (availEl) availEl.textContent = avail;
    if (totalEl) totalEl.textContent = total;
  }

  function refresh() {
    STORE.readSeats().then(function (r) { render(r.data); }).catch(function () {});
  }

  // Keep the admin link absolute so it always points at the genuine admin.
  var link = document.getElementById('mirrorLink');
  if (link) {
    try {
      var base = new URL('admin.html', window.location.href);
      link.href = base.href;
    } catch (e) { /* keep relative fallback */ }
  }

  refresh();
  // Refresh soon after the tab regains focus, so a decrement the owner just
  // made in the admin shows on the public site with minimal delay.
  window.addEventListener('focus', function () { refresh(); });
  window.addEventListener('pageshow', function () { refresh(); });
  setInterval(refresh, 15000);
})();
