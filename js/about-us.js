document.addEventListener('DOMContentLoaded', () => {
  const aboutImages = document.querySelector('.about-images');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutImages.classList.add('animate-in');
          observer.unobserve(aboutImages); // optional: stop observing after animation triggers
        }
      });
    }, 
    { threshold: 0.1 }  // Trigger when 10% visible
  );

  observer.observe(aboutImages);
});
