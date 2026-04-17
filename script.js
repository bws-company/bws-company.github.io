const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
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

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('show');
  });
}

const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

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
