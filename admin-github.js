/* =====================================================================
 * SNAP Coffee — Admin dashboard (GitHub-stored, owner-only)
 * Login = GitHub Personal Access Token (PAT) + an owner password
 * (so the token isn't usable by just anyone who opens the page).
 * Writes seats + menu JSON files to the repo via the GitHub API.
 * ===================================================================== */
(function () {
  'use strict';

  var loginView = document.getElementById('loginView');
  if (!window.SNAP_CONFIG_READY || !window.SNAP_CONFIG_READY()) {
    if (loginView) loginView.innerHTML =
      '<div class="login-card"><img class="login-logo" src="images/snap-logo.jpg" alt="SNAP" />' +
      '<h1>SNAP Admin</h1><p class="login-sub">Not configured yet.</p>' +
      '<p class="admin-error">Open <b>github-config.js</b> and set repo + branch, then reload. See SETUP.md.</p></div>';
    return;
  }

  var STORE = window.SNAP_STORE;
  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }
  var toastTimer;
  function toast(msg, isErr) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.classList.toggle('err', !!isErr); show(t);
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { hide(t); }, 2600);
  }

  var OWNER_USER = "adminsnap";
  var OWNER_PW = "adminsnapmourad123";
  var TOKEN_KEY = 'snap-gh-token';
  var loggedIn = false;

  function savedToken() { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }

  /* ---- login ---- */
  function tryUnlock() {
    var user = $('loginUser').value.trim();
    var pw = $('loginPw').value;
    var override = $('loginToken').value.trim();
    if (user !== OWNER_USER || pw !== OWNER_PW) { showLoginErr('Wrong username or password.'); return; }
    // Token source: pasted field > previously saved in this browser > embedded (empty here)
    var token = override || savedToken() || STORE.embeddedPat;
    if (!token) { showLoginErr('First time: paste your GitHub token (PAT) below. It is saved on this device.'); return; }
    // verify token works by reading the seats file via the API (proves token valid + repo access)
    STORE.verifyToken(token).then(function () {
      try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
      loggedIn = true;
      hide(loginView); show($('dashView')); initDashboard();
    }).catch(function (err) { showLoginErr(err.message || 'Token rejected by GitHub.'); });
  }
  $('loginForm').addEventListener('submit', function (e) { e.preventDefault(); tryUnlock(); });
  function showLoginErr(m) { var el = $('loginError'); el.textContent = m; show(el); }

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }
  $('logoutBtn').addEventListener('click', function () {
    loggedIn = false; hide($('dashView')); show($('loginView')); $('loginToken').value = ''; $('loginPw').value = '';
  });

  /* ---- dashboard ---- */
  var seatsSha = null, menuSha = null;
  var menuItems = {}, editId = null, currentEditImg = null;

  function initDashboard() {
    STORE.readSeats(getToken()).then(function (r) {
      seatsSha = r.sha;
      var d = r.data || {};
      var total = (typeof d.total === 'number') ? d.total : 20;
      var avail = (typeof d.available === 'number') ? d.available : total;
      avail = Math.max(0, Math.min(avail, total));
      $('seatAvail').textContent = avail; $('seatTotal').textContent = total;
      $('seatTotalInput').value = total;
      if (d.updatedAt) $('seatUpdated').textContent = 'Updated ' + new Date(d.updatedAt).toLocaleTimeString();
    }).catch(function () { toast('Could not load seats', true); });

    STORE.readMenu(getToken()).then(function (r) {
      menuSha = r.sha; menuItems = r.data || {}; renderMenuList();
    }).catch(function () { toast('Could not load menu', true); });
  }

  function writeSeats(avail, total) {
    var payload = { total: total, available: avail, updatedAt: Date.now() };
    STORE.writeSeats(payload, seatsSha, getToken()).then(function (sha) {
      seatsSha = sha;
      $('seatUpdated').textContent = 'Updated ' + new Date().toLocaleTimeString();
      toast('Seats saved');
    }).catch(function (e) { toast('Save failed: ' + e.message, true); });
  }
  $('seatMinus').addEventListener('click', function () {
    var a = +$('seatAvail').textContent || 0, t = +$('seatTotal').textContent || 0;
    writeSeats(Math.max(0, a - 1), t);
  });
  $('seatPlus').addEventListener('click', function () {
    var a = +$('seatAvail').textContent || 0, t = +$('seatTotal').textContent || 0;
    writeSeats(Math.min(t, a + 1), t);
  });
  $('seatSave').addEventListener('click', function () {
    var t = Math.max(0, +$('seatTotalInput').value || 0);
    var a = Math.min(+$('seatAvail').textContent || 0, t);
    writeSeats(a, t);
  });

  function renderMenuList() {
    var ul = $('menuList'); var keys = Object.keys(menuItems);
    if (!keys.length) { ul.innerHTML = '<li class="empty">No items yet. Add one, or import the current site menu.</li>'; return; }
    keys.sort(function (a, b) { return (menuItems[a].order || 0) - (menuItems[b].order || 0); });
    ul.innerHTML = keys.map(function (k) {
      var it = menuItems[k];
      var img = it.img ? '<img src="' + it.img + '" alt="" />' : '<div class="no-img">img</div>';
      var badge = it.badge ? '<span class="chip">' + it.badge + '</span>' : '';
      var price = (typeof it.price === 'number') ? it.price + ' TND' : '';
      return '<li class="mi" data-id="' + k + '"><div class="mi-img">' + img + '</div>' +
        '<div class="mi-body"><strong>' + (it.name || '') + '</strong> ' + badge +
        '<span class="mi-cat">' + (it.cat || '') + '</span><p>' + (it.desc || '') + '</p></div>' +
        '<div class="mi-price">' + price + '</div>' +
        '<div class="mi-actions"><button class="btn-admin ghost edit" data-id="' + k + '">Edit</button>' +
        '<button class="btn-admin danger del" data-id="' + k + '">Delete</button></div></li>';
    }).join('');
    ul.querySelectorAll('.edit').forEach(function (b) { b.addEventListener('click', function () { startEdit(b.dataset.id); }); });
    ul.querySelectorAll('.del').forEach(function (b) { b.addEventListener('click', function () { deleteItem(b.dataset.id); }); });
  }
  function deleteItem(id) {
    if (!confirm('Delete this menu item?')) return;
    var next = Object.assign({}, menuItems); delete next[id];
    STORE.writeMenu(next, menuSha, getToken()).then(function (sha) { menuSha = sha; menuItems = next; renderMenuList(); toast('Item deleted'); })
      .catch(function (e) { toast('Delete failed: ' + e.message, true); });
  }
  function startEdit(id) {
    var it = menuItems[id]; if (!it) return;
    editId = id; currentEditImg = it.img || null;
    $('menuId').value = id; $('menuName').value = it.name || ''; $('menuCat').value = it.cat || 'food';
    $('menuPrice').value = (typeof it.price === 'number') ? it.price : ''; $('menuDesc').value = it.desc || '';
    $('menuBadge').value = it.badge || '';
    $('menuSubmit').textContent = 'Save changes'; show($('menuCancel'));
    if (currentEditImg) showPreview(currentEditImg); else hidePreview();
  }
  $('menuCancel').addEventListener('click', resetForm);
  function resetForm() {
    editId = null; currentEditImg = null; $('menuForm').reset(); $('menuId').value = '';
    $('menuSubmit').textContent = 'Add item'; hide($('menuCancel')); hidePreview();
  }
  var imgInput = $('menuImg');
  imgInput.addEventListener('change', function () {
    var file = imgInput.files && imgInput.files[0]; if (!file) return;
    resizeImage(file).then(function (d) { currentEditImg = d; showPreview(d); }).catch(function () { toast('Could not read image', true); });
  });
  function showPreview(src) { $('imgPreviewImg').src = src; show($('imgPreview')); }
  function hidePreview() { hide($('imgPreview')); $('imgPreviewImg').src = ''; }
  function resizeImage(file, maxW, q) {
    maxW = maxW || 720; q = q || 0.82;
    return new Promise(function (res, rej) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var w = img.width, h = img.height; if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h); res(c.toDataURL('image/jpeg', q));
        };
        img.onerror = rej; img.src = reader.result;
      };
      reader.onerror = rej; reader.readAsDataURL(file);
    });
  }
  $('menuForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('menuName').value.trim(); if (!name) { toast('Name is required', true); return; }
    var item = {
      name: name, cat: $('menuCat').value,
      price: parseFloat($('menuPrice').value) || 0,
      desc: $('menuDesc').value.trim(), badge: $('menuBadge').value,
      img: currentEditImg, order: (menuItems[editId] && menuItems[editId].order) || Object.keys(menuItems).length
    };
    var next = Object.assign({}, menuItems);
    var id = editId || ('m_' + Date.now());
    next[id] = item;
    STORE.writeMenu(next, menuSha, getToken()).then(function (sha) {
      menuSha = sha; menuItems = next; renderMenuList(); resetForm(); toast(editId ? 'Saved' : 'Item added');
    }).catch(function (er) { toast('Save failed: ' + er.message, true); });
  });

  $('importMenu').addEventListener('click', function () {
    if (Object.keys(menuItems).length && !confirm('Import will ADD the current site menu items. Continue?')) return;
    fetch('index.html').then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var dishes = doc.querySelectorAll('.menu-grid .dish');
      if (!dishes.length) { toast('No menu found', true); return; }
      var base = Object.keys(menuItems).length; var next = Object.assign({}, menuItems);
      dishes.forEach(function (d, i) {
        var id = 'imp_' + i;
        var img = d.querySelector('.dish-img img');
        var badge = d.querySelector('.dish-badge');
        var btext = badge ? badge.textContent.trim().toLowerCase() : '';
        var bval = btext.indexOf('best') > -1 ? 'best' : btext.indexOf('new') > -1 ? 'new' : btext.indexOf('local') > -1 ? 'local' : '';
        next[id] = {
          name: (d.querySelector('.dish-name') || {}).textContent || '',
          cat: d.getAttribute('data-cat') || 'food',
          price: parseFloat((d.querySelector('.dish-price') || {}).textContent) || 0,
          desc: (d.querySelector('.dish-desc') || {}).textContent || '',
          badge: bval, img: img ? img.getAttribute('src') : '', order: base + i
        };
      });
      STORE.writeMenu(next, menuSha, getToken()).then(function (sha) { menuSha = sha; menuItems = next; renderMenuList(); toast('Imported ' + dishes.length + ' items'); })
        .catch(function (er) { toast('Import failed: ' + er.message, true); });
    }).catch(function () { toast('Import failed', true); });
  });
})();
