const WHATSAPP_NUMBER = '918309036705';
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}

// Reveal content smoothly as it enters the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Animate experience numbers when the metrics section first appears.
const metrics = document.querySelector('.metrics');
let countersPlayed = false;
function animateCounters() {
  if (countersPlayed || !metrics) return;
  countersPlayed = true;
  metrics.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const duration = 1100;
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
if (metrics && 'IntersectionObserver' in window) {
  const metricObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      animateCounters();
      metricObserver.disconnect();
    }
  }, { threshold: 0.25 });
  metricObserver.observe(metrics);
}

// Service links preselect the matching service in the enquiry form.
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.getElementById('service');
    if (select) {
      const requested = link.dataset.service.toLowerCase();
      const option = [...select.options].find(opt => opt.text.toLowerCase().includes(requested.split(' ')[0]));
      if (option) select.value = option.value || option.text;
    }
  });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    if (!name || !phone || !service || !message) return;
    const text = `Hello Man Power Consultancy,\n\nMy name is ${name}.\nMy phone number: ${phone}\nService required: ${service}\nRequirement: ${message}\n\nPlease let me know the next steps.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    const status = document.getElementById('formStatus');
    if (status) status.textContent = 'Opening WhatsApp with your enquiry…';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
