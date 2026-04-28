AOS.init({ duration: 1000, once: true });

// --- CAROUSEL LOGIC ---
let currentSlide = 0;
const totalSlides = 3;
const track = document.getElementById('track');
const dots = document.querySelectorAll('.nav-dot');
const carouselContainer = document.getElementById('hero-carousel');
let slideInterval;
let currentSpeed = 5000;

let touchStartX = 0;
let touchEndX = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        if (index === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
    resetTimer();
}

function nextSlideUser() {
    nextSlide();
    resetTimer();
}

function startSlideShow(speed) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, speed);
}

function resetTimer() {
    startSlideShow(currentSpeed);
}

function jumpToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetTimer();
}

// Swipe Gestures
carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) nextSlideUser();
    else if (touchEndX - touchStartX > threshold) prevSlide();
}

// Hover Timing
carouselContainer.addEventListener('mouseenter', () => {
    currentSpeed = 10000;
    startSlideShow(currentSpeed);
});

carouselContainer.addEventListener('mouseleave', () => {
    currentSpeed = 5000;
    startSlideShow(currentSpeed);
});

startSlideShow(5000);

// --- TYPEWRITER ---
const words = ["Automation Testing.", "Hybrid Frameworks.", "Java Selenium.", "SDET Skills."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    const typeElement = document.getElementById("typewriter");
    if (!typeElement) return;

    if (isDeleting) {
        typeElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 75 : 150;

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}
type();

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function openSocialChannels() {
    window.open("https://www.linkedin.com/in/piyushbaldaniya/", "_blank");
    window.open("https://github.com/AutomationWithPiyushhh", "_blank");
    window.open("https://x.com/Just_Automaton", "_blank");
}