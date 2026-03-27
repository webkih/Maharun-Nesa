// Shared interactive behaviors for home and IFY2026 pages
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after navigation item click (mobile)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, caption, alt) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

// Reusable gallery generator with optional modal behavior
function initGallery({ gridId, imagePaths, labelPrefix }) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  imagePaths.forEach((path, index) => {
    const item = document.createElement('button');
    item.className = 'gallery-item';
    item.type = 'button';
    item.setAttribute('aria-label', `Open ${labelPrefix.toLowerCase()} ${index + 1}`);

    const img = document.createElement('img');
    img.src = path;
    img.alt = `${labelPrefix} ${String(index + 1).padStart(2, '0')}`;
    img.loading = 'lazy';
    img.decoding = 'async';

    const caption = document.createElement('span');
    caption.textContent = `${labelPrefix} ${String(index + 1).padStart(2, '0')}`;

    item.append(img, caption);
    grid.appendChild(item);
  });

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.gallery-item');
    if (!card) return;
    const img = card.querySelector('img');
    const caption = card.querySelector('span')?.textContent || `${labelPrefix} image`;
    if (img) openLightbox(img.src, caption, img.alt);
  });
}

// Home gallery
initGallery({
  gridId: 'galleryGrid',
  imagePaths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18].map((id) => `images/${id}.jpg`),
  labelPrefix: 'Image'
});

// IFY2026 certifications gallery
initGallery({
  gridId: 'certGallery',
  imagePaths: Array.from({ length: 12 }, (_, index) => `images/eca${index + 1}.jpg`),
  labelPrefix: 'Certification'
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// Back-to-top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Reveal-on-scroll + active nav highlighting
const revealElements = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function updateScrollUI() {
  const scrollY = window.scrollY;

  if (backToTop) {
    backToTop.style.display = scrollY > 480 ? 'inline-grid' : 'none';
  }

  const hashNavItems = [...navItems].filter((link) => link.getAttribute('href')?.startsWith('#'));

  if (sections.length > 0 && hashNavItems.length > 0) {
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        hashNavItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // Subtle parallax for hero orbs when present
  const translate = Math.min(scrollY * 0.08, 40);
  document.querySelectorAll('.orb').forEach((orb, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    orb.style.transform = `translate3d(${direction * translate}px, ${translate}px, 0)`;
  });
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

// Dynamic year in footer
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
