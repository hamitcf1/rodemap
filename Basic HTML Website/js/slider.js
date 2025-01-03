document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('reviewContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    const reviews = container.getElementsByClassName('review-card');
    let currentIndex = 0;
    let interval;
    let startX;
    let isDragging = false;

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

    // Drag functionality
    container.addEventListener('mousedown', startDragging);
    container.addEventListener('touchstart', (e) => startDragging(e), { passive: true });
    container.addEventListener('mousemove', drag);
    container.addEventListener('touchmove', drag);
    container.addEventListener('mouseup', endDragging);
    container.addEventListener('touchend', endDragging);
    container.addEventListener('mouseleave', endDragging);

    function startDragging(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].clientX;
        container.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].clientX;
        const diff = startX - currentX;

        if (Math.abs(diff) > 50) { // Threshold for slide change
            if (diff > 0) {
                goToSlide((currentIndex + 1) % reviews.length);
            } else {
                goToSlide((currentIndex - 1 + reviews.length) % reviews.length);
            }
            isDragging = false;
            container.style.cursor = 'grab';
        }
    }

    function endDragging() {
        isDragging = false;
        container.style.cursor = 'grab';
    }

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
        }, 7000); // Slowed down to 7 seconds
    }

    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }

    function updateSlides() {
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