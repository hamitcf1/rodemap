import { auth, reviewsRef, db } from '../js/firebase-config.js';
import { get, update, ref, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

class AdminReviewManager {
    constructor() {
        this.checkAuth();
        this.pendingContainer = document.getElementById('pendingReviews');
        this.approvedContainer = document.getElementById('approvedReviews');
        this.loadReviews();
    }

    checkAuth() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                window.location.href = '/admin/login.html';
            }
        });
    }

    async loadReviews() {
        try {
            const snapshot = await get(reviewsRef);
            const reviews = [];
            
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    reviews.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }

            const pending = reviews.filter(r => r.status === 'pending');
            const approved = reviews.filter(r => r.status === 'approved');

            this.displayReviews(pending, approved);
        } catch (error) {
            console.error("Error loading reviews:", error);
        }
    }

    async updateStatus(reviewId, status) {
        try {
            const updates = {};
            updates[`/reviews/${reviewId}/status`] = status;
            await update(ref(db), updates);
            this.loadReviews();
        } catch (error) {
            console.error("Error updating review:", error);
            alert('Error updating review status');
        }
    }

    // ... rest of the AdminReviewManager class methods
}

// Initialize the admin review manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminReviewManager();
}); 