// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on link click (mobile)
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Generate gallery from local images/1.jpg to images/20.jpg
const galleryGrid = document.getElementById('galleryGrid');
for (let i = 1; i <= 20; i += 1) {
  const item = document.createElement('button');
  item.className = 'gallery-item';
  item.type = 'button';
  item.setAttribute('aria-label', `Open gallery image ${i}`);

  const img = document.createElement('img');
  img.src = `images/${i}.jpg`;
  img.alt = `Maharun Nesa Mukti gallery image ${String(i).padStart(2, '0')}`;
  img.loading = 'lazy';

  const caption = document.createElement('span');
  caption.textContent = `Image ${String(i).padStart(2, '0')}`;

  item.append(img, caption);
  galleryGrid.appendChild(item);
}

// Lightbox behavior
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, caption, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

galleryGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.gallery-item');
  if (!card) return;
  const img = card.querySelector('img');
  const caption = card.querySelector('span')?.textContent || 'Gallery image';
  openLightbox(img.src, caption, img.alt);
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// Back-to-top button
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Reveal-on-scroll + active nav highlighting
const revealElements = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));

function updateScrollUI() {
  const scrollY = window.scrollY;
  backToTop.style.display = scrollY > 480 ? 'inline-grid' : 'none';

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });

  // subtle parallax for hero background orbs
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
year.textContent = new Date().getFullYear();
