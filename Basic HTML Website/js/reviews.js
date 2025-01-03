import { reviewsRef, db } from './firebase-config.js';
import { push, set, get, query, orderByChild, equalTo, ref, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

class ReviewsManager {
    constructor() {
        this.reviewsList = document.getElementById('reviewsList');
        this.form = document.getElementById('reviewForm');
        this.initializeForm();
        this.loadReviews();
    }

    async loadReviews() {
        try {
            // Get only approved reviews
            const approvedReviewsQuery = query(
                reviewsRef,
                orderByChild('status'),
                equalTo('approved')
            );

            const snapshot = await get(approvedReviewsQuery);
            const reviews = [];
            
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    reviews.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }

            this.displayReviews(reviews);
        } catch (error) {
            console.error("Error loading reviews:", error);
        }
    }

    initializeForm() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const review = {
                name: this.form.name.value.trim(),
                rating: parseInt(this.form.rating.value),
                review: this.form.review.value.trim(),
                date: new Date().toISOString(),
                status: 'pending'
            };

            try {
                const newReviewRef = push(reviewsRef);
                await set(newReviewRef, review);
                this.form.reset();
                alert('Thank you for your review! It will be visible after moderation.');
            } catch (error) {
                console.error("Error submitting review:", error);
                alert('There was an error submitting your review. Please try again.');
            }
        });
    }

    displayReviews(reviews) {
        if (!this.reviewsList) return;
        
        this.reviewsList.innerHTML = reviews
            .map(review => `
                <div class="review-card">
                    <h3>${this.escapeHtml(review.name)}</h3>
                    <div class="stars">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <p>${this.escapeHtml(review.review)}</p>
                    <small>${new Date(review.date).toLocaleDateString()}</small>
                </div>
            `)
            .join('');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReviewsManager();
}); 