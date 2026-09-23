/* ============================================
   GALAXY PORTFOLIO — INTERACTIVE JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  // ============================
  // 1. INTERACTIVE STAR FIELD CANVAS
  // ============================
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let mouseX = 0;
  let mouseY = 0;
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 2500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random(),
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        hue: Math.random() > 0.85 ? Math.floor(Math.random() * 60 + 200) : 0, // some blue/purple tinted stars
        depth: Math.random() * 3 + 1, // parallax depth
      });
    }
  }

  function createShootingStar() {
    if (shootingStars.length > 2) return;
    const star = {
      x: Math.random() * canvas.width * 0.8,
      y: Math.random() * canvas.height * 0.4,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      angle: (Math.PI / 6) + Math.random() * (Math.PI / 8),
      opacity: 1,
      life: 0,
      maxLife: 60 + Math.random() * 40,
    };
    shootingStars.push(star);
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parallax offset from mouse
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const parallaxX = (mouseX - centerX) / centerX;
    const parallaxY = (mouseY - centerY) / centerY;

    // Draw stars
    for (const star of stars) {
      // Twinkle
      star.opacity += star.opacityDir * star.twinkleSpeed;
      if (star.opacity >= 1) { star.opacity = 1; star.opacityDir = -1; }
      if (star.opacity <= 0.15) { star.opacity = 0.15; star.opacityDir = 1; }

      // Parallax offset
      const offsetX = parallaxX * star.depth * 8;
      const offsetY = parallaxY * star.depth * 8;
      const drawX = star.x + offsetX;
      const drawY = star.y + offsetY;

      ctx.beginPath();
      ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);

      if (star.hue > 0) {
        ctx.fillStyle = `hsla(${star.hue}, 70%, 80%, ${star.opacity})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      }

      ctx.fill();

      // Glow for larger stars
      if (star.size > 1.5) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity * 0.08})`;
        ctx.fill();
      }
    }

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.life++;
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;

      if (ss.life > ss.maxLife * 0.7) {
        ss.opacity -= 0.04;
      }

      if (ss.opacity <= 0 || ss.life > ss.maxLife) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - Math.cos(ss.angle) * ss.len;
      const tailY = ss.y - Math.sin(ss.angle) * ss.len;

      const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      gradient.addColorStop(0.6, `rgba(200, 220, 255, ${ss.opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Head glow
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
      ctx.fill();
    }

    animationId = requestAnimationFrame(drawStars);
  }

  function initCanvas() {
    resizeCanvas();
    createStars();
    drawStars();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
  });

  // Mouse tracking for parallax
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Random shooting stars
  setInterval(() => {
    if (Math.random() > 0.4) createShootingStar();
  }, 3000);

  // ============================
  // 2. TYPED TEXT EFFECT
  // ============================
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Full-Stack MERN Developer ✨',
    'Building Robust Web Applications 🚀',
    'React · Node · Express · MongoDB 💎',
    'Passionate about Clean Code & Innovation 💡',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typedEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // ============================
  // 3. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
  // ============================
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    animatedElements.forEach((el) => observer.observe(el));
  }

  // ============================
  // 4. NAVBAR — SCROLL EFFECT + ACTIVE LINK
  // ============================
  const nav = document.getElementById('galaxy-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ============================
  // 5. MOBILE HAMBURGER MENU
  // ============================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
    });

    // Close menu on link click
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // ============================
  // 6. 3D TILT EFFECT ON CARDS
  // ============================
  function initTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ============================
  // 7. CURSOR PARTICLE TRAIL (Desktop only)
  // ============================
  function initCursorTrail() {
    if (window.innerWidth < 768) return; // disable on mobile

    const colors = [
      'rgba(108, 63, 160, 0.6)',
      'rgba(30, 144, 255, 0.6)',
      'rgba(0, 245, 212, 0.5)',
      'rgba(255, 45, 117, 0.5)',
      'rgba(255, 255, 255, 0.4)',
    ];

    let lastTime = 0;
    const throttleMs = 60;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const particle = document.createElement('div');
      particle.classList.add('cursor-particle');
      particle.style.left = (e.clientX - 2) + 'px';
      particle.style.top = (e.clientY - 2) + 'px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 800);
    });
  }

  // ============================
  // 8. SMOOTH SCROLL FOR NAV LINKS
  // ============================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const offset = 70; // nav height
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================
  // INITIALIZATION
  // ============================
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    typeEffect();
    initScrollAnimations();
    initTiltEffect();
    initCursorTrail();
    initSmoothScroll();
    handleNavScroll(); // initial state
  });
})();
