/**
 * Shree Ganga Jewellers — Main Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const hamburger = document.querySelector('.hamburger-toggle');
  const drawer = document.querySelector('.mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('active');
      const isExpanded = drawer.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
      hamburger.innerHTML = isExpanded 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    // Close drawer when clicking a link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
        hamburger.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });
  }

  // 2. Video Play/Pause Control
  const heroVideo = document.querySelector('.hero-video-bg');
  const videoBtn = document.querySelector('.video-control-btn');

  if (heroVideo && videoBtn) {
    videoBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        videoBtn.setAttribute('aria-label', 'Pause background video');
      } else {
        heroVideo.pause();
        videoBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        videoBtn.setAttribute('aria-label', 'Play background video');
      }
    });
  }

  // 3. Glide-in Scroll Reveal (IntersectionObserver)
  const glideElements = document.querySelectorAll('.glide-in');
  if ('IntersectionObserver' in window) {
    const glideObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    glideElements.forEach(el => glideObserver.observe(el));
  } else {
    glideElements.forEach(el => el.classList.add('in-view'));
  }

  // 4. Dynamic Typewriter Headline
  const typewriterEl = document.querySelector('.dynamic-typewriter');
  if (typewriterEl) {
    const phrases = [
      'Pure 925 Sterling Silver.',
      'Heirloom Bengali Filigree.',
      'Sacred Temple Ornaments.',
      'Certified BIS Hallmarked.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2200; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 450;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
  }

  // 5. Telemetry Number Counters
  const counterElements = document.querySelectorAll('.stat-counter');
  let animated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1800;
      const startTime = performance.now();
      const isDecimal = target % 1 !== 0;

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statContainer = document.querySelector('.telemetry-grid');
  if (statContainer && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounters();
        }
      });
    }, { threshold: 0.2 });

    counterObserver.observe(statContainer);
  } else if (statContainer) {
    runCounters();
  }

  // 6. Interactive Silver Estimator & Shipping Calculator
  const calcPurity = document.getElementById('calc-purity');
  const calcType = document.getElementById('calc-type');
  const calcWeight = document.getElementById('calc-weight');
  const calcWeightVal = document.getElementById('calc-weight-val');
  const resEstRate = document.getElementById('res-silver-rate');
  const resCraft = document.getElementById('res-craft-tier');
  const resShipping = document.getElementById('res-shipping-status');
  const resTotal = document.getElementById('res-total-estimate');

  function calculateSilverEstimate() {
    if (!calcWeight || !resTotal) return;

    const purity = calcPurity ? calcPurity.value : '925';
    const type = calcType ? calcType.value : 'necklace';
    const weight = parseFloat(calcWeight.value) || 25;

    if (calcWeightVal) calcWeightVal.textContent = `${weight}g`;

    // Base market silver rate per gram (approx Nov 2026 reference)
    let baseRate = 96; // ₹96 per gram for 925
    if (purity === '999') baseRate = 104; // ₹104 per gram for 999 Fine Silver

    let craftFactor = 1.35; // Making charge factor
    let craftTier = 'Standard Filigree (35%)';
    if (type === 'temple') {
      craftFactor = 1.48;
      craftTier = 'Intricate Temple Nakshi (48%)';
    } else if (type === 'filigree') {
      craftFactor = 1.42;
      craftTier = 'Heirloom Tarakasi (42%)';
    } else if (type === 'pooja') {
      craftFactor = 1.25;
      craftTier = 'Pure Silver Pooja Ware (25%)';
    }

    const estimatedValue = Math.round(weight * baseRate * craftFactor);

    if (resEstRate) resEstRate.textContent = `₹${baseRate}/g`;
    if (resCraft) resCraft.textContent = craftTier;
    if (resShipping) resShipping.textContent = weight > 20 ? 'Free Insured Express' : 'Standard Insured (₹150)';
    if (resTotal) resTotal.textContent = `₹${estimatedValue.toLocaleString('en-IN')}`;
  }

  if (calcWeight) {
    calcWeight.addEventListener('input', calculateSilverEstimate);
  }
  if (calcPurity) {
    calcPurity.addEventListener('change', calculateSilverEstimate);
  }
  if (calcType) {
    calcType.addEventListener('change', calculateSilverEstimate);
  }
  calculateSilverEstimate();

  // 7. Gallery Filter Rail
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 8. Contact Form Direct WhatsApp Forwarding
  const contactForm = document.getElementById('consultation-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Valued Client';
      const phone = document.getElementById('form-phone')?.value || '';
      const interest = document.getElementById('form-interest')?.value || '925 Silver Jewellery';
      const notes = document.getElementById('form-notes')?.value || 'None';

      const waMsg = `Hello Shree Ganga Jewellers! My name is ${name} (${phone}). I am interested in inquiring about ${interest}. Notes: ${notes}. Please share availability and catalogue details.`;
      const waUrl = `https://wa.me/919804228202?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');
    });
  }
});
