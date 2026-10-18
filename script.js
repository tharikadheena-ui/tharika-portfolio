/**
 * Tharika — Creative Developer & Researcher Portfolio
 * Fast, Responsive Motion Architecture & Interactive Life Journey
 * Powered by GSAP & Native Scroll Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Live Time Indicator (Chennai, IST)
  initTimeClock();

  // 2. Mobile Menu Navigation
  initMobileMenu();

  // 3. Email Copy Action
  initEmailCopy();

  // 4. Project Drawer Interaction
  initProjectDrawers();

  // 5. Native Fast Smooth Scrolling for Anchors
  initAnchorNavigation();

  // 6. Interactive Life Journey (Animated Character along Winding Path)
  initLifeJourney(prefersReducedMotion);

  // 7. Fast, Responsive Section Motion
  if (!prefersReducedMotion) {
    initFastMotion();
  } else {
    initStaticState();
  }
});

/**
 * Chennai (IST) Real-time Clock
 */
function initTimeClock() {
  const timeEl = document.querySelector('#localTime .time-value');
  if (!timeEl) return;

  function updateClock() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    try {
      const now = new Intl.DateTimeFormat('en-US', options).format(new Date());
      timeEl.textContent = now;
    } catch {
      timeEl.textContent = new Date().toLocaleTimeString();
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Mobile Drawer Menu
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !toggleBtn.classList.contains('is-active');
    toggleBtn.classList.toggle('is-active', isOpen);
    mobileMenu.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => toggleMenu());

  const navItems = mobileMenu.querySelectorAll('.mobile-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.classList.contains('is-active')) {
      toggleMenu(false);
    }
  });
}

/**
 * Copy Email to Clipboard
 */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const tooltip = document.getElementById('copyTooltip');
  if (!copyBtn || !tooltip) return;

  const emailToCopy = 'tharikadheena@gmail.com';

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      tooltip.classList.add('is-active');
      setTimeout(() => {
        tooltip.classList.remove('is-active');
      }, 2000);
    } catch (err) {
      console.warn('Unable to copy email:', err);
    }
  });
}

/**
 * Fast Native Anchor Navigation (Zero scroll lag)
 */
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle URL hash or query scroll immediately
  const urlParams = new URLSearchParams(window.location.search);
  const queryTarget = urlParams.get('scroll');
  const initialHash = window.location.hash ? window.location.hash.slice(1) : null;
  const targetId = queryTarget || initialHash;

  if (targetId) {
    const el = document.getElementById(targetId);
    if (el) {
      window.scrollTo(0, el.offsetTop - 70);
    }
  }
}

/**
 * Project Row Accordion Drawer
 */
function initProjectDrawers() {
  const projectRows = document.querySelectorAll('.project-row');

  projectRows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;

      const isCurrentlyExpanded = row.classList.contains('is-expanded');

      projectRows.forEach(other => {
        if (other !== row) {
          other.classList.remove('is-expanded');
        }
      });

      row.classList.toggle('is-expanded', !isCurrentlyExpanded);
    });
  });
}

/**
 * INTERACTIVE LIFE JOURNEY: Winding Path & Jumping Character
 */
function initLifeJourney(prefersReducedMotion) {
  const stage = document.getElementById('journeyStage');
  const character = document.getElementById('journeyCharacter');
  const activePath = document.getElementById('journeyPathActive');
  const nodes = document.querySelectorAll('.journey-node-svg');
  const cards = document.querySelectorAll('.milestone-card');
  const stepIndicator = document.getElementById('stepIndicator');
  if (!stage || !character || !activePath) return;

  // Exact coordinates matching the SVG nodes (M1: 160,90 -> M2: 840,230 -> M3: 160,380 -> M4: 840,520)
  // Character sits on top of each node with feet positioned above circle
  const milestoneCoords = [
    { x: 160, y: 48, scaleX: 1 },    // 01: Top-Left (facing right)
    { x: 840, y: 188, scaleX: -1 },  // 02: Middle-Right (facing left)
    { x: 160, y: 338, scaleX: 1 },   // 03: Middle-Left (facing right)
    { x: 840, y: 478, scaleX: 1 },   // 04: Bottom-Right (facing forward/right)
  ];

  // Calculate SVG active path dash lengths for progressive drawing
  let totalPathLength = 2400;
  try {
    totalPathLength = activePath.getTotalLength();
  } catch {
    totalPathLength = 2400;
  }
  activePath.style.strokeDasharray = totalPathLength;
  activePath.style.strokeDashoffset = totalPathLength * 0.75; // Initial state at milestone 1

  let currentStep = 0;
  let isTransitioning = false;

  function setMilestone(index, animate = true) {
    if (index < 0 || index >= milestoneCoords.length) return;
    currentStep = index;

    // Update active node styling
    nodes.forEach((node, i) => {
      node.classList.toggle('is-active', i === index);
      const glow = document.querySelector(`.glow-${i + 1}`);
      if (glow) glow.classList.toggle('is-active', i === index);
    });

    // Update active story cards
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index);
    });

    // Update step text
    if (stepIndicator) {
      stepIndicator.innerHTML = `<span class="step-active-text">MILESTONE 0${index + 1} OF 04</span>`;
    }

    // Update path progress
    const progressRatios = [0.05, 0.38, 0.72, 1.0];
    const targetOffset = totalPathLength * (1 - progressRatios[index]);
    activePath.style.strokeDashoffset = targetOffset;

    // Position Character
    const target = milestoneCoords[index];
    if (animate && !prefersReducedMotion) {
      isTransitioning = true;
      character.classList.add('is-jumping');

      // Apply transform with direction facing
      character.setAttribute('transform', `translate(${target.x}, ${target.y}) scale(${target.scaleX}, 1)`);

      setTimeout(() => {
        character.classList.remove('is-jumping');
        isTransitioning = false;
      }, 550);
    } else {
      character.setAttribute('transform', `translate(${target.x}, ${target.y}) scale(${target.scaleX}, 1)`);
    }
  }

  // Set initial milestone
  setMilestone(0, false);

  // Click interaction: clicking any node or card jumps the character immediately
  nodes.forEach((node, index) => {
    node.addEventListener('click', () => setMilestone(index, true));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMilestone(index, true);
      }
    });
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', () => setMilestone(index, true));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMilestone(index, true);
      }
    });
  });

  // Natural Scroll Synchronization without artificial scroll resistance
  if (window.ScrollTrigger && !prefersReducedMotion) {
    window.ScrollTrigger.create({
      trigger: stage,
      start: 'top 75%',
      end: 'bottom 25%',
      onUpdate: (self) => {
        if (isTransitioning) return;
        const progress = self.progress;
        let step = 0;
        if (progress > 0.75) step = 3;
        else if (progress > 0.45) step = 2;
        else if (progress > 0.18) step = 1;
        else step = 0;

        if (step !== currentStep) {
          setMilestone(step, true);
        }
      }
    });
  }
}

/**
 * Fast, Snappy Motion for Other Sections (No slow lag, no long pins)
 */
function initFastMotion() {
  if (typeof window.gsap === 'undefined') return;
  const { gsap } = window;

  // 1. Fast, Crisp Hero Entrance (400ms - 600ms)
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.from('.navigation', {
    y: -14,
    opacity: 0,
    duration: 0.5,
  });

  heroTl.from('.hero-line .line-inner', {
    y: '100%',
    duration: 0.75,
    stagger: 0.1,
  }, '-=0.25');

  heroTl.from('.reveal-hero', {
    y: 16,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
  }, '-=0.35');

  // 2. Personal Philosophy (Fast scroll reveal without heavy pinning)
  if (window.ScrollTrigger) {
    const chunks = gsap.utils.toArray('.quote-chunk');
    if (chunks.length > 0) {
      gsap.from(chunks, {
        scrollTrigger: {
          trigger: '.manifesto-quote',
          start: 'top 82%',
          once: true,
        },
        opacity: 0.35,
        y: 16,
        stagger: 0.12,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    // Highlight action glow
    gsap.to('.highlight-action', {
      scrollTrigger: {
        trigger: '.manifesto-quote',
        start: 'top 70%',
        once: true,
      },
      scale: 1.02,
      duration: 0.4,
    });
  }

  // 3. Fast Intersection Observer for remaining sections
  initIntersectionReveals();
}

/**
 * High-performance native Intersection Observer for instant reveals
 */
function initIntersectionReveals() {
  const revealElements = document.querySelectorAll(
    '.project-row, .experience-item, .portrait-card, .about-narrative-col > *, .contact-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px',
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-item');
    observer.observe(el);
  });

  // Safety fallback for instantaneous visibility
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 900);
}

/**
 * Static State for Reduced Motion
 */
function initStaticState() {
  const heroLines = document.querySelectorAll('.hero-line .line-inner');
  heroLines.forEach(line => {
    line.style.transform = 'none';
    line.style.opacity = '1';
  });

  const quoteChunks = document.querySelectorAll('.quote-chunk');
  quoteChunks.forEach(chunk => {
    chunk.style.opacity = '1';
    chunk.style.transform = 'none';
  });

  const reveals = document.querySelectorAll('.project-row, .experience-item, .portrait-card, .contact-card, .milestone-card');
  reveals.forEach(el => {
    el.classList.add('is-revealed');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
