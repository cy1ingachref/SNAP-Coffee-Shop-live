/* =====================================================================
 * SNAP Coffee — customer side (reads seats + menu from GitHub, no login)
 * Polls every 20s so changes the owner makes show up within ~20s.
 * If GitHub config isn't filled in, the static 20/20 card stays.
 * ===================================================================== */
(function () {
  'use strict';
  if (!window.SNAP_CONFIG_READY || !window.SNAP_CONFIG_READY()) return;

  var STORE = window.SNAP_STORE;
  var POLL_MS = 20000;

  /* ---------- live available places ---------- */
  var numEl = document.getElementById('availNum');
  var totalEl = document.getElementById('availTotal');
  var labelEl = document.getElementById('availLabel');
  var fillEl = document.getElementById('availFill');
  var updEl = document.getElementById('availUpdated');

  function fmtTime(ts) {
    if (!ts) return '';
    try { return 'Updated ' + new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }
  function renderSeats(data) {
    var d = data || {};
    var total = (typeof d.total === 'number') ? d.total : 20;
    var avail = (typeof d.available === 'number') ? d.available : total;
    avail = Math.max(0, Math.min(avail, total));
    if (numEl) numEl.textContent = avail;
    if (totalEl) totalEl.textContent = total;
    if (fillEl) {
      var pct = total > 0 ? (avail / total) * 100 : 0;
      fillEl.style.width = pct + '%';
      fillEl.classList.toggle('full', avail === total);
      fillEl.classList.toggle('empty', avail === 0);
    }
    if (labelEl) labelEl.textContent = avail === 0 ? 'Sorry — fully booked right now'
      : (avail === total ? 'Wide open, come on in!' : 'Seats free — drop by!');
    if (updEl) updEl.textContent = fmtTime(d.updatedAt);
  }

  /* ---------- live menu ---------- */
  var grid = document.querySelector('.menu-grid');
  var PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="100%" height="100%" fill="#f1e2d0"/>' +
    '<text x="50%" y="50%" font-family="Georgia,serif" font-size="26" fill="#c9a47a" text-anchor="middle" dominant-baseline="middle">SNAP</text></svg>'
  );
  function renderMenu(val) {
    if (!val || !Object.keys(val).length || !grid) return;
    var items = Object.keys(val).map(function (k) { return val[k]; });
    items.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    grid.innerHTML = items.map(function (it) {
      var cat = it.cat || 'food';
      var img = it.img ? it.img : PLACEHOLDER;
      var badge = it.badge
        ? '<div class="dish-badge ' + it.badge + '">' + it.badge.charAt(0).toUpperCase() + it.badge.slice(1) + '</div>' : '';
      var price = (typeof it.price === 'number') ? it.price : (it.price || '');
      return '<article class="dish" data-cat="' + cat + '">' +
        '<div class="dish-img"><img src="' + img + '" alt="' + (it.name || '') + '" loading="lazy" /></div>' +
        '<div class="dish-body">' + badge +
        '<h3 class="dish-name">' + (it.name || '') + '</h3>' +
        '<p class="dish-desc">' + (it.desc || '') + '</p>' +
        '<span class="dish-price">' + price + '</span></div></article>';
    }).join('');
    var active = document.querySelector('.menu-tab.active');
    var cat = active ? active.dataset.cat : 'all';
    grid.querySelectorAll('.dish').forEach(function (d) {
      d.style.display = (cat === 'all' || d.dataset.cat === cat) ? 'block' : 'none';
    });
  }

  function poll() {
    STORE.readSeats().then(function (r) { renderSeats(r.data); }).catch(function () {});
    STORE.readMenu().then(function (r) { renderMenu(r.data); }).catch(function () {});
  }
  poll();
  setInterval(poll, POLL_MS);
})();
