/* ==========================================================================
   錦寓機電股份有限公司 ｜一頁式官網 互動腳本
   - 行動版選單切換
   - 區段標題滾動淡入（IntersectionObserver）
   - 平滑捲動到錨點時，扣除導覽列高度
   - 詢價表單以 mailto 開啟業主信箱
   ========================================================================== */

(function () {
  'use strict';

  // ---------- 1. lucide icons 啟動 ----------
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({
        attrs: { 'stroke-width': 1.5 }
      });
    } else {
      // 若 CDN 慢，重試一次
      setTimeout(initIcons, 200);
    }
  }
  initIcons();


  // ---------- 2. 行動版選單 ----------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navMobile.hidden = !isOpen;
    });

    // 點選單後自動關閉
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.hidden = true;
      });
    });
  }


  // ---------- 3. 區段標題滾動淡入 ----------
  const revealTargets = document.querySelectorAll(
    '.section__head, .qc__head, .about__copy, .about__photo'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    // 不支援 IO 的瀏覽器直接全部顯示
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }


  // ---------- 4. 平滑捲動（扣除導覽列高度） ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  // ---------- 5. 詢價表單 (mailto) ----------
  const form = document.getElementById('inquiryForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const get = function (name) {
        const f = form.elements.namedItem(name);
        return f ? f.value.trim() : '';
      };

      const name = get('name');
      const phone = get('phone');

      if (!name || !phone) {
        alert('請填寫姓名與聯絡電話。');
        return;
      }

      const company = get('company');
      const email = get('email');
      const type = get('type');
      const message = get('message');

      const subject = '【錦寓機電 線上詢價】' + name + (company ? '（' + company + '）' : '');
      const bodyLines = [
        '姓　　名：' + name,
        '公　　司：' + (company || '—'),
        '電　　話：' + phone,
        'Email　：' + (email || '—'),
        '工程類別：' + (type || '—'),
        '',
        '需求說明：',
        message || '（未填寫）',
        '',
        '— 透過官網詢價表單送出 —'
      ];

      const mailto = 'mailto:evo215766@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;
    });
  }


  // ---------- 6. 當前區段 active 樣式（可選） ----------
  const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionsForNav = Array.from(navLinks)
      .map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);

    const navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sectionsForNav.forEach(function (s) { navIO.observe(s); });
  }
})();
