/* ============================================================
   SULAIMAN BALIKOOWA — PORTFOLIO MAIN JS
   ============================================================ */

'use strict';

/* ── PARTICLE SYSTEM ──────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = ['rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(236,72,153,'];
  const COUNT  = Math.min(60, Math.floor(window.innerWidth / 20));

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.3,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      a:    Math.random() * 0.5 + 0.15,
      color: c,
    };
  }

  function initParticleList() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function drawConnections() {
    const MAX_DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.15;
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.a + ')';
      ctx.fill();
    });
    animId = requestAnimationFrame(animate);
  }

  resize();
  initParticleList();
  animate();
  window.addEventListener('resize', () => { resize(); });
})();


/* ── NAVBAR ───────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    // Back to top visibility
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      navLinks && navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
})();


/* ── BACK TO TOP ──────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ── REVEAL ON SCROLL ─────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger sibling reveals
        const delay = Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
          .indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();


/* ── COUNTER ANIMATION ────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const val   = Math.round(eased * target);
        el.textContent = val.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();


/* ── SKILLS TABS ──────────────────────────────────────────── */
(function initTabs() {
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContent = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContent.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const content = document.getElementById(`tab-content-${target}`);
      if (content) {
        content.classList.add('active');
        // Re-animate chips
        const chips = content.querySelectorAll('.skill-chip');
        chips.forEach((chip, i) => {
          chip.style.opacity = '0';
          chip.style.transform = 'translateY(16px)';
          setTimeout(() => {
            chip.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            chip.style.opacity = '1';
            chip.style.transform = 'translateY(0)';
          }, i * 40);
        });
      }
    });
  });
})();


/* ── CONTACT FORM ─────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      shakeForm(document.getElementById('cf-email'));
      return;
    }

    // Simulate sending
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    await delay(1600);

    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    form.reset();
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
})();


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 80;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── SKILL CHIPS INITIAL ANIMATION ───────────────────────── */
(function animateInitialTab() {
  const chips = document.querySelectorAll('#tab-content-languages .skill-chip');
  chips.forEach((chip, i) => {
    chip.style.opacity = '0';
    chip.style.transform = 'translateY(16px)';
    setTimeout(() => {
      chip.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      chip.style.opacity = '1';
      chip.style.transform = 'translateY(0)';
    }, 300 + i * 45);
  });
})();


/* ── CURSOR GLOW EFFECT ───────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:300px; height:300px; border-radius:50%;
    background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: transform 0.1s linear, opacity 0.3s ease;
    opacity:0;
  `;
  document.body.appendChild(glow);
  let visible = false;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    if (!visible) { glow.style.opacity = '1'; visible = true; }
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });
})();


/* ── PROJECT CARD TILT ────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const rotateY =  (x / rect.width)  * 6;
      const rotateX = -(y / rect.height) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── TYPING EFFECT HERO ROLES ─────────────────────────────── */
(function initTypingGlow() {
  const roleTags = document.querySelectorAll('.role-tag');
  let idx = 0;
  function highlight() {
    roleTags.forEach(t => t.style.color = '');
    if (roleTags[idx]) {
      roleTags[idx].style.color = '#8b5cf6';
      roleTags[idx].style.textShadow = '0 0 12px rgba(139,92,246,0.6)';
      setTimeout(() => {
        if (roleTags[idx]) {
          roleTags[idx].style.color = '';
          roleTags[idx].style.textShadow = '';
        }
      }, 900);
    }
    idx = (idx + 1) % roleTags.length;
  }
  setInterval(highlight, 1800);
})();


/* ── CSS SHAKE KEYFRAME INJECTION ─────────────────────────── */
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
  `;
  document.head.appendChild(style);
})();


/* ── GITHUB ACTIVITY HEATMAP ──────────────────────────────── */
(function initGithubActivity() {

  /* ── Seeded pseudo-random (Mulberry32) for reproducible data ── */
  function seededRand(seed) {
    return function() {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── Generate realistic commit data for a whole year ── */
  function generateYearData(year) {
    const rand = seededRand(year * 31337 + 42);
    const start = new Date(year, 0, 1);
    const end   = new Date(year, 11, 31);
    const data  = {};
    const totalDays = Math.round((end - start) / 86400000) + 1;

    // activity profile — ramps up with experience
    const baseProb = { 2022: 0.28, 2023: 0.38, 2024: 0.50, 2025: 0.60 }[year] || 0.45;

    for (let d = 0; d < totalDays; d++) {
      const dt = new Date(start);
      dt.setDate(dt.getDate() + d);
      // stop at today for current year
      if (dt > new Date()) break;
      const dow  = dt.getDay(); // 0=Sun
      const key  = dt.toISOString().slice(0, 10);

      // weekends slightly lower probability
      const prob = dow === 0 || dow === 6 ? baseProb * 0.55 : baseProb;
      if (rand() > prob) { data[key] = 0; continue; }

      // commit count: mostly 1-3, occasional spree
      const r = rand();
      let commits;
      if      (r < 0.40) commits = 1 + Math.floor(rand() * 2);  // 1-2 (lvl 1)
      else if (r < 0.70) commits = 3 + Math.floor(rand() * 4);  // 3-6 (lvl 2)
      else if (r < 0.88) commits = 7 + Math.floor(rand() * 6);  // 7-12 (lvl 3)
      else               commits = 13 + Math.floor(rand() * 10); // 13-22 (lvl 4)
      data[key] = commits;
    }
    return data;
  }

  function commitLevel(n) {
    if (n === 0) return 0;
    if (n <= 2)  return 1;
    if (n <= 6)  return 2;
    if (n <= 12) return 3;
    return 4;
  }

  /* ── Build the heatmap DOM ── */
  function buildHeatmap(year) {
    const grid    = document.getElementById('heatmap-grid');
    const months  = document.getElementById('heatmap-months');
    if (!grid || !months) return;
    grid.innerHTML   = '';
    months.innerHTML = '';

    const data  = generateYearData(year);
    const start = new Date(year, 0, 1);

    // find Sunday on or before Jan 1
    const firstSun = new Date(start);
    firstSun.setDate(firstSun.getDate() - firstSun.getDay());

    const endDate = year < new Date().getFullYear()
      ? new Date(year, 11, 31)
      : new Date();

    const weeks   = [];
    let cur       = new Date(firstSun);
    let monthCols = {}; // track which week col each month first appears

    let weekIdx = 0;
    while (cur <= endDate) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(cur);
        day.setDate(cur.getDate() + d);
        week.push(day);
      }
      // find first day of each month in this week
      week.forEach(day => {
        if (day.getDate() === 1 && day.getFullYear() === year) {
          monthCols[day.getMonth()] = weekIdx;
        }
      });
      weeks.push(week);
      cur.setDate(cur.getDate() + 7);
      weekIdx++;
    }

    const totalWeeks = weeks.length;

    // build month labels
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthSpans = new Array(totalWeeks).fill('');
    Object.entries(monthCols).forEach(([m, wi]) => { monthSpans[wi] = MONTHS[+m]; });
    monthSpans.forEach(label => {
      const s = document.createElement('span');
      s.textContent = label;
      months.appendChild(s);
    });

    // build grid weeks
    const tooltip = document.getElementById('heatmap-tooltip');
    weeks.forEach(week => {
      const weekEl = document.createElement('div');
      weekEl.className = 'hm-week';
      week.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'hm-day';
        const key  = day.toISOString().slice(0, 10);
        const inRange = day.getFullYear() === year && day <= endDate;
        const n    = inRange ? (data[key] || 0) : -1;
        const lvl  = n < 0 ? 0 : commitLevel(n);
        cell.dataset.lvl = lvl;
        if (n >= 0) {
          cell.dataset.date    = key;
          cell.dataset.commits = n;
          // tooltip
          cell.addEventListener('mouseenter', e => {
            const label = n === 0
              ? `No contributions on ${key}`
              : `${n} commit${n > 1 ? 's' : ''} on ${key}`;
            tooltip.textContent = label;
            tooltip.classList.add('visible');
          });
          cell.addEventListener('mousemove', e => {
            tooltip.style.left = (e.clientX + 14) + 'px';
            tooltip.style.top  = (e.clientY - 28) + 'px';
          });
          cell.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
          });
        } else {
          cell.style.opacity = '0.2';
        }
        weekEl.appendChild(cell);
      });
      grid.appendChild(weekEl);
    });
  }

  /* ── Year tab switching ── */
  const tabs = document.querySelectorAll('.hy-tab');
  let currentYear = 2025;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentYear = parseInt(tab.dataset.year, 10);
      buildHeatmap(currentYear);
    });
  });

  // initial render
  buildHeatmap(currentYear);

  /* ── Animated meta counters ── */
  const metaNums = document.querySelectorAll('.gh-meta-num[data-gh-target]');
  const metaObs  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.ghTarget, 10);
      const dur    = 1600;
      const start  = performance.now();
      function tick(now) {
        const p   = Math.min((now - start) / dur, 1);
        const eas = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eas * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      metaObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  metaNums.forEach(n => metaObs.observe(n));

  /* ── Language bar fill animation ── */
  const lbFills = document.querySelectorAll('.lb-fill[data-pct]');
  const lbObs   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const pct = el.dataset.pct;
      requestAnimationFrame(() => { el.style.width = pct + '%'; });
      lbObs.unobserve(el);
    });
  }, { threshold: 0.3 });
  lbFills.forEach(f => lbObs.observe(f));

})();
