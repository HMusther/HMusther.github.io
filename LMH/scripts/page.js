// Smooth scrolling for same-page anchors (handles href="#id" and "page#id")
const setupSmoothScroll = () => {
  const handleAnchorClick = (event) => {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    const resolved = new URL(href, window.location.href);
    const isSamePage = resolved.pathname === window.location.pathname;

    // Smooth scroll to top if clicking Home link on the same page without a hash
    if (isSamePage && !resolved.hash) {
      event.preventDefault();
      history.replaceState(null, '', resolved.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!href.includes('#')) return;

    // Resolve URL to compare pathnames and extract hash
    // resolved and isSamePage already computed above
    const hash = resolved.hash;
    if (!isSamePage || !hash) return; // allow normal nav for cross-page links

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetPosition = target.offsetTop - navbarHeight;
    history.replaceState(null, '', hash);
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  };

  document.addEventListener('click', handleAnchorClick, { passive: false });

  // If the page loads with a hash, offset for the fixed navbar
  const scrollToHashOnLoad = () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const top = target.offsetTop - navbarHeight;
    window.scrollTo({ top, behavior: 'instant' in window ? 'instant' : 'auto' });
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(scrollToHashOnLoad, 0);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(scrollToHashOnLoad, 0));
  }
};

setupSmoothScroll();

  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
          }
      });
  }, observerOptions);

  // Existing fade-in sections
  document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
  });

  // Generic reveal-on-scroll
  document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      const subject = `L.M.Hill Inquiry from ${name}`;
      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
      
      window.location.href = `mailto:lmhillcarpets@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

// (Removed duplicate anchor smooth-scroll listener)


  const myModal = document.getElementById('myModal');
  const myInput = document.getElementById('myInput');
  if (myModal && myInput) {
    myModal.addEventListener('shown.bs.modal', () => {
      myInput.focus();
    });
  }

  // Navbar shrink-on-scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleNavbarShrink = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('navbar-shrink');
      } else {
        navbar.classList.remove('navbar-shrink');
      }
    };

    handleNavbarShrink();
    window.addEventListener('scroll', handleNavbarShrink, { passive: true });
  }

  // Enable swipe/drag navigation on Bootstrap carousel
  const carouselEl = document.querySelector('#carouselExampleIndicators');
  if (carouselEl) {
    const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
    let startX = 0;
    let startY = 0;
    let isTouch = false;

    const threshold = 40; // min px to qualify as a swipe

    const onTouchStart = (e) => {
      isTouch = true;
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX;
      startY = t.clientY;
    };

    const onTouchMove = (e) => {
      // Allow vertical scroll; prevent default only when horizontal gesture dominates
      if (!isTouch) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      const t = (e.changedTouches && e.changedTouches[0]) || e;
      const dx = t.clientX - startX;
      if (Math.abs(dx) > threshold) {
        if (dx < 0) { bsCarousel.next(); } else { bsCarousel.prev(); }
      }
      isTouch = false;
    };

    // Touch events
    carouselEl.addEventListener('touchstart', onTouchStart, { passive: true });
    carouselEl.addEventListener('touchmove', onTouchMove, { passive: false });
    carouselEl.addEventListener('touchend', onTouchEnd, { passive: true });

    // Mouse drag support
    let isMouseDown = false;
    carouselEl.addEventListener('mousedown', (e) => { isMouseDown = true; onTouchStart(e); });
    carouselEl.addEventListener('mousemove', (e) => { if (isMouseDown) onTouchMove(e); });
    document.addEventListener('mouseup', (e) => { if (isMouseDown) { onTouchEnd(e); isMouseDown = false; } });
  }