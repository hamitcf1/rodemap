document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('reviewContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    const reviews = container.getElementsByClassName('review-card');
    let currentIndex = 0;
    let interval;

    // Create dots
    for (let i = 0; i < reviews.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // Initialize
    updateSlides();
    startAutoSlide();

    // Navigation
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        updateSlides();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % reviews.length;
        updateSlides();
        resetAutoSlide();
    });

    // Auto slide function
    function startAutoSlide() {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % reviews.length;
            updateSlides();
        }, 5000); // Change slide every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }

    function updateSlides() {
        // Update slides
        for (let i = 0; i < reviews.length; i++) {
            reviews[i].classList.remove('active');
            dotsContainer.children[i].classList.remove('active');
        }
        reviews[currentIndex].classList.add('active');
        dotsContainer.children[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlides();
        resetAutoSlide();
    }

    // Pause auto-slide when hovering
    container.addEventListener('mouseenter', () => clearInterval(interval));
    container.addEventListener('mouseleave', startAutoSlide);
}); 