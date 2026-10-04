/**
 * Lorena Guadalupe Mendoza Pérez - Portfolio Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const currentYearSpan = document.getElementById('currentYear');
  
  // CV Modal Elements
  const cvModalOverlay = document.getElementById('cvModalOverlay');
  const openCvModalBtn = document.getElementById('openCvModalBtn');
  const quickViewCvHero = document.getElementById('quickViewCvHero');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');

  // Contact & Toast Elements
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyTooltip = document.getElementById('copyTooltip');
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Experience Filter Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineCards = document.querySelectorAll('.timeline-card');

  // Courses Tabs & Search Elements
  const certTabs = document.querySelectorAll('.cert-tab');
  const courseSearchInput = document.getElementById('courseSearchInput');
  const courseCards = document.querySelectorAll('.course-card');

  // Set current year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. Theme Switcher (Dark / Light) with Persistence
     ========================================================================== */
  const savedTheme = localStorage.getItem('lmp_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(newTheme === 'dark' ? 'Modo Oscuro Activado' : 'Modo Claro Activado');
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lmp_theme', theme);
  }

  /* ==========================================================================
     2. Navbar Scroll Effect & Scroll Progress Bar
     ========================================================================== */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    highlightActiveNavLink();
  });

  /* ==========================================================================
     3. Active Nav Link on Scroll (Scroll Spy)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }

  /* ==========================================================================
     4. Mobile Navigation Toggle
     ========================================================================== */
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     5. Experience Timeline Filtering
     ========================================================================== */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      timelineCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6. Courses & Certifications Filtering & Live Search
     ========================================================================== */
  let activeTabFilter = 'all';

  certTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      certTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTabFilter = tab.getAttribute('data-tab');
      filterCourses();
    });
  });

  if (courseSearchInput) {
    courseSearchInput.addEventListener('input', () => {
      filterCourses();
    });
  }

  function filterCourses() {
    const query = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : '';

    courseCards.forEach(card => {
      const cat = card.getAttribute('data-cat');
      const text = card.textContent.toLowerCase();

      const matchesTab = (activeTabFilter === 'all' || cat === activeTabFilter);
      const matchesSearch = query === '' || text.includes(query);

      if (matchesTab && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ==========================================================================
     7. CV Modal Handler
     ========================================================================== */
  function openCvModal(e) {
    if (e) e.preventDefault();
    if (cvModalOverlay) {
      cvModalOverlay.classList.add('open');
      cvModalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    if (cvModalOverlay) {
      cvModalOverlay.classList.remove('open');
      cvModalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openCvModalBtn) openCvModalBtn.addEventListener('click', openCvModal);
  if (quickViewCvHero) quickViewCvHero.addEventListener('click', openCvModal);
  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', closeCvModal);

  if (cvModalOverlay) {
    cvModalOverlay.addEventListener('click', (e) => {
      if (e.target === cvModalOverlay) {
        closeCvModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModalOverlay && cvModalOverlay.classList.contains('open')) {
      closeCvModal();
    }
  });

  /* ==========================================================================
     8. Copy Email to Clipboard
     ========================================================================== */
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = 'lorena.mendoza@politicas.unam.mx';
      navigator.clipboard.writeText(emailText).then(() => {
        if (copyTooltip) {
          copyTooltip.classList.add('show');
          setTimeout(() => {
            copyTooltip.classList.remove('show');
          }, 2000);
        }
        showToast('Correo copiado al portapapeles');
      }).catch(() => {
        showToast('Presione sobre el correo para escribirle');
      });
    });
  }

  /* ==========================================================================
     9. Contact Form Simulation & Mailto Trigger
     ========================================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const phone = document.getElementById('senderPhone').value;
      const subject = document.getElementById('messageSubject').value;
      const message = document.getElementById('senderMessage').value;

      const bodyText = `Hola Lorena,%0D%0A%0D%0AMi nombre es ${encodeURIComponent(name)}.%0D%0AEmail de contacto: ${encodeURIComponent(email)}%0D%0ATeléfono: ${encodeURIComponent(phone || 'No especificado')}%0D%0A%0D%0AMensaje:%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ASaludos cordiales.`;

      const mailtoUrl = `mailto:lorena.mendoza@politicas.unam.mx?subject=${encodeURIComponent(subject + ' - Contacto desde Portafolio')}&body=${bodyText}`;

      showToast('Abriendo gestor de correo...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 700);
    });
  }

  /* ==========================================================================
     10. Toast Notification System
     ========================================================================== */
  let toastTimer;
  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }
});
