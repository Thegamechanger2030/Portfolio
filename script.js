/* ============================
   SCRIPT.JS — Abhay Mishra Portfolio
   Full feature set:
   - Custom cursor
   - Particles background
   - Loader
   - Navbar scroll behavior
   - Hamburger menu
   - Scroll progress bar
   - Typing effect
   - Animated counters
   - Scroll reveal (AOS-lite)
   - Skill bar animations
   - Project filtering
   - Certificate slider with dots
   - Timeline tabs
   - Contact form
   - Back to top button
============================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. LOADING SCREEN
  ───────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1200);
  });
  // Fallback if 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }

  /* ─────────────────────────────────────────────
     2. CUSTOM CURSOR
  ───────────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let curX = 0, curY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', e => {
    curX = e.clientX; curY = e.clientY;
    dot.style.left = curX + 'px';
    dot.style.top  = curY + 'px';
  });

  (function animateRing() {
    ringX += (curX - ringX) * 0.10;
    ringY += (curY - ringY) * 0.10;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a,button,.filter-btn,.cert-slider-btn,.tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '54px';
      ring.style.height = '54px';
      ring.style.borderColor = 'var(--primary)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(155,93,229,0.55)';
    });
  });

  /* ─────────────────────────────────────────────
     3. PARTICLES BACKGROUND (Canvas)
  ───────────────────────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const PARTICLE_COUNT = 110;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.8 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      // Hue: purple (270) or blue (220)
      const hue = Math.random() > 0.5 ? 270 : 220;
      this.color = `hsla(${hue},80%,65%,${Math.random() * 0.5 + 0.1})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(155,93,229,${(1 - dist/120) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  /* ─────────────────────────────────────────────
     4. NAVBAR SCROLL + SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const progBar = document.getElementById('scroll-progress');
  const btt     = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / maxScroll) * 100;

    progBar.style.width = pct + '%';
    navbar.classList.toggle('scrolled', scrollTop > 60);
    btt.classList.toggle('visible', scrollTop > 400);

    updateActiveNav();
    triggerScrollReveal();
    triggerSkillBars();
    triggerCounters();
  });

  /* Active Nav link based on scroll position */
  const sections  = document.querySelectorAll('section');
  const navLinks  = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  /* Back to top */
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─────────────────────────────────────────────
     5. HAMBURGER MENU
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────────────
     6. SMOOTH SCROLL for NAV LINKS
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     7. TYPING EFFECT
  ───────────────────────────────────────────── */
  const typingEl = document.getElementById('typing-text');
  const roles = [
    'Aspiring Software Developer',
    'Java & DSA Learner',
    'Web Developer',
    'AI Enthusiast',
    'Power BI Developer',
    'Data Analyst'
  ];
  let rIdx = 0, cIdx = 0, deleting = false;

  function typeRole() {
    if (!typingEl) return;
    const current = roles[rIdx];
    typingEl.textContent = deleting
      ? current.substring(0, --cIdx)
      : current.substring(0, ++cIdx);

    let speed = deleting ? 50 : 95;
    if (!deleting && cIdx === current.length) { speed = 2200; deleting = true; }
    else if (deleting && cIdx === 0)          { deleting = false; rIdx = (rIdx + 1) % roles.length; speed = 400; }
    setTimeout(typeRole, speed);
  }
  typeRole();

  /* ─────────────────────────────────────────────
     8. SCROLL REVEAL (AOS-lite)
  ───────────────────────────────────────────── */
  const aosEls = document.querySelectorAll('[data-aos]');
  function triggerScrollReveal() {
    aosEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add('aos-animate');
      }
    });
  }
  triggerScrollReveal(); // run on load

  /* ─────────────────────────────────────────────
     9. ANIMATED COUNTERS
  ───────────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num');
  let countersTriggered = false;
  function triggerCounters() {
    if (countersTriggered) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      countersTriggered = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { counter.textContent = target; clearInterval(timer); }
          else counter.textContent = current;
        }, 40);
      });
    }
  }

  /* ─────────────────────────────────────────────
     10. SKILL BAR ANIMATIONS
  ───────────────────────────────────────────── */
  let skillsTriggered = false;
  function triggerSkillBars() {
    if (skillsTriggered) return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      skillsTriggered = true;
      document.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 150);
      });
    }
  }

  /* ─────────────────────────────────────────────
     11. PROJECT FILTERING
  ───────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cats = card.getAttribute('data-category') || '';
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? 'flex' : 'none';
        if (show) {
          card.style.animation = 'fadeIn .5s ease forwards';
        }
      });
    });
  });

  /* ─────────────────────────────────────────────
     12. CERTIFICATE SLIDER
  ───────────────────────────────────────────── */
  const slider    = document.getElementById('cert-slider');
  const prevBtn   = document.getElementById('cert-prev');
  const nextBtn   = document.getElementById('cert-next');
  const dotsWrap  = document.getElementById('cert-dots');

  if (slider && prevBtn && nextBtn) {
    const cards   = slider.querySelectorAll('.cert-card');
    const visible = () => window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
    let current   = 0;
    const total   = cards.length;

    // Build dots
    const totalPages = () => Math.max(0, total - visible() + 1);
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalPages(); i++) {
        const dot = document.createElement('div');
        dot.className = 'cert-dot' + (i === current ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.cert-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - visible()));
      // Compute card width
      const cardW   = cards[0].getBoundingClientRect().width;
      const gap     = 24; // 1.5rem gap
      slider.style.transform = `translateX(-${current * (cardW + gap)}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-slide
    let autoTimer = setInterval(() => goTo((current + 1) >= totalPages() ? 0 : current + 1), 3500);
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo((current + 1) >= totalPages() ? 0 : current + 1), 3500);
    });

    buildDots();
    window.addEventListener('resize', () => { goTo(0); buildDots(); });
  }

  /* ─────────────────────────────────────────────
     13. TIMELINE TABS
  ───────────────────────────────────────────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.getElementById('tab-experience').style.display = target === 'experience' ? 'block' : 'none';
      document.getElementById('tab-education').style.display  = target === 'education'  ? 'block' : 'none';
    });
  });

  /* ─────────────────────────────────────────────
     14. CONTACT FORM
  ───────────────────────────────────────────── */
 emailjs.init("Jqs7gOTe27mlgBJWTT"); // Public Key

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.send("abhi@04", "template_z73vtzk", {
        name: document.getElementById("c-name").value,
        email: document.getElementById("c-email").value,
        subject: document.getElementById("c-subject").value,
        message: document.getElementById("c-message").value
    })
    .then(function () {
        alert("✅ Message Sent Successfully!");
        contactForm.reset();
    })
    .catch(function (error) {
        console.log(error);
        alert("❌ Failed to send message.");
    });
});
  

  /* ─────────────────────────────────────────────
     15. RESUME DOWNLOAD PLACEHOLDER
  ───────────────────────────────────────────── */
  const resumeBtn = document.getElementById('download-resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', e => {
      // If a resume PDF exists in assets/, set href there. For now alert user.
      const resumePath = 'assets/resume.pdf';
      // Try fetching silently
      fetch(resumePath, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const a = document.createElement('a');
            a.href = resumePath;
            a.download = 'Abhay_Mishra_Resume.pdf';
            a.click();
          } else {
            alert('Resume PDF not found. Please add your resume as assets/resume.pdf to enable this button!');
          }
        })
        .catch(() => {
          alert('Please add your resume file as assets/resume.pdf to enable download!');
        });
    });
  }

  /* ─────────────────────────────────────────────
     16. HERO IMAGE TILT ON MOUSE MOVE
  ───────────────────────────────────────────── */
  const heroImgWrapper = document.querySelector('.hero-img-wrapper');
  if (heroImgWrapper) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rx = ((e.clientY - cy) / cy) * 8;
      const ry = ((e.clientX - cx) / cx) * -8;
      heroImgWrapper.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    document.addEventListener('mouseleave', () => {
      heroImgWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ─────────────────────────────────────────────
     17. TOOLTIP for TECH ICONS
  ───────────────────────────────────────────── */
  // Simple CSS tooltips via data-tooltip attr — handled in CSS via ::after

});

