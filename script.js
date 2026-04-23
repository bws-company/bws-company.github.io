const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
const root = document.documentElement;

const setTheme = (theme) => {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);

  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀' : '🌙';
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    
    // Add rotation animation to icon
    themeToggle.classList.add('rotating');
    setTimeout(() => {
      themeToggle.classList.remove('rotating');
    }, 400);
  }
};

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
setTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

const closeSidebar = () => {
  if (sidebar) {
    sidebar.classList.remove('show');
  }
  if (sidebarOverlay) {
    sidebarOverlay.classList.remove('show');
  }
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('active');
  }
};

const toggleSidebar = () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.classList.toggle('active');
  if (sidebar) {
    sidebar.classList.toggle('show');
  }
  if (sidebarOverlay) {
    sidebarOverlay.classList.toggle('show');
  }
};

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', toggleSidebar);
}

// Close sidebar when clicking overlay
if (sidebarOverlay && sidebar) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Close sidebar when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar?.classList.contains('show')) {
    closeSidebar();
  }
});

// Close sidebar when clicking on a link
const sidebarLinks = document.querySelectorAll('.sidebar a');
sidebarLinks.forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

// Scroll-triggered animations using Intersection Observer
const elements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2 // triggers when 20% visible
});

elements.forEach(el => observer.observe(el));

let testimonialSwiper = null;

const getTestimonialsSwiperConfig = () => ({
  effect: window.innerWidth >= 560 ? 'cards' : 'slide',
  slidesPerView: 1.1,
  spaceBetween: 16,
  grabCursor: true,
  loop: false,
  cardsEffect: {
    slideShadows: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    560: {
      effect: 'cards',
      slidesPerView: 1,
      spaceBetween: 0,
    },
  },
});

const initTestimonialsSwiper = () => {
  if (typeof Swiper === 'undefined') return;
  testimonialSwiper = new Swiper('.testimonials-swiper', getTestimonialsSwiperConfig());
};

const destroyTestimonialsSwiper = () => {
  if (testimonialSwiper && typeof testimonialSwiper.destroy === 'function') {
    testimonialSwiper.destroy(true, true);
  }
  testimonialSwiper = null;
};

let resizeTimeout = null;

const resetTestimonialsSwiper = () => {
  destroyTestimonialsSwiper();
  initTestimonialsSwiper();
};

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSwiper(window.innerWidth);

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resetTestimonialsSwiper, 250);
  });
});
