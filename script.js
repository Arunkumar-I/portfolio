(() => {
  // ─── CURSOR ───────────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  // ─── CANVAS BACKGROUND ────────────────────────────────────
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a  = Math.random() * 0.6 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animCanvas() {
    ctx.clearRect(0, 0, W, H);
    // Gradient overlay
    const grad = ctx.createRadialGradient(W*0.7, H*0.3, 0, W*0.7, H*0.3, W*0.7);
    grad.addColorStop(0, 'rgba(124,58,237,0.06)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animCanvas);
  }
  animCanvas();

  // ─── PARALLAX on hero scene ────────────────────────────────
  const heroScene = document.getElementById('heroScene');
  const heroShape = document.getElementById('heroShape');
  const holoRing  = document.getElementById('holoRing');
  document.addEventListener('mousemove', e => {
    const rx = (e.clientX / window.innerWidth  - 0.5) * 20;
    const ry = (e.clientY / window.innerHeight - 0.5) * 20;
    if (heroShape) heroShape.style.transform = `translateY(-50%) rotateX(${-ry}deg) rotateY(${rx}deg)`;
    if (holoRing)  holoRing.style.transform  = `translateY(-50%) rotateX(${75 + ry * 0.3}deg) rotateY(${rx * 0.3}deg)`;
    if (heroScene) heroScene.style.transform  = `translate(${rx * 0.5}px, ${ry * 0.5}px)`;
  });

  // ─── NAVBAR SCROLL ────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ─── SCROLL REVEAL ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObs.observe(el));

  // ─── CARD TILT ─────────────────────────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      const rx2 = (-y / r.height * 14).toFixed(2);
      const ry2 = ( x / r.width  * 14).toFixed(2);
      card.style.transform = `rotateX(${rx2}deg) rotateY(${ry2}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // ─── MAGNETIC BUTTONS ─────────────────────────────────────
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const ox = e.clientX - r.left - r.width  / 2;
      const oy = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${ox * 0.3}px, ${oy * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ─── COUNTER ANIMATION ────────────────────────────────────
  function animCount(el) {
    const target = +el.dataset.count;
    let current  = 0;
    const step   = Math.ceil(target / 30);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  }
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(animCount);
        countObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) countObs.observe(statsEl);

  // ─── SMOOTH SCROLL HELPER ─────────────────────────────────
  window.scrollTo = function(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').replace('#','');
      window.scrollTo(id);
    });
  });

  // ─── SCROLL TO TOP ────────────────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── CONTACT FORM ─────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit] .btn-text');
      if (btn) { btn.textContent = '✓ Message Sent!'; }
      setTimeout(() => { if (btn) btn.textContent = 'Send Message'; form.reset(); }, 3000);
    });
  }

  // ─── HERO PARTICLES ───────────────────────────────────────
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position:absolute;
        width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;
        background:rgba(192,132,252,${Math.random()*0.6+0.2});
        border-radius:50%;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation:heroPartFloat ${Math.random()*8+5}s ease-in-out infinite ${Math.random()*5}s;
      `;
      heroParticles.appendChild(dot);
    }
    // Add keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes heroPartFloat {
        0%,100%{transform:translateY(0) translateX(0);}
        33%{transform:translateY(-${Math.random()*30+20}px) translateX(${Math.random()*20-10}px);}
        66%{transform:translateY(${Math.random()*20-10}px) translateX(-${Math.random()*20}px);}
      }
    `;
    document.head.appendChild(style);
  }
  // ─── SKILL PILLS SCROLL-TRIGGERED ENTRANCE ───────────────
  const arena = document.getElementById('skillArena');
  if (arena) {
    const pills = arena.querySelectorAll('.skill-pill');
    // Keep pills hidden until section enters view
    pills.forEach(p => { p.style.animationPlayState = 'paused'; });

    const pillObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        pills.forEach(p => { p.style.animationPlayState = 'running'; });
        pillObs.disconnect();
      }
    }, { threshold: 0.2 });
    pillObs.observe(arena);
  }

})();

