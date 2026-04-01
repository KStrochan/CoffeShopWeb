const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = contactForm.elements['name'].value.trim();
  formMessage.textContent = `Thank you, ${name}. Your request has been recorded in this demo form.`;
  contactForm.reset();
});
