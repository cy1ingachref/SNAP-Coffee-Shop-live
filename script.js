// ===== SNAP Coffee — interactions =====
(function () {
  'use strict';
  var header = document.getElementById('header');
  var heroImg = document.querySelector('.float-cup');
  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 40);
    if (heroImg && y < window.innerHeight) heroImg.style.transform = 'translateY(' + (y * 0.12) + 'px)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var backdrop = document.getElementById('navBackdrop');
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (backdrop) {
      backdrop.classList.toggle('show', open);
      backdrop.hidden = !open;
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760 && navLinks.classList.contains('open')) setMenu(false);
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // ===== i18n =====
  var I18N = {
    en: {
      'meta.title': 'SNAP Coffee — Artisan Coffee & Fresh Bites · Ariana, Tunis',
      'meta.desc': 'SNAP Coffee in Ariana (Les Jardins de Babylon) — single-origin coffee, in-house pastries and a calm space for students and remote workers. Open until midnight. Rated 4.3 on Google.',
      'brand.sub': 'coffee',
      'nav.menu': 'Menu', 'nav.reviews': 'Reviews', 'nav.visit': 'Visit',
      'hero.eyebrow': 'Ariana · Les Jardins de Babylon',
      'hero.title': 'Slow mornings,<br><em>bright</em> cups.',
      'hero.lead': 'A neighbourhood café where every cup is pulled with care — for students, remote workers, and anyone who likes their coffee made well.',
      'hero.point1': 'Single-origin beans, ground to order',
      'hero.point2': 'Pastries baked fresh each morning',
      'hero.point3': 'A quiet corner to study & meet',
      'hero.cta1': 'Explore the menu', 'hero.cta2': 'Find us',
      'menu.eyebrow': 'From the bar & the kitchen',
      'menu.title': 'The Menu',
      'menu.sub': 'Simple, fresh, made to order',
      'menu.tab_all': 'All', 'menu.tab_coffee': 'Coffee & Drinks', 'menu.tab_food': 'Food & Bites', 'menu.tab_breakfast': 'Petit Déj',
      'menu.foot': 'Prices are indicative — ask in-store for the day’s specials.',
      'badge.best': 'Best seller', 'badge.new': 'New', 'badge.local': 'Local',
      'dish.espresso.name': 'Espresso', 'dish.espresso.desc': 'A short, intense shot with a caramel crema.',
      'dish.cappuccino.name': 'Cappuccino', 'dish.cappuccino.desc': 'Equal parts espresso, steamed milk and micro-foam.',
      'dish.drink.name': 'Signature Drink', 'dish.drink.desc': 'Our house blend, sweet and refreshing.',
      'dish.croissant.name': 'Butter Croissant', 'dish.croissant.desc': 'Laminated, flaky, baked at dawn.',
      'dish.sandwich.name': 'Ham & Cheese Sandwich', 'dish.sandwich.desc': 'Toasted baguette with ham, melted cheese, lettuce & tomato, herb aioli. Served with fries, side salad & sauce.',
      'dish.thai.name': 'Thai Chicken Sandwich', 'dish.thai.desc': 'Chicken with a Thai-style spicy-sweet dressing.',
      'dish.crepe.name': 'Ham & Cheese Crêpe', 'dish.crepe.desc': 'Soft crêpe folded around ham and cheese.',
      'dish.csep.name': 'Savory Crêpe', 'dish.csep.desc': 'Filled with fresh vegetables and cheese.',
      'dish.waffle.name': 'Waffle', 'dish.waffle.desc': 'Crisp waffle, dusted with sugar.',
      'dish.belgian.name': 'Belgian Waffle', 'dish.belgian.desc': 'Thick, golden waffle with your favourite topping.',
      'dish.banana.name': 'Banana Waffle', 'dish.banana.desc': 'Warm waffle, fresh banana, milk-chocolate drizzle & biscuit crumble, whipped cream.',
      'dish.oreo.name': 'Oreo Waffle', 'dish.oreo.desc': 'Belgian waffle, dark-chocolate sauce, crushed Oreo, cream & mint.',
      'dish.almond.name': 'Almond & Chocolate Waffle', 'dish.almond.desc': 'Roasted almonds, milk-chocolate drizzle, cocoa dusting, with mousse & vanilla ice cream.',
      'dish.pdj1.name': 'Petit Déj — 1 Person', 'dish.pdj1.desc': 'Coffee or café crème, mineral water, milk, chocolate crepe, croissant, sliced baguette & a trio of spreads (butter, chocolate, apricot jam).',
      'dish.pdj2.name': 'Petit Déj — 2 Persons', 'dish.pdj2.desc': 'For two: fresh orange juice & espresso, sweet chocolate crepe, savory ham & cheese galette, toast, scrambled eggs, green salad & tomato.',
      'dish.pdjt.name': 'Petit Déj Tunisien', 'dish.pdjt.desc': 'Msemen & pastry, fried egg, salad (lettuce, tomato, cucumber, orange), harissa, labneh, olive oil, honey & coffee.',
      'reviews.eyebrow': 'Loved locally', 'reviews.title': 'What people say',
      'reviews.from': 'from', 'reviews.google': 'Google reviews',
      'reviews.r1': '“Best study spot around. The Wi-Fi is solid and the latte is always on point.”',
      'reviews.r2': '“Their sandwich is unreal for the price. I come here every lunch break.”',
      'reviews.r3': '“Cozy, quiet, friendly. Feels like a second living room during exam season.”',
      'reviews.regular': 'regular', 'reviews.worker': 'nearby worker', 'reviews.student': 'student',
      'visit.eyebrow': 'Come say hi', 'visit.title': 'Visit SNAP',
      'visit.where': 'Where', 'visit.call': 'Call', 'visit.hours': 'Hours',
      'visit.hours_val': 'Open daily · until 12:00 AM',
      'visit.price': 'Price', 'visit.find': 'Find', 'visit.maps': 'View on Google Maps',
      'visit.whatsapp': 'Message us on WhatsApp',
      'visit.tap': 'Tap to open · Les Jardins de Babylon, Ariana 2037',
      'footer.copy': 'SNAP Coffee · Ariana, Tunis'
    },
    fr: {
      'meta.title': 'SNAP Coffee — Café artisanal & gourmandises · Ariana, Tunis',
      'meta.desc': 'SNAP Coffee à Ariana (Les Jardins de Babylon) — cafés de spécialité, pâtisseries maison et un coin calme pour les étudiants et les télétravailleurs. Ouvert jusqu’à minuit. Noté 4,3 sur Google.',
      'brand.sub': 'coffee',
      'nav.menu': 'Menu', 'nav.reviews': 'Avis', 'nav.visit': 'Visite',
      'hero.eyebrow': 'Ariana · Les Jardins de Babylon',
      'hero.title': 'Matinées lentes,<br><em>tasses</em> lumineuses.',
      'hero.lead': 'Un café de quartier où chaque tasse est préparée avec soin — pour les étudiants, les télétravailleurs et tous les amateurs de bon café.',
      'hero.point1': 'Cafés de spécialité, moulus sur commande',
      'hero.point2': 'Pâtisseries fraîches, cuites chaque matin',
      'hero.point3': 'Un coin calme pour étudier & se retrouver',
      'hero.cta1': 'Découvrir le menu', 'hero.cta2': 'Nous trouver',
      'menu.eyebrow': 'Du comptoir & de la cuisine',
      'menu.title': 'La Carte',
      'menu.sub': 'Simple, frais, fait sur commande',
      'menu.tab_all': 'Tout', 'menu.tab_coffee': 'Cafés & Boissons', 'menu.tab_food': 'Manger & Snacks', 'menu.tab_breakfast': 'Petit Déj',
      'menu.foot': 'Prix indicatifs — demandez les spéciaux du jour en magasin.',
      'badge.best': 'Best-seller', 'badge.new': 'Nouveau', 'badge.local': 'Local',
      'dish.espresso.name': 'Espresso', 'dish.espresso.desc': 'Une courte et intense shot avec une crème caramel.',
      'dish.cappuccino.name': 'Cappuccino', 'dish.cappuccino.desc': 'Parts égales d’espresso, lait mousseux et micro-mousse.',
      'dish.drink.name': 'Boisson Signature', 'dish.drink.desc': 'Notre mélange maison, doux et rafraîchissant.',
      'dish.croissant.name': 'Croissant au Beurre', 'dish.croissant.desc': 'Feuilleté, croustillant, cuit à l’aube.',
      'dish.sandwich.name': 'Sandwich Jambon & Fromage', 'dish.sandwich.desc': 'Baguette grillée, jambon, fromage fondu, salade & tomate, aïoli aux herbes. Servi avec frites, salade et sauce.',
      'dish.thai.name': 'Sandwich Poulet Thaï', 'dish.thai.desc': 'Poulet avec une sauce thaï épicée-sucrée.',
      'dish.crepe.name': 'Crêpe Jambon & Fromage', 'dish.crepe.desc': 'Crêpe souple garnie de jambon et fromage.',
      'dish.csep.name': 'Crêpe Salée', 'dish.csep.desc': 'Garnie de légumes frais et de fromage.',
      'dish.waffle.name': 'Gaufre', 'dish.waffle.desc': 'Gaufre croustillante, saupoudrée de sucre.',
      'dish.belgian.name': 'Gaufre Belge', 'dish.belgian.desc': 'Gaufre épaisse et dorée, avec votre garniture préférée.',
      'dish.banana.name': 'Gaufre Banane', 'dish.banana.desc': 'Gaufre tiède, banane fraîche, chocolat au lait & miettes de biscuit, crème fouettée.',
      'dish.oreo.name': 'Gaufre Oreo', 'dish.oreo.desc': 'Gaufre belge, sauce chocolat noir, Oreo écrasé, crème & menthe.',
      'dish.almond.name': 'Gaufre Amande & Chocolat', 'dish.almond.desc': 'Amandes grillées, chocolat au lait, cacao, mousse & glace vanille.',
      'dish.pdj1.name': 'Petit Déj — 1 Personne', 'dish.pdj1.desc': 'Café ou crème, eau minérale, lait, crêpe chocolat, croissant, baguette & trio de confitures (beurre, chocolat, abricot).',
      'dish.pdj2.name': 'Petit Déj — 2 Personnes', 'dish.pdj2.desc': 'Pour deux : jus d’orange & espresso, crêpe chocolat, galette salée jambon-fromage, toast, œufs brouillés, salade verte & tomate.',
      'dish.pdjt.name': 'Petit Déj Tunisien', 'dish.pdjt.desc': 'Msemen & pâtisserie, œuf sur le plat, salade (laitue, tomate, concombre, orange), harissa, labneh, huile d’olive, miel & café.',
      'reviews.eyebrow': 'Aimé des habitants', 'reviews.title': 'Ce qu’ils disent',
      'reviews.from': 'par', 'reviews.google': 'avis Google',
      'reviews.r1': '“Le meilleur endroit pour étudier. Le Wi-Fi est solide et le latte toujours parfait.”',
      'reviews.r2': '“Leur sandwich est incroyable pour le prix. J’y viens à chaque pause déjeuner.”',
      'reviews.r3': '“Cosy, calme, accueillant. Comme un second salon pendant les exams.”',
      'reviews.regular': 'habitué', 'reviews.worker': 'travailleur du coin', 'reviews.student': 'étudiant',
      'visit.eyebrow': 'Venez nous dire bonjour', 'visit.title': 'Visitez SNAP',
      'visit.where': 'Où', 'visit.call': 'Appel', 'visit.hours': 'Horaires',
      'visit.hours_val': 'Ouvert tous les jours · jusqu’à 00:00',
      'visit.price': 'Prix', 'visit.find': 'Trouver', 'visit.maps': 'Voir sur Google Maps',
      'visit.whatsapp': 'Messagez-nous sur WhatsApp',
      'visit.tap': 'Touchez pour ouvrir · Les Jardins de Babylon, Ariana 2037',
      'footer.copy': 'SNAP Coffee · Ariana, Tunis'
    },
    ar: {
      'meta.title': 'سناپ كوفي — قهوة حرفية ووجبات خفيفة طازجة · أريانة، تونس',
      'meta.desc': 'سناپ كوفي في أريانة (حدائق بابل) — قهوة مختصة، حلويات محضّرة يوميًا، ومكان هادئ للطلاب والعاملين عن بُعد. مفتوح حتى منتصف الليل. تقييم 4.3 على جوجل.',
      'brand.sub': 'coffee',
      'nav.menu': 'القائمة', 'nav.reviews': 'التقييمات', 'nav.visit': 'الزيارة',
      'hero.eyebrow': 'أريانة · حدائق بابل',
      'hero.title': 'صباحات هادئة،<br><em>أكواب</em> مشرقة.',
      'hero.lead': 'مقهى حيّ يُحضّر فيه كل كوب بعناية — للطلاب، والعاملين عن بُعد، وكل من يحب قهوته جيدة.',
      'hero.point1': 'حبوب قهوة مختصة، تُطحن عند الطلب',
      'hero.point2': 'حلويات محضّرة طازجة كل صباح',
      'hero.point3': 'مكان هادئ للدراسة واللقاء',
      'hero.cta1': 'تصفّح القائمة', 'hero.cta2': 'أين تجدنا',
      'menu.eyebrow': 'من البار والمطبخ',
      'menu.title': 'القائمة',
      'menu.sub': 'بسيط، طازج، يُحضّر عند الطلب',
      'menu.tab_all': 'الكل', 'menu.tab_coffee': 'قهوة ومشروبات', 'menu.tab_food': 'أكل وسناك', 'menu.tab_breakfast': 'بريك',
      'menu.foot': 'الأسعار تقريبية — اسأل في المحل عن عروض اليوم.',
      'badge.best': 'الأكثر مبيعًا', 'badge.new': 'جديد', 'badge.local': 'محلي',
      'dish.espresso.name': 'إسبريسو', 'dish.espresso.desc': 'جرعة قصيرة وكثيفة بلمعة كراميل.',
      'dish.cappuccino.name': 'كابتشينو', 'dish.cappuccino.desc': 'إسبريسو وحليب مُرَغى ورغوة ناعمة بالتساوي.',
      'dish.drink.name': 'مشروب مميّز', 'dish.drink.desc': 'خليطنا الخاص، حلو ومنعش.',
      'dish.croissant.name': 'كرواسون بالزبدة', 'dish.croissant.desc': 'مورق ومقرمش، يُخبز عند الفجر.',
      'dish.sandwich.name': 'ساندويتش جبن ولحم', 'dish.sandwich.desc': 'باغيت محمّص مع لحم وجبن ذائب وخس وطماطم ومايونيز عشبي. يُقدّم مع بطاطا مقلية وسلطة وصوص.',
      'dish.thai.name': 'ساندويتش دجاج تايلندي', 'dish.thai.desc': 'دجاج بتتبيلة تايلندية حلوة وحارة.',
      'dish.crepe.name': 'كريب جبن ولحم', 'dish.crepe.desc': 'كريب طري يلفّ حول اللحم والجبن.',
      'dish.csep.name': 'كريب مالح', 'dish.csep.desc': 'محشو بخضار طازجة وجبن.',
      'dish.waffle.name': 'وافل', 'dish.waffle.desc': 'وافل مقرمش مرشوش بالسكر.',
      'dish.belgian.name': 'وافل بلجيكي', 'dish.belgian.desc': 'وافل سميك ذهبي مع الإضافة المفضلة لديك.',
      'dish.banana.name': 'وافل موز', 'dish.banana.desc': 'وافل دافئ وموز طازج وصوص شوكولاتة بالحليب وفتات بسكويت وكريمة.',
      'dish.oreo.name': 'وافل أوريو', 'dish.oreo.desc': 'وافل بلجيكي وصوص شوكولاتة داكنة وأوريو مكسّر وكريمة ونعناع.',
      'dish.almond.name': 'وافل لوز وشوكولاتة', 'dish.almond.desc': 'لوز محمّص وصوص شوكولاتة بالحليب وكاكاو مع موسّ وجلاس فانيليا.',
      'dish.pdj1.name': 'بريك — شخص واحد', 'dish.pdj1.desc': 'قهوة أو كرème، ماء معدني، حليب، كريب شوكولاتة، كرواسون، بaguette وثلاثة أنواع من المربى (زبدة، شوكولاتة، مشمش).',
      'dish.pdj2.name': 'بريك — شخصان', 'dish.pdj2.desc': 'لشخصين: عصير برتقال طازج وإسبريسو، كريب شوكولاتة، galette مالح جبن ولحم، توست، بيض مخفوق، سلطة خضراء وطماطم.',
      'dish.pdjt.name': 'بريك تونسي', 'dish.pdjt.desc': 'msamen وحلويات، بيض مقلي، سلطة (خس وطماطم وخيار وبرتقال)، harissa، labneh، زيت زيتون، عسل وقهوة.',
      'reviews.eyebrow': 'محبوب محليًا', 'reviews.title': 'ماذا يقول الناس',
      'reviews.from': 'من', 'reviews.google': 'تقييمات جوجل',
      'reviews.r1': '“أفضل مكان للدراسة. الإنترنت قوي واللاتيه دائمًا ممتاز.”',
      'reviews.r2': '“الساندويتش عندهم خرافي مقابل السعر. أزورهم كل استراحة غداء.”',
      'reviews.r3': '“مريح وهادئ وودود. كأنه غرفة معيشة ثانية في موعد الامتحانات.”',
      'reviews.regular': 'زبون دائم', 'reviews.worker': 'عامل قريب', 'reviews.student': 'طالب',
      'visit.eyebrow': 'مرحبًا بك', 'visit.title': 'زوروا سناپ',
      'visit.where': 'المكان', 'visit.call': 'اتصال', 'visit.hours': 'الساعات',
      'visit.hours_val': 'مفتوح يوميًا · حتى 12:00 ص',
      'visit.price': 'السعر', 'visit.find': 'موقع', 'visit.maps': 'افتح في خرائط جوجل',
      'visit.whatsapp': 'راسلنا على واتساب',
      'visit.tap': 'اضغط للفتح · حدائق بابل، أريانة 2037',
      'footer.copy': 'سناپ كوفي · أريانة، تونس'
    }
  };
  function applyLang(lang) {
    var dict = I18N[lang] || I18N.en;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('snap-lang', lang); } catch (e) {}
  }
  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });
  var saved = null;
  try { saved = localStorage.getItem('snap-lang'); } catch (e) {}
  applyLang(saved || 'en');

  // Scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  // SAFETY: if a reveal element is never triggered, force everything visible.
  function revealAll() { document.body.classList.add('reveal-fallback'); }
  window.addEventListener('load', function () { setTimeout(revealAll, 1500); });
  setTimeout(revealAll, 3000);

  // Count-up
  function countUp(el, target, dur, decimals) {
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(tick);
  }
  var scoreEl = document.querySelector('.score');
  var numEl = document.querySelector('.review-count .num');
  var reviewsSec = document.getElementById('reviews');
  var rated = false;
  var rIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !rated) {
        rated = true;
        if (scoreEl) countUp(scoreEl, 4.3, 1200, 1);
        if (numEl) countUp(numEl, 26, 1400, 0);
        rIo.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (reviewsSec) rIo.observe(reviewsSec);

  // Menu filter
  var tabs = document.querySelectorAll('.menu-tab');
  var dishes = document.querySelectorAll('.dish');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var cat = t.dataset.cat;
      dishes.forEach(function (d) {
        var show = cat === 'all' || d.dataset.cat === cat;
        d.style.display = show ? 'block' : 'none';
        if (show) { d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop'); }
      });
    });
  });

  // Lightbox
  var cards = Array.prototype.slice.call(document.querySelectorAll('.g-card'));
  var lb = document.querySelector('.lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('.lb-cap');
  var current = 0;
  function openLb(i) {
    current = i;
    var c = cards[i];
    lbImg.src = c.querySelector('img').src;
    lbImg.alt = c.querySelector('img').alt;
    lbCap.textContent = c.querySelector('figcaption').textContent;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function step(d) { openLb((current + d + cards.length) % cards.length); }
  cards.forEach(function (c, i) { c.addEventListener('click', function () { openLb(i); }); });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  // Year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
