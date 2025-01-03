class ReviewCarousel {
    constructor() {
        this.currentSlide = 0;
        this.wrapper = document.getElementById('reviewWrapper');
        this.dotsContainer = document.getElementById('reviewDots');
        this.reviews = window.siteReviews;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Create slides
        this.reviews.forEach(review => {
            const slide = document.createElement('div');
            slide.className = 'review-slide';
            slide.innerHTML = `
                <p class="review-quote">"${review.quote}"</p>
                <p class="review-author">- ${review.author}</p>
            `;
            this.wrapper.appendChild(slide);
        });

        // Create dots
        this.reviews.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            this.dotsContainer.appendChild(dot);
        });

        this.slides = this.wrapper.querySelectorAll('.review-slide');
        this.dots = this.dotsContainer.querySelectorAll('.dot');
        
        this.updateSlide(0);
    }

    setupEventListeners() {
        document.querySelector('.nav-btn.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.nav-btn.next').addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.updateSlide(index));
        });
    }

    updateSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }

    nextSlide() {
        this.updateSlide((this.currentSlide + 1) % this.slides.length);
    }

    prevSlide() {
        this.updateSlide((this.currentSlide - 1 + this.slides.length) % this.slides.length);
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewCarousel();
}); 