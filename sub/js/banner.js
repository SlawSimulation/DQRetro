// No DOMContentLoaded needed since the script is dynamically injected after HTML is ready

const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const totalSlides = images.length;
let autoplayInterval;

function updateSlide() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlide();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlide();
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

nextBtn.addEventListener('click', () => {
  stopAutoplay();
  nextSlide();
  startAutoplay();
});

prevBtn.addEventListener('click', () => {
  stopAutoplay();
  prevSlide();
  startAutoplay();
});

updateSlide();
startAutoplay();
