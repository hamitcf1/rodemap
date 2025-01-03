class ReviewsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        this.container = document.getElementById('reviewsCarousel');
        
        this.initializeCarousel();
        this.setupControls();
    }

    initializeCarousel() {
        if (!this.container) return;
        
        this.container.innerHTML = this.reviews
            .map(review => `
                <div class="carousel-slide">
                    <div class="review-card">
                        <h3>${review.name}</h3>
                        <div class="stars">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                        <p>${review.review}</p>
                    </div>
                </div>
            `)
            .join('');
    }

    setupControls() {
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');

        prevButton?.addEventListener('click', () => this.slide('prev'));
        nextButton?.addEventListener('click', () => this.slide('next'));
    }

    slide(direction) {
        if (direction === 'next') {
            this.currentSlide = (this.currentSlide + 1) % this.reviews.length;
        } else {
            this.currentSlide = this.currentSlide === 0 ? this.reviews.length - 1 : this.currentSlide - 1;
        }

        this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReviewsCarousel();
}); 