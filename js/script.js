// Toggle menu visibility on mobile
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
const authButtons = document.getElementById('auth');

menuToggle.addEventListener('click', function() {
  // Toggle navigation and authentication button visibility
  if (nav.style.display === 'block') {
    nav.style.display = 'none';
    authButtons.style.display = 'none';
  } else {
    nav.style.display = 'block';
    authButtons.style.display = 'flex';
  }
});

// Smooth scroll for anchor links (if needed later)
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
smoothScrollLinks.forEach((link) => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    }
  });
});
