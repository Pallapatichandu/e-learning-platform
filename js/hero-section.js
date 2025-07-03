const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let index = 0;
let timer = setInterval(showNextSlide, 4000); // 4 seconds

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[i].classList.add('active');
}

function showNextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function showPrevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(showNextSlide, 4000);
}

nextBtn.addEventListener('click', () => {
  showNextSlide();
  resetTimer();
});

prevBtn.addEventListener('click', () => {
  showPrevSlide();
  resetTimer();
});
